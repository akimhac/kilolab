import { useEffect, useMemo, useState } from "react";
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
  AlertTriangle,
  X,
  Phone,
  Shield,
  Tag,
  MapPin,
  Plus,
  FileText,
} from "lucide-react";
import { OrderHeatmap } from "../components/OrderHeatmap";
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

type TimeRange = "7d" | "30d" | "90d" | "all";
type Tab =
  | "overview"
  | "partners"
  | "washers"
  | "clients"
  | "orders"
  | "messages"
  | "logs"
  | "coupons"
  | "heatmap"
  | "b2b";

type PartnerStatusFilter = "all" | "active" | "pending";
type WasherFilter = "all" | "pending" | "approved" | "rejected";

type CouponType = "percentage" | "fixed";

// B2B Partner interface
interface B2BPartner {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: "starter" | "business" | "enterprise";
  status: "active" | "trial" | "inactive";
  api_key: string;
  api_calls: number;
  monthly_revenue: number;
  created_at: string;
}

export default function AdminDashboard() {
  // --- ÉTATS ---
  const [orders, setOrders] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [washers, setWashers] = useState<any[]>([]);
  const [errorLogs, setErrorLogs] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  
  // B2B State
  const [b2bPartners, setB2bPartners] = useState<B2BPartner[]>([]);
  const [showB2BModal, setShowB2BModal] = useState(false);
  const [editingB2B, setEditingB2B] = useState<B2BPartner | null>(null);
  const [newB2BPartner, setNewB2BPartner] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "starter" as "starter" | "business" | "enterprise",
  });

  // Order Management State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filtres & UI
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PartnerStatusFilter>("all");
  const [washerFilter, setWasherFilter] = useState<WasherFilter>("all");

  // Modales & Sélection
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [selectedWasher, setSelectedWasher] = useState<any>(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showWasherModal, setShowWasherModal] = useState(false);

  // Nouveau coupon
  const [newCoupon, setNewCoupon] = useState<{
    code: string;
    discount_value: number;
    discount_type: CouponType;
    max_uses: number;
    expires_at: string; // YYYY-MM-DD
  }>({
    code: "",
    discount_value: 5,
    discount_type: "percentage",
    max_uses: 100,
    expires_at: "",
  });

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
        .select(`*, partner:partners(company_name)`)
        .order("created_at", { ascending: false });
      
      // Récupérer les emails des clients pour chaque commande
      if (o && o.length > 0) {
        const clientIds = [...new Set(o.map(order => order.client_id).filter(Boolean))];
        if (clientIds.length > 0) {
          const { data: profiles } = await supabase
            .from("user_profiles")
            .select("id, email, full_name")
            .in("id", clientIds);
          
          // Associer les profils aux commandes
          if (profiles) {
            const profileMap = new Map(profiles.map(p => [p.id, p]));
            o.forEach(order => {
              if (order.client_id) {
                order.profiles = profileMap.get(order.client_id) || null;
              }
            });
          }
        }
      }

      // 2. Partenaires
      const { data: p } = await supabase
        .from("partners")
        .select("*")
        .order("created_at", { ascending: false });

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
      const { data: w } = await supabase
        .from("washers")
        .select("*")
        .order("created_at", { ascending: false });

      // 6. Error logs
      const { data: logs } = await supabase
        .from("error_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      // 7. Coupons
      const { data: coup } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      setOrders(o || []);
      setMessages(m || []);
      setClients(c || []);
      setWashers(w || []);
      setErrorLogs(logs || []);
      setCoupons(coup || []);

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
          name: partner.company_name || partner.name || `Partenaire ${partner.id?.slice(0, 6)}`,
          city: partner.city || "Non spécifié",
          totalOrders: stats.totalOrders,
          totalRevenue: parseFloat(stats.totalRevenue.toFixed(2)),
        };
      });

      setPartners(partnersWithStats);
      
      // 8. B2B Partners
      const { data: b2b } = await supabase
        .from("b2b_partners")
        .select("*")
        .order("created_at", { ascending: false });
      
      setB2bPartners(b2b || []);
    } catch (e) {
      console.error(e);
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD B2B PARTNERS ---
  const generateApiKey = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'kb_live_';
    for (let i = 0; i < 24; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const createB2BPartner = async () => {
    if (!newB2BPartner.name || !newB2BPartner.email) {
      toast.error("Nom et email requis");
      return;
    }

    const t = toast.loading("Création du partenaire...");
    
    try {
      const { data, error } = await supabase
        .from("b2b_partners")
        .insert({
          name: newB2BPartner.name,
          email: newB2BPartner.email,
          phone: newB2BPartner.phone,
          plan: newB2BPartner.plan,
          status: "trial",
          api_key: generateApiKey(),
          api_calls: 0,
          monthly_revenue: 0,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Partenaire B2B créé !", { id: t });
      setB2bPartners([data, ...b2bPartners]);
      setNewB2BPartner({ name: "", email: "", phone: "", plan: "starter" });
      setShowB2BModal(false);
    } catch (e: any) {
      console.error(e);
      toast.error("Erreur: " + e.message, { id: t });
    }
  };

  const updateB2BPartner = async (partner: B2BPartner) => {
    const t = toast.loading("Mise à jour...");
    
    try {
      const { error } = await supabase
        .from("b2b_partners")
        .update({
          name: partner.name,
          email: partner.email,
          phone: partner.phone,
          plan: partner.plan,
          status: partner.status,
        })
        .eq("id", partner.id);

      if (error) throw error;

      toast.success("Partenaire mis à jour !", { id: t });
      setB2bPartners(b2bPartners.map(p => p.id === partner.id ? partner : p));
      setEditingB2B(null);
    } catch (e: any) {
      console.error(e);
      toast.error("Erreur: " + e.message, { id: t });
    }
  };

  const deleteB2BPartner = async (id: string) => {
    if (!confirm("Supprimer ce partenaire B2B ?")) return;
    
    const t = toast.loading("Suppression...");
    
    try {
      const { error } = await supabase
        .from("b2b_partners")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Partenaire supprimé", { id: t });
      setB2bPartners(b2bPartners.filter(p => p.id !== id));
    } catch (e: any) {
      console.error(e);
      toast.error("Erreur: " + e.message, { id: t });
    }
  };

  const toggleB2BStatus = async (partner: B2BPartner) => {
    const newStatus = partner.status === "active" ? "inactive" : "active";
    const t = toast.loading("Mise à jour...");
    
    try {
      const { error } = await supabase
        .from("b2b_partners")
        .update({ status: newStatus })
        .eq("id", partner.id);

      if (error) throw error;

      toast.success(`Statut: ${newStatus}`, { id: t });
      setB2bPartners(b2bPartners.map(p => p.id === partner.id ? { ...p, status: newStatus } : p));
    } catch (e: any) {
      console.error(e);
      toast.error("Erreur: " + e.message, { id: t });
    }
  };

  const regenerateApiKey = async (partner: B2BPartner) => {
    if (!confirm("Régénérer la clé API ? L'ancienne sera invalidée.")) return;
    
    const t = toast.loading("Régénération...");
    const newKey = generateApiKey();
    
    try {
      const { error } = await supabase
        .from("b2b_partners")
        .update({ api_key: newKey })
        .eq("id", partner.id);

      if (error) throw error;

      toast.success("Nouvelle clé API générée", { id: t });
      setB2bPartners(b2bPartners.map(p => p.id === partner.id ? { ...p, api_key: newKey } : p));
    } catch (e: any) {
      console.error(e);
      toast.error("Erreur: " + e.message, { id: t });
    }
  };

  // --- ORDER MANAGEMENT ---
  const cancelOrder = async (order: any, message: string) => {
    if (!message.trim()) {
      toast.error("Veuillez écrire un message au client");
      return;
    }

    setSendingEmail(true);
    const t = toast.loading("Annulation en cours...");

    try {
      // 1. Update order status in Supabase (only status and cancelled_at)
      const { error: updateError } = await supabase
        .from("orders")
        .update({ 
          status: "cancelled",
          cancelled_at: new Date().toISOString()
        })
        .eq("id", order.id);

      if (updateError) throw updateError;

      // 2. Get client email from profiles or fallback
      let clientEmail = order.profiles?.email;
      
      // If no email in profiles, try to get it from client_id
      if (!clientEmail && order.client_id) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("email")
          .eq("id", order.client_id)
          .single();
        clientEmail = profile?.email;
      }
      
      if (clientEmail) {
        // 3. Send cancellation email to client
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background: linear-gradient(135deg, #ef4444 0%, #f97316 100%); padding: 25px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 22px;">Commande annulée</h1>
            </div>
            <div style="background: white; padding: 25px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">Bonjour,</p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                Nous sommes désolés de vous informer que votre commande <strong>#${order.id.slice(0, 8).toUpperCase()}</strong> a été annulée.
              </p>
              
              <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <p style="color: #991b1b; margin: 0; font-weight: bold;">Message de l'équipe Kilolab :</p>
                <p style="color: #7f1d1d; margin: 10px 0 0 0; font-style: italic;">"${message}"</p>
              </div>
              
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                Si vous avez effectué un paiement, il sera remboursé sous 5-7 jours ouvrés.
              </p>
              
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                N'hésitez pas à passer une nouvelle commande quand vous le souhaitez.
              </p>
              
              <a href="https://kilolab.fr/new-order" style="display: block; background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); color: white; text-align: center; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 20px;">
                Passer une nouvelle commande
              </a>
              
              <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 20px;">
                Des questions ? Contactez-nous à contact@kilolab.fr
              </p>
            </div>
            <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">
              © 2025 Kilolab - Le pressing au kilo
            </p>
          </body>
          </html>
        `;

        // Call the email API
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: clientEmail,
            subject: `❌ Commande #${order.id.slice(0, 8).toUpperCase()} annulée - Kilolab`,
            html: emailHtml,
            type: 'order_cancelled'
          })
        });
      }

      toast.success("Commande annulée et client notifié !", { id: t });
      setShowOrderModal(false);
      setCancelMessage("");
      setSelectedOrder(null);
      fetchData();

    } catch (e: any) {
      console.error(e);
      toast.error("Erreur: " + e.message, { id: t });
    } finally {
      setSendingEmail(false);
    }
  };

  const sendMessageToClient = async (order: any, message: string) => {
    if (!message.trim()) {
      toast.error("Veuillez écrire un message");
      return;
    }

    setSendingEmail(true);
    const t = toast.loading("Envoi du message...");

    try {
      // Get client email from profiles or fallback
      let clientEmail = order.profiles?.email;
      
      // If no email in profiles, try to get it from client_id
      if (!clientEmail && order.client_id) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("email")
          .eq("id", order.client_id)
          .single();
        clientEmail = profile?.email;
      }
      
      if (!clientEmail) {
        throw new Error("Email du client non trouvé. L'utilisateur n'a peut-être pas de compte.");
      }

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); padding: 25px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">Message de Kilolab</h1>
          </div>
          <div style="background: white; padding: 25px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="color: #334155; font-size: 16px; line-height: 1.6;">Bonjour,</p>
            <p style="color: #334155; font-size: 16px; line-height: 1.6;">
              Concernant votre commande <strong>#${order.id.slice(0, 8).toUpperCase()}</strong> :
            </p>
            
            <div style="background: #f0fdfa; border-left: 4px solid #14b8a6; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <p style="color: #0f766e; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            
            <p style="color: #334155; font-size: 16px; line-height: 1.6;">
              N'hésitez pas à nous répondre si vous avez des questions.
            </p>
            
            <a href="https://kilolab.fr/tracking/${order.id}" style="display: block; background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); color: white; text-align: center; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 20px;">
              Suivre ma commande
            </a>
            
            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 20px;">
              © 2025 Kilolab - Le pressing au kilo
            </p>
          </div>
        </body>
        </html>
      `;

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: clientEmail,
          subject: `📬 Message concernant votre commande #${order.id.slice(0, 8).toUpperCase()} - Kilolab`,
          html: emailHtml,
          type: 'order_message'
        })
      });

      toast.success("Message envoyé au client !", { id: t });
      setCancelMessage("");

    } catch (e: any) {
      console.error(e);
      toast.error("Erreur: " + e.message, { id: t });
    } finally {
      setSendingEmail(false);
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

    if ((data as any)?.warning) toast.success("✅ Validé (compte déjà existant)", { id: t });
    else toast.success("✅ Partenaire validé & email envoyé !", { id: t });

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
      console.error(err);
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
      console.error(err);
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
      console.error(err);
      toast.error("❌ Erreur lors du déblocage", { id: t });
    }
  };

  // --- ACTIONS MESSAGES ---
  const markMessageAsRead = async (messageId: string) => {
    await supabase.from("contact_messages").update({ read: true }).eq("id", messageId);
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, read: true } : m)));
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
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    setSelectedMessage(null);
    toast.success("Supprimé");
  };

  const handleExportCSV = () => {
    const csvHeader = "Date,ID,Client,Montant,Poids,Statut,Partenaire\n";
    const csvData = filteredOrdersByTime
      .slice(0, 200)
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

  // --- COUPONS ---
  const createCoupon = async () => {
    if (!newCoupon.code.trim()) return toast.error("Code requis");

    const expiresAt = newCoupon.expires_at
      ? new Date(newCoupon.expires_at).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabase.from("coupons").insert({
      code: newCoupon.code.toUpperCase(),
      discount_type: newCoupon.discount_type,
      discount_value: newCoupon.discount_value,
      max_uses: newCoupon.max_uses,
      uses_count: 0,
      expires_at: expiresAt,
      source: "admin",
    });

    if (error) {
      // unique violation
      if ((error as any).code === "23505") return toast.error("Ce code existe déjà");
      return toast.error(error.message);
    }

    toast.success("✅ Coupon créé !");
    setNewCoupon({ code: "", discount_value: 5, discount_type: "percentage", max_uses: 100, expires_at: "" });
    fetchData();
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm("Supprimer ce coupon ?")) return;
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("🗑️ Coupon supprimé");
    fetchData();
  };

  // --- STATS & FILTRES ---
  const filteredOrdersByTime = useMemo(() => {
    if (timeRange === "all") return orders;
    const daysMap: Record<Exclude<TimeRange, "all">, number> = { "7d": 7, "30d": 30, "90d": 90 };
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

    const criticalErrors = errorLogs.filter(
      (l) => l.severity === "critical" || l.severity === "error"
    ).length;

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
      criticalErrors,
    };
  }, [filteredOrdersByTime, partners, messages, washers, clients, errorLogs]);

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
      .map((m: any) => ({ ...m, revenue: parseFloat(m.revenue.toFixed(2)) }));
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

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.city || "").toLowerCase().includes(q) ||
          (p.email || "").toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [partners, searchTerm, statusFilter]);

  const filteredWashers = useMemo(() => {
    if (washerFilter === "all") return washers;
    return washers.filter((w) => w.status === washerFilter);
  }, [washers, washerFilter]);

  // --- STATCARD (classes stables) ---
  const statTheme: Record<
    string,
    { iconBg: string; iconText: string; orbFrom: string }
  > = {
    teal: { iconBg: "bg-teal-50", iconText: "text-teal-600", orbFrom: "from-teal-50" },
    blue: { iconBg: "bg-blue-50", iconText: "text-blue-600", orbFrom: "from-blue-50" },
    purple: { iconBg: "bg-purple-50", iconText: "text-purple-600", orbFrom: "from-purple-50" },
    orange: { iconBg: "bg-orange-50", iconText: "text-orange-600", orbFrom: "from-orange-50" },
    red: { iconBg: "bg-red-50", iconText: "text-red-600", orbFrom: "from-red-50" },
  };

  const StatCard = ({ title, value, icon, suffix, badge, color = "teal" }: any) => {
    const t = statTheme[color] || statTheme.teal;
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${t.orbFrom} to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform`} />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 ${t.iconBg} rounded-xl ${t.iconText}`}>{icon}</div>
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
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-teal-500/30 rounded-full animate-pulse" />
            <Loader2 className="absolute inset-0 m-auto animate-spin text-teal-400" size={40} />
          </div>
          <p className="text-slate-400 font-medium mt-6">Chargement du dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-sans text-white">
      <Navbar />

      <div className="pt-28 pb-20 px-4 max-w-[1500px] mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                  <Shield size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    Command Center
                  </h1>
                  <p className="text-slate-400 text-sm flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    Données en temps réel
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={fetchData}
                className="bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-white/20 flex items-center gap-2 transition-all"
              >
                <RefreshCw size={16} />
                Actualiser
              </button>

              <a
                href="/admin/analytics"
                className="bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-white/20 flex items-center gap-2 transition-all"
              >
                <BarChart3 size={16} />
                Analytics
              </a>

              <button
                onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                className="bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-white/20 flex items-center gap-2 transition-all"
              >
                <Database size={16} />
                Supabase
              </button>

              <button
                onClick={handleExportCSV}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-teal-500/30 flex items-center gap-2 transition-all"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>
          </div>

          {/* TIME RANGE */}
          <div className="flex gap-2 mb-8">
            {(["7d", "30d", "90d", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  timeRange === range
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30"
                    : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {range === "7d" ? "7 jours" : range === "30d" ? "30 jours" : range === "90d" ? "90 jours" : "Tout"}
              </button>
            ))}
          </div>

          {/* TOP STATS - Glass morphism style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <DollarSign size={24} className="text-emerald-400" />
                </div>
                <TrendingUp size={18} className="text-emerald-400" />
              </div>
              <p className="text-4xl font-black text-white mb-1">{stats.totalRevenue.toFixed(0)}€</p>
              <p className="text-sm text-slate-400">Chiffre d'affaires</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <ShoppingBag size={24} className="text-blue-400" />
                </div>
                <span className="text-xs font-bold text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">
                  {stats.completedOrders} terminées
                </span>
              </div>
              <p className="text-4xl font-black text-white mb-1">{stats.totalOrders}</p>
              <p className="text-sm text-slate-400">Commandes totales</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-violet-500/20 rounded-xl">
                  <Users size={24} className="text-violet-400" />
                </div>
              </div>
              <p className="text-4xl font-black text-white mb-1">{stats.totalClients}</p>
              <p className="text-sm text-slate-400">Clients inscrits</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <MessageSquare size={24} className="text-orange-400" />
                </div>
                {stats.newMessages > 0 && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    {stats.newMessages}
                  </span>
                )}
              </div>
              <p className="text-4xl font-black text-white mb-1">{messages.length}</p>
              <p className="text-sm text-slate-400">Messages reçus</p>
            </div>
          </div>

          {/* SECOND STATS ROW */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <CheckCircle size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-400">{stats.activePartners}</p>
                <p className="text-xs text-slate-400">Pressings actifs</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-xl p-4 flex items-center gap-4">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Clock size={20} className="text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-black text-orange-400">{stats.pendingPartners + stats.pendingWashers}</p>
                <p className="text-xs text-slate-400">En attente</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-500/10 to-teal-500/5 border border-teal-500/20 rounded-xl p-4 flex items-center gap-4">
              <div className="p-2 bg-teal-500/20 rounded-lg">
                <BarChart3 size={20} className="text-teal-400" />
              </div>
              <div>
                <p className="text-2xl font-black text-teal-400">{stats.avgOrderValue.toFixed(0)}€</p>
                <p className="text-xs text-slate-400">Panier moyen</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-center gap-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-black text-red-400">{stats.criticalErrors}</p>
                <p className="text-xs text-slate-400">Erreurs critiques</p>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS - Modern pills */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl mb-8 overflow-hidden">
          <div className="flex border-b border-white/10 overflow-x-auto p-2 gap-1">
            {(["overview", "partners", "washers", "clients", "orders", "messages", "heatmap", "b2b", "logs", "coupons"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 font-bold transition-all whitespace-nowrap rounded-xl relative text-sm ${
                    activeTab === tab 
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg" 
                      : "text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {tab === "overview"
                    ? "Vue d'ensemble"
                    : tab === "partners"
                    ? `Pressings (${partners.length})`
                    : tab === "washers"
                    ? `Washers (${washers.length})`
                    : tab === "clients"
                    ? `Clients (${clients.length})`
                    : tab === "orders"
                    ? `Commandes (${orders.length})`
                    : tab === "messages"
                    ? `Messages (${stats.newMessages})`
                    : tab === "heatmap"
                    ? "Heatmap"
                    : tab === "b2b"
                    ? "B2B / API"
                    : tab === "logs"
                    ? `Logs (${stats.criticalErrors})`
                    : `Coupons (${coupons.length})`}

                  {tab === "washers" && stats.pendingWashers > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {stats.pendingWashers}
                    </span>
                  )}

                  {tab === "logs" && stats.criticalErrors > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {stats.criticalErrors}
                    </span>
                  )}
                </button>
              )
            )}
          </div>

          <div className="p-6">
            {/* TAB OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                      <TrendingUp className="text-teal-400" size={20} />
                      Évolution du CA
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                          labelStyle={{ color: '#fff' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={3} name="CA (€)" dot={{ r: 4, fill: '#14b8a6' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                      <Package className="text-blue-400" size={20} />
                      Commandes mensuelles
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                          labelStyle={{ color: '#fff' }}
                        />
                        <Legend />
                        <Bar dataKey="orders" fill="#3b82f6" name="Commandes" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {statusData.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                      <BarChart3 className="text-violet-400" size={20} />
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
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}

            {/* TAB PARTNERS */}
            {activeTab === "partners" && (
              <div>
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      placeholder="Rechercher un pressing..."
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStatusFilter("all")}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition ${statusFilter === "all" ? "bg-white/20 text-white" : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"}`}
                    >
                      Tous
                    </button>
                    <button
                      onClick={() => setStatusFilter("active")}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition ${statusFilter === "active" ? "bg-emerald-500 text-white" : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"}`}
                    >
                      Actifs
                    </button>
                    <button
                      onClick={() => setStatusFilter("pending")}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition ${statusFilter === "pending" ? "bg-orange-500 text-white" : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"}`}
                    >
                      En attente
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="text-left p-4 font-bold text-sm text-slate-400">Nom</th>
                        <th className="text-left p-4 font-bold text-sm text-slate-400">Ville</th>
                        <th className="text-left p-4 font-bold text-sm text-slate-400">Statut</th>
                        <th className="text-left p-4 font-bold text-sm text-slate-400">CA Total</th>
                        <th className="text-left p-4 font-bold text-sm text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPartners.map((partner) => (
                        <tr
                          key={partner.id}
                          className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition"
                          onClick={() => {
                            setSelectedPartner(partner);
                            setShowPartnerModal(true);
                          }}
                        >
                          <td className="p-4 font-bold text-white">{partner.name}</td>
                          <td className="p-4 text-slate-300">{partner.city}</td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                partner.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-orange-500/20 text-orange-400"
                              }`}
                            >
                              {partner.is_active ? "Actif" : "En attente"}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-teal-400">{partner.totalRevenue} €</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              {!partner.is_active && (
                                <>
                                  <button
                                    onClick={(e) => approvePartner(partner.id, e as any)}
                                    className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition"
                                    title="Valider"
                                  >
                                    <CheckCircle size={18} />
                                  </button>
                                  <button
                                    onClick={(e) => rejectPartner(partner, e as any)}
                                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                                    title="Refuser"
                                  >
                                    <XCircle size={18} />
                                  </button>
                                </>
                              )}
                              {partner.is_active && (
                                <button
                                  onClick={(e) => deactivatePartner(partner.id, e as any)}
                                  className="p-2 bg-white/10 text-slate-400 rounded-lg hover:bg-white/20 transition"
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

            {/* TAB WASHERS */}
            {activeTab === "washers" && (
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-white">Validation des Washers</h3>
                  <p className="text-slate-400">{washers.length} washers au total</p>
                </div>

                <div className="flex gap-3 mb-6 flex-wrap">
                  {(["all", "pending", "approved", "rejected"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setWasherFilter(f)}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition ${
                        washerFilter === f 
                          ? f === "pending" ? "bg-orange-500 text-white" 
                            : f === "approved" ? "bg-emerald-500 text-white"
                            : f === "rejected" ? "bg-red-500 text-white"
                            : "bg-white/20 text-white"
                          : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {f === "all"
                        ? `Tous (${washers.length})`
                        : f === "pending"
                        ? `En attente (${washers.filter((w) => w.status === "pending").length})`
                        : f === "approved"
                        ? `Approuvés (${washers.filter((w) => w.status === "approved").length})`
                        : `Rejetés (${washers.filter((w) => w.status === "rejected").length})`}
                    </button>
                  ))}
                </div>

                {filteredWashers.length === 0 ? (
                  <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                    <Users size={64} className="mx-auto mb-4 text-slate-500" />
                    <p className="text-xl font-bold text-slate-400">Aucun washer trouvé</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="text-left p-4 font-bold text-sm text-slate-400">Nom</th>
                          <th className="text-left p-4 font-bold text-sm text-slate-400">Email</th>
                          <th className="text-left p-4 font-bold text-sm text-slate-400">Téléphone</th>
                          <th className="text-left p-4 font-bold text-sm text-slate-400">Ville</th>
                          <th className="text-left p-4 font-bold text-sm text-slate-400">Statut</th>
                          <th className="text-left p-4 font-bold text-sm text-slate-400">Date</th>
                          <th className="text-left p-4 font-bold text-sm text-slate-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredWashers.map((washer) => (
                          <tr key={washer.id} className="border-b border-white/5 hover:bg-white/5 transition">
                            <td className="p-4">
                              <div className="font-bold text-white">{washer.full_name || "Sans nom"}</div>
                            </td>
                            <td className="p-4 text-sm text-slate-300">{washer.email}</td>
                            <td className="p-4 text-sm text-slate-300">{washer.phone}</td>
                            <td className="p-4 text-sm text-slate-300">
                              {washer.city} ({washer.postal_code})
                            </td>

                            <td className="p-4">
                              <div className="flex flex-col gap-1">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    washer.status === "approved"
                                      ? "bg-emerald-500/20 text-emerald-400"
                                      : washer.status === "pending"
                                      ? "bg-orange-500/20 text-orange-400"
                                      : "bg-red-500/20 text-red-400"
                                  }`}
                                >
                                  {washer.status === "approved" && "Approuvé"}
                                  {washer.status === "pending" && "En attente"}
                                  {washer.status === "rejected" && "Rejeté"}
                                </span>

                                {washer.is_blocked && (
                                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                                    BLOQUÉ
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="p-4 text-sm text-slate-400">
                              {new Date(washer.created_at).toLocaleDateString("fr-FR")}
                            </td>

                            <td className="p-4">
                              <div className="flex gap-2 flex-wrap">
                                {washer.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() => approveWasher(washer.id)}
                                      className="px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-bold hover:bg-emerald-500/30 transition"
                                      title="Approuver"
                                    >
                                      <CheckCircle size={16} />
                                    </button>
                                    <button
                                      onClick={() => rejectWasher(washer.id)}
                                      className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-bold hover:bg-red-500/30 transition"
                                      title="Rejeter"
                                    >
                                      <XCircle size={16} />
                                    </button>
                                  </>
                                )}

                                {washer.status === "approved" && !washer.is_blocked && (
                                  <button
                                    onClick={() => blockWasher(washer.id)}
                                    className="px-3 py-2 bg-orange-500/20 text-orange-400 rounded-lg text-sm font-bold hover:bg-orange-500/30 transition"
                                    title="Bloquer"
                                  >
                                    <AlertTriangle size={16} />
                                  </button>
                                )}

                                {washer.is_blocked && (
                                  <button
                                    onClick={() => unblockWasher(washer.id)}
                                    className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-bold hover:bg-blue-500/30 transition"
                                    title="Débloquer"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    setSelectedWasher(washer);
                                    setShowWasherModal(true);
                                  }}
                                  className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-bold hover:bg-blue-500/30 transition"
                                  title="Voir détails"
                                >
                                  <FileText size={16} />
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

            {/* TAB CLIENTS */}
            {activeTab === "clients" && (
              <div>
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="text-left p-4 font-bold text-sm text-slate-400">Nom</th>
                      <th className="text-left p-4 font-bold text-sm text-slate-400">Email</th>
                      <th className="text-left p-4 font-bold text-sm text-slate-400">Ville</th>
                      <th className="text-left p-4 font-bold text-sm text-slate-400">Inscrit le</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="p-4 font-bold text-white">
                          {client.full_name || client.email}
                        </td>
                        <td className="p-4 text-sm text-slate-300">{client.email}</td>
                        <td className="p-4 text-sm text-slate-300">{client.city || "-"}</td>
                        <td className="p-4 text-sm text-slate-400">
                          {new Date(client.created_at).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB ORDERS */}
            {activeTab === "orders" && (
              <div>
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="text-left p-4 font-bold text-sm text-slate-400">ID</th>
                      <th className="text-left p-4 font-bold text-sm text-slate-400">Client</th>
                      <th className="text-left p-4 font-bold text-sm text-slate-400">Adresse</th>
                      <th className="text-left p-4 font-bold text-sm text-slate-400">Montant</th>
                      <th className="text-left p-4 font-bold text-sm text-slate-400">Statut</th>
                      <th className="text-left p-4 font-bold text-sm text-slate-400">Date</th>
                      <th className="text-left p-4 font-bold text-sm text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrdersByTime.map((order) => (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="p-4 font-mono text-xs text-teal-400">{order.id.slice(0, 8)}</td>
                        <td className="p-4 text-sm text-white">
                          {order.profiles?.email || order.client_email || <span className="text-slate-500">-</span>}
                        </td>
                        <td className="p-4 text-sm text-slate-300 max-w-[200px] truncate">
                          {order.pickup_address || order.partner?.company_name || <span className="text-slate-500">-</span>}
                        </td>
                        <td className="p-4 font-bold text-emerald-400">{order.total_price} €</td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              order.status === "completed"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : order.status === "cancelled"
                                ? "bg-red-500/20 text-red-400"
                                : order.status === "pending"
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {order.status === "completed" ? "Terminé" 
                              : order.status === "cancelled" ? "Annulé"
                              : order.status === "pending" ? "En attente"
                              : order.status === "in_progress" ? "En cours"
                              : order.status === "ready" ? "Prêt"
                              : order.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-400">
                          {new Date(order.created_at).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {order.status !== "cancelled" && order.status !== "completed" && (
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowOrderModal(true);
                                }}
                                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                                title="Annuler la commande"
                              >
                                <XCircle size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setCancelMessage("");
                                setShowOrderModal(true);
                              }}
                              className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
                              title="Contacter le client"
                            >
                              <Send size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB MESSAGES */}
            {activeTab === "messages" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
                <div className="overflow-y-auto border-r border-white/10 pr-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-4 rounded-xl mb-3 cursor-pointer transition ${
                        selectedMessage?.id === msg.id
                          ? "bg-teal-500/20 border border-teal-500/30"
                          : "bg-white/5 hover:bg-white/10 border border-white/10"
                      } ${!msg.read ? "border-l-4 border-l-teal-500" : ""}`}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-bold text-white">{msg.name}</span>
                        <span className="text-xs text-slate-400">{new Date(msg.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-1">{msg.subject}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white/5 rounded-2xl p-6 h-full flex flex-col border border-white/10">
                  {selectedMessage ? (
                    <>
                      <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/10">
                        <div>
                          <h3 className="font-bold text-xl mb-1 text-white">{selectedMessage.subject}</h3>
                          <div className="flex items-center gap-2 text-sm text-slate-400 flex-wrap">
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
                        <button onClick={() => deleteMessage(selectedMessage.id)} className="text-red-400 hover:text-red-500 transition">
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
                        <p className="whitespace-pre-wrap text-slate-300">{selectedMessage.message}</p>
                      </div>

                      {selectedMessage.support_responses?.length > 0 && (
                        <div className="mb-4 pl-4 border-l-2 border-teal-500/50">
                          <p className="text-xs font-bold text-teal-400 mb-1">Réponse envoyée :</p>
                          <p className="text-sm text-slate-400 italic">"{selectedMessage.support_responses[0].response}"</p>
                        </div>
                      )}

                      <div className="mt-auto">
                        <textarea
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 mb-3 focus:ring-2 focus:ring-teal-500 text-white placeholder-slate-500"
                          placeholder="Écrire une réponse..."
                          rows={3}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <button
                          onClick={() => handleReplyInApp(selectedMessage)}
                          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-teal-500/30 flex items-center justify-center gap-2 transition"
                        >
                          <Send size={18} /> Envoyer la réponse
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-500 flex-col gap-4">
                      <MessageSquare size={48} />
                      <p>Sélectionnez un message pour répondre</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB LOGS */}
            {activeTab === "logs" && (
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-white">Logs d'erreurs</h3>
                  <p className="text-slate-400">{errorLogs.length} logs au total</p>
                </div>

                {errorLogs.length === 0 ? (
                  <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                    <AlertTriangle size={64} className="mx-auto mb-4 text-slate-500" />
                    <p className="text-xl font-bold text-slate-400">Aucune erreur enregistrée</p>
                    <p className="text-sm text-slate-500 mt-2">C'est une bonne nouvelle !</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="text-left p-4 font-bold text-sm text-slate-400">Date</th>
                          <th className="text-left p-4 font-bold text-sm text-slate-400">Source</th>
                          <th className="text-left p-4 font-bold text-sm text-slate-400">Sévérité</th>
                          <th className="text-left p-4 font-bold text-sm text-slate-400">Message</th>
                          <th className="text-left p-4 font-bold text-sm text-slate-400">Order ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {errorLogs.map((log) => (
                          <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition">
                            <td className="p-4 text-sm text-slate-400">{new Date(log.created_at).toLocaleString("fr-FR")}</td>
                            <td className="p-4 font-mono text-xs text-slate-300">{log.source}</td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  log.severity === "critical"
                                    ? "bg-red-500/20 text-red-400"
                                    : log.severity === "error"
                                    ? "bg-orange-500/20 text-orange-400"
                                    : log.severity === "warning"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-blue-500/20 text-blue-400"
                                }`}
                              >
                                {log.severity}
                              </span>
                            </td>
                            <td className="p-4 text-sm max-w-md truncate text-slate-300">{log.message}</td>
                            <td className="p-4 font-mono text-xs text-teal-400">{log.order_id ? String(log.order_id).slice(0, 8) : "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB COUPONS */}
            {activeTab === "coupons" && (
              <div>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                    <Tag size={20} className="text-teal-400" />
                    Créer un coupon
                  </h3>

                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-300">Code *</label>
                      <input
                        type="text"
                        placeholder="PROMO2026"
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl uppercase text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-300">Type</label>
                      <select
                        value={newCoupon.discount_type}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value as CouponType })}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                      >
                        <option value="percentage">Pourcentage (%)</option>
                        <option value="fixed">Montant fixe (€)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-300">
                        Réduction ({newCoupon.discount_type === "percentage" ? "%" : "€"})
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={newCoupon.discount_type === "percentage" ? 100 : 1000}
                        value={newCoupon.discount_value}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: parseInt(e.target.value || "0", 10) })}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-300">Utilisations max</label>
                      <input
                        type="number"
                        min={1}
                        value={newCoupon.max_uses}
                        onChange={(e) => setNewCoupon({ ...newCoupon, max_uses: parseInt(e.target.value || "0", 10) })}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-300">Expire le (optionnel)</label>
                      <input
                        type="date"
                        value={newCoupon.expires_at}
                        onChange={(e) => setNewCoupon({ ...newCoupon, expires_at: e.target.value })}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={createCoupon}
                        className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-teal-500/30 flex items-center justify-center gap-2 transition"
                      >
                        <Plus size={18} />
                        Créer le coupon
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Coupons existants</h3>

                  {coupons.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-slate-500">Aucun coupon pour le moment.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                          <tr>
                            <th className="text-left p-4 font-bold text-sm text-slate-400">Code</th>
                            <th className="text-left p-4 font-bold text-sm text-slate-400">Réduction</th>
                            <th className="text-left p-4 font-bold text-sm text-slate-400">Utilisations</th>
                            <th className="text-left p-4 font-bold text-sm text-slate-400">Expire le</th>
                            <th className="text-left p-4 font-bold text-sm text-slate-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {coupons.map((coupon) => (
                            <tr key={coupon.id} className="border-b border-white/5 hover:bg-white/5 transition">
                              <td className="p-4 font-mono font-bold text-teal-400">{coupon.code}</td>
                              <td className="p-4 text-white">
                                {coupon.discount_value}
                                {coupon.discount_type === "percentage" ? "%" : "€"}
                              </td>
                              <td className="p-4">
                                <span className={`font-bold ${coupon.uses_count >= coupon.max_uses ? "text-red-400" : "text-emerald-400"}`}>
                                  {coupon.uses_count} / {coupon.max_uses}
                                </span>
                              </td>
                              <td className="p-4 text-sm text-slate-400">
                                {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString("fr-FR") : "Jamais"}
                              </td>
                              <td className="p-4">
                                <button
                                  onClick={() => deleteCoupon(coupon.id)}
                                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                                  title="Supprimer"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ═══ HEATMAP TAB ═══ */}
            {activeTab === "heatmap" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold flex items-center gap-2 text-white">
                    <MapPin size={20} className="text-teal-400" /> Carte des commandes
                  </h3>
                </div>
                {/* Real Heatmap Component with Leaflet */}
                <OrderHeatmap dateRange={timeRange === '7d' ? '7d' : timeRange === '90d' ? '90d' : '30d'} />
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                    <p className="text-3xl font-black text-teal-400">{orders.length}</p>
                    <p className="text-sm text-slate-400 mt-1">Commandes totales</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                    <p className="text-3xl font-black text-violet-400">{new Set(orders.map(o => o.city || 'N/A')).size}</p>
                    <p className="text-sm text-slate-400 mt-1">Villes actives</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                    <p className="text-3xl font-black text-orange-400">{washers.filter(w => w.status === 'approved').length}</p>
                    <p className="text-sm text-slate-400 mt-1">Washers disponibles</p>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ B2B / API TAB ═══ */}
            {activeTab === "b2b" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold flex items-center gap-2 text-white">
                    <Database size={20} className="text-violet-400" /> Partenaires B2B & API
                  </h3>
                  <button 
                    onClick={() => setShowB2BModal(true)}
                    className="px-4 py-2 bg-violet-500 text-white rounded-xl font-bold text-sm hover:bg-violet-600 transition flex items-center gap-2"
                  >
                    <Plus size={16} /> Nouveau partenaire
                  </button>
                </div>

                {/* API Info Box */}
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[60px]" />
                  <h4 className="text-xl font-bold mb-2 relative">API Kilolab B2B</h4>
                  <p className="text-violet-200 mb-6 text-sm relative">Intégrez Kilolab dans vos applications avec notre API REST. Chaque partenaire reçoit sa propre clé API.</p>
                  <div className="grid md:grid-cols-4 gap-4 relative">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <p className="text-3xl font-black">{b2bPartners.length}</p>
                      <p className="text-xs text-violet-200">Partenaires</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <p className="text-3xl font-black">{b2bPartners.reduce((sum, p) => sum + (p.api_calls || 0), 0).toLocaleString()}</p>
                      <p className="text-xs text-violet-200">Appels API / mois</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <p className="text-3xl font-black">{b2bPartners.reduce((sum, p) => sum + (p.monthly_revenue || 0), 0).toFixed(0)}€</p>
                      <p className="text-xs text-violet-200">Revenus B2B</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <p className="text-3xl font-black">99.9%</p>
                      <p className="text-xs text-violet-200">Uptime API</p>
                    </div>
                  </div>
                </div>

                {/* B2B Partners List - CRUD */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-white/10">
                    <h4 className="font-bold text-lg text-white">Partenaires B2B</h4>
                    <p className="text-sm text-slate-400">{b2bPartners.length} entreprises enregistrées</p>
                  </div>
                  
                  {b2bPartners.length === 0 ? (
                    <div className="p-12 text-center">
                      <Database size={48} className="mx-auto mb-4 text-slate-500" />
                      <p className="text-slate-400 mb-4">Aucun partenaire B2B</p>
                      <button 
                        onClick={() => setShowB2BModal(true)}
                        className="px-4 py-2 bg-violet-500 text-white rounded-xl font-bold text-sm hover:bg-violet-600 transition"
                      >
                        Ajouter le premier partenaire
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                          <tr>
                            <th className="text-left p-4 font-bold text-sm text-slate-400">Entreprise</th>
                            <th className="text-left p-4 font-bold text-sm text-slate-400">Plan</th>
                            <th className="text-left p-4 font-bold text-sm text-slate-400">Statut</th>
                            <th className="text-left p-4 font-bold text-sm text-slate-400">Clé API</th>
                            <th className="text-left p-4 font-bold text-sm text-slate-400">Appels</th>
                            <th className="text-left p-4 font-bold text-sm text-slate-400">Revenus</th>
                            <th className="text-left p-4 font-bold text-sm text-slate-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {b2bPartners.map((partner) => (
                            <tr key={partner.id} className="border-b border-white/5 hover:bg-white/5 transition">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center text-violet-400 font-bold">
                                    {partner.name[0]}
                                  </div>
                                  <div>
                                    <p className="font-bold text-white">{partner.name}</p>
                                    <p className="text-xs text-slate-400">{partner.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  partner.plan === 'enterprise' ? 'bg-violet-500/20 text-violet-400' :
                                  partner.plan === 'business' ? 'bg-teal-500/20 text-teal-400' :
                                  'bg-white/10 text-slate-400'
                                }`}>
                                  {partner.plan}
                                </span>
                              </td>
                              <td className="p-4">
                                <button 
                                  onClick={() => toggleB2BStatus(partner)}
                                  className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition ${
                                    partner.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' :
                                    partner.status === 'trial' ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' :
                                    'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                  }`}
                                >
                                  {partner.status}
                                </button>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <code className="text-xs font-mono text-slate-300 bg-white/5 px-2 py-1 rounded">
                                    {partner.api_key?.slice(0, 12)}...
                                  </code>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(partner.api_key);
                                      toast.success("Clé copiée !");
                                    }}
                                    className="p-1 hover:bg-white/10 rounded transition text-slate-400 hover:text-white"
                                    title="Copier"
                                  >
                                    <FileText size={14} />
                                  </button>
                                  <button
                                    onClick={() => regenerateApiKey(partner)}
                                    className="p-1 hover:bg-white/10 rounded transition text-slate-400 hover:text-orange-400"
                                    title="Régénérer"
                                  >
                                    <RefreshCw size={14} />
                                  </button>
                                </div>
                              </td>
                              <td className="p-4 text-sm text-slate-300">{(partner.api_calls || 0).toLocaleString()}</td>
                              <td className="p-4 font-bold text-emerald-400">{(partner.monthly_revenue || 0).toFixed(0)}€</td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setEditingB2B(partner)}
                                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
                                    title="Modifier"
                                  >
                                    <FileText size={16} />
                                  </button>
                                  <button
                                    onClick={() => deleteB2BPartner(partner.id)}
                                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                                    title="Supprimer"
                                  >
                                    <Trash2 size={16} />
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

                {/* API Documentation */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-white"><FileText size={18} className="text-slate-400" /> Documentation API</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { method: "POST", path: "/api/v1/orders", desc: "Créer une commande" },
                      { method: "GET", path: "/api/v1/orders/:id", desc: "Statut d'une commande" },
                      { method: "GET", path: "/api/v1/washers/available", desc: "Washers disponibles" },
                      { method: "POST", path: "/api/v1/webhooks", desc: "Configurer un webhook" },
                    ].map((ep, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>{ep.method}</span>
                        <div>
                          <code className="text-sm font-mono text-slate-300">{ep.path}</code>
                          <p className="text-xs text-slate-500 mt-0.5">{ep.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALE PARTNER */}
      {showPartnerModal && selectedPartner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-white/10 rounded-3xl p-8 max-w-2xl w-full relative shadow-2xl">
            <button
              onClick={() => setShowPartnerModal(false)}
              className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition text-white"
            >
              <X size={20} />
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-black mb-2 text-white">{selectedPartner.name}</h2>
              <div className="flex gap-2">
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm font-bold text-slate-300">
                  {selectedPartner.city}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    selectedPartner.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-orange-500/20 text-orange-400"
                  }`}
                >
                  {selectedPartner.is_active ? "Actif" : "En attente"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-slate-400 mb-1">Email Pro</p>
                <p className="font-bold text-white">{selectedPartner.email}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-slate-400 mb-1">Téléphone</p>
                <p className="font-bold text-white">{selectedPartner.phone}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl col-span-2 border border-white/10">
                <p className="text-sm text-slate-400 mb-1">Adresse</p>
                <p className="font-bold text-white">
                  {selectedPartner.address}, {selectedPartner.postal_code} {selectedPartner.city}
                </p>
              </div>
            </div>

            {!selectedPartner.is_active && (
              <div className="flex gap-3 pt-6 border-t border-white/10">
                <button
                  onClick={() => rejectPartner(selectedPartner)}
                  className="flex-1 py-3 bg-red-500/20 text-red-400 font-bold rounded-xl hover:bg-red-500/30 transition"
                >
                  Refuser
                </button>
                <button
                  onClick={() => approvePartner(selectedPartner.id)}
                  className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/30"
                >
                  Valider le compte
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {showWasherModal && selectedWasher && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-white/10 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setShowWasherModal(false)}
              className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition text-white"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {(selectedWasher.full_name || "?").charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-black text-white">{selectedWasher.full_name || "Sans nom"}</h2>

                <div className="flex gap-2 flex-wrap">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold ${
                      selectedWasher.status === "approved"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : selectedWasher.status === "pending"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {selectedWasher.status === "approved" && "Approuvé"}
                    {selectedWasher.status === "pending" && "En attente"}
                    {selectedWasher.status === "rejected" && "Rejeté"}
                  </span>

                  {selectedWasher.is_blocked && (
                    <span className="text-xs px-3 py-1 rounded-full font-bold bg-red-600 text-white">
                      BLOQUÉ
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                    <Users size={18} className="text-teal-400" /> Informations personnelles
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email</span>
                      <span className="font-medium text-white">{selectedWasher.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Téléphone</span>
                      <span className="font-medium text-white">{selectedWasher.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ville</span>
                      <span className="font-medium text-white">{selectedWasher.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Code postal</span>
                      <span className="font-medium text-white">{selectedWasher.postal_code}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-400">Adresse</span>
                      <span className="font-medium text-right text-white">{selectedWasher.address || "Non renseignée"}</span>
                    </div>
                  </div>
                </div>

                {selectedWasher?.is_blocked && (
                  <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-400">
                      <AlertCircle size={18} /> Washer bloqué
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Raison</span>
                        <span className="font-bold text-red-400 text-right">
                          {selectedWasher.blocked_reason || "Non spécifiée"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">Bloqué le</span>
                        <span className="font-medium text-white">
                          {selectedWasher.blocked_at ? new Date(selectedWasher.blocked_at).toLocaleDateString("fr-FR") : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                    <Calendar size={18} className="text-teal-400" /> Inscription
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Date d'inscription</span>
                      <span className="font-medium text-white">
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

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-3 flex-wrap">
              <button
                onClick={() => setShowWasherModal(false)}
                className="px-6 py-3 bg-white/10 border border-white/10 rounded-xl font-bold text-white hover:bg-white/20 transition"
              >
                Fermer
              </button>

              {selectedWasher.status === "pending" && (
                <>
                  <button
                    onClick={() => rejectWasher(selectedWasher.id)}
                    className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold hover:bg-red-500/30 transition"
                  >
                    Rejeter
                  </button>
                  <button
                    onClick={() => approveWasher(selectedWasher.id)}
                    className="px-6 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 shadow-lg shadow-teal-500/30 transition"
                  >
                    Approuver
                  </button>
                </>
              )}

              {selectedWasher.status === "approved" && !selectedWasher.is_blocked && (
                <button
                  onClick={() => blockWasher(selectedWasher.id)}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition"
                >
                  Bloquer ce Washer
                </button>
              )}

              {selectedWasher.is_blocked && (
                <button
                  onClick={() => unblockWasher(selectedWasher.id)}
                  className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition"
                >
                  Débloquer ce Washer
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODALE ORDER - ANNULATION / MESSAGE CLIENT */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-white/10 rounded-3xl p-8 max-w-2xl w-full relative shadow-2xl">
            <button
              onClick={() => {
                setShowOrderModal(false);
                setSelectedOrder(null);
                setCancelMessage("");
              }}
              className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition text-white"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <ShoppingBag className="text-teal-400" />
                Commande #{selectedOrder.id.slice(0, 8).toUpperCase()}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {new Date(selectedOrder.created_at).toLocaleDateString("fr-FR", { 
                  day: "numeric", 
                  month: "long", 
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-slate-400 mb-1">Client</p>
                <p className="font-bold text-white">{selectedOrder.profiles?.email || "Email non disponible"}</p>
                {!selectedOrder.profiles?.email && (
                  <p className="text-xs text-orange-400 mt-1">⚠️ Commande sans compte utilisateur</p>
                )}
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-slate-400 mb-1">Montant</p>
                <p className="font-bold text-emerald-400 text-xl">{selectedOrder.total_price} €</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 col-span-2">
                <p className="text-sm text-slate-400 mb-1">Adresse de collecte</p>
                <p className="font-bold text-white">{selectedOrder.pickup_address || "Non spécifiée"}</p>
                {selectedOrder.pickup_city && (
                  <p className="text-slate-300 text-sm">{selectedOrder.pickup_city}</p>
                )}
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-slate-400 mb-1">Statut actuel</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedOrder.status === "completed"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : selectedOrder.status === "cancelled"
                    ? "bg-red-500/20 text-red-400"
                    : selectedOrder.status === "pending"
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}>
                  {selectedOrder.status === "completed" ? "Terminé" 
                    : selectedOrder.status === "cancelled" ? "Annulé"
                    : selectedOrder.status === "pending" ? "En attente"
                    : selectedOrder.status}
                </span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-slate-400 mb-1">Poids</p>
                <p className="font-bold text-white">{selectedOrder.weight || "?"} kg</p>
              </div>
            </div>

            {/* Message Input */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 text-slate-300">
                Message au client
              </label>
              <textarea
                value={cancelMessage}
                onChange={(e) => setCancelMessage(e.target.value)}
                placeholder="Écrivez votre message au client... (ex: Désolé, nous n'avons pas de laveur disponible dans votre zone actuellement)"
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none resize-none h-32"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setShowOrderModal(false);
                  setSelectedOrder(null);
                  setCancelMessage("");
                }}
                className="flex-1 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition"
              >
                Fermer
              </button>
              
              <button
                onClick={() => sendMessageToClient(selectedOrder, cancelMessage)}
                disabled={sendingEmail || !cancelMessage.trim()}
                className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
              >
                {sendingEmail ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                Envoyer message
              </button>

              {selectedOrder.status !== "cancelled" && selectedOrder.status !== "completed" && (
                <button
                  onClick={() => cancelOrder(selectedOrder, cancelMessage)}
                  disabled={sendingEmail || !cancelMessage.trim()}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
                >
                  {sendingEmail ? <Loader2 className="animate-spin" size={18} /> : <XCircle size={18} />}
                  Annuler commande
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODALE CREATE B2B PARTNER */}
      {showB2BModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-white/10 rounded-3xl p-8 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setShowB2BModal(false)}
              className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition text-white"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">Nouveau Partenaire B2B</h2>
              <p className="text-slate-400 text-sm mt-1">Créer un compte API pour une entreprise</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-300">Nom de l'entreprise *</label>
                <input
                  type="text"
                  placeholder="CleanCorp SAS"
                  value={newB2BPartner.name}
                  onChange={(e) => setNewB2BPartner({ ...newB2BPartner, name: e.target.value })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-slate-300">Email *</label>
                <input
                  type="email"
                  placeholder="contact@cleancorp.fr"
                  value={newB2BPartner.email}
                  onChange={(e) => setNewB2BPartner({ ...newB2BPartner, email: e.target.value })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-slate-300">Téléphone</label>
                <input
                  type="tel"
                  placeholder="01 23 45 67 89"
                  value={newB2BPartner.phone}
                  onChange={(e) => setNewB2BPartner({ ...newB2BPartner, phone: e.target.value })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-slate-300">Plan</label>
                <select
                  value={newB2BPartner.plan}
                  onChange={(e) => setNewB2BPartner({ ...newB2BPartner, plan: e.target.value as any })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-violet-500 focus:outline-none"
                >
                  <option value="starter">Starter</option>
                  <option value="business">Business</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowB2BModal(false)}
                className="flex-1 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition"
              >
                Annuler
              </button>
              <button
                onClick={createB2BPartner}
                className="flex-1 py-3 bg-violet-500 text-white rounded-xl font-bold hover:bg-violet-600 shadow-lg shadow-violet-500/30 transition"
              >
                Créer le partenaire
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE EDIT B2B PARTNER */}
      {editingB2B && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-white/10 rounded-3xl p-8 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setEditingB2B(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition text-white"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">Modifier {editingB2B.name}</h2>
              <p className="text-slate-400 text-sm mt-1">Mettre à jour les informations du partenaire</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-300">Nom de l'entreprise</label>
                <input
                  type="text"
                  value={editingB2B.name}
                  onChange={(e) => setEditingB2B({ ...editingB2B, name: e.target.value })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-slate-300">Email</label>
                <input
                  type="email"
                  value={editingB2B.email}
                  onChange={(e) => setEditingB2B({ ...editingB2B, email: e.target.value })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-slate-300">Téléphone</label>
                <input
                  type="tel"
                  value={editingB2B.phone}
                  onChange={(e) => setEditingB2B({ ...editingB2B, phone: e.target.value })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-300">Plan</label>
                  <select
                    value={editingB2B.plan}
                    onChange={(e) => setEditingB2B({ ...editingB2B, plan: e.target.value as any })}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-violet-500 focus:outline-none"
                  >
                    <option value="starter">Starter</option>
                    <option value="business">Business</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-300">Statut</label>
                  <select
                    value={editingB2B.status}
                    onChange={(e) => setEditingB2B({ ...editingB2B, status: e.target.value as any })}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-violet-500 focus:outline-none"
                  >
                    <option value="trial">Essai</option>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-slate-400 mb-2">Clé API</p>
                <code className="text-xs font-mono text-violet-400 break-all">{editingB2B.api_key}</code>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setEditingB2B(null)}
                className="flex-1 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition"
              >
                Annuler
              </button>
              <button
                onClick={() => updateB2BPartner(editingB2B)}
                className="flex-1 py-3 bg-violet-500 text-white rounded-xl font-bold hover:bg-violet-600 shadow-lg shadow-violet-500/30 transition"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}