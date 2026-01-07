import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import {
  Users, ShoppingBag, DollarSign, Search, Download,
  TrendingUp, MapPin, Loader2, MessageSquare, Mail, Trash2, Send, 
  Database, AlertCircle, CheckCircle, LogOut, XCircle
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
      toast.success(`✅ Partenaire ${newStatus ? 'activé' : 'désactivé'} !`, { id: toastId });
      
      // Envoyer email d'acceptation si activation
      if (newStatus) {
        const partner = partners.find(p => p.id === partnerId);
        if (partner?.email) {
          sendAcceptanceEmail(partner);
        }
      }
    } catch (error: any) {
      toast.error("❌ Erreur : " + error.message, { id: toastId });
    }
  };

  // 📧 ENVOI EMAIL D'ACCEPTATION
  const sendAcceptanceEmail = async (partner: any) => {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Kilolab <onboarding@resend.dev>',
          to: [partner.email],
          subject: '🎉 Bienvenue chez Kilolab !',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Félicitations !</h1>
              </div>
              <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px; color: #333;">Bonjour <strong>${partner.name}</strong>,</p>
                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                  Nous avons le plaisir de vous informer que votre candidature a été <strong style="color: #14b8a6;">acceptée</strong> ! 
                  Vous faites maintenant partie du réseau Kilolab.
                </p>
                <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #14b8a6;">
                  <p style="margin: 0; color: #0d9488; font-weight: 600;">🚀 Prochaines étapes :</p>
                  <ul style="color: #333; margin: 10px 0; padding-left: 20px;">
                    <li>Vous recevrez bientôt vos identifiants de connexion</li>
                    <li>Accédez à votre tableau de bord partenaire</li>
                    <li>Commencez à recevoir des commandes</li>
                  </ul>
                </div>
                <p style="font-size: 16px; color: #333;">À très bientôt ! 👋</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
                <p style="font-size: 13px; color: #888; text-align: center;">
                  L'équipe Kilolab<br>
                  <a href="https://kilolab.fr" style="color: #14b8a6; text-decoration: none;">kilolab.fr</a>
                </p>
              </div>
            </div>
          `
        })
      });
      console.log("✅ Email d'acceptation envoyé à", partner.email);
    } catch (error) {
      console.error("❌ Erreur envoi email acceptation:", error);
    }
  };

  // 🔥 FONCTION : REFUS + ENVOI EMAIL AUTOMATIQUE VIA RESEND
  const rejectPartner = async (partner: any) => {
    if (!confirm(`⛔ Êtes-vous sûr de vouloir REFUSER ${partner.name} ?\n\n✉️ Un email de refus sera envoyé automatiquement.`)) return;

    const toastId = toast.loading("📧 Envoi de l'email de refus...");

    try {
      // 1. Appel API Resend pour envoyer l'email
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Kilolab <onboarding@resend.dev>',
          to: [partner.email],
          subject: 'Réponse à votre candidature Kilolab',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Candidature non retenue</h1>
              </div>
              <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px; color: #333;">Bonjour <strong>${partner.name}</strong>,</p>
                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                  Nous vous remercions sincèrement de l'intérêt que vous portez à Kilolab.
                </p>
                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                  Après étude de votre dossier, nous ne sommes malheureusement pas en mesure de donner une suite favorable 
                  à votre demande d'inscription pour le moment.
                </p>
                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                  Nous vous souhaitons une excellente continuation dans vos projets.
                </p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
                <p style="font-size: 13px; color: #888; text-align: center;">
                  Cordialement,<br>
                  L'équipe Kilolab<br>
                  <a href="https://kilolab.fr" style="color: #14b8a6; text-decoration: none;">kilolab.fr</a>
                </p>
              </div>
            </div>
          `
        })
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.error("❌ Erreur Resend:", errorData);
        toast.error("⚠️ Erreur email (voir console). Suppression en cours...", { id: toastId });
      } else {
        toast.loading("✅ Email envoyé ! Suppression du dossier...", { id: toastId });
      }

      // 2. Suppression de la base de données
      const { error } = await supabase.from('partners').delete().eq('id', partner.id);

      if (error) throw error;

      // 3. Mise à jour UI
      setPartners(partners.filter(p => p.id !== partner.id));
      toast.success("✅ Partenaire refusé et email envoyé", { id: toastId, duration: 4000 });
      
    } catch (error: any) {
      console.error(error);
      toast.error("❌ Erreur : " + error.message, { id: toastId });
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
    };
  }, [filteredOrdersByTime, orders, timeRange, messages, users, partners]);

  const markMessageAsRead = async (id: string) => { 
    await supabase.from("contact_messages").update({ read: true }).eq("id", id); 
    fetchData(); 
  };

  const handleReplyInApp = async (msg: any) => { 
    if (!replyText.trim()) return toast.error("Écris une réponse");
    try {
      await supabase.from("support_responses").insert({ 
        message_id: msg.id, 
        response: replyText, 
        admin_email: "admin@kilolab.fr" 
      });
      toast.success("Réponse enregistrée"); 
      setReplyText(""); 
      setSelectedMessage(null); 
      markMessageAsRead(msg.id);
    } catch(e: any) { 
      toast.error(e.message); 
    }
  };

  const deleteMessage = async (id: string) => { 
    if (!confirm("Supprimer ce message ?")) return;
    await supabase.from("contact_messages").delete().eq("id", id); 
    toast.success("Message supprimé");
    fetchData(); 
  };

  const handleExportCSV = () => toast.success("Export CSV");
  const handleLogout = async () => { 
    await supabase.auth.signOut(); 
    window.location.href = "/admin/login"; 
  };

  const filteredPartners = useMemo(() => {
    let filtered = partners;
    if (statusFilter === "active") filtered = filtered.filter(p => p.is_active === true);
    else if (statusFilter === "pending") filtered = filtered.filter(p => p.is_active === false);
    if (searchTerm) {
      filtered = filtered.filter(p => 
        (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.city || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [partners, searchTerm, statusFilter]);

  const StatCard = ({ title, value, icon, suffix, badge }: any) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition relative">
      <div className="flex justify-between mb-4">
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
        <Loader2 className="animate-spin text-teal-600" size={48} />
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
              <p className="text-slate-600">Gestion de la plateforme</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                className="bg-white border px-4 py-2 rounded-lg font-bold hover:bg-slate-50 transition flex items-center gap-2"
              >
                <Database size={16} />
                Base de données
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition flex items-center gap-2"
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
          <div className="flex border-b overflow-x-auto">
            {(["partners", "orders", "messages"] as const).map((tab) => (
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
            {activeTab === "partners" && (
              <div>
                <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setStatusFilter("all")} 
                      className={`px-4 py-2 rounded-lg font-bold transition ${statusFilter === 'all' ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      Tous ({partners.length})
                    </button>
                    <button 
                      onClick={() => setStatusFilter("pending")} 
                      className={`px-4 py-2 rounded-lg font-bold transition ${statusFilter === 'pending' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      <AlertCircle size={14} className="inline mr-1" />
                      En attente ({partners.filter(p => !p.is_active).length})
                    </button>
                    <button 
                      onClick={() => setStatusFilter("active")} 
                      className={`px-4 py-2 rounded-lg font-bold transition ${statusFilter === 'active' ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      <CheckCircle size={14} className="inline mr-1" />
                      Actifs ({partners.filter(p => p.is_active).length})
                    </button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-64"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Statut</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Partenaire</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Ville</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPartners.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-slate-400">
                            <Users size={48} className="mx-auto mb-3 opacity-30" />
                            <p className="font-bold">Aucun partenaire trouvé</p>
                          </td>
                        </tr>
                      ) : (
                        filteredPartners.map((p) => (
                          <tr key={p.id} className="border-b hover:bg-slate-50 transition">
                            <td className="py-3 px-4">
                              {p.is_active ? (
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
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{p.name}</div>
                              <div className="text-xs text-slate-500">{p.email}</div>
                            </td>
                            <td className="py-3 px-4 text-slate-700">
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={14} className="text-slate-400" />
                                {p.city || "Non spécifié"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                {p.is_active ? (
                                  <button
                                    onClick={() => togglePartnerStatus(p.id, true)}
                                    className="bg-white border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-red-50 transition"
                                  >
                                    Désactiver
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => rejectPartner(p)}
                                      className="bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded-lg text-xs font-bold hover:bg-red-100 transition inline-flex items-center gap-1"
                                    >
                                      <XCircle size={14} /> 
                                      Refuser
                                    </button>
                                    <button
                                      onClick={() => togglePartnerStatus(p.id, false)}
                                      className="bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-green-700 transition shadow-sm shadow-green-200 inline-flex items-center gap-1"
                                    >
                                      <CheckCircle size={14} /> 
                                      Accepter
                                    </button>
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

            {activeTab !== "partners" && (
              <div className="text-center text-slate-400 py-10">
                <p className="font-bold">Module {activeTab} à implémenter</p>
                <p className="text-sm mt-2">Voir le code complet pour les détails</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
