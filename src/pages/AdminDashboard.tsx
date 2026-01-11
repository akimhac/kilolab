import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import {
  Users, ShoppingBag, DollarSign, Search, Download,
  TrendingUp, TrendingDown, MapPin, Package, Loader2, Eye,
  MessageSquare, Mail, Trash2, Send, Database, AlertCircle, 
  CheckCircle, LogOut, XCircle, X
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
  const [clients, setClients] = useState<any[]>([]); // État pour les clients
  const [loading, setLoading] = useState(true);
  
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [activeTab, setActiveTab] = useState<"overview" | "partners" | "cities" | "orders" | "messages" | "users" | "clients">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">("all");
  
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [selectedPartnerForAssign, setSelectedPartnerForAssign] = useState<string>("");
  
  // États pour la modal
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data: o } = await supabase.from("orders").select(`*, partner:partners!orders_partner_id_fkey(company_name)`).order("created_at", { ascending: false });
      const { data: p } = await supabase.from("partners").select("*").order("created_at", { ascending: false });
      const { data: m } = await supabase.from("contact_messages").select("*, support_responses(*)").order("created_at", { ascending: false });
      const { data: u } = await supabase.from("user_profiles").select("*").order("created_at", { ascending: false });
      
      setOrders(o || []); 
      setMessages(m || []); 
      setUsers(u || []);

      // 🟢 LOGIQUE AJOUTÉE : Filtrer les clients (ceux qui ne sont pas partners/admins)
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
          name: partner.company_name || partner.name || `Partenaire ${partner.id.slice(0, 6)}`,
          city: partner.city || "Non spécifié",
          totalOrders: stats.totalOrders,
          totalRevenue: parseFloat(stats.totalRevenue.toFixed(2))
        };
      });

      setPartners(partnersWithStats);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  // ✅ ACCEPTER VIA RPC
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

  // ❌ REFUSER VIA RPC
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

    return {
      totalRevenue,
      totalOrders: filteredOrdersByTime.length,
      activePartners,
      newMessages,
      totalUsers: users.length,
      revenueGrowth,
      ordersGrowth
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

  const extractCity = (address: string): string => {
    if (!address) return "Non spécifié";
    const parts = address.split(",");
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1].trim();
      const match = lastPart.match(/\d{5}\s+(.+)/);
      if (match && match[1]) return match[1].trim();
    }
    return address.split(" ").pop() || "Non spécifié";
  };

  const cityData = useMemo(() => {
    const cities: any = {};
    filteredOrdersByTime.filter(o => o.status === "completed").forEach(order => {
      const city = extractCity(order.pickup_address);
      if (!cities[city]) cities[city] = { name: city, value: 0, orders: 0 };
      cities[city].value += parseFloat(order.total_price || 0);
      cities[city].orders += 1;
    });
    return Object.values(cities).sort((a: any, b: any) => b.value - a.value).map((c: any) => ({ ...c, value: parseFloat(c.value.toFixed(2)) }));
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

  const assignPartner = async (orderId: string) => {
    if (!selectedPartnerForAssign) return toast.error("Choisis un partenaire");
    const { error } = await supabase.from('orders').update({ partner_id: selectedPartnerForAssign, status: 'assigned' }).eq('id', orderId);
    if (error) return toast.error(error.message);
    toast.success("Assigné !");
    setSelectedPartnerForAssign("");
    fetchData();
  };

  const StatCard = ({ title, value, icon, trend, suffix, badge }: any) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition relative">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-teal-50 rounded-xl text-teal-600">{icon}</div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
            {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
        {badge !== undefined && badge > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">{badge}</div>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}{suffix}</div>
      <div className="text-sm text-slate-500">{title}</div>
    </div>
  );

  const filteredPartners = useMemo(() => {
    let filtered = partners;
    if (statusFilter === "active") filtered = filtered.filter(p => p.is_active);
    else if (statusFilter === "pending") filtered = filtered.filter(p => !p.is_active);
    if (searchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.city.toLowerCase().includes(searchTerm.toLowerCase()));
    return filtered;
  }, [partners, searchTerm, statusFilter]);

  const handleExportCSV = () => {
    const csvHeader = "Date,ID Commande,Client,Montant,Poids,Statut,Partenaire\n";
    const csvData = filteredOrdersByTime.slice(0, 100).map(o => `${new Date(o.created_at).toLocaleDateString()},${o.id.slice(0, 8)},${o.pickup_address || "N/A"},${o.total_price},${o.weight},${o.status},${o.partner?.company_name || 'Non attribué'}`).join("\n");
    const blob = new Blob([csvHeader + csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kilolab-export-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV !");
  };

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = "/admin/login"; };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" size={48}/></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar />
      <div className="pt-32 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-black mb-2">Dashboard Admin Kilolab 👑</h1>
              <p className="text-slate-600">Vue d'ensemble</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => window.open("https://supabase.com/dashboard", "_blank")} className="bg-white border px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 flex items-center gap-2">
                <Database size={16} />Supabase
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {(["7d", "30d", "90d", "all"] as const).map((range) => (
              <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-2 rounded-lg font-medium transition ${timeRange === range ? "bg-teal-600 text-white shadow-md" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                {range === "7d" ? "7 jours" : range === "30d" ? "30 jours" : range === "90d" ? "90 jours" : "Tout"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="CA" value={stats.totalRevenue.toFixed(2)} suffix=" €" icon={<DollarSign size={24} />} trend={stats.revenueGrowth} />
            <StatCard title="Commandes" value={stats.totalOrders.toString()} icon={<ShoppingBag size={24} />} trend={stats.ordersGrowth} />
            <StatCard title="Utilisateurs" value={stats.totalUsers.toString()} icon={<Users size={24} />} />
            <StatCard title="Messages" value={stats.newMessages.toString()} icon={<MessageSquare size={24} />} badge={stats.newMessages} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border mb-8">
          <div className="flex border-b overflow-x-auto">
            {(["overview", "partners", "cities", "orders", "messages", "users", "clients"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-4 font-medium transition whitespace-nowrap ${activeTab === tab ? "text-teal-600 border-b-2 border-teal-600" : "text-slate-500 hover:text-slate-700"}`}>
                {tab === "overview" ? "Vue" : tab === "partners" ? "Partenaires" : tab === "cities" ? "Villes" : tab === "orders" ? "Commandes" : tab === "messages" ? `Messages (${stats.newMessages})` : tab === "users" ? "Users" : `Clients (${clients.length})`}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp className="text-teal-600" size={20} />CA</h3>
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
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Package className="text-blue-600" size={20} />Commandes</h3>
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
              </div>
            )}

            {activeTab === "partners" && (
              <div>
                <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <button onClick={() => setStatusFilter("all")} className={`px-4 py-2 rounded-lg font-bold text-sm ${statusFilter === "all" ? "bg-teal-600 text-white shadow-lg" : "bg-slate-100"}`}>Tous ({partners.length})</button>
                    <button onClick={() => setStatusFilter("pending")} className={`px-4 py-2 rounded-lg font-bold text-sm ${statusFilter === "pending" ? "bg-orange-500 text-white shadow-lg" : "bg-slate-100"}`}><AlertCircle size={14} className="inline mr-1" />En attente ({partners.filter(p => !p.is_active).length})</button>
                    <button onClick={() => setStatusFilter("active")} className={`px-4 py-2 rounded-lg font-bold text-sm ${statusFilter === "active" ? "bg-green-600 text-white shadow-lg" : "bg-slate-100"}`}><CheckCircle size={14} className="inline mr-1" />Actifs ({partners.filter(p => p.is_active).length})</button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-64" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b"><th className="text-left py-3 px-4 text-sm font-semibold">Statut</th><th className="text-left py-3 px-4 text-sm font-semibold">Partenaire</th><th className="text-left py-3 px-4 text-sm font-semibold">Ville</th><th className="text-right py-3 px-4 text-sm font-semibold">CA</th><th className="text-right py-3 px-4 text-sm font-semibold">Actions</th></tr></thead>
                    <tbody>
                      {filteredPartners.length === 0 ? (
                        <tr><td colSpan={5} className="py-12 text-center text-slate-400"><Users size={48} className="mx-auto mb-3 opacity-30" /><p className="font-bold">Aucun</p></td></tr>
                      ) : (
                        filteredPartners.map((partner) => (
                          <tr 
                            key={partner.id} 
                            onClick={(e) => {
                                // On ouvre la modal uniquement si on ne clique pas sur un bouton
                                if((e.target as HTMLElement).closest('button')) return;
                                setSelectedPartner(partner); 
                                setShowModal(true); 
                            }}
                            className="border-b hover:bg-slate-50 cursor-pointer"
                          >
                            <td className="py-3 px-4">
                              {partner.is_active ? (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border inline-flex items-center gap-1"><CheckCircle size={12} />Actif</span>
                              ) : (
                                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold border inline-flex items-center gap-1"><AlertCircle size={12} />En attente</span>
                              )}
                            </td>
                            <td className="py-3 px-4"><div className="font-bold">{partner.name}</div><div className="text-xs text-slate-500">{partner.email}</div></td>
                            <td className="py-3 px-4"><span className="inline-flex items-center gap-1"><MapPin size={14} className="text-slate-400" />{partner.city}</span></td>
                            <td className="py-3 px-4 text-right font-semibold text-teal-600">{partner.totalRevenue.toFixed(2)} €</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                {partner.is_active ? (
                                  <button onClick={(e) => deactivatePartner(partner.id, e)} className="bg-white border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-red-50">Désactiver</button>
                                ) : (
                                  <>
                                    <button onClick={(e) => rejectPartner(partner, e)} className="bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded-lg text-xs font-bold hover:bg-red-100 inline-flex items-center gap-1"><XCircle size={14} />Refuser</button>
                                    <button onClick={(e) => approvePartner(partner.id, e)} className="bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-green-700 shadow-sm inline-flex items-center gap-1"><CheckCircle size={14} />Accepter</button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- ONGLET CLIENTS --- */}
            {activeTab === "clients" && (
              <div>
                <h3 className="text-lg font-bold mb-6">👤 Clients inscrits ({clients.length})</h3>
                {clients.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Users size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-bold">Aucun client inscrit</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-4 px-4 text-sm font-semibold">Email</th>
                          <th className="text-left py-4 px-4 text-sm font-semibold">Nom</th>
                          <th className="text-left py-4 px-4 text-sm font-semibold">Téléphone</th>
                          <th className="text-left py-4 px-4 text-sm font-semibold">Date inscription</th>
                          <th className="text-left py-4 px-4 text-sm font-semibold">Commandes</th>
                          <th className="text-center py-4 px-4 text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((client) => (
                          <tr key={client.id} className="border-b border-gray-100 hover:bg-slate-50">
                            <td className="py-4 px-4">{client.email}</td>
                            <td className="py-4 px-4 font-medium">{client.full_name || "N/A"}</td>
                            <td className="py-4 px-4">{client.phone || "N/A"}</td>
                            <td className="py-4 px-4 text-sm text-slate-500">
                              {new Date(client.created_at).toLocaleDateString("fr-FR")}
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-teal-600 font-bold">0</span> commandes
                            </td>
                            <td className="py-4 px-4 text-center">
                              <button className="text-teal-600 hover:underline text-sm font-medium">
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

            {activeTab === "cities" && (
              <div>
                <h3 className="text-lg font-bold mb-6">Villes</h3>
                {cityData.length === 0 ? (
                  <div className="text-center py-12 text-slate-400"><MapPin size={48} className="mx-auto mb-3 opacity-30" /><p className="font-bold">Aucune donnée</p></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cityData.map((city, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-6 border border-teal-100">
                        <div className="flex items-center gap-3 mb-4">
                          <MapPin size={24} className="text-teal-600" />
                          <h4 className="text-lg font-bold">{city.name}</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between"><span className="text-slate-600">Commandes</span><span className="font-semibold">{city.orders}</span></div>
                          <div className="flex justify-between"><span className="text-slate-600">CA</span><span className="font-semibold text-teal-600">{city.value.toFixed(2)} €</span></div>
                          <div className="flex justify-between"><span className="text-slate-600">Panier moy.</span><span className="font-semibold">{(city.value / city.orders).toFixed(2)} €</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-bold">Commandes ({filteredOrdersByTime.length})</h3>
                  <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"><Download size={16} />CSV</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase"><tr><th className="p-4">ID</th><th className="p-4">Date</th><th className="p-4">Client</th><th className="p-4">Poids</th><th className="p-4">Statut</th><th className="p-4">Partenaire</th><th className="p-4 text-right">Actions</th></tr></thead>
                    <tbody className="divide-y text-sm">
                      {filteredOrdersByTime.slice(0, 50).map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50">
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
                      <div key={message.id} className={`border rounded-xl p-4 hover:shadow-md ${message.read ? "bg-white border-slate-200" : "bg-teal-50 border-teal-200"}`}>
                        <div className="flex justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex gap-3 mb-2">
                              <h4 className="font-bold">{message.subject || "Sans objet"}</h4>
                              {!message.read && <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">NEW</span>}
                            </div>
                            <p className="text-sm text-slate-600 mb-2"><Mail size={14} className="inline mr-1" />{message.email}{message.name && <span className="ml-2">({message.name})</span>}</p>
                            <p className="text-sm text-slate-500">{new Date(message.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                          </div>
                          <div className="flex gap-2">
                            {!message.read && <button onClick={() => markMessageAsRead(message.id)} className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold hover:bg-green-200 flex items-center gap-2"><CheckCircle size={14} />Lu</button>}
                            <button onClick={() => setSelectedMessage(selectedMessage?.id === message.id ? null : message)} className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 flex items-center gap-2"><Send size={14} />Répondre</button>
                            <button onClick={() => deleteMessage(message.id)} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200"><Trash2 size={14} /></button>
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 text-sm mb-3 whitespace-pre-wrap">{message.message}</div>
                        {message.support_responses && message.support_responses.length > 0 && (
                          <div className="mb-4 pl-4 border-l-4 border-teal-200 space-y-3 bg-teal-50/50 p-3 rounded-r-lg">
                            <p className="text-xs font-bold text-teal-600 uppercase mb-2">Historique :</p>
                            {message.support_responses.map((resp: any) => (
                              <div key={resp.id} className="bg-white p-3 rounded-lg shadow-sm text-sm border border-teal-100">
                                <div className="flex justify-between text-xs text-slate-400 mb-1">
                                  <span className="font-bold text-teal-700">Vous (Admin)</span>
                                  <span>{new Date(resp.created_at).toLocaleDateString("fr-FR")} {new Date(resp.created_at).toLocaleTimeString("fr-FR", {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <p className="whitespace-pre-wrap">{resp.response}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {selectedMessage?.id === message.id && (
                          <div className="mt-4 border-t pt-4">
                            <label className="block text-sm font-bold mb-2">Votre réponse</label>
                            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Écris..." rows={4} className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                            <div className="flex gap-2 mt-3">
                              <button onClick={() => handleReplyInApp(message)} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 flex items-center gap-2"><Send size={14} />Envoyer</button>
                              <button onClick={() => { setSelectedMessage(null); setReplyText(""); }} className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold hover:bg-slate-200">Annuler</button>
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
                {users.length === 0 ? (
                  <div className="text-center py-12 text-slate-400"><Users size={48} className="mx-auto mb-3 opacity-30" /><p className="font-bold">Aucun</p></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead><tr className="border-b"><th className="text-left py-3 px-4 text-sm font-semibold">Nom</th><th className="text-left py-3 px-4 text-sm font-semibold">Email</th><th className="text-left py-3 px-4 text-sm font-semibold">Téléphone</th><th className="text-left py-3 px-4 text-sm font-semibold">Inscription</th></tr></thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-slate-50">
                            <td className="py-3 px-4 font-medium">{user.full_name || "Non renseigné"}</td>
                            <td className="py-3 px-4">{user.email || "N/A"}</td>
                            <td className="py-3 px-4">{user.phone || "N/A"}</td>
                            <td className="py-3 px-4 text-sm text-slate-500">{new Date(user.created_at).toLocaleDateString("fr-FR")}</td>
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

      {/* --- MODAL DÉTAILS PRESSING --- */}
      {showModal && selectedPartner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <X size={20} className="text-gray-600" />
            </button>

            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
               📋 Détails du pressing
               <span className={`text-sm px-3 py-1 rounded-full border ${selectedPartner.is_active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-orange-50 border-orange-200 text-orange-700'}`}>
                 {selectedPartner.is_active ? 'Actif' : 'En attente'}
               </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Colonne Gauche : Infos */}
              <div className="space-y-6">
                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2"><Users size={18}/> Informations Légales</h3>
                    <div className="space-y-3">
                       <div><span className="text-sm text-slate-500 block">Nom Commercial</span><span className="font-semibold text-lg">{selectedPartner.name}</span></div>
                       <div><span className="text-sm text-slate-500 block">SIRET</span><span className="font-mono bg-white px-2 py-1 rounded border border-slate-200 inline-block mt-1">{selectedPartner.siret || "N/A"}</span></div>
                    </div>
                 </div>

                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2"><MapPin size={18}/> Contact & Localisation</h3>
                    <div className="space-y-3">
                       <div><span className="text-sm text-slate-500 block">Email</span><span className="font-medium">{selectedPartner.email}</span></div>
                       <div><span className="text-sm text-slate-500 block">Téléphone</span><span className="font-medium">{selectedPartner.phone || "N/A"}</span></div>
                       <div><span className="text-sm text-slate-500 block">Adresse</span><span className="font-medium">{selectedPartner.address || "N/A"}</span></div>
                       <div><span className="text-sm text-slate-500 block">Ville</span><span className="font-medium">{selectedPartner.city}</span></div>
                    </div>
                 </div>
              </div>

              {/* Colonne Droite : Docs & Stats */}
              <div className="space-y-6">
                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2"><Database size={18}/> Documents</h3>
                    <div className="space-y-3">
                       <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                          <span className="font-medium flex items-center gap-2">📄 KBIS</span>
                          <button className="text-teal-600 text-sm font-bold hover:underline">Télécharger</button>
                       </div>
                       <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                          <span className="font-medium flex items-center gap-2">🏦 RIB</span>
                          <button className="text-teal-600 text-sm font-bold hover:underline">Télécharger</button>
                       </div>
                       <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                          <span className="font-medium flex items-center gap-2">🆔 Pièce d'identité</span>
                          <button className="text-teal-600 text-sm font-bold hover:underline">Télécharger</button>
                       </div>
                    </div>
                 </div>

                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2"><TrendingUp size={18}/> Performance</h3>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white p-4 rounded-xl text-center border border-slate-200">
                          <div className="text-2xl font-bold text-slate-800">{selectedPartner.totalOrders}</div>
                          <div className="text-xs text-slate-500 uppercase font-bold tracking-wide">Commandes</div>
                       </div>
                       <div className="bg-white p-4 rounded-xl text-center border border-slate-200">
                          <div className="text-2xl font-bold text-teal-600">{selectedPartner.totalRevenue.toFixed(2)} €</div>
                          <div className="text-xs text-slate-500 uppercase font-bold tracking-wide">Chiffre d'affaires</div>
                       </div>
                    </div>
                 </div>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
               <button 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition"
               >
                  Fermer
               </button>
               {selectedPartner.is_active ? (
                  <button 
                    onClick={(e) => { deactivatePartner(selectedPartner.id, e); }}
                    className="px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-100 transition"
                  >
                    Désactiver le compte
                  </button>
               ) : (
                  <button 
                    onClick={(e) => { approvePartner(selectedPartner.id, e); }}
                    className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-200 transition"
                  >
                    Valider le compte
                  </button>
               )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}