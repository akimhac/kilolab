import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import {
  Users, ShoppingBag, DollarSign, Search, Download,
  TrendingUp, MapPin, Package, Loader2, Eye,
  MessageSquare, Mail, Trash2, Send, Database, AlertCircle, 
  CheckCircle, XCircle, Building2, Calendar, Activity,
  Clock, ArrowUpRight, ArrowDownRight, BarChart3
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [activeTab, setActiveTab] = useState<"overview" | "partners" | "clients" | "orders" | "messages">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">("all");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data: o } = await supabase
        .from("orders")
        .select(`*, partner:partners!orders_partner_id_fkey(company_name)`)
        .order("created_at", { ascending: false });
      
      const { data: p } = await supabase
        .from("partners")
        .select("*")
        .order("created_at", { ascending: false });
      
      const { data: m } = await supabase
        .from("contact_messages")
        .select("*, support_responses(*)")
        .order("created_at", { ascending: false });
      
      const { data: c } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("role", "client")
        .order("created_at", { ascending: false });
      
      setOrders(o || []); 
      setMessages(m || []);
      setClients(c || []);

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
          name: partner.company_name || partner.name || `Partenaire ${partner.id.slice(0, 6)}`,
          city: partner.city || "Non spécifié",
          totalOrders: stats.totalOrders,
          totalRevenue: parseFloat(stats.totalRevenue.toFixed(2))
        };
      });

      setPartners(partnersWithStats);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  const approvePartner = async (id: string) => {
    const t = toast.loading("⏳ Validation...");
    const { error } = await supabase.rpc('admin_approve_partner', { partner_uuid: id });
    if (error) toast.error("❌ Erreur: " + error.message, { id: t });
    else {
      toast.success("✅ Partenaire validé & email envoyé !", { id: t });
      fetchData();
    }
  };

  const rejectPartner = async (partner: any) => {
    if (!confirm(`⛔ Refuser ${partner.name} ?`)) return;
    const t = toast.loading("⏳ Refus...");
    const { error } = await supabase.rpc('admin_reject_partner', { partner_uuid: partner.id });
    if (error) toast.error("❌ Erreur: " + error.message, { id: t });
    else {
      toast.success("🗑️ Partenaire refusé", { id: t });
      fetchData();
    }
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
    const pendingPartners = partners.filter(p => !p.is_active).length;
    const newMessages = messages.filter(m => !m.read).length;

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

    const avgOrderValue = completed.length > 0 ? totalRevenue / completed.length : 0;

    return {
      totalRevenue,
      totalOrders: filteredOrdersByTime.length,
      completedOrders: completed.length,
      activePartners,
      pendingPartners,
      totalClients: clients.length,
      newMessages,
      revenueGrowth,
      ordersGrowth,
      avgOrderValue
    };
  }, [filteredOrdersByTime, orders, timeRange, messages, clients, partners]);

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
    return Object.values(months).slice(-12).map((m: any) => ({ 
      ...m, 
      revenue: parseFloat(m.revenue.toFixed(2)) 
    }));
  }, [filteredOrdersByTime]);

  const statusData = useMemo(() => {
    const labels: any = { 
      "pending": "En attente", 
      "assigned": "Assigné", 
      "in_progress": "En cours", 
      "ready": "Prêt", 
      "completed": "Terminé", 
      "cancelled": "Annulé" 
    };
    const statuses: any = {};
    filteredOrdersByTime.forEach(o => {
      const label = labels[o.status] || o.status;
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
    await supabase.from("contact_messages").update({ read: true }).eq("id", messageId);
    setMessages(messages.map(m => m.id === messageId ? { ...m, read: true } : m));
    toast.success("Message lu");
  };

  const handleReplyInApp = async (message: any) => {
    if (!replyText.trim()) return toast.error("Écris une réponse");
    const { error } = await supabase
      .from("support_responses")
      .insert({ 
        message_id: message.id, 
        response: replyText, 
        admin_email: "admin@kilolab.fr" 
      });
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

  const StatCard = ({ title, value, icon, trend, suffix, badge, color = "teal" }: any) => (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all relative overflow-hidden group`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${color}-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform`}></div>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 bg-${color}-50 rounded-xl text-${color}-600`}>{icon}</div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full ${trend >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
              {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(trend).toFixed(1)}%
            </div>
          )}
          {badge !== undefined && badge > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
              {badge}
            </div>
          )}
        </div>
        <div className="text-3xl font-black text-slate-900 mb-1">
          {value}{suffix}
        </div>
        <div className="text-sm text-slate-500 font-medium">{title}</div>
      </div>
    </div>
  );

  const filteredPartners = useMemo(() => {
    let filtered = partners;
    if (statusFilter === "active") filtered = filtered.filter(p => p.is_active);
    else if (statusFilter === "pending") filtered = filtered.filter(p => !p.is_active);
    if (searchTerm) filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered;
  }, [partners, searchTerm, statusFilter]);

  const handleExportCSV = () => {
    const csvHeader = "Date,ID,Client,Montant,Poids,Statut,Partenaire\n";
    const csvData = filteredOrdersByTime.slice(0, 100).map(o => 
      `${new Date(o.created_at).toLocaleDateString()},${o.id.slice(0, 8)},${o.pickup_address || "N/A"},${o.total_price},${o.weight},${o.status},${o.partner?.company_name || 'Non attribué'}`
    ).join("\n");
    const blob = new Blob([csvHeader + csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kilolab-export-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV !");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="animate-spin text-teal-600 mx-auto mb-4" size={48}/>
        <p className="text-slate-600 font-medium">Chargement du dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 max-w-[1400px] mx-auto">
        
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Dashboard Admin 👑
              </h1>
              <p className="text-slate-600 flex items-center gap-2">
                <Activity size={16} className="text-teal-500" />
                Vue d'ensemble en temps réel
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button 
                onClick={() => window.open("https://supabase.com/dashboard", "_blank")} 
                className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 flex items-center gap-2 shadow-sm hover:shadow transition-all"
              >
                <Database size={16} />
                Supabase
              </button>
              <button 
                onClick={handleExportCSV}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:from-teal-700 hover:to-cyan-700 flex items-center gap-2 shadow-lg transition-all"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-8">
            {(["7d", "30d", "90d", "all"] as const).map((range) => (
              <button 
                key={range} 
                onClick={() => setTimeRange(range)} 
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  timeRange === range 
                    ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-200" 
                    : "bg-white text-slate-600 border border-slate-200 hover:border-teal-300"
                }`}
              >
                {range === "7d" ? "7 jours" : range === "30d" ? "30 jours" : range === "90d" ? "90 jours" : "Tout"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Chiffre d'affaires" 
              value={stats.totalRevenue.toFixed(0)} 
              suffix=" €" 
              icon={<DollarSign size={24} />} 
              trend={stats.revenueGrowth}
              color="teal"
            />
            <StatCard 
              title="Commandes" 
              value={stats.completedOrders} 
              icon={<ShoppingBag size={24} />} 
              trend={stats.ordersGrowth}
              color="blue"
            />
            <StatCard 
              title="Clients" 
              value={stats.totalClients} 
              icon={<Users size={24} />}
              color="purple"
            />
            <StatCard 
              title="Messages" 
              value={stats.newMessages} 
              icon={<MessageSquare size={24} />} 
              badge={stats.newMessages}
              color="orange"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Pressings actifs</p>
                  <p className="text-2xl font-black text-green-600">{stats.activePartners}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">En attente</p>
                  <p className="text-2xl font-black text-orange-600">{stats.pendingPartners}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl">
                  <Clock size={24} className="text-orange-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Panier moyen</p>
                  <p className="text-2xl font-black text-teal-600">{stats.avgOrderValue.toFixed(2)} €</p>
                </div>
                <div className="p-3 bg-teal-50 rounded-xl">
                  <BarChart3 size={24} className="text-teal-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-8">
          <div className="flex border-b overflow-x-auto">
            {(["overview", "partners", "clients", "orders", "messages"] as const).map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`px-6 py-4 font-bold transition whitespace-nowrap relative ${
                  activeTab === tab 
                    ? "text-teal-600" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab === "overview" ? "📊 Vue d'ensemble" : 
                 tab === "partners" ? `🏪 Pressings (${partners.length})` : 
                 tab === "clients" ? `👤 Clients (${clients.length})` :
                 tab === "orders" ? `📦 Commandes (${orders.length})` : 
                 `💬 Messages (${stats.newMessages})`}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-600 to-cyan-600"></div>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            
            {activeTab === "messages" && (
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">💬 Messages de contact</h3>
                  <p className="text-slate-600">{messages.length} messages reçus</p>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <MessageSquare size={64} className="mx-auto mb-4 text-slate-300" />
                    <p className="text-xl font-bold text-slate-400">Aucun message</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`border rounded-2xl p-6 hover:shadow-lg transition-all ${
                          message.read 
                            ? "bg-white border-slate-200" 
                            : "bg-teal-50 border-teal-200 shadow-md"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-lg text-slate-900">
                                {message.subject || "Sans objet"}
                              </h4>
                              {!message.read && (
                                <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                                  NEW
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <Mail size={14} />
                                {message.email}
                              </span>
                              {message.name && (
                                <span className="flex items-center gap-1">
                                  <Users size={14} />
                                  {message.name}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(message.created_at).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!message.read && (
                              <button 
                                onClick={() => markMessageAsRead(message.id)} 
                                className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold hover:bg-green-200 flex items-center gap-2"
                              >
                                <CheckCircle size={14} />
                                Marquer lu
                              </button>
                            )}
                            <button 
                              onClick={() => setSelectedMessage(selectedMessage?.id === message.id ? null : message)} 
                              className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 flex items-center gap-2"
                            >
                              <Send size={14} />
                              Répondre
                            </button>
                            <button 
                              onClick={() => deleteMessage(message.id)} 
                              className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 text-sm mb-4 whitespace-pre-wrap border border-slate-200">
                          {message.message}
                        </div>

                        {message.support_responses && message.support_responses.length > 0 && (
                          <div className="mb-4 pl-4 border-l-4 border-teal-200 space-y-3 bg-teal-50/50 p-4 rounded-r-xl">
                            <p className="text-xs font-bold text-teal-600 uppercase">Historique des réponses :</p>
                            {message.support_responses.map((resp: any) => (
                              <div key={resp.id} className="bg-white p-3 rounded-lg shadow-sm text-sm border border-teal-100">
                                <div className="flex justify-between text-xs text-slate-400 mb-2">
                                  <span className="font-bold text-teal-700">Admin</span>
                                  <span>{new Date(resp.created_at).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <p className="whitespace-pre-wrap text-slate-700">{resp.response}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {selectedMessage?.id === message.id && (
                          <div className="mt-4 border-t pt-4">
                            <label className="block text-sm font-bold mb-2 text-slate-700">Votre réponse</label>
                            <textarea 
                              value={replyText} 
                              onChange={(e) => setReplyText(e.target.value)} 
                              placeholder="Écrivez votre réponse..." 
                              rows={4} 
                              className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <div className="flex gap-2 mt-3">
                              <button 
                                onClick={() => handleReplyInApp(message)} 
                                className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 flex items-center gap-2"
                              >
                                <Send size={14} />
                                Envoyer
                              </button>
                              <button 
                                onClick={() => { 
                                  setSelectedMessage(null); 
                                  setReplyText(""); 
                                }} 
                                className="px-4 py-2 bg-slate-100 rounded-xl text-sm font-bold hover:bg-slate-200"
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

            {/* AUTRES ONGLETS... (on garde le reste identique) */}

          </div>
        </div>

      </div>
    </div>
  );
}
