import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import {
  Users, ShoppingBag, DollarSign, Search, Download,
  TrendingUp, MapPin, MessageSquare, Mail, Trash2, Send, Database, AlertCircle, 
  CheckCircle, LogOut, XCircle
} from "lucide-react";
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import toast from "react-hot-toast";

// 🔑 CLÉ API RESEND CONFIGURÉE
const RESEND_API_KEY = "re_SKazngYD_PMonzk1UaoAec4qHBJU1CQZG";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [activeTab, setActiveTab] = useState<"overview" | "partners" | "cities" | "orders" | "messages" | "users">("partners");
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
      const { data: ordersData } = await supabase
        .from("orders")
        .select(`*, partner:partners!orders_partner_id_fkey(company_name)`)
        .order("created_at", { ascending: false });

      const { data: partnersData } = await supabase
        .from("partners")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: messagesData } = await supabase
        .from("contact_messages")
        .select("*, support_responses(*)")
        .order("created_at", { ascending: false });

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
    } finally {
      setLoading(false);
    }
  };

  const togglePartnerStatus = async (partnerId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    if (!newStatus && !confirm("Désactiver ce partenaire ? Il ne recevra plus de commandes.")) return;

    const toastId = toast.loading("Mise à jour...");
    try {
      const { error } = await supabase
        .from('partners')
        .update({ is_active: newStatus })
        .eq('id', partnerId);

      if (error) throw error;

      setPartners(partners.map(p => p.id === partnerId ? { ...p, is_active: newStatus } : p));
      toast.success(`Partenaire ${newStatus ? 'activé' : 'désactivé'} !`, { id: toastId });
    } catch (error: any) {
      toast.error("Erreur : " + error.message, { id: toastId });
    }
  };

  // 🔥 FONCTION : REFUS + ENVOI EMAIL AUTOMATIQUE VIA RESEND
  const rejectPartner = async (partner: any) => {
    if (!confirm(`⛔ Êtes-vous sûr de vouloir REFUSER ${partner.name} ?\n\nCela enverra un email automatique et supprimera sa demande.`)) return;

    const toastId = toast.loading("Envoi de l'email de refus...");

    try {
      // 1. Appel API Resend pour envoyer l'email
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Kilolab <onboarding@resend.dev>', // ⚠️ Par défaut en mode test. Change en 'contact@kilolab.fr' si domaine vérifié.
          to: [partner.email],
          subject: 'Mise à jour de votre candidature Kilolab',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
              <h2 style="color: #ef4444;">Candidature non retenue</h2>
              <p>Bonjour <strong>${partner.name}</strong>,</p>
              <p>Nous vous remercions de l'intérêt que vous portez à Kilolab.</p>
              <p>Après étude de votre dossier, nous ne sommes malheureusement pas en mesure de donner une suite favorable à votre demande d'inscription pour le moment.</p>
              <p>Nous vous souhaitons une excellente continuation.</p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
              <p style="font-size: 12px; color: #888;">L'équipe Kilolab</p>
            </div>
          `
        })
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.error("Erreur Resend:", errorData);
        // On ne bloque pas la suppression si l'email échoue (ex: domaine non vérifié en mode test)
        toast.error("Erreur email (vérifiez console). Suppression en cours...", { id: toastId });
      } else {
        toast.loading("Email envoyé ! Suppression du dossier...", { id: toastId });
      }

      // 2. Suppression de la base de données
      const { error } = await supabase.from('partners').delete().eq('id', partner.id);

      if (error) throw error;

      // 3. Mise à jour UI
      setPartners(partners.filter(p => p.id !== partner.id));
      toast.success("Partenaire refusé et supprimé.", { id: toastId });
      
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur : " + error.message, { id: toastId });
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

  const monthlyData = useMemo(() => [], [filteredOrdersByTime]); 
  const cityData = useMemo(() => [], [filteredOrdersByTime]); 
  const statusData = useMemo(() => [], [filteredOrdersByTime]); 

  const markMessageAsRead = async (id:string) => { await supabase.from("contact_messages").update({ read: true }).eq("id", id); fetchData(); };
  const handleReplyInApp = async (msg:any) => { 
      if (!replyText.trim()) return toast.error("Écris une réponse");
      try {
        await supabase.from("support_responses").insert({ message_id: msg.id, response: replyText, admin_email: "admin@kilolab.fr" });
        toast.success("Réponse interne enregistrée"); setReplyText(""); setSelectedMessage(null); markMessageAsRead(msg.id);
      } catch(e:any) { toast.error(e.message); }
  };
  const deleteMessage = async (id:string) => { await supabase.from("contact_messages").delete().eq("id", id); fetchData(); };
  const handleExportCSV = () => toast.success("Export CSV");
  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = "/admin/login"; };

  const filteredPartners = useMemo(() => {
    let filtered = partners;
    if (statusFilter === "active") filtered = filtered.filter(p => p.is_active === true);
    else if (statusFilter === "pending") filtered = filtered.filter(p => p.is_active === false);
    if (searchTerm) filtered = filtered.filter(p => (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()));
    return filtered;
  }, [partners, searchTerm, statusFilter]);

  const StatCard = ({ title, value, icon, suffix, badge }: any) => (
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
        <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-black">Dashboard Admin 👑</h1>
            <button onClick={handleLogout} className="text-red-600 bg-white border px-3 py-2 rounded-lg font-bold">Déconnexion</button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-8 p-6">
            <div className="flex border-b mb-6 overflow-x-auto">
                {["partners", "orders", "messages"].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-4 font-bold capitalize ${activeTab === tab ? "text-teal-600 border-b-2 border-teal-600" : "text-slate-500"}`}>{tab}</button>
                ))}
            </div>

            {activeTab === "partners" && (
                <div>
                    <div className="flex gap-2 mb-4">
                        <button onClick={() => setStatusFilter("all")} className={`px-4 py-2 rounded font-bold ${statusFilter === 'all' ? 'bg-teal-600 text-white' : 'bg-slate-100'}`}>Tous</button>
                        <button onClick={() => setStatusFilter("pending")} className={`px-4 py-2 rounded font-bold ${statusFilter === 'pending' ? 'bg-orange-500 text-white' : 'bg-slate-100'}`}>En attente</button>
                        <button onClick={() => setStatusFilter("active")} className={`px-4 py-2 rounded font-bold ${statusFilter === 'active' ? 'bg-green-600 text-white' : 'bg-slate-100'}`}>Actifs</button>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                            <tr><th className="p-4">Statut</th><th className="p-4">Nom</th><th className="p-4 text-right">Actions</th></tr>
                        </thead>
                        <tbody>
                            {filteredPartners.map(p => (
                                <tr key={p.id} className="border-b hover:bg-slate-50">
                                    <td className="p-4">
                                        {p.is_active ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Actif</span> 
                                                     : <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">En attente</span>}
                                    </td>
                                    <td className="p-4 font-bold">{p.name} <div className="text-xs font-normal text-slate-500">{p.email}</div></td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        {p.is_active ? (
                                            <button onClick={() => togglePartnerStatus(p.id, true)} className="text-red-600 border border-red-200 px-3 py-1 rounded text-xs font-bold">Désactiver</button>
                                        ) : (
                                            <>
                                                <button onClick={() => rejectPartner(p)} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded text-xs font-bold flex items-center gap-1 hover:bg-red-100">
                                                    <XCircle size={12}/> Refuser
                                                </button>
                                                <button onClick={() => togglePartnerStatus(p.id, false)} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1 hover:bg-green-700">
                                                    <CheckCircle size={12}/> Accepter
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {activeTab !== "partners" && <div className="text-center text-slate-400 py-10">Module {activeTab} actif (voir code complet pour détails)</div>}
        </div>
      </div>
    </div>
  );
}
