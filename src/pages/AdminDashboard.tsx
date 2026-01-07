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
        .select(`*, partner:partners!orders_partner_id_fkey(company_name)`)
        .order("created_at", { ascending: false });

      if (ordersError) console.error("Orders error:", ordersError);

      // 2. Partners
      const { data: partnersData, error: partnersError } = await supabase
        .from("partners")
        .select("*")
        .order("created_at", { ascending: false });

      if (partnersError) console.error("Partners error:", partnersError);

      // 3. Messages
      const { data: messagesData, error: messagesError } = await supabase
        .from("contact_messages")
        .select("*, support_responses(*)")
        .order("created_at", { ascending: false });

      if (messagesError) console.error("Messages error:", messagesError);

      // 4. Users (On met vide pour éviter le crash database actuel)
      const usersData: any[] = []; 

      setOrders(ordersData || []);
      setMessages(messagesData || []);
      setUsers(usersData || []);

      // Calcul des stats partenaires
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
          totalOrders: stats.totalOrders,
          totalRevenue: parseFloat(stats.totalRevenue.toFixed(2)),
          rating: partner.average_rating || 4.5,
        };
      });
      setPartners(partnersWithStats);

    } catch (error: any) {
      console.error("❌ Erreur admin:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FONCTION CORRIGÉE POUR ACCEPTER/REFUSER
  const togglePartnerStatus = async (partnerId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const action = newStatus ? "activé" : "désactivé";

    if (!confirm(`Voulez-vous vraiment ${newStatus ? "activer" : "désactiver"} ce partenaire ?`)) return;

    try {
      const { error } = await supabase
        .from('partners')
        .update({ is_active: newStatus })
        .eq('id', partnerId);

      if (error) throw error;

      setPartners(partners.map(p => 
        p.id === partnerId ? { ...p, is_active: newStatus } : p
      ));

      toast.success(`Partenaire ${action} avec succès !`);
    } catch (error: any) {
      console.error("Erreur update:", error);
      toast.error("Erreur : " + error.message);
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
    
    return {
      totalRevenue,
      totalOrders: filteredOrdersByTime.length,
      activePartners: partners.filter(p => p.is_active).length,
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
      toast.success("Message lu");
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
    if (!confirm("Supprimer ?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", messageId);
    if (!error) {
      setMessages(messages.filter(m => m.id !== messageId));
      toast.success("Supprimé");
    }
  };

  const assignPartner = async (orderId: string) => {
    if (!selectedPartnerForAssign) return toast.error("Choisis un partenaire");
    try {
      const { error } = await supabase.from('orders').update({ partner_id: selectedPartnerForAssign, status: 'assigned' }).eq('id', orderId);
      if (error) throw error;
      toast.success("Assigné !");
      setSelectedPartnerForAssign("");
      fetchData();
    } catch (error: any) { toast.error(error.message); }
  };

  const filteredPartners = useMemo(() => {
    return partners.filter(p => {
      const name = p.company_name || p.name || "";
      const city = p.city || "";
      return name.toLowerCase().includes(searchTerm.toLowerCase()) || city.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [partners, searchTerm]);

  const handleExportCSV = () => {
    const csvHeader = "Date,ID Commande,Client,Montant,Poids,Statut,Partenaire\n";
    const csvData = filteredOrdersByTime.slice(0, 100).map(o => 
      `${new Date(o.created_at).toLocaleDateString()},${o.id.slice(0, 8)},${o.pickup_address || "N/A"},${o.total_price},${o.weight},${o.status},${o.partner?.company_name || 'Non attribué'}`
    ).join("\n");
    const blob = new Blob([csvHeader + csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kilolab-export.csv";
    link.click();
    toast.success("Export CSV réussi !");
  };

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = "/admin/login"; };

  const StatCard = ({ title, value, icon, trend, suffix, badge }: any) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative">
      <div className="flex justify-between mb-4">
        <div className="p-3 bg-teal-50 rounded-xl text-teal-600">{icon}</div>
        {badge > 0 && <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">{badge}</div>}
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}{suffix}</div>
      <div className="text-sm text-slate-500">{title}</div>
    </div>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600"/></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar />
      <div className="pt-32 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-black mb-2">Dashboard Admin 👑</h1>
                <div className="flex gap-2">
                    <button onClick={() => window.open("https://supabase.com", "_blank")} className="bg-white border px-3 py-2 rounded-lg text-sm font-bold">Base de données</button>
                    <button onClick={handleLogout} className="text-red-600 bg-white border px-3 py-2 rounded-lg text-sm font-bold">Déconnexion</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard title="Revenus" value={stats.totalRevenue.toFixed(2)} suffix=" €" icon={<DollarSign/>}/>
                <StatCard title="Commandes" value={stats.totalOrders} icon={<ShoppingBag/>}/>
                <StatCard title="Partenaires Actifs" value={stats.activePartners} icon={<Users/>}/>
                <StatCard title="Messages" value={stats.newMessages} icon={<MessageSquare/>} badge={stats.newMessages}/>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-8 overflow-hidden">
            <div className="flex border-b border-slate-100 overflow-x-auto">
                {["overview", "partners", "orders", "messages", "cities", "users"].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-4 font-bold capitalize ${activeTab === tab ? "text-teal-600 border-b-2 border-teal-600" : "text-slate-500"}`}>{tab}</button>
                ))}
            </div>

            <div className="p-6">
                {/* --- ONGLET OVERVIEW --- */}
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-bold mb-4">Évolution du CA</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis/><Tooltip/><Line type="monotone" dataKey="revenue" stroke="#14b8a6"/></LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div>
                                <h3 className="font-bold mb-4">Répartition</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart><Pie data={statusData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>{statusData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color}/>)}</Pie><Tooltip/></PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- ONGLET PARTENAIRES --- */}
                {activeTab === "partners" && (
                    <div>
                        <div className="flex justify-between mb-6">
                            <h3 className="font-bold text-lg">Gestion des Partenaires ({filteredPartners.length})</h3>
                            <input type="text" placeholder="Rechercher..." className="border rounded-lg px-4 py-2 text-sm w-64" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                                    <tr>
                                        <th className="p-4">Statut</th>
                                        <th className="p-4">Nom</th>
                                        <th className="p-4">Ville</th>
                                        <th className="p-4 text-right">CA</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {filteredPartners.map(partner => (
                                        <tr key={partner.id} className="hover:bg-slate-50">
                                            <td className="p-4">
                                                {partner.is_active ? 
                                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold border border-green-200">Actif</span> : 
                                                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-bold border border-orange-200">En attente</span>
                                                }
                                            </td>
                                            <td className="p-4 font-bold text-slate-900">{partner.company_name || partner.name}</td>
                                            <td className="p-4 text-slate-500">{partner.city}</td>
                                            <td className="p-4 text-right font-mono font-medium">{partner.totalRevenue} €</td>
                                            <td className="p-4 text-right">
                                                {partner.is_active ? (
                                                    <button onClick={() => togglePartnerStatus(partner.id, true)} className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-red-100 border border-red-200 transition">
                                                        Désactiver
                                                    </button>
                                                ) : (
                                                    <button onClick={() => togglePartnerStatus(partner.id, false)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-700 transition shadow-sm shadow-green-200">
                                                        Accepter
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- ONGLET ORDERS --- */}
                {activeTab === "orders" && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Commandes ({filteredOrdersByTime.length})</h3>
                            <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold"><Download size={16}/> CSV</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                                    <tr><th className="p-3">ID</th><th className="p-3">Date</th><th className="p-3">Client</th><th className="p-3">Statut</th><th className="p-3">Partenaire</th></tr>
                                </thead>
                                <tbody>
                                    {filteredOrdersByTime.slice(0, 50).map(o => (
                                        <tr key={o.id} className="border-b hover:bg-slate-50">
                                            <td className="p-3 font-mono">#{o.id.slice(0,6)}</td>
                                            <td className="p-3">{new Date(o.created_at).toLocaleDateString()}</td>
                                            <td className="p-3 truncate max-w-xs">{o.pickup_address}</td>
                                            <td className="p-3"><span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold uppercase">{o.status}</span></td>
                                            <td className="p-3">{o.partner ? o.partner.company_name : 
                                                <div className="flex gap-1">
                                                    <select className="border rounded text-xs p-1" onChange={(e) => setSelectedPartnerForAssign(e.target.value)}><option>Choisir...</option>{partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                                                    <button onClick={() => assignPartner(o.id)} className="bg-slate-900 text-white text-xs px-2 rounded">OK</button>
                                                </div>
                                            }</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- ONGLET CITIES --- */}
                {activeTab === "cities" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {cityData.map((city, idx) => (
                            <div key={idx} className="p-4 border rounded-xl bg-slate-50">
                                <h4 className="font-bold text-lg">{city.name}</h4>
                                <div className="flex justify-between mt-2 text-sm text-slate-600"><span>CA: {city.value.toFixed(2)}€</span><span>Cmds: {city.orders}</span></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- ONGLET MESSAGES --- */}
                {activeTab === "messages" && (
                    <div className="space-y-4">
                        {messages.map(m => (
                            <div key={m.id} className={`p-4 border rounded-xl ${m.read ? 'bg-white' : 'bg-teal-50 border-teal-200'}`}>
                                <div className="flex justify-between mb-2">
                                    <h4 className="font-bold">{m.subject || "Sans objet"} <span className="text-xs font-normal text-slate-500">({m.email})</span></h4>
                                    {!m.read && <button onClick={() => markMessageAsRead(m.id)} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Marquer lu</button>}
                                </div>
                                <p className="text-sm text-slate-700 mb-3">{m.message}</p>
                                {selectedMessage?.id === m.id ? (
                                    <div className="mt-2">
                                        <textarea className="w-full border p-2 rounded text-sm" rows={3} placeholder="Réponse..." value={replyText} onChange={e => setReplyText(e.target.value)}/>
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => handleReplyInApp(m)} className="bg-teal-600 text-white px-3 py-1 rounded text-sm font-bold">Envoyer</button>
                                            <button onClick={() => setSelectedMessage(null)} className="bg-slate-200 px-3 py-1 rounded text-sm">Annuler</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button onClick={() => setSelectedMessage(m)} className="text-teal-600 text-sm font-bold hover:underline">Répondre</button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* --- ONGLET USERS --- */}
                {activeTab === "users" && <div className="text-center py-10 text-slate-400">Gestion utilisateurs désactivée temporairement</div>}

            </div>
        </div>
      </div>
    </div>
  );
}
