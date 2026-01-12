import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import {
  Users, ShoppingBag, DollarSign, Search, Download,
  TrendingUp, TrendingDown, MapPin, Package, Loader2, Eye,
  MessageSquare, Mail, Trash2, Send, Database, AlertCircle, 
  CheckCircle, LogOut, XCircle, X, RefreshCw
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
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [activeTab, setActiveTab] = useState<"overview" | "partners" | "cities" | "orders" | "messages" | "users" | "clients">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">("all");
  
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [selectedPartnerForAssign, setSelectedPartnerForAssign] = useState<string>("");
  
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: o } = await supabase.from("orders").select(`*, partner:partners!orders_partner_id_fkey(company_name)`).order("created_at", { ascending: false });
      const { data: p } = await supabase.from("partners").select("*").order("created_at", { ascending: false });
      const { data: m } = await supabase.from("contact_messages").select("*, support_responses(*)").order("created_at", { ascending: false });
      const { data: u } = await supabase.from("user_profiles").select("*").order("created_at", { ascending: false });
      
      setOrders(o || []); 
      setMessages(m || []); 
      setUsers(u || []);

      if (u) {
        const clientList = u.filter((user: any) => user.role === 'client' || !user.role);
        setClients(clientList);
      }

      const partnerStatsMap = new Map();
      (o || []).forEach((order: any) => {
        if (order.partner_id && order.status === "completed") {
          if (!partnerStatsMap.has(order.partner_id)) {
            partnerStatsMap.set(order.partner_id, { totalOrders: 0, totalRevenue: 0 });
          }
          const stats = partnerStatsMap.get(order.partner_id);
          stats.totalOrders += 1;
          stats.totalRevenue += parseFloat(order.total_price || 0);
        }
      });

      const partnersWithStats = (p || []).map((partner: any) => {
        const stats = partnerStatsMap.get(partner.id) || { totalOrders: 0, totalRevenue: 0 };
        return {
          ...partner,
          name: partner.company_name || partner.name || partner.email?.split('@')[0] || "Sans nom",
          city: partner.city || "Non spécifié",
          totalOrders: stats.totalOrders,
          totalRevenue: parseFloat(stats.totalRevenue.toFixed(2))
        };
      });

      setPartners(partnersWithStats);
    } catch (e) { 
        console.error(e);
        toast.error("Erreur de chargement");
    } finally { 
        setLoading(false); 
    }
  };

  const approvePartner = async (id: string, e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    const t = toast.loading("⏳ Validation...");
    const { error } = await supabase.rpc('admin_approve_partner', { partner_uuid: id });
    if (error) toast.error("❌ Erreur: " + error.message, { id: t });
    else {
      toast.success("✅ Partenaire validé & email envoyé !", { id: t });
      fetchData();
      if(showModal) setShowModal(false);
    }
  };

  const rejectPartner = async (partner: any, e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    if (!confirm(`⛔ Refuser ${partner.name} ?`)) return;
    const t = toast.loading("⏳ Refus...");
    const { error } = await supabase.rpc('admin_reject_partner', { partner_uuid: partner.id });
    if (error) toast.error("❌ Erreur: " + error.message, { id: t });
    else {
      toast.success("🗑️ Partenaire refusé & notifié", { id: t });
      fetchData();
      if(showModal) setShowModal(false);
    }
  };

  const deactivatePartner = async (id: string, e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    if (!confirm("Désactiver ?")) return;
    await supabase.from('partners').update({ is_active: false }).eq('id', id);
    fetchData();
    toast.success("✅ Désactivé");
    if(showModal) setShowModal(false);
  };

  const filteredOrdersByTime = useMemo(() => {
    if (timeRange === "all") return orders;
    const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysMap[timeRange]);
    return orders.filter(o => new Date(o.created_at) >= cutoffDate);
  }, [orders, timeRange]);

  const stats = useMemo(() => {
    const completed = filteredOrdersByTime.filter(o => o.status === "completed");
    const totalRevenue = completed.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
    const activePartners = partners.filter(p => p.is_active).length;
    const newMessages = Array.isArray(messages) ? messages.filter(m => !m.read).length : 0;

    return {
      totalRevenue,
      totalOrders: filteredOrdersByTime.length,
      activePartners,
      newMessages,
      totalUsers: users.length,
      revenueGrowth: 0, 
      ordersGrowth: 0 
    };
  }, [filteredOrdersByTime, orders, timeRange, messages, users, partners]);

  const monthlyData = useMemo(() => {
    const months: any = {};
    filteredOrdersByTime.filter(o => o.status === "completed").forEach(order => {
      const date = new Date(order.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
      if (!months[monthKey]) months[monthKey] = { month: monthName, revenue: 0, orders: 0 };
      months[monthKey].revenue += parseFloat(order.total_price || 0);
      months[monthKey].orders += 1;
    });
    return Object.values(months).slice(-12).map((m: any) => ({ ...m, revenue: parseFloat(m.revenue.toFixed(2)) }));
  }, [filteredOrdersByTime]);

  const cityData = useMemo(() => {
    const cities: any = {};
    filteredOrdersByTime.filter(o => o.status === "completed").forEach(order => {
      const parts = (order.pickup_address || "").split(",");
      const city = parts.length > 1 ? parts[parts.length - 1].trim().replace(/[0-9]/g, '') : "Inconnu";
      if (!cities[city]) cities[city] = { name: city, value: 0, orders: 0 };
      cities[city].value += parseFloat(order.total_price || 0);
      cities[city].orders += 1;
    });
    return Object.values(cities).sort((a: any, b: any) => b.value - a.value).slice(0, 10).map((c: any) => ({ ...c, value: parseFloat(c.value.toFixed(2)) }));
  }, [filteredOrdersByTime]);

  const statusData = useMemo(() => {
    const labels: any = { "pending": "En attente", "assigned": "Assigné", "in_progress": "En cours", "ready": "Prêt", "completed": "Terminé", "cancelled": "Annulé" };
    const statuses: any = {};
    filteredOrdersByTime.forEach(o => {
      const label = labels[o.status] || o.status;
      statuses[label] = (statuses[label] || 0) + 1;
    });
    const colors: any = { "Terminé": "#10b981", "En cours": "#3b82f6", "En attente": "#f59e0b", "Assigné": "#8b5cf6", "Prêt": "#6366f1", "Annulé": "#ef4444" };
    return Object.entries(statuses).map(([name, value]) => ({ name, value, color: colors[name] || "#64748b" }));
  }, [filteredOrdersByTime]);

  const filteredPartners = useMemo(() => {
    let filtered = partners;
    if (statusFilter === "active") filtered = filtered.filter(p => p.is_active);
    else if (statusFilter === "pending") filtered = filtered.filter(p => !p.is_active);
    
    if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(p => 
            (p.name && p.name.toLowerCase().includes(lowerTerm)) || 
            (p.email && p.email.toLowerCase().includes(lowerTerm)) ||
            (p.city && p.city.toLowerCase().includes(lowerTerm))
        );
    }
    return filtered;
  }, [partners, searchTerm, statusFilter]);

  const handleExportCSV = () => {
    toast.success("Export CSV lancé !");
    // Logique CSV ici si besoin
  };

  // --- ACTIONS MESSAGERIE ---
  const markMessageAsRead = async (messageId: string) => {
    await supabase.from("contact_messages").update({ read: true }).eq("id", messageId);
    setMessages(messages.map(m => m.id === messageId ? { ...m, read: true } : m));
    toast.success("Message lu");
  };

  const handleReplyInApp = async (message: any) => {
    if (!replyText.trim()) return toast.error("Écris une réponse");
    const { error } = await supabase.from("support_responses").insert({ message_id: message.id, response: replyText, admin_email: "admin@kilolab.fr" });
    if (error) return toast.error("❌ " + error.message);
    toast.success("✅ Réponse enregistrée !");
    setReplyText("");
    setSelectedMessage(null);
    markMessageAsRead(message.id);
    fetchData();
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm("Supprimer ?")) return;
    await supabase.from("contact_messages").delete().eq("id", messageId);
    setMessages(messages.filter(m => m.id !== messageId));
    setSelectedMessage(null);
    toast.success("Supprimé");
  };

  // --- ACTION ASSIGNATION ---
  const assignPartner = async (orderId: string) => {
    if (!selectedPartnerForAssign) return toast.error("Choisis un partenaire");
    const { error } = await supabase.from('orders').update({ partner_id: selectedPartnerForAssign, status: 'assigned' }).eq('id', orderId);
    if (error) return toast.error(error.message);
    toast.success("Assigné !");
    setSelectedPartnerForAssign("");
    fetchData();
  };

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = "/admin/login"; };

  const StatCard = ({ title, value, icon, suffix, badge }: any) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition relative">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-teal-50 rounded-xl text-teal-600">{icon}</div>
        {badge !== undefined && badge > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">{badge}</div>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}{suffix}</div>
      <div className="text-sm text-slate-500">{title}</div>
    </div>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-teal-600" size={48}/></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar />
      <div className="pt-32 px-4 max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-black mb-2 text-slate-900">Dashboard Admin Kilolab 👑</h1>
              <p className="text-slate-600">Vue d'ensemble de l'activité</p>
            </div>
            <div className="flex gap-3">
               <button onClick={fetchData} className="bg-white border px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 flex items-center gap-2 transition">
                <RefreshCw size={16} /> Actualiser
              </button>
              <button onClick={() => window.open("https://supabase.com/dashboard", "_blank")} className="bg-white border px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 flex items-center gap-2 transition">
                <Database size={16} /> Supabase
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="CA Total" value={stats.totalRevenue.toFixed(2)} suffix=" €" icon={<DollarSign size={24} />} />
            <StatCard title="Commandes" value={stats.totalOrders.toString()} icon={<ShoppingBag size={24} />} />
            <StatCard title="Utilisateurs" value={stats.totalUsers.toString()} icon={<Users size={24} />} />
            <StatCard title="Messages" value={stats.newMessages.toString()} icon={<MessageSquare size={24} />} badge={stats.newMessages} />
          </div>
        </div>

        {/* TABS & CONTENT */}
        <div className="bg-transparent mb-8">
          <div className="flex overflow-x-auto space-x-2 mb-6 bg-white p-2 rounded-2xl shadow-sm border inline-flex">
            {(["overview", "partners", "cities", "orders", "messages", "users", "clients"] as const).map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab 
                    ? "bg-teal-600 text-white shadow-lg" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {tab === "overview" ? "Vue" : tab === "partners" ? "Partenaires" : tab === "cities" ? "Villes" : tab === "orders" ? "Commandes" : tab === "messages" ? `Messages` : tab === "users" ? "Users" : `Clients`}
              </button>
            ))}
          </div>

          <div className="">
            {/* --- VUE D'ENSEMBLE --- */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><TrendingUp className="text-teal-600" size={20} />Évolution CA</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}€`} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Line type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} dot={{ r: 4, fill: "#0d9488", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Package className="text-blue-600" size={20} />Commandes</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* --- PARTENAIRES (DESIGN PREMIUM) --- */}
            {activeTab === "partners" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                  <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border">
                    <button onClick={() => setStatusFilter("all")} className={`px-4 py-2 rounded-lg font-bold text-sm transition ${statusFilter === "all" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`}>Tous ({partners.length})</button>
                    <button onClick={() => setStatusFilter("pending")} className={`px-4 py-2 rounded-lg font-bold text-sm transition ${statusFilter === "pending" ? "bg-orange-500 text-white" : "text-slate-500 hover:bg-slate-50"}`}>En attente ({partners.filter(p => !p.is_active).length})</button>
                    <button onClick={() => setStatusFilter("active")} className={`px-4 py-2 rounded-lg font-bold text-sm transition ${statusFilter === "active" ? "bg-teal-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}>Actifs ({partners.filter(p => p.is_active).length})</button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Rechercher un pressing..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 w-72 shadow-sm" />
                  </div>
                </div>

                {filteredPartners.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                        <Users size={48} className="mx-auto mb-4 text-slate-300" />
                        <p className="font-bold text-slate-500">Aucun partenaire trouvé</p>
                    </div>
                ) : (
                    /* ASTUCE CTO : table avec border-spacing pour effet cartes séparées */
                    <table className="w-full border-separate border-spacing-y-3">
                        <thead>
                            <tr className="text-slate-400 text-sm uppercase tracking-wider">
                                <th className="text-left font-bold px-6 py-2">Statut</th>
                                <th className="text-left font-bold px-6 py-2">Partenaire</th>
                                <th className="text-left font-bold px-6 py-2">Ville</th>
                                <th className="text-right font-bold px-6 py-2">CA</th>
                                <th className="text-right font-bold px-6 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredPartners.map((partner) => (
                            <tr 
                                key={partner.id} 
                                onClick={(e) => {
                                    if((e.target as HTMLElement).closest('button')) return;
                                    setSelectedPartner(partner); 
                                    setShowModal(true); 
                                }}
                                className="bg-white shadow-sm rounded-2xl hover:shadow-md transition-all duration-200 cursor-pointer group hover:-translate-y-0.5"
                            >
                                <td className="py-4 px-6 rounded-l-2xl border-l border-y border-transparent">
                                    {partner.is_active ? (
                                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100 inline-flex items-center gap-1">
                                            <CheckCircle size={12} fill="currentColor" className="text-green-200" /> Actif
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold border border-orange-100 inline-flex items-center gap-1">
                                            <AlertCircle size={12} fill="currentColor" className="text-orange-200" /> En attente
                                        </span>
                                    )}
                                </td>
                                <td className="py-4 px-6 border-y border-transparent">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 text-lg group-hover:text-teal-600 transition-colors">{partner.name}</span>
                                        <span className="text-xs text-slate-400">{partner.email}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 border-y border-transparent">
                                    <span className="inline-flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1 rounded-lg">
                                        <MapPin size={14} className="text-slate-400" /> {partner.city}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right font-bold text-teal-600 border-y border-transparent">
                                    {partner.totalRevenue.toFixed(2)} €
                                </td>
                                <td className="py-4 px-6 text-right rounded-r-2xl border-r border-y border-transparent">
                                    <div className="flex justify-end gap-2">
                                        {partner.is_active ? (
                                            <button 
                                                onClick={(e) => deactivatePartner(partner.id, e)} 
                                                className="bg-white border border-red-100 text-red-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-50 hover:border-red-200 transition"
                                            >
                                                Désactiver
                                            </button>
                                        ) : (
                                            <>
                                                <button onClick={(e) => rejectPartner(partner, e)} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition">Refuser</button>
                                                <button onClick={(e) => approvePartner(partner.id, e)} className="bg-teal-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-teal-700 shadow-lg shadow-teal-100 transition">Valider</button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
              </div>
            )}

            {activeTab === "cities" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {cityData.map((city, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h4 className="font-bold text-lg mb-2">{city.name}</h4>
                            <div className="flex justify-between text-sm"><span className="text-slate-500">CA</span> <span className="font-bold text-teal-600">{city.value}€</span></div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "orders" && (
              <div>
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-bold">Commandes ({filteredOrdersByTime.length})</h3>
                  <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"><Download size={16} />CSV</button>
                </div>
                <div className="overflow-x-auto bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase"><tr><th className="p-4">ID</th><th className="p-4">Date</th><th className="p-4">Client</th><th className="p-4">Poids</th><th className="p-4">Statut</th><th className="p-4">Partenaire</th><th className="p-4 text-right">Actions</th></tr></thead>
                    <tbody className="divide-y text-sm">
                      {filteredOrdersByTime.slice(0, 50).map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50 transition">
                          <td className="p-4 font-mono font-bold">#{order.id.toString().slice(0, 6)}</td>
                          <td className="p-4 text-slate-500">{new Date(order.created_at).toLocaleDateString("fr-FR")}</td>
                          <td className="p-4"><div className="font-bold truncate max-w-xs">{order.pickup_address || "Adresse inconnue"}</div></td>
                          <td className="p-4"><span className="font-bold">{order.weight || "?"} kg</span></td>
                          <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${order.status === "pending" ? "bg-orange-100 text-orange-700" : order.status === "assigned" ? "bg-purple-100 text-purple-700" : order.status === "completed" ? "bg-green-100 text-green-700" : order.status === "in_progress" ? "bg-blue-100 text-blue-700" : "bg-slate-100"}`}>{order.status}</span></td>
                          <td className="p-4">
                            {order.partner ? (
                              <span className="font-bold flex items-center gap-1"><CheckCircle size={14} className="text-green-500" />{order.partner.company_name}</span>
                            ) : order.status === 'assigned' ? (
                              <div className="flex flex-col gap-2">
                                <span className="text-xs font-bold text-red-600 flex items-center gap-1 bg-red-50 px-2 py-1 rounded w-fit"><AlertCircle size={12} />À attribuer</span>
                                <div className="flex gap-1">
                                  <select className="text-xs border rounded p-1 w-32" value={selectedPartnerForAssign} onChange={(e) => setSelectedPartnerForAssign(e.target.value)}>
                                    <option value="">Choisir...</option>
                                    {partners.filter(p => p.is_active).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                  </select>
                                  <button onClick={() => assignPartner(order.id)} className="bg-slate-900 text-white text-xs px-2 py-1 rounded hover:bg-black">OK</button>
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">En attente</span>
                            )}
                          </td>
                          <td className="p-4 text-right"><button className="text-slate-400 hover:text-slate-900"><Eye size={18} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div>
                <h3 className="text-lg font-bold mb-6">Messages ({messages.length})</h3>
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-400"><MessageSquare size={48} className="mx-auto mb-3 opacity-30" /><p className="font-bold">Aucun message</p></div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`border rounded-2xl p-6 hover:shadow-md transition ${message.read ? "bg-white border-slate-200" : "bg-teal-50 border-teal-200"}`}>
                        <div className="flex justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex gap-3 mb-2">
                              <h4 className="font-bold text-lg">{message.subject || "Sans objet"}</h4>
                              {!message.read && <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">NOUVEAU</span>}
                            </div>
                            <p className="text-sm text-slate-600 mb-2"><Mail size={14} className="inline mr-1" />{message.email}{message.name && <span className="ml-2 font-medium">({message.name})</span>}</p>
                            <p className="text-sm text-slate-500">{new Date(message.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                          </div>
                          <div className="flex gap-2">
                            {!message.read && <button onClick={() => markMessageAsRead(message.id)} className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold hover:bg-green-200 flex items-center gap-2"><CheckCircle size={14} />Lu</button>}
                            <button onClick={() => setSelectedMessage(selectedMessage?.id === message.id ? null : message)} className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 flex items-center gap-2"><Send size={14} />Répondre</button>
                            <button onClick={() => deleteMessage(message.id)} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200"><Trash2 size={14} /></button>
                          </div>
                        </div>
                        <div className="bg-slate-50/50 rounded-xl p-4 text-sm mb-3 whitespace-pre-wrap border border-slate-100/50">{message.message}</div>
                        
                        {/* Réponse rapide */}
                        {selectedMessage?.id === message.id && (
                          <div className="mt-4 border-t pt-4 animate-in slide-in-from-top-2">
                            <label className="block text-sm font-bold mb-2">Votre réponse</label>
                            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Écrivez votre réponse ici..." rows={4} className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm" />
                            <div className="flex gap-2 mt-3">
                              <button onClick={() => handleReplyInApp(message)} className="px-6 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 flex items-center gap-2 shadow-lg shadow-teal-100"><Send size={14} />Envoyer</button>
                              <button onClick={() => { setSelectedMessage(null); setReplyText(""); }} className="px-4 py-2 bg-slate-100 rounded-xl text-sm font-bold hover:bg-slate-200 text-slate-600">Annuler</button>
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
                <h3 className="text-lg font-bold mb-6">Utilisateurs ({users.length})</h3>
                <div className="overflow-x-auto bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <table className="w-full">
                      <thead><tr className="border-b bg-slate-50/50"><th className="text-left py-4 px-6 text-sm font-semibold">Nom</th><th className="text-left py-4 px-6 text-sm font-semibold">Email</th><th className="text-left py-4 px-6 text-sm font-semibold">Téléphone</th><th className="text-left py-4 px-6 text-sm font-semibold">Inscription</th></tr></thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-slate-50 transition">
                            <td className="py-4 px-6 font-medium">{user.full_name || "Non renseigné"}</td>
                            <td className="py-4 px-6">{user.email || "N/A"}</td>
                            <td className="py-4 px-6">{user.phone || "N/A"}</td>
                            <td className="py-4 px-6 text-sm text-slate-500">{new Date(user.created_at).toLocaleDateString("fr-FR")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
              </div>
            )}

            {activeTab === "clients" && (
              <div>
                <h3 className="text-lg font-bold mb-6">👤 Clients inscrits ({clients.length})</h3>
                {clients.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                    <Users size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-bold">Aucun client inscrit</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-slate-50/50">
                          <th className="text-left py-4 px-6 text-sm font-semibold">Email</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold">Nom</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold">Téléphone</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold">Date inscription</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold">Commandes</th>
                          <th className="text-center py-4 px-6 text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((client) => (
                          <tr key={client.id} className="border-b border-gray-100 hover:bg-slate-50 transition">
                            <td className="py-4 px-6">{client.email}</td>
                            <td className="py-4 px-6 font-medium">{client.full_name || "N/A"}</td>
                            <td className="py-4 px-6">{client.phone || "N/A"}</td>
                            <td className="py-4 px-6 text-sm text-slate-500">
                              {new Date(client.created_at).toLocaleDateString("fr-FR")}
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-teal-600 font-bold bg-teal-50 px-2 py-1 rounded">0</span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <button className="text-teal-600 hover:text-teal-800 text-sm font-bold transition">
                                Voir détails
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* --- MODAL DÉTAILS PRESSING (DESIGN PREMIUM) --- */}
      {showModal && selectedPartner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
            
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition text-slate-500 hover:text-slate-900">
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-teal-100">
                    {selectedPartner.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-900">{selectedPartner.name}</h2>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${selectedPartner.is_active ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {selectedPartner.is_active ? 'Actif' : 'En attente'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-teal-900 mb-4 flex items-center gap-2"><Users size={18} className="text-teal-600"/> Informations</h3>
                    <div className="space-y-3">
                       <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="font-medium">{selectedPartner.email}</span></div>
                       <div className="flex justify-between"><span className="text-slate-500">Téléphone</span><span className="font-medium">{selectedPartner.phone || "N/A"}</span></div>
                       <div className="flex justify-between"><span className="text-slate-500">Ville</span><span className="font-medium">{selectedPartner.city}</span></div>
                       <div className="flex justify-between"><span className="text-slate-500">SIRET</span><span className="font-mono bg-white px-2 rounded border">{selectedPartner.siret || "N/A"}</span></div>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-teal-900 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-teal-600"/> Performance</h3>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                          <div className="text-2xl font-bold text-slate-900">{selectedPartner.totalOrders}</div>
                          <div className="text-xs text-slate-400 uppercase font-bold">Commandes</div>
                       </div>
                       <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                          <div className="text-2xl font-bold text-teal-600">{selectedPartner.totalRevenue.toFixed(2)}€</div>
                          <div className="text-xs text-slate-400 uppercase font-bold">CA Total</div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
               <button onClick={() => setShowModal(false)} className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition">Fermer</button>
               {selectedPartner.is_active ? (
                  <button onClick={(e) => { deactivatePartner(selectedPartner.id, e); }} className="px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-100 transition">Désactiver</button>
               ) : (
                  <button onClick={(e) => { approvePartner(selectedPartner.id, e); }} className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-200 transition">Valider le compte</button>
               )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
