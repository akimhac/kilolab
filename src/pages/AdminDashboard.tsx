import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import {
  Users, ShoppingBag, DollarSign, Search, Download, TrendingUp, 
  MapPin, MessageSquare, Mail, Trash2, Send, Database, 
  AlertCircle, CheckCircle, LogOut, XCircle, Loader2
} from "lucide-react";
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"partners" | "orders" | "messages">("partners");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data: o } = await supabase.from("orders").select(`*, partner:partners!orders_partner_id_fkey(company_name)`).order("created_at", { ascending: false });
      const { data: p } = await supabase.from("partners").select("*").order("created_at", { ascending: false });
      const { data: m } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      setOrders(o || []); 
      setPartners(p || []); 
      setMessages(m || []);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  // ✅ ACCEPTER (Via SQL RPC - Pas de CORS)
  const approvePartner = async (id: string) => {
    const toastId = toast.loading("⏳ Validation en cours...");
    try {
      const { error } = await supabase.rpc('admin_approve_partner', { partner_uuid: id });
      if (error) throw error;
      toast.success("✅ Partenaire validé & email envoyé !", { id: toastId });
      fetchData();
    } catch (error: any) {
      toast.error("❌ Erreur: " + error.message, { id: toastId });
    }
  };

  // ❌ REFUSER (Via SQL RPC - Pas de CORS)
  const rejectPartner = async (partner: any) => {
    if (!confirm(`⛔ Refuser ${partner.name || partner.company_name} ?\n\nUn email sera envoyé et le dossier supprimé.`)) return;
    const toastId = toast.loading("⏳ Refus en cours...");
    try {
      const { error } = await supabase.rpc('admin_reject_partner', { partner_uuid: partner.id });
      if (error) throw error;
      toast.success("🗑️ Partenaire refusé & notifié par email", { id: toastId });
      fetchData();
    } catch (error: any) {
      toast.error("❌ Erreur: " + error.message, { id: toastId });
    }
  };

  // Désactiver (Simple update)
  const deactivatePartner = async (id: string) => {
    if (!confirm("Désactiver ce partenaire ?")) return;
    const toastId = toast.loading("Désactivation...");
    try {
      await supabase.from('partners').update({ is_active: false }).eq('id', id);
      toast.success("✅ Compte désactivé", { id: toastId });
      fetchData();
    } catch (error: any) {
      toast.error("❌ Erreur: " + error.message, { id: toastId });
    }
  };

  const handleLogout = async () => { 
    await supabase.auth.signOut(); 
    window.location.href = "/admin/login"; 
  };

  const filteredPartners = useMemo(() => {
    let res = partners;
    if (statusFilter === "active") res = res.filter(p => p.is_active);
    if (statusFilter === "pending") res = res.filter(p => !p.is_active);
    if (searchTerm) {
      res = res.filter(p => 
        (p.name || p.company_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.city || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return res;
  }, [partners, statusFilter, searchTerm]);

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
            <button
              onClick={handleLogout}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition flex items-center gap-2"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Commandes"
              value={orders.length}
              icon={<ShoppingBag size={24} />}
            />
            <StatCard
              title="Partenaires Actifs"
              value={partners.filter(p => p.is_active).length}
              icon={<Users size={24} />}
            />
            <StatCard
              title="Messages"
              value={messages.filter(m => !m.read).length}
              icon={<MessageSquare size={24} />}
              badge={messages.filter(m => !m.read).length}
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
                 tab === "messages" ? `Messages (${messages.filter(m => !m.read).length})` :
                 tab === "orders" ? `Commandes (${orders.length})` :
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
                      className={`px-4 py-2 rounded-lg font-bold transition text-sm ${
                        statusFilter === 'all' 
                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Tous ({partners.length})
                    </button>
                    <button 
                      onClick={() => setStatusFilter("pending")} 
                      className={`px-4 py-2 rounded-lg font-bold transition text-sm ${
                        statusFilter === 'pending' 
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <AlertCircle size={14} className="inline mr-1" />
                      En attente ({partners.filter(p => !p.is_active).length})
                    </button>
                    <button 
                      onClick={() => setStatusFilter("active")} 
                      className={`px-4 py-2 rounded-lg font-bold transition text-sm ${
                        statusFilter === 'active' 
                          ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-64 text-sm"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Statut</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Partenaire</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Ville</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Actions</th>
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
                              <div className="font-bold text-slate-900">{p.name || p.company_name}</div>
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
                                    onClick={() => deactivatePartner(p.id)}
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
                                      onClick={() => approvePartner(p.id)}
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
                <p className="font-bold">Module {activeTab}</p>
                <p className="text-sm mt-2">À implémenter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
