import { useEffect, useState, useMemo } from "react";
import type { MouseEvent } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import {
  Users,
  ShoppingBag,
  DollarSign,
  Search,
  Download,
  TrendingUp,
  MapPin,
  Package,
  Loader2,
  MessageSquare,
  Mail,
  Trash2,
  Send,
  Database,
  CheckCircle,
  XCircle,
  Calendar,
  Activity,
  Clock,
  BarChart3,
  RefreshCw,
  AlertCircle,
  X,
  Phone,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  // --- ÉTATS ---
  const [orders, setOrders] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [washers, setWashers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtres & UI
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [activeTab, setActiveTab] = useState<
    "overview" | "partners" | "clients" | "orders" | "messages" | "washers"
  >("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">("all");
  const [washerFilter, setWasherFilter] = useState<"all" | "pending" | "approved" | "rejected">(
    "all"
  );

  // Modales & Sélection
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [selectedWasher, setSelectedWasher] = useState<any>(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showWasherModal, setShowWasherModal] = useState(false);

  // --- CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Commandes
      const { data: o } = await supabase
        .from("orders")
        .select(`*, partner:partners!orders_partner_id_fkey(company_name)`)
        .order("created_at", { ascending: false });

      // 2. Partenaires
      const { data: p } = await supabase.from("partners").select("*").order("created_at", {
        ascending: false,
      });

      // 3. Messages
      const { data: m } = await supabase
        .from("contact_messages")
        .select("*, support_responses(*)")
        .order("created_at", { ascending: false });

      // 4. Clients
      const { data: c } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("role", "client")
        .order("created_at", { ascending: false });

      // 5. Washers
      const { data: w } = await supabase.from("washers").select("*").order("created_at", {
        ascending: false,
      });

      setOrders(o || []);
      setMessages(m || []);
      setClients(c || []);
      setWashers(w || []);

      // Calcul stats Partenaires
      const partnerStatsMap = new Map<string, { totalOrders: number; totalRevenue: number }>();
      (o || []).forEach((order: any) => {
        if (order.partner_id && order.status === "completed") {
          if (!partnerStatsMap.has(order.partner_id)) {
            partnerStatsMap.set(order.partner_id, { totalOrders: 0, totalRevenue: 0 });
          }
          const stats = partnerStatsMap.get(order.partner_id)!;
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
          totalRevenue: parseFloat(stats.totalRevenue.toFixed(2)),
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

  // --- ACTIONS PARTENAIRES ---
  const approvePartner = async (id: string, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    const t = toast.loading("⏳ Validation...");

    const { data, error } = await supabase.functions.invoke("approve-partner", {
      body: { partner_id: id },
    });

    if (error) {
      toast.error("❌ Erreur: " + error.message, { id: t });
      return;
    }

    if ((data as any)?.warning) {
      toast.success("✅ Validé (compte déjà existant)", { id: t });
    } else {
      toast.success("✅ Partenaire validé & email envoyé !", { id: t });
    }

    fetchData();
    if (showPartnerModal) setShowPartnerModal(false);
  };

  const rejectPartner = async (partner: any, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm(`⛔ Refuser ${partner.name} ?`)) return;
    const t = toast.loading("⏳ Refus...");
    const { error } = await supabase.rpc("admin_reject_partner", { partner_uuid: partner.id });
    if (error) toast.error("❌ Erreur: " + error.message, { id: t });
    else {
      toast.success("🗑️ Partenaire refusé", { id: t });
      fetchData();
      if (showPartnerModal) setShowPartnerModal(false);
    }
  };

  const deactivatePartner = async (id: string, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Désactiver ?")) return;
    const { error } = await supabase.from("partners").update({ is_active: false }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("✅ Désactivé");
    fetchData();
    if (showPartnerModal) setShowPartnerModal(false);
  };

  // --- ACTIONS WASHERS ---
  const approveWasher = async (washerId: string) => {
    const t = toast.loading("⏳ Approbation du Washer...");

    try {
      const { error } = await supabase.functions.invoke("approve-washer", {
        body: { washer_id: washerId },
      });

      if (error) {
        toast.error("❌ Erreur: " + error.message, { id: t });
        return;
      }

      toast.success("✅ Washer approuvé ! Email d'invitation envoyé.", { id: t });
      fetchData();
      if (showWasherModal) setShowWasherModal(false);
    } catch (err: any) {
      console.error("Error approving washer:", err);
      toast.error("❌ Erreur lors de l'approbation", { id: t });
    }
  };

  const rejectWasher = async (washerId: string) => {
    if (!confirm("⛔ Êtes-vous sûr de vouloir rejeter ce Washer ?")) return;

    const t = toast.loading("⏳ Rejet...");

    const { error } = await supabase.from("washers").update({ status: "rejected" }).eq("id", washerId);

    if (error) {
      toast.error("❌ Erreur: " + error.message, { id: t });
      return;
    }

    toast.success("❌ Washer rejeté", { id: t });
    fetchData();
    if (showWasherModal) setShowWasherModal(false);
  };

  // ✅ NOUVEAU : BLOQUER / DÉBLOQUER
  const blockWasher = async (washerId: string) => {
    const reason = prompt("Raison du blocage (obligatoire) :");

    if (!reason || reason.trim() === "") {
      toast.error("Veuillez indiquer une raison");
      return;
    }

    if (!confirm(`⛔ Bloquer ce Washer ?\nRaison : ${reason}`)) return;

    const t = toast.loading("⏳ Blocage en cours...");

    try {
      const { error } = await supabase.rpc("admin_block_washer", {
        washer_uuid: washerId,
        block_reason: reason,
      });

      if (error) {
        toast.error("❌ Erreur: " + error.message, { id: t });
        return;
      }

      toast.success("🚫 Washer bloqué", { id: t });
      fetchData();
      if (showWasherModal) setShowWasherModal(false);
    } catch (err: any) {
      console.error("Error blocking washer:", err);
      toast.error("❌ Erreur lors du blocage", { id: t });
    }
  };

  const unblockWasher = async (washerId: string) => {
    if (!confirm("✅ Débloquer ce Washer ?")) return;

    const t = toast.loading("⏳ Déblocage en cours...");

    try {
      const { error } = await supabase.rpc("admin_unblock_washer", {
        washer_uuid: washerId,
      });

      if (error) {
        toast.error("❌ Erreur: " + error.message, { id: t });
        return;
      }

      toast.success("✅ Washer débloqué", { id: t });
      fetchData();
      if (showWasherModal) setShowWasherModal(false);
    } catch (err: any) {
      console.error("Error unblocking washer:", err);
      toast.error("❌ Erreur lors du déblocage", { id: t });
    }
  };

  // --- ACTIONS MESSAGES ---
  const markMessageAsRead = async (messageId: string) => {
    await supabase.from("contact_messages").update({ read: true }).eq("id", messageId);
    setMessages(messages.map((m) => (m.id === messageId ? { ...m, read: true } : m)));
    toast.success("Message lu");
  };

  const handleReplyInApp = async (message: any) => {
    if (!replyText.trim()) return toast.error("Écris une réponse");
    const { error } = await supabase.from("support_responses").insert({
      message_id: message.id,
      response: replyText,
      admin_email: "admin@kilolab.fr",
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
    setMessages(messages.filter((m) => m.id !== messageId));
    setSelectedMessage(null);
    toast.success("Supprimé");
  };

  const handleExportCSV = () => {
    const csvHeader = "Date,ID,Client,Montant,Poids,Statut,Partenaire\n";
    const csvData = filteredOrdersByTime
      .slice(0, 100)
      .map(
        (o) =>
          `${new Date(o.created_at).toLocaleDateString()},${o.id.slice(0, 8)},${
            o.pickup_address || "N/A"
          },${o.total_price},${o.weight},${o.status},${o.partner?.company_name || "Non attribué"}`
      )
      .join("\n");
    const blob = new Blob([csvHeader + csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kilolab-export-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV !");
  };

  // --- STATS & FILTRES ---
  const filteredOrdersByTime = useMemo(() => {
    if (timeRange === "all") return orders;
    const daysMap: Record<"7d" | "30d" | "90d", number> = { "7d": 7, "30d": 30, "90d": 90 };
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysMap[timeRange]);
    return orders.filter((o) => new Date(o.created_at) >= cutoffDate);
  }, [orders, timeRange]);

  const stats = useMemo(() => {
    const completed = filteredOrdersByTime.filter((o) => o.status === "completed");
    const totalRevenue = completed.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
    const activePartners = partners.filter((p) => p.is_active).length;
    const pendingPartners = partners.filter((p) => !p.is_active).length;
    const newMessages = messages.filter((m) => !m.read).length;
    const pendingWashers = washers.filter((w) => w.status === "pending").length;

    const avgOrderValue = completed.length > 0 ? totalRevenue / completed.length : 0;

    return {
      totalRevenue,
      totalOrders: filteredOrdersByTime.length,
      completedOrders: completed.length,
      activePartners,
      pendingPartners,
      totalClients: clients.length,
      newMessages,
      avgOrderValue,
      pendingWashers,
    };
  }, [filteredOrdersByTime, messages, clients, partners, washers]);

  const monthlyData = useMemo(() => {
    const months: any = {};
    filteredOrdersByTime
      .filter((o) => o.status === "completed")
      .forEach((order) => {
        const date = new Date(order.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const monthName = date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
        if (!months[monthKey]) months[monthKey] = { month: monthName, revenue: 0, orders: 0 };
        months[monthKey].revenue += parseFloat(order.total_price || 0);
        months[monthKey].orders += 1;
      });
    return Object.values(months)
      .slice(-12)
      .map((m: any) => ({
        ...m,
        revenue: parseFloat(m.revenue.toFixed(2)),
      }));
  }, [filteredOrdersByTime]);

  const statusData = useMemo(() => {
    const labels: any = {
      pending: "En attente",
      assigned: "Assigné",
      in_progress: "En cours",
      ready: "Prêt",
      completed: "Terminé",
      cancelled: "Annulé",
    };
    const statuses: any = {};
    filteredOrdersByTime.forEach((o) => {
      const label = labels[o.status] || o.status;
      statuses[label] = (statuses[label] || 0) + 1;
    });
    const colors: any = {
      Terminé: "#10b981",
      "En cours": "#3b82f6",
      "En attente": "#f59e0b",
      Assigné: "#8b5cf6",
      Prêt: "#6366f1",
      Annulé: "#ef4444",
    };
    return Object.entries(statuses).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || "#64748b",
    }));
  }, [filteredOrdersByTime]);

  const filteredPartners = useMemo(() => {
    let filtered = partners;
    if (statusFilter === "active") filtered = filtered.filter((p) => p.is_active);
    else if (statusFilter === "pending") filtered = filtered.filter((p) => !p.is_active);
    if (searchTerm)
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return filtered;
  }, [partners, searchTerm, statusFilter]);

  const filteredWashers = useMemo(() => {
    if (washerFilter === "all") return washers;
    return washers.filter((w) => w.status === washerFilter);
  }, [washers, washerFilter]);

  // --- COMPOSANT STATCARD ---
  // ⚠️ Note Tailwind : from-${color}-50 etc nécessite safelist, tu sembles déjà le faire.
  const StatCard = ({ title, value, icon, suffix, badge, color = "teal" }: any) => (
    <div
      className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all relative overflow-hidden group`}
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${color}-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform`}
      ></div>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 bg-${color}-50 rounded-xl text-${color}-600`}>{icon}</div>
          {badge !== undefined && badge > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
              {badge}
            </div>
          )}
        </div>
        <div className="text-3xl font-black text-slate-900 mb-1">
          {value}
          {suffix}
        </div>
        <div className="text-sm text-slate-500 font-medium">{title}</div>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-teal-600 mx-auto mb-4" size={48} />
          <p className="text-slate-600 font-medium">Chargement du dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      <div className="pt-32 pb-20 px-4 max-w-[1400px] mx-auto">
        {/* HEADER DASHBOARD */}
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
                onClick={fetchData}
                className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 flex items-center gap-2 shadow-sm hover:shadow transition-all"
              >
                <RefreshCw size={16} />
                Actualiser
              </button>
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
                {range === "7d"
                  ? "7 jours"
                  : range === "30d"
                  ? "30 jours"
                  : range === "90d"
                  ? "90 jours"
                  : "Tout"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Chiffre d'affaires"
              value={stats.totalRevenue.toFixed(0)}
              suffix=" €"
              icon={<DollarSign size={24} />}
              color="teal"
            />
            <StatCard title="Commandes" value={stats.completedOrders} icon={<ShoppingBag size={24} />} color="blue" />
            <StatCard title="Clients" value={stats.totalClients} icon={<Users size={24} />} color="purple" />
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

        {/* NAVIGATION TABS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-8">
          <div className="flex border-b overflow-x-auto">
            {(["overview", "partners", "washers", "clients", "orders", "messages"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-bold transition whitespace-nowrap relative ${
                  activeTab === tab ? "text-teal-600" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab === "overview"
                  ? "📊 Vue d'ensemble"
                  : tab === "partners"
                  ? `🏪 Pressings (${partners.length})`
                  : tab === "washers"
                  ? `🧺 Washers (${washers.length})`
                  : tab === "clients"
                  ? `👤 Clients (${clients.length})`
                  : tab === "orders"
                  ? `📦 Commandes (${orders.length})`
                  : `💬 Messages (${stats.newMessages})`}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-600 to-cyan-600"></div>
                )}
                {tab === "washers" && stats.pendingWashers > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {stats.pendingWashers}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* --- TAB OVERVIEW --- */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
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
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#14b8a6"
                          strokeWidth={3}
                          name="CA (€)"
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Package className="text-blue-600" size={20} />
                      Commandes mensuelles
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

                {statusData.length > 0 && (
                  <div className="bg-white rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <BarChart3 className="text-purple-600" size={20} />
                      Statuts des commandes
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}

            {/* --- TAB PARTNERS --- */}
            {activeTab === "partners" && (
              <div>
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      placeholder="Rechercher un pressing..."
                      className="w-full pl-10 pr-4 py-2 border rounded-xl"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStatusFilter("all")}
                      className={`px-4 py-2 rounded-xl text-sm font-bold ${
                        statusFilter === "all" ? "bg-slate-900 text-white" : "bg-white border"
                      }`}
                    >
                      Tous
                    </button>
                    <button
                      onClick={() => setStatusFilter("active")}
                      className={`px-4 py-2 rounded-xl text-sm font-bold ${
                        statusFilter === "active" ? "bg-green-600 text-white" : "bg-white border"
                      }`}
                    >
                      Actifs
                    </button>
                    <button
                      onClick={() => setStatusFilter("pending")}
                      className={`px-4 py-2 rounded-xl text-sm font-bold ${
                        statusFilter === "pending" ? "bg-orange-500 text-white" : "bg-white border"
                      }`}
                    >
                      En attente
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-bold text-sm text-slate-500">Nom</th>
                        <th className="text-left p-4 font-bold text-sm text-slate-500">Ville</th>
                        <th className="text-left p-4 font-bold text-sm text-slate-500">Statut</th>
                        <th className="text-left p-4 font-bold text-sm text-slate-500">CA Total</th>
                        <th className="text-left p-4 font-bold text-sm text-slate-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPartners.map((partner) => (
                        <tr
                          key={partner.id}
                          className="border-b hover:bg-slate-50 cursor-pointer"
                          onClick={() => {
                            setSelectedPartner(partner);
                            setShowPartnerModal(true);
                          }}
                        >
                          <td className="p-4 font-bold">{partner.name}</td>
                          <td className="p-4">{partner.city}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${
                                partner.is_active ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {partner.is_active ? "Actif" : "En attente"}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-teal-600">{partner.totalRevenue} €</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              {!partner.is_active && (
                                <>
                                  <button
                                    onClick={(e) => approvePartner(partner.id, e as any)}
                                    className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                                    title="Valider"
                                  >
                                    <CheckCircle size={18} />
                                  </button>
                                  <button
                                    onClick={(e) => rejectPartner(partner, e as any)}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                    title="Refuser"
                                  >
                                    <XCircle size={18} />
                                  </button>
                                </>
                              )}
                              {partner.is_active && (
                                <button
                                  onClick={(e) => deactivatePartner(partner.id, e as any)}
                                  className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100"
                                  title="Désactiver"
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- TAB WASHERS (AVEC BLOCAGE) --- */}
            {activeTab === "washers" && (
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">🧺 Validation des Washers</h3>
                  <p className="text-slate-600">{washers.length} washers au total</p>
                </div>

                <div className="flex gap-4 mb-6 flex-wrap">
                  <button
                    onClick={() => setWasherFilter("all")}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                      washerFilter === "all"
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-500 hover:bg-slate-50 border"
                    }`}
                  >
                    Tous ({washers.length})
                  </button>
                  <button
                    onClick={() => setWasherFilter("pending")}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                      washerFilter === "pending"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-slate-500 hover:bg-slate-50 border"
                    }`}
                  >
                    En attente ({washers.filter((w) => w.status === "pending").length})
                  </button>
                  <button
                    onClick={() => setWasherFilter("approved")}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                      washerFilter === "approved"
                        ? "bg-green-500 text-white"
                        : "bg-white text-slate-500 hover:bg-slate-50 border"
                    }`}
                  >
                    Approuvés ({washers.filter((w) => w.status === "approved").length})
                  </button>
                  <button
                    onClick={() => setWasherFilter("rejected")}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                      washerFilter === "rejected"
                        ? "bg-red-500 text-white"
                        : "bg-white text-slate-500 hover:bg-slate-50 border"
                    }`}
                  >
                    Rejetés ({washers.filter((w) => w.status === "rejected").length})
                  </button>
                </div>

                {filteredWashers.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <Users size={64} className="mx-auto mb-4 text-slate-300" />
                    <p className="text-xl font-bold text-slate-400">Aucun washer trouvé</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left p-4 font-bold text-sm">Nom</th>
                          <th className="text-left p-4 font-bold text-sm">Email</th>
                          <th className="text-left p-4 font-bold text-sm">Téléphone</th>
                          <th className="text-left p-4 font-bold text-sm">Ville</th>
                          <th className="text-left p-4 font-bold text-sm">Statut</th>
                          <th className="text-left p-4 font-bold text-sm">Date</th>
                          <th className="text-left p-4 font-bold text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredWashers.map((washer) => (
                          <tr key={washer.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="p-4">
                              <div className="font-bold">{washer.full_name || "Sans nom"}</div>
                            </td>
                            <td className="p-4 text-sm">{washer.email}</td>
                            <td className="p-4 text-sm">{washer.phone}</td>
                            <td className="p-4 text-sm">
                              {washer.city} ({washer.postal_code})
                            </td>

                            {/* ✅ STATUT + BADGE BLOQUÉ */}
                            <td className="p-4">
                              <div className="flex flex-col gap-1">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    washer.status === "approved"
                                      ? "bg-green-100 text-green-700"
                                      : washer.status === "pending"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {washer.status === "approved" && "✅ Approuvé"}
                                  {washer.status === "pending" && "⏳ En attente"}
                                  {washer.status === "rejected" && "❌ Rejeté"}
                                </span>

                                {washer.is_blocked && (
                                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                                    🚫 BLOQUÉ
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="p-4 text-sm text-slate-600">
                              {new Date(washer.created_at).toLocaleDateString("fr-FR")}
                            </td>

                            {/* ✅ ACTIONS : approuver / rejeter / bloquer / débloquer / voir */}
                            <td className="p-4">
                              <div className="flex gap-2 flex-wrap">
                                {washer.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() => approveWasher(washer.id)}
                                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-500 transition"
                                      title="Approuver"
                                    >
                                      ✅
                                    </button>
                                    <button
                                      onClick={() => rejectWasher(washer.id)}
                                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-500 transition"
                                      title="Rejeter"
                                    >
                                      ❌
                                    </button>
                                  </>
                                )}

                                {washer.status === "approved" && !washer.is_blocked && (
                                  <button
                                    onClick={() => blockWasher(washer.id)}
                                    className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-500 transition"
                                    title="Bloquer"
                                  >
                                    🚫 Bloquer
                                  </button>
                                )}

                                {washer.is_blocked && (
                                  <button
                                    onClick={() => unblockWasher(washer.id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-500 transition"
                                    title="Débloquer"
                                  >
                                    ✅ Débloquer
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    setSelectedWasher(washer);
                                    setShowWasherModal(true);
                                  }}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-500 transition"
                                  title="Voir détails"
                                >
                                  👁️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* --- TAB CLIENTS --- */}
            {activeTab === "clients" && (
              <div>
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-bold text-sm">Nom</th>
                      <th className="text-left p-4 font-bold text-sm">Email</th>
                      <th className="text-left p-4 font-bold text-sm">Ville</th>
                      <th className="text-left p-4 font-bold text-sm">Inscrit le</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id} className="border-b hover:bg-slate-50">
                        <td className="p-4 font-bold">
                          {client.first_name} {client.last_name}
                        </td>
                        <td className="p-4 text-sm">{client.email}</td>
                        <td className="p-4 text-sm">{client.city || "-"}</td>
                        <td className="p-4 text-sm text-slate-500">
                          {new Date(client.created_at).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* --- TAB ORDERS --- */}
            {activeTab === "orders" && (
              <div>
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-bold text-sm">ID</th>
                      <th className="text-left p-4 font-bold text-sm">Partenaire</th>
                      <th className="text-left p-4 font-bold text-sm">Montant</th>
                      <th className="text-left p-4 font-bold text-sm">Statut</th>
                      <th className="text-left p-4 font-bold text-sm">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrdersByTime.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-slate-50">
                        <td className="p-4 font-mono text-xs">{order.id.slice(0, 8)}</td>
                        <td className="p-4 font-bold text-sm">
                          {order.partner?.company_name || <span className="text-slate-400">Non attribué</span>}
                        </td>
                        <td className="p-4 font-bold">{order.total_price} €</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : order.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-500">
                          {new Date(order.created_at).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* --- TAB MESSAGES --- */}
            {activeTab === "messages" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
                <div className="overflow-y-auto border-r pr-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-4 rounded-xl mb-3 cursor-pointer transition ${
                        selectedMessage?.id === msg.id
                          ? "bg-teal-50 border border-teal-200"
                          : "bg-white hover:bg-slate-50 border border-slate-100"
                      } ${!msg.read ? "border-l-4 border-l-teal-500" : ""}`}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-bold">{msg.name}</span>
                        <span className="text-xs text-slate-400">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-1">{msg.subject}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 h-full flex flex-col">
                  {selectedMessage ? (
                    <>
                      <div className="flex justify-between items-start mb-6 pb-4 border-b">
                        <div>
                          <h3 className="font-bold text-xl mb-1">{selectedMessage.subject}</h3>
                          <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Mail size={14} /> {selectedMessage.email}
                            </span>
                            {selectedMessage.phone && (
                              <span className="flex items-center gap-1">
                                <Phone size={14} /> {selectedMessage.phone}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteMessage(selectedMessage.id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto mb-6 bg-white p-4 rounded-xl border border-slate-200">
                        <p className="whitespace-pre-wrap text-slate-700">{selectedMessage.message}</p>
                      </div>

                      {selectedMessage.support_responses?.length > 0 && (
                        <div className="mb-4 pl-4 border-l-2 border-teal-200">
                          <p className="text-xs font-bold text-teal-600 mb-1">Réponse envoyée :</p>
                          <p className="text-sm text-slate-600 italic">
                            "{selectedMessage.support_responses[0].response}"
                          </p>
                        </div>
                      )}

                      <div className="mt-auto">
                        <textarea
                          className="w-full p-3 rounded-xl border border-slate-200 mb-3 focus:ring-2 focus:ring-teal-500"
                          placeholder="Écrire une réponse..."
                          rows={3}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <button
                          onClick={() => handleReplyInApp(selectedMessage)}
                          className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 flex items-center justify-center gap-2"
                        >
                          <Send size={18} /> Envoyer la réponse
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 flex-col gap-4">
                      <MessageSquare size={48} />
                      <p>Sélectionnez un message pour répondre</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALE PARTNER */}
      {showPartnerModal && selectedPartner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full relative shadow-2xl">
            <button
              onClick={() => setShowPartnerModal(false)}
              className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition"
            >
              <X size={20} />
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-black mb-2">{selectedPartner.name}</h2>
              <div className="flex gap-2">
                <span className="bg-slate-100 px-3 py-1 rounded-full text-sm font-bold text-slate-600">
                  {selectedPartner.city}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    selectedPartner.is_active ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {selectedPartner.is_active ? "Actif" : "En attente"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Email Pro</p>
                <p className="font-bold">{selectedPartner.email}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Téléphone</p>
                <p className="font-bold">{selectedPartner.phone}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl col-span-2">
                <p className="text-sm text-slate-500 mb-1">Adresse</p>
                <p className="font-bold">
                  {selectedPartner.address}, {selectedPartner.postal_code} {selectedPartner.city}
                </p>
              </div>
            </div>

            {!selectedPartner.is_active && (
              <div className="flex gap-3 pt-6 border-t">
                <button
                  onClick={() => rejectPartner(selectedPartner)}
                  className="flex-1 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition"
                >
                  Refuser
                </button>
                <button
                  onClick={() => approvePartner(selectedPartner.id)}
                  className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-200"
                >
                  Valider le compte
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODALE WASHER */}
      {showWasherModal && selectedWasher && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setShowWasherModal(false)}
              className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {(selectedWasher.full_name || "?").charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-black text-slate-900">{selectedWasher.full_name || "Sans nom"}</h2>

                <div className="flex gap-2 flex-wrap">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold ${
                      selectedWasher.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : selectedWasher.status === "pending"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedWasher.status === "approved" && "✅ Approuvé"}
                    {selectedWasher.status === "pending" && "⏳ En attente"}
                    {selectedWasher.status === "rejected" && "❌ Rejeté"}
                  </span>

                  {selectedWasher.is_blocked && (
                    <span className="text-xs px-3 py-1 rounded-full font-bold bg-red-600 text-white">
                      🚫 BLOQUÉ
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Users size={18} className="text-blue-600" /> Informations personnelles
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email</span>
                      <span className="font-medium">{selectedWasher.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Téléphone</span>
                      <span className="font-medium">{selectedWasher.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ville</span>
                      <span className="font-medium">{selectedWasher.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Code postal</span>
                      <span className="font-medium">{selectedWasher.postal_code}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Adresse</span>
                      <span className="font-medium text-right">{selectedWasher.address || "Non renseignée"}</span>
                    </div>
                  </div>
                </div>

                {/* ✅ NOUVEAU : bloc état bloqué */}
                {selectedWasher?.is_blocked && (
                  <div className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-700">
                      <AlertCircle size={18} /> Washer bloqué
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">Raison</span>
                        <span className="font-bold text-red-700 text-right">
                          {selectedWasher.blocked_reason || "Non spécifiée"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">Bloqué le</span>
                        <span className="font-medium">
                          {selectedWasher.blocked_at
                            ? new Date(selectedWasher.blocked_at).toLocaleDateString("fr-FR")
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-blue-600" /> Inscription
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date d'inscription</span>
                      <span className="font-medium">
                        {new Date(selectedWasher.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ FOOTER MODALE : approuver/rejeter + bloquer/débloquer */}
            <div className="mt-8 pt-6 border-t flex justify-end gap-3 flex-wrap">
              <button
                onClick={() => setShowWasherModal(false)}
                className="px-6 py-3 bg-white border rounded-xl font-bold text-slate-600 hover:bg-slate-50"
              >
                Fermer
              </button>

              {selectedWasher.status === "pending" && (
                <>
                  <button
                    onClick={() => rejectWasher(selectedWasher.id)}
                    className="px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-100"
                  >
                    ❌ Rejeter
                  </button>
                  <button
                    onClick={() => approveWasher(selectedWasher.id)}
                    className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 shadow-lg"
                  >
                    ✅ Approuver
                  </button>
                </>
              )}

              {selectedWasher.status === "approved" && !selectedWasher.is_blocked && (
                <button
                  onClick={() => blockWasher(selectedWasher.id)}
                  className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-lg"
                >
                  🚫 Bloquer ce Washer
                </button>
              )}

              {selectedWasher.is_blocked && (
                <button
                  onClick={() => unblockWasher(selectedWasher.id)}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg"
                >
                  ✅ Débloquer ce Washer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
