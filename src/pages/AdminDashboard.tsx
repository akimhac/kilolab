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
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [selectedPartnerForAssign, setSelectedPartnerForAssign] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          partner:partners!orders_partner_id_fkey(company_name)
        `)
        .order("created_at", { ascending: false });

      if (ordersError) console.error("Orders error:", ordersError);

      // 2. Partners (TOUS les partenaires, même les non actifs)
      const { data: partnersData, error: partnersError } = await supabase
        .from("partners")
        .select("*")
        .order("created_at", { ascending: false }); // J'ai retiré le filtre .eq('is_active', true)

      if (partnersError) console.error("Partners error:", partnersError);

      // 3. Messages de contact AVEC L'HISTORIQUE
      const { data: messagesData, error: messagesError } = await supabase
        .from("contact_messages")
        .select("*, support_responses(*)")
        .order("created_at", { ascending: false });

      if (messagesError) console.error("Messages error:", messagesError);

      // 4. Utilisateurs
      const { data: usersData, error: usersError } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (usersError) console.error("Users error:", usersError);

      // 5. Set states
      setOrders(ordersData || []);
      setMessages(messagesData || []);
      setUsers(usersData || []);

      // 6. Calculer les stats des partenaires
      const partnerStatsMap = new Map();

      (ordersData || []).forEach((order: any) => {
        if (order.partner_id && order.status === "completed") {
          if (!partnerStatsMap.has(order.partner_id)) {
            partnerStatsMap.set(order.partner_id, {
              totalOrders: 0,
              totalRevenue: 0,
            });
          }
          const stats = partnerStatsMap.get(order.partner_id);
          stats.totalOrders += 1;
          stats.totalRevenue += parseFloat(order.total_price || 0);
        }
      });

      const partnersWithStats = (partnersData || []).map((partner: any) => {
        const stats = partnerStatsMap.get(partner.id) || { totalOrders: 0, totalRevenue: 0 };
        return {
          id: partner.id,
          name: partner.company_name || partner.name || `Partenaire ${partner.id.slice(0, 6)}`,
          city: partner.city || "Non spécifié",
          is_active: partner.is_active, // On garde l'info pour l'affichage
          totalOrders: stats.totalOrders,
          totalRevenue: parseFloat(stats.totalRevenue.toFixed(2)),
          rating: partner.average_rating || 4.5,
        };
      });

      setPartners(partnersWithStats);

    } catch (error: any) {
      console.error("❌ Erreur admin:", error);
      toast.error("Erreur partielle: " + error.message);
    } finally {
      setLoading(false);
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
    const activePartners = new Set(completed.map(o => o.partner_id).filter(Boolean)).size;
    const pending = filteredOrdersByTime.filter(o => o.status === "pending").length;
    const newMessages = messages.filter(m => m.read === false).length;
    const totalUsers = users.length;

    const periodDays = timeRange === "all" ? 90 : parseInt(timeRange);
    const previousPeriodStart = new Date();
    previousPeriodStart.setDate(previousPeriodStart.getDate() - periodDays * 2);
    const previousPeriodEnd = new Date();
    previousPeriodEnd.setDate(previousPeriodEnd.getDate() - periodDays);

    const previousOrders = orders.filter(o => {
      const date = new Date(o.created_at);
      return date >= previousPeriodStart && date < previousPeriodEnd && o.status === "completed";
    });

    const previousRevenue = previousOrders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    const ordersGrowth = previousOrders.length > 0 ? ((completed.length - previousOrders.length) / previousOrders.length) * 100 : 0;

    return {
      totalRevenue,
      totalOrders: filteredOrdersByTime.length,
      activePartners,
      pending,
      newMessages,
      totalUsers,
      revenueGrowth,
      ordersGrowth,
    };
  }, [filteredOrdersByTime, orders, timeRange, messages, users]);

  const monthlyData = useMemo(() => {
    const months: { [key: string]: { month: string; revenue: number; orders: number } } = {};

    filteredOrdersByTime
      .filter(o => o.status === "completed")
      .forEach(order => {
        const date = new Date(order.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const monthName = date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });

        if (!months[monthKey]) {
          months[monthKey] = { month: monthName, revenue: 0, orders: 0 };
        }

        months[monthKey].revenue += parseFloat(order.total_price || 0);
        months[monthKey].orders += 1;
      });

    return Object.values(months)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12)
      .map(m => ({ ...m, revenue: parseFloat(m.revenue.toFixed(2)) }));
  }, [filteredOrdersByTime]);

  const extractCity = (address: string): string => {
    if (!address) return "Non spécifié";
    const parts = address.split(",");
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1].trim();
      const match = lastPart.match(/\d{5}\s+(.+)/);
      if (match && match[1]) return match[1].trim();
    }
    const words = address.split(" ");
    return words[words.length - 1] || "Non spécifié";
  };

  const cityData = useMemo(() => {
    const cities: { [key: string]: { name: string; value: number; orders: number } } = {};
    filteredOrdersByTime
      .filter(o => o.status === "completed")
      .forEach(order => {
        const city = extractCity(order.pickup_address);
        if (!cities[city]) cities[city] = { name: city, value: 0, orders: 0 };
        cities[city].value += parseFloat(order.total_price || 0);
        cities[city].orders += 1;
      });
    return Object.values(cities)
      .sort((a, b) => b.value - a.value)
      .map(c => ({ ...c, value: parseFloat(c.value.toFixed(2)) }));
  }, [filteredOrdersByTime]);

  const statusData = useMemo(() => {
    const statusLabels: any = {
      "pending": "En attente",
      "assigned": "Assigné",
      "in_progress": "En cours",
      "ready": "Prêt",
      "completed": "Terminé",
      "cancelled": "Annulé"
    };
    const statuses: any = {};
    filteredOrdersByTime.forEach(o => {
      const label = statusLabels[o.status] || o.status;
      statuses[label] = (statuses[label] || 0) + 1;
    });
    const colors: any = {
      "Terminé": "#10b981",
      "En cours": "#3b82f6",
      "En attente": "#f59e0b",
      "Assigné": "#8b5cf6",
      "Prêt": "#6366f1",
      "Annulé": "#ef4444"
    };
    return Object.entries(statuses).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || "#64748b"
    }));
  }, [filteredOrdersByTime]);

  const markMessageAsRead = async (messageId: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ read: true })
      .eq("id", messageId);

    if (!error) {
      setMessages(messages.map(m => m.id === messageId ? { ...m, read: true } : m));
      toast.success("Message marqué comme lu");
    } else {
      toast.error("Erreur de mise à jour");
    }
  };

  const handleReplyInApp = async (message: any) => {
    if (!replyText.trim()) {
      toast.error("Écris une réponse avant d'envoyer");
      return;
    }

    try {
      const { error } = await supabase
        .from("support_responses")
        .insert({
          message_id: message.id,
          response: replyText,
          admin_email: "admin@kilolab.fr"
        });

      if (error) throw error;

      toast.success("✅ Réponse enregistrée ! L'email devrait partir.");
      setReplyText("");
      setSelectedMessage(null);
      markMessageAsRead(message.id);
      
      // Rafraîchir pour voir la réponse apparaître
      fetchData();
    } catch (error: any) {
      console.error(error);
      toast.error("❌ Erreur d'enregistrement : " + error.message);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm("Supprimer ce message ?")) return;
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", messageId);
    if (!error) {
      setMessages(messages.filter(m => m.id !== messageId));
      setSelectedMessage(null);
      toast.success("Message supprimé");
    } else {
      toast.error("Erreur de suppression");
    }
  };

  const assignPartner = async (orderId: string) => {
    if (!selectedPartnerForAssign) return toast.error("Veuillez choisir un partenaire !");
    try {
      const { error } = await supabase
        .from('orders')
        .update({ partner_id: selectedPartnerForAssign, status: 'assigned' })
        .eq('id', orderId);
      if (error) throw error;
      toast.success("Commande attribuée avec succès !");
      setSelectedPartnerForAssign("");
      fetchData();
    } catch (error: any) {
      toast.error("Erreur : " + error.message);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: number;
    suffix?: string;
    badge?: number;
  }> = ({ title, value, icon, trend, suffix, badge }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition relative">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
            {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
        {badge !== undefined && badge > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {badge}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">
        {value}{suffix}
      </div>
      <div className="text-sm text-slate-500">{title}</div>
    </div>
  );

  const filteredPartners = useMemo(() => {
    return partners.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [partners, searchTerm]);

  const handleExportCSV = () => {
    const csvHeader = "Date,ID Commande,Client,Montant,Poids,Statut,Partenaire\n";
    const csvData = filteredOrdersByTime
      .slice(0, 100)
      .map(o =>
        `${new Date(o.created_at).toLocaleDateString()},${o.id.slice(0, 8)},${o.pickup_address || "N/A"},${o.total_price},${o.weight},${o.status},${o.partner?.company_name || 'Non attribué'}`
      )
      .join("\n");

    const blob = new Blob([csvHeader + csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kilolab-admin-export-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV réussi !");
  };

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
              <h1 className="text-3xl font-black mb-2">Dashboard Admin Kilolab 👑</h1>
              <p className="text-slate-600">Vue d'ensemble de la plateforme</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.open("https://supabase.com/dashboard/project/dhecegehcjelbxydeolg", "_blank")}
                className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition flex items-center gap-2"
              >
                <Database size={16} />
                Ouvrir Supabase
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition"
              >
                Rafraîchir
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {(["7d", "30d", "90d", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition ${timeRange === range
                  ? "bg-teal-600 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {range === "7d" ? "7 jours" : range === "30d" ? "30 jours" : range === "90d" ? "90 jours" : "Tout"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Chiffre d'affaires"
              value={stats.totalRevenue.toFixed(2)}
              suffix=" €"
              icon={<DollarSign size={24} />}
              trend={stats.revenueGrowth}
            />
            <StatCard
              title="Commandes terminées"
              value={stats.totalOrders.toString()}
              icon={<ShoppingBag size={24} />}
              trend={stats.ordersGrowth}
            />
            <StatCard
              title="Utilisateurs inscrits"
              value={stats.totalUsers.toString()}
              icon={<Users size={24} />}
            />
            <StatCard
              title="Messages non lus"
              value={stats.newMessages.toString()}
              icon={<MessageSquare size={24} />}
              badge={stats.newMessages}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-8">
          <div className="flex border-b border-slate-100 overflow-x-auto">
            {(["overview", "messages", "users", "partners", "cities", "orders"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium transition whitespace-nowrap ${activeTab === tab
                  ? "text-teal-600 border-b-2 border-teal-600"
                  : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                {tab === "overview" ? "Vue d'ensemble" :
                  tab === "messages" ? `Messages (${stats.newMessages})` :
                    tab === "users" ? "Utilisateurs" :
                      tab === "partners" ? "Partenaires" :
                        tab === "cities" ? "Villes" : "Commandes"}
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
                        <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={3} name="CA" dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Package className="text-blue-600" size={20} />
                      Commandes par mois
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="orders" fill="#3b82f6" name="Commandes" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <MapPin className="text-purple-600" size={20} />
                      Top 5 villes
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={cityData.slice(0, 5)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" stroke="#64748b" fontSize={12} />
                        <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={100} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8b5cf6" name="CA" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-6">Messages clients ({messages.length})</h3>
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-bold">Aucun message reçu</p>
                    <p className="text-sm mt-2">Les messages du formulaire de contact apparaîtront ici</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`border rounded-xl p-4 transition hover:shadow-md ${message.read ? "bg-white border-slate-200" : "bg-teal-50 border-teal-200"
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

                        {/* Historique des réponses */}
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
                              Votre réponse (sera envoyée automatiquement par email)
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
                                Envoyer l'email
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

            {activeTab === "users" && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-6">Utilisateurs inscrits ({users.length})</h3>
                {users.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Users size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-bold">Aucun utilisateur inscrit</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Nom</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Email</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Téléphone</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Inscription</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4 font-medium text-slate-900">{user.full_name || "Non renseigné"}</td>
                            <td className="py-3 px-4 text-slate-700">{user.email || "N/A"}</td>
                            <td className="py-3 px-4 text-slate-700">{user.phone || "N/A"}</td>
                            <td className="py-3 px-4 text-slate-500 text-sm">
                              {new Date(user.created_at).toLocaleDateString("fr-FR")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "partners" && (
              <div>
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                  <h3 className="text-lg font-bold text-slate-900">Liste des partenaires ({partners.length})</h3>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <button
                      onClick={handleExportCSV}
                      className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                    >
                      <Download size={16} />
                      Exporter
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Statut</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Nom</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Ville</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Commandes</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">CA total</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPartners.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            Aucun partenaire trouvé.
                          </td>
                        </tr>
                      ) : (
                        filteredPartners.map((partner) => (
                          <tr key={partner.id} className="border-b border-slate-100 hover:bg-slate-50">
                             <td className="py-3 px-4">
                              {partner.is_active ? (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                                  Actif
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold border border-orange-200">
                                  En attente
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-900">{partner.name}</td>
                            <td className="py-3 px-4 text-slate-700">
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={14} className="text-slate-400" />
                                {partner.city}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right text-slate-700">{partner.totalOrders}</td>
                            <td className="py-3 px-4 text-right font-semibold text-teal-600">{partner.totalRevenue.toFixed(2)} €</td>
                            <td className="py-3 px-4 text-right">
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium">
                                ⭐ {partner.rating.toFixed(1)}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
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
                      <div key={idx} className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-6 border border-teal-100">
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

            {activeTab === "orders" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Toutes les commandes ({filteredOrdersByTime.length})</h3>
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm"
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
                        <th className="p-4 text-right">Actions</th>
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
                            ) : order.status === 'assigned' ? (
                              <div className="flex flex-col gap-2">
                                <span className="text-xs font-bold text-red-600 flex items-center gap-1 bg-red-50 px-2 py-1 rounded w-fit">
                                  <AlertCircle size={12} /> À attribuer
                                </span>
                                <div className="flex gap-1">
                                  <select
                                    className="text-xs border rounded p-1 w-32"
                                    value={selectedPartnerForAssign}
                                    onChange={(e) => setSelectedPartnerForAssign(e.target.value)}
                                  >
                                    <option value="">Choisir...</option>
                                    {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                  </select>
                                  <button
                                    onClick={() => assignPartner(order.id)}
                                    className="bg-slate-900 text-white text-xs px-2 py-1 rounded hover:bg-black"
                                  >
                                    OK
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">En attente</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <button className="text-slate-400 hover:text-slate-900 transition">
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
