import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import {
  Users, ShoppingBag, DollarSign, Search, Download,
  TrendingUp, MapPin, MessageSquare, Mail, Trash2, Send, Database, AlertCircle, 
  CheckCircle, LogOut, XCircle, Loader2
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
      setOrders(o || []); setPartners(p || []); setMessages(m || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  // ✅ ACCEPTER (Via SQL Serveur)
  const approvePartner = async (id: string) => {
    const toastId = toast.loading("Validation en cours...");
    const { error } = await supabase.rpc('admin_approve_partner', { partner_uuid: id });
    if (error) toast.error("Erreur: " + error.message, { id: toastId });
    else {
      toast.success("✅ Partenaire validé & email envoyé !", { id: toastId });
      fetchData();
    }
  };

  // ❌ REFUSER (Via SQL Serveur)
  const rejectPartner = async (partner: any) => {
    if (!confirm("Refuser et supprimer ce partenaire ?")) return;
    const toastId = toast.loading("Refus en cours...");
    const { error } = await supabase.rpc('admin_reject_partner', { partner_uuid: partner.id });
    if (error) toast.error("Erreur: " + error.message, { id: toastId });
    else {
      toast.success("🗑️ Partenaire refusé & notifié.", { id: toastId });
      fetchData();
    }
  };

  // Désactiver (Simple update)
  const deactivatePartner = async (id: string) => {
    if (!confirm("Désactiver ?")) return;
    await supabase.from('partners').update({ is_active: false }).eq('id', id);
    toast.success("Compte désactivé");
    fetchData();
  };

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = "/admin/login"; };

  const filteredPartners = useMemo(() => {
    let res = partners;
    if (statusFilter === "active") res = res.filter(p => p.is_active);
    if (statusFilter === "pending") res = res.filter(p => !p.is_active);
    if (searchTerm) res = res.filter(p => (p.name || p.company_name || "").toLowerCase().includes(searchTerm.toLowerCase()));
    return res;
  }, [partners, statusFilter, searchTerm]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600"/></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar />
      <div className="pt-32 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black">Admin Dashboard 👑</h1>
            <button onClick={handleLogout} className="text-red-600 border px-3 py-1 rounded bg-white font-bold">Déconnexion</button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
            {/* TABS */}
            <div className="flex gap-4 border-b mb-6">
                {["partners", "orders", "messages"].map(t => (
                    <button key={t} onClick={() => setActiveTab(t as any)} className={`pb-2 capitalize font-bold ${activeTab === t ? "text-teal-600 border-b-2 border-teal-600" : "text-slate-400"}`}>{t}</button>
                ))}
            </div>

            {/* PARTNERS TAB */}
            {activeTab === "partners" && (
                <div>
                    <div className="flex justify-between mb-4 gap-4 flex-wrap">
                        <div className="flex gap-2">
                            <button onClick={() => setStatusFilter("all")} className={`px-3 py-1 rounded font-bold text-sm ${statusFilter === "all" ? "bg-teal-600 text-white" : "bg-slate-100"}`}>Tous</button>
                            <button onClick={() => setStatusFilter("pending")} className={`px-3 py-1 rounded font-bold text-sm ${statusFilter === "pending" ? "bg-orange-500 text-white" : "bg-slate-100"}`}>En attente</button>
                            <button onClick={() => setStatusFilter("active")} className={`px-3 py-1 rounded font-bold text-sm ${statusFilter === "active" ? "bg-green-600 text-white" : "bg-slate-100"}`}>Actifs</button>
                        </div>
                        <input className="border rounded px-3 py-1 text-sm" placeholder="Rechercher..." onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 uppercase text-xs font-bold text-slate-500"><tr><th className="p-3">Statut</th><th className="p-3">Nom</th><th className="p-3 text-right">Actions</th></tr></thead>
                        <tbody>
                            {filteredPartners.map(p => (
                                <tr key={p.id} className="border-b hover:bg-slate-50">
                                    <td className="p-3">
                                        {p.is_active ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-bold text-xs">Actif</span> : <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold text-xs">En attente</span>}
                                    </td>
                                    <td className="p-3 font-bold">{p.company_name || p.name}<div className="text-xs text-slate-400 font-normal">{p.email}</div></td>
                                    <td className="p-3 text-right flex justify-end gap-2">
                                        {p.is_active ? (
                                            <button onClick={() => deactivatePartner(p.id)} className="border border-red-200 text-red-500 px-2 py-1 rounded font-bold text-xs">Désactiver</button>
                                        ) : (
                                            <>
                                                <button onClick={() => rejectPartner(p)} className="bg-red-50 text-red-600 px-3 py-1 rounded font-bold text-xs hover:bg-red-100 flex items-center gap-1"><XCircle size={12}/> Refuser</button>
                                                <button onClick={() => approvePartner(p.id)} className="bg-green-600 text-white px-3 py-1 rounded font-bold text-xs hover:bg-green-700 flex items-center gap-1 shadow-green-200 shadow-sm"><CheckCircle size={12}/> Accepter</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {activeTab !== "partners" && <div className="text-center py-10 text-slate-400">Module {activeTab} (voir code complet)</div>}
        </div>
      </div>
    </div>
  );
}
