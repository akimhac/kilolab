import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import {
  Users, ShoppingBag, DollarSign, Search, Download,
  TrendingUp, TrendingDown, MapPin, Package, Loader2, Eye,
  MessageSquare, Mail, Trash2, Send, Database, AlertCircle, 
  CheckCircle, LogOut
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [activeTab, setActiveTab] = useState<"overview" | "partners" | "cities" | "orders" | "messages" | "users">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">("all");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [selectedPartnerForAssign, setSelectedPartnerForAssign] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`*, partner:partners!orders_partner_id_fkey(company_name)`)
        .order("created_at", { ascending: false });

      if (ordersError) console.error("Orders error:", ordersError);

      const { data: partnersData, error: partnersError } = await supabase
        .from("partners")
        .select("*")
        .order("created_at", { ascending: false });

      if (partnersError) console.error("Partners error:", partnersError);

      const { data: messagesData, error: messagesError } = await supabase
        .from("contact_messages")
        .select("*, support_responses(*)")
        .order("created_at", { ascending: false });

      if (messagesError) console.error("Messages error:", messagesError);

      const usersData: any[] = [];

      setOrders(ordersData || []);
      setMessages(messagesData || []);
      setUsers(usersData || []);

      const partnerStatsMap = new Map();
      (ordersData || []).forEach((order: any) => {
        if (order.partner_id && order.status === "completed") {
          if (!partnerStatsMap.has(order.partner_id)) {
            partnerStatsMap.set(order.partner_id, { totalOrders: 0, totalRevenue: 0 });
          }
          const stats = partnerStatsMap.get(order.partner_id);
          stats.totalOrders += 1;
          stats.totalRevenue += parseFloat(order.total_price || 0);
        }
      });

      const partnersWithStats = (partnersData || []).map((partner: any) => {
        const stats = partnerStatsMap.get(partner.id) || { totalOrders: 0, totalRevenue: 0 };
        return {
          ...partner,
          name: partner.company_name || partner.name || `Partenaire ${partner.id?.slice(0, 6)}`,
          totalOrders: stats.totalOrders,
          totalRevenue: parseFloat(stats.totalRevenue.toFixed(2)),
          rating: partner.average_rating || 4.5,
        };
      });
      setPartners(partnersWithStats);

    } catch (error: any) {
      console.error("❌ Erreur admin:", error);
      toast.error("Erreur de chargement : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePartnerStatus = async (partnerId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const confirmMessage = newStatus 
      ? "✅ Accepter ce partenaire ? Il pourra recevoir des commandes."
      : "⚠️ Désactiver ce partenaire ? Il ne recevra plus de commandes.";
    
    if (!confirm(confirmMessage)) return;

    const loadingToast = toast.loading(`${newStatus ? 'Activation' : 'Désactivation'} en cours...`);

    try {
      const { error, data } = await supabase
        .from('partners')
        .update({ is_active: newStatus })
        .eq('id', partnerId)
        .select();

      if (error) {
        console.error("Erreur Supabase:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error("Aucune donnée retournée");
      }

      setPartners(partners.map(p => 
        p.id === partnerId ? { ...p, is_active: newStatus } : p
      ));

      toast.dismiss(loadingToast);
      toast.success(`✅ Partenaire ${newStatus ? 'activé' : 'désactivé'} avec succès !`, { duration: 3000 });

      await fetchData();

    } catch (error: any) {
      console.error("❌ Erreur toggle:", error);
      toast.dismiss(loadingToast);
      toast.error(`❌ Erreur : ${error.message}`, { duration: 5000 });
    }
  };

  const filteredOrdersByTime = useMemo(() => {
    if (timeRange === "all") return orders;
    const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
    const days = daysMap[timeRange];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return orders.filter(o => new Date(o.created_at) >= cutoffDate);
  }, [orders, timeRange]);

  const stats = useMemo(() => {
    const completed = filteredOrdersByTime.filter(o => o.status === "completed");
    const totalRevenue = completed.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
    const pending = filteredOrdersByTime.filter(o => o.status === "pending").length;
    const newMessages = messages.filter(m => m.read === false).length;
    const activePartnersCount = partners.filter(p => p.is_active === true).length;
    
    return {
      totalRevenue,
      totalOrders: filteredOrdersByTime.length,
      activePartners: activePartnersCount,
      pending,
      newMessages,
      totalUsers: users.length,
      revenueGrowth: 0,
      ordersGrowth: 0,
    };
  }, [filteredOrdersByTime, orders, timeRange, messages, users, partners]);

  const monthlyData = useMemo(() => {
    const months: { [key: string]: { month: string; revenue: number; orders: number } } = {};
    filteredOrdersByTime.filter(o => o.status === "completed").forEach(order => {
      const date = new Date(order.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
      if (!months[monthKey]) months[monthKey] = { month: monthName, revenue: 0, orders: 0 };
      months[monthKey].revenue += parseFloat(order.total_price || 0);
      months[monthKey].orders += 1;
    });
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month)).slice(-12);
  }, [filteredOrdersByTime]);

  const extractCity = (address: string): string => {
    if (!address) return "Non spécifié";
    const parts = address.split(",");
    if (parts.length > 1) {
      const match = parts[parts.length - 1].trim().match(/\d{5}\s+(.+)/);
      if (match && match[1]) return match[1].trim();
    }
    const words = address.split(" ");
    return words[words.length - 1] || "Non spécifié";
  };

  const cityData = useMemo(() => {
    const cities: { [key: string]: { name: string; value: number; orders: number } } = {};
    filteredOrdersByTime.filter(o => o.status === "completed").forEach(order => {
      const city = extractCity(order.pickup_address);
      if (!cities[city]) cities[city] = { name: city, value: 0, orders: 0 };
      cities[city].value += parseFloat(order.total_price || 0);
      cities[city].orders += 1;
    });
    return Object.values(cities).sort((a, b) => b.value - a.value);
  }, [filteredOrdersByTime]);

  const statusData = useMemo(() => {
    const statuses: any = {};
    filteredOrdersByTime.forEach(o => { statuses[o.status] = (statuses[o.status] || 0) + 1; });
    const colors: any = { "completed": "#10b981", "in_progress": "#3b82f6", "pending": "#f59e0b", "assigned": "#8b5cf6", "cancelled": "#ef4444" };
    return Object.entries(statuses).map(([name, value]) => ({ name, value, color: colors[name] || "#64748b" }));
  }, [filteredOrdersByTime]);

  const markMessageAsRead = async (messageId: string) => {
    const { error } = await supabase.from("contact_messages").update({ read: true }).eq("id", messageId);
    if (!error) {
      setMessages(messages.map(m => m.id === messageId ? { ...m, read: true } : m));
      toast.success("Message marqué comme lu");
    }
  };

  const handleReplyInApp = async (message: any) => {
    if (!replyText.trim()) return toast.error("Écris une réponse");
    try {
      const { error } = await supabase.from("support_responses").insert({
        message_id: message.id, response: replyText, admin_email: "admin@kilolab.fr"
      });
      if (error) throw error;
      toast.success("Réponse enregistrée");
      setReplyText("");
      setSelectedMessage(null);
      markMessageAsRead(message.id);
      fetchData();
    } catch (error: any) { toast.error(error.message); }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm("Supprimer ce message ?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", messageId);
    if (!error) {
      setMessages(messages.filter(m => m.id !== messageId));
      setSelectedMessage(null);
      toast.success("Message supprimé");
    }
  };

  const assignPartner = async (orderId: string) => {
    if (!selectedPartnerForAssign) return toast.error("Choisis un partenaire");
    try {
      const { error } = await supabase.from('orders').update({ partner_id: selectedPartnerForAssign, status: 'assigned' }).eq('id', orderId);
      if (error) throw error;
      toast.success("Commande assignée !");
      setSelectedPartnerForAssign("");
      fetchData();
    } catch (error: any) { toast.error(error.message); }
  };

  const filteredPartners = useMemo(() => {
    let filtered = partners;
    
    if (statusFilter === "active") {
      filtered = filtered.filter(p => p.is_active === true);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter(p => p.is_active === false);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(p => {
        const name = p.name || "";
        const city = p.city || "";
        return name.toLowerCase().includes(searchTerm.toLowerCase()) || 
               city.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    return filtered;
  }, [partners, searchTerm, statusFilter]);

  const handleExportCSV = () => {
    const csvHeader = "Date,ID Commande,Client,Montant,Poids,Statut,Partenaire\n";
    const csvData = filteredOrdersByTime.slice(0, 100).map(o => 
      `${new Date(o.created_at).toLocaleDateString()},${o.id.slice(0, 8)},${o.pickup_address || "N/A"},${o.total_price},${o.weight},${o.status},${o.partner?.company_name || 'Non attribué'}`
    ).join("\n");
    const blob = new Blob([csvHeader + csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kilolab-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV réussi !");
  };

  const handleLogout = async () => { 
    await supabase.auth.signOut(); 
    window.location.href = "/admin/login"; 
  };

  const StatCard = ({ title, value, icon, suffix, badge }: any) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition relative">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-teal-50 rounded-xl text-teal-600">{icon}</div>
        {badge !== undefined && badge > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {badge}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}{suffix}</div>
      <div className="text-sm text-slate-500">{title}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-teal-600" size={48} />
          <p className="text-slate-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar />
      <div className="pt-32 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-black mb-2">Dashboard Admin 👑</h1>
              <p className="text-slate-600">Vue d'ensemble de la plateforme</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition flex items-center gap-2"
              >
                <Database size={16} />
                Base de données
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition flex items-center gap-2"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Chiffre d'affaires"
              value={stats.totalRevenue.toFixed(2)}
              suffix=" €"
              icon={<DollarSign size={24} />}
            />
            <StatCard
              title="Commandes"
              value={stats.totalOrders}
              icon={<ShoppingBag size={24} />}
            />
            <StatCard
              title="Partenaires Actifs"
              value={stats.activePartners}
              icon={<Users size={24} />}
            />
            <StatCard
              title="Messages non lus"
              value={stats.newMessages}
              icon={<MessageSquare size={24} />}
              badge={stats.newMessages}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-8">
          <div className="flex border-b border-slate-100 overflow-x-auto">
            {(["overview", "partners", "orders", "messages", "cities"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium transition whitespace-nowrap capitalize ${
                  activeTab === tab
                    ? "text-teal-600 border-b-2 border-teal-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab === "partners" ? `Partenaires (${partners.length})` :
                 tab === "messages" ? `Messages (${stats.newMessages})` :
                 tab === "orders" ? `Commandes (${stats.totalOrders})` :
                 tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="text-teal-600" size={20} />
                      Évolution du CA
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={3} name="CA (€)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Répartition des commandes</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "partners" && (
              <div>
                <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setStatusFilter("all")}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                        statusFilter === "all" 
                          ? "bg-teal-600 text-white shadow-lg shadow-teal-500/30" 
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Tous ({partners.length})
                    </button>
                    <button 
                      onClick={() => setStatusFilter("pending")}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                        statusFilter === "pending" 
                          ? "bg-orange-600 text-white shadow-lg shadow-orange-500/30" 
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <AlertCircle size={14} className="inline mr-1" />
                      En attente ({partners.filter(p => !p.is_active).length})
                    </button>
                    <button 
                      onClick={() => setStatusFilter("active")}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                        statusFilter === "active" 
                          ? "bg-green-600 text-white shadow-lg shadow-green-500/30" 
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <CheckCircle size={14} className="inline mr-1" />
                      Actifs ({partners.filter(p => p.is_active).length})
                    </button>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Rechercher un partenaire..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-64"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Statut</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Nom</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Ville</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 uppercase">CA Total</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPartners.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400">
                            <Users size={48} className="mx-auto mb-3 opacity-30" />
                            <p className="font-bold">Aucun partenaire trouvé</p>
                          </td>
                        </tr>
                      ) : (
                        filteredPartners.map((partner) => (
                          <tr key={partner.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                            <td className="py-3 px-4">
                              {partner.is_active ? (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-300 inline-flex items-center gap-1">
                                  <CheckCircle size={12} />
                                  Actif
                                </span>
                              ) : (
                                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-300 inline-flex items-center gap-1">
                                  <AlertCircle size={12} />
                                  En attente
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-900">
                              {partner.name}
                            </td>
                            <td className="py-3 px-4 text-slate-700">
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={14} className="text-slate-400" />
                                {partner.city || "Non spécifié"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-teal-600">
                              {partner.totalRevenue.toFixed(2)} €
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => togglePartnerStatus(partner.id, partner.is_active)}
                                disabled={loading}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm ${
                                  partner.is_active 
                                    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                                    : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {partner.is_active ? "�� Désactiver" : "✅ Accepter"}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Toutes les commandes ({filteredOrdersByTime.length})</h3>
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm font-bold shadow-lg shadow-teal-500/30"
                  >
                    <Download size={16} />
                    Exporter CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Client</th>
                        <th className="p-4">Poids</th>
                        <th className="p-4">Statut</th>
                        <th className="p-4">Partenaire</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredOrdersByTime.slice(0, 50).map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50 transition">
                          <td className="p-4 font-mono font-bold">#{order.id.toString().slice(0, 6)}</td>
                          <td className="p-4 text-slate-500">
                            {new Date(order.created_at).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900 truncate max-w-xs">{order.pickup_address || "Adresse inconnue"}</div>
                          </td>
                          <td className="p-4">
                            <span className="font-bold">{order.weight || "?"} kg</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase 
                              ${order.status === "pending" ? "bg-orange-100 text-orange-700" :
                                order.status === "assigned" ? "bg-purple-100 text-purple-700" :
                                order.status === "completed" ? "bg-green-100 text-green-700" :
                                order.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                                "bg-slate-100"}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4">
                            {order.partner ? (
                              <span className="font-bold text-slate-700 flex items-center gap-1">
                                <CheckCircle size={14} className="text-green-500" />
                                {order.partner.company_name}
                              </span>
                            ) : (
                              <div className="flex gap-1">
                                <select
                                  className="text-xs border rounded p-1 w-32"
                                  value={selectedPartnerForAssign}
                                  onChange={(e) => setSelectedPartnerForAssign(e.target.value)}
                                >
                                  <option value="">Choisir...</option>
                                  {partners.filter(p => p.is_active).map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => assignPartner(order.id)}
                                  className="bg-slate-900 text-white text-xs px-2 py-1 rounded hover:bg-black transition"
                                >
                                  OK
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "cities" && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-6">Statistiques par ville</h3>
                {cityData.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <MapPin size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-bold">Aucune donnée disponible</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cityData.map((city, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-6 border border-teal-100 hover:shadow-md transition">
                        <div className="flex items-center gap-3 mb-4">
                          <MapPin size={24} className="text-teal-600" />
                          <h4 className="text-lg font-bold text-slate-900">{city.name}</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Commandes</span>
                            <span className="font-semibold text-slate-900">{city.orders}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">CA</span>
                            <span className="font-semibold text-teal-600">{city.value.toFixed(2)} €</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Panier moy.</span>
                            <span className="font-semibold text-slate-900">{(city.value / city.orders).toFixed(2)} €</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "messages" && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-6">Messages clients ({messages.length})</h3>
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-bold">Aucun message reçu</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`border rounded-xl p-4 transition hover:shadow-md ${
                          message.read ? "bg-white border-slate-200" : "bg-teal-50 border-teal-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-slate-900">{message.subject || "Sans objet"}</h4>
                              {!message.read && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                  NOUVEAU
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">
                              <Mail size={14} className="inline mr-1" />
                              {message.email}
                              {message.name && <span className="ml-2">({message.name})</span>}
                            </p>
                            <p className="text-sm text-slate-500">
                              {new Date(message.created_at).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {!message.read && (
                              <button
                                onClick={() => markMessageAsRead(message.id)}
                                className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold hover:bg-green-200 transition flex items-center gap-2"
                              >
                                <CheckCircle size={14} />
                                Marquer lu
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedMessage(selectedMessage?.id === message.id ? null : message)}
                              className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 transition flex items-center gap-2"
                            >
                              <Send size={14} />
                              Répondre
                            </button>
                            <button
                              onClick={() => deleteMessage(message.id)}
                              className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200 transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 mb-3 whitespace-pre-wrap">
                          {message.message}
                        </div>

                        {message.support_responses && message.support_responses.length > 0 && (
                          <div className="mb-4 pl-4 border-l-4 border-teal-200 space-y-3 bg-teal-50/50 p-3 rounded-r-lg">
                            <p className="text-xs font-bold text-teal-600 uppercase mb-2">Historique de vos réponses :</p>
                            {message.support_responses
                              .sort((a:any, b:any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                              .map((resp: any) => (
                              <div key={resp.id} className="bg-white p-3 rounded-lg shadow-sm text-sm border border-teal-100">
                                <div className="flex justify-between text-xs text-slate-400 mb-1">
                                  <span className="font-bold text-teal-700">Vous (Admin)</span>
                                  <span>{new Date(resp.created_at).toLocaleDateString("fr-FR")} à {new Date(resp.created_at).toLocaleTimeString("fr-FR", {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <p className="text-slate-700 whitespace-pre-wrap">{resp.response}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {selectedMessage?.id === message.id && (
                          <div className="mt-4 border-t border-slate-200 pt-4">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              Votre réponse
                            </label>
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Écris ta réponse ici..."
                              rows={4}
                              className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleReplyInApp(message)}
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 transition flex items-center gap-2"
                              >
                                <Send size={14} />
                                Envoyer
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedMessage(null);
                                  setReplyText("");
                                }}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition"
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
