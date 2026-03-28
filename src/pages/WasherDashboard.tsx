import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { requestNotificationPermission } from "../lib/firebase";
import { 
  subscribeToZoneOrders, 
  showBrowserNotification,
  requestNotificationPermission as requestBrowserNotif 
} from "../services/washerNotifications";
import Navbar from "../components/Navbar";
import { FadeInOnScroll, CountUp } from "../components/animations/ScrollAnimations";
import { WasherDashboardSkeleton } from "../components/animations/Skeleton";
import toast from "react-hot-toast";
import {
  DollarSign, Package, Clock, MapPin, Check, TrendingUp, Loader2,
  AlertCircle, Bell, Calendar, ArrowRight, Settings, CreditCard,
  RefreshCcw, Play, CheckCircle2, X, ChevronRight, Star, Map, Plane, Scale
} from "lucide-react";
import { lazy, Suspense } from 'react';
import WasherAvailability from '../components/WasherAvailability';
import WeightAdjustment from '../components/WeightAdjustment';

// Lazy load the map component
const OrdersMap = lazy(() => import('../components/OrdersMap'));

type WasherStatus = "pending" | "approved" | "rejected";
type OrderStatus = "pending" | "confirmed" | "assigned" | "in_progress" | "completed" | string;

interface WasherStats {
  totalEarnings: number; completedOrders: number; pendingOrders: number;
  avgRating: number; totalRatings: number; weekEarnings: number;
}
interface Mission {
  id: string; client_id?: string | null; weight: number; formula: string;
  total_price: number; status: OrderStatus; pickup_address: string;
  pickup_date: string; pickup_slot?: string | null;
  pickup_lat?: number | null; pickup_lng?: number | null;
  created_at: string; updated_at?: string | null;
  assigned_at?: string | null; completed_at?: string | null;
  washer_id?: string | null; partner_id?: string | null;
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos((lat1*Math.PI)/180)*Math.cos((lat2*Math.PI)/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
function startOfWeekMonday(d: Date) {
  const date = new Date(d); const day = date.getDay();
  date.setDate(date.getDate() + (day === 0 ? -6 : 1) - day);
  date.setHours(0,0,0,0); return date;
}
function safeNumber(v: any, fallback = 0) { const n = Number(v); return Number.isFinite(n) ? n : fallback; }
function formatDateFR(iso: string) { try { return new Date(iso).toLocaleDateString("fr-FR"); } catch { return iso; } }
function trimAddress(addr?: string | null) { if (!addr) return "Adresse non definie"; return addr.split(" (")[0]; }
function commissionEarnings(total_price: any, commission = 0.6) { return (safeNumber(total_price,0)*commission).toFixed(2); }
function formulaLabel(f: string) { return ({express:"Express",eco:"Eco",standard:"Standard",premium:"Premium"}[f]??f); }
function formulaEmoji(f: string) { return ({express:"⚡",eco:"🌿",standard:"🟢",premium:"⭐"}[f]??"📦"); }
function formulaBadgeClass(f: string) {
  return ({
    express:"bg-purple-500/20 text-purple-300 border border-purple-500/30",
    eco:"bg-green-500/20 text-green-300 border border-green-500/30",
    premium:"bg-amber-500/20 text-amber-300 border border-amber-500/30"
  }[f]??"bg-blue-500/20 text-blue-300 border border-blue-500/30");
}

/* ── MODALE DETAIL MISSION ── */
function MissionModal({ mission, onClose, onAccept, onUpdate, isActive, onWeightAdjust }: {
  mission: Mission; onClose: () => void;
  onAccept?: (id: string) => void;
  onUpdate?: (id: string, status: OrderStatus) => void;
  isActive?: boolean;
  onWeightAdjust?: (mission: Mission) => void;
}) {
  const earning = commissionEarnings(mission.total_price);
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#0f1729] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
        style={{ boxShadow: "0 0 80px rgba(20,184,166,0.15)" }}
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="relative p-6 border-b border-white/8">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(20,184,166,0.12) 0%, transparent 65%)" }} />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-1">Detail de la mission</p>
              <p className="text-white font-black text-3xl">{earning} EUR</p>
              <p className="text-white/30 text-xs mt-0.5">60% de {parseFloat(String(mission.total_price)).toFixed(2)} EUR total</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${formulaBadgeClass(mission.formula)}`}>
                {formulaEmoji(mission.formula)} {formulaLabel(mission.formula)}
              </span>
              <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center hover:bg-white/15 transition">
                <X size={16} className="text-white/60" />
              </button>
            </div>
          </div>
        </div>
        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/8">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-1">Poids</p>
              <p className="text-white font-black text-2xl">{mission.weight} kg</p>
              {isActive && mission.status === "assigned" && onWeightAdjust && (
                <button 
                  onClick={() => onWeightAdjust(mission)}
                  className="mt-2 text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1"
                >
                  <Scale size={12} /> Ajuster
                </button>
              )}
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/8">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-1">Date collecte</p>
              <p className="text-white font-black text-sm">{formatDateFR(mission.pickup_date)}</p>
              {mission.pickup_slot && <p className="text-teal-400 text-xs mt-1">{mission.pickup_slot}</p>}
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/8">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-teal-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin size={14} className="text-teal-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-1">Adresse de collecte</p>
                <p className="text-white font-semibold text-sm leading-relaxed">{mission.pickup_address}</p>
              </div>
            </div>
          </div>
          <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-300 text-xs font-semibold uppercase tracking-wide mb-1">Votre gain net</p>
                <p className="text-teal-400 font-black text-3xl">{earning} EUR</p>
              </div>
              <div className="text-right">
                <p className="text-white/30 text-xs">Commission 60%</p>
                <p className="text-white/30 text-xs">Virement dimanche</p>
              </div>
            </div>
          </div>
        </div>
        {/* CTA */}
        <div className="p-6 pt-0 space-y-3">
          {isActive && mission.status === "assigned" && onWeightAdjust && (
            <button onClick={() => onWeightAdjust(mission)}
              className="w-full py-3 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-2xl font-bold text-sm hover:bg-orange-500/30 transition flex items-center justify-center gap-2">
              <Scale size={18} /> Ajuster le poids a la collecte
            </button>
          )}
          {!isActive && onAccept && (
            <button onClick={() => { onAccept(mission.id); onClose(); }}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl font-black text-base hover:shadow-2xl hover:shadow-teal-500/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
              <Check size={20} /> Accepter cette mission
            </button>
          )}
          {isActive && onUpdate && mission.status === "assigned" && (
            <button onClick={() => { onUpdate(mission.id, "in_progress"); onClose(); }}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-2xl font-black text-base hover:shadow-2xl transition-all flex items-center justify-center gap-2">
              <Play size={20} /> Commencer la mission
            </button>
          )}
          {isActive && onUpdate && mission.status === "in_progress" && (
            <button onClick={() => { onUpdate(mission.id, "completed"); onClose(); }}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-black text-base hover:shadow-2xl transition-all flex items-center justify-center gap-2">
              <CheckCircle2 size={20} /> Marquer comme terminee
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── STAT CARD ── */
function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: React.ReactNode; accent: string }) {
  return (
    <div className="relative bg-[#0f1729] border border-white/8 rounded-2xl p-5 overflow-hidden group hover:border-white/15 hover:scale-[1.02] transition-all duration-300">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 0% 0%, ${accent}15 0%, transparent 60%)` }} />
      <div className="relative">
        <div className="mb-3 opacity-80">{icon}</div>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
        <p className="text-white font-black text-2xl">{value}</p>
      </div>
    </div>
  );
}

/* ── MISSION CARD (disponibles) ── */
function MissionCard({ mission, onOpen }: { mission: Mission; onOpen: (m: Mission) => void }) {
  const earning = commissionEarnings(mission.total_price);
  const isNew = (Date.now() - new Date(mission.created_at).getTime()) < 3600000;
  return (
    <div onClick={() => onOpen(mission)}
      className="relative bg-[#0f1729] border border-white/8 rounded-2xl p-5 cursor-pointer group hover:border-teal-500/30 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(20,184,166,0.06) 0%, transparent 60%)" }} />
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "linear-gradient(rgba(20,184,166,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.3) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            {isNew && (
              <span className="text-xs text-teal-400 font-bold tracking-widest uppercase flex items-center gap-1 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" /> Nouveau
              </span>
            )}
            <p className="text-white font-black text-2xl">{earning} EUR</p>
            <p className="text-white/30 text-xs mt-0.5">sur {parseFloat(String(mission.total_price)).toFixed(2)} EUR</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${formulaBadgeClass(mission.formula)}`}>
            {formulaEmoji(mission.formula)} {formulaLabel(mission.formula)}
          </span>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <MapPin size={13} className="text-teal-500 flex-shrink-0" />
            <span className="truncate">{trimAddress(mission.pickup_address)}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Package size={13} className="text-teal-500 flex-shrink-0" />
              <span>{mission.weight} kg</span>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Calendar size={13} className="text-teal-500 flex-shrink-0" />
              <span>{formatDateFR(mission.pickup_date)}</span>
            </div>
          </div>
          {mission.pickup_slot && (
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Clock size={13} className="text-teal-500 flex-shrink-0" />
              <span>{mission.pickup_slot}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-white/6">
          <span className="text-white/20 text-xs">Cliquez pour les details</span>
          <div className="flex items-center gap-1 text-teal-400 text-xs font-bold group-hover:gap-2 transition-all">
            Accepter <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ACTIVE MISSION CARD ── */
function ActiveMissionCard({ mission, onOpen }: { mission: Mission; onOpen: (m: Mission) => void }) {
  const earning = commissionEarnings(mission.total_price);
  const isInProgress = mission.status === "in_progress";
  return (
    <div onClick={() => onOpen(mission)}
      className="relative bg-[#0f1729] border rounded-2xl p-5 cursor-pointer hover:border-white/20 transition-all overflow-hidden"
      style={{ borderColor: isInProgress ? "rgba(139,92,246,0.4)" : "rgba(59,130,246,0.3)" }}>
      <div className="absolute inset-0"
        style={{ background: isInProgress
          ? "radial-gradient(ellipse at 0% 0%, rgba(139,92,246,0.08) 0%, transparent 60%)"
          : "radial-gradient(ellipse at 0% 0%, rgba(59,130,246,0.06) 0%, transparent 60%)" }} />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${isInProgress ? "bg-purple-500/20" : "bg-blue-500/20"}`}>
            {isInProgress ? <Play size={20} className="text-purple-400" /> : <Package size={20} className="text-blue-400" />}
          </div>
          <div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold inline-block mb-1 ${isInProgress ? "bg-purple-500/20 text-purple-300" : "bg-blue-500/20 text-blue-300"}`}>
              {isInProgress ? "En cours" : "Assignee"}
            </span>
            <p className="text-white font-black text-lg">{earning} EUR</p>
            <p className="text-white/40 text-xs truncate max-w-[220px]">{trimAddress(mission.pickup_address)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white/30 text-xs mb-1">{mission.weight} kg</p>
          <ChevronRight size={18} className="text-white/20 ml-auto" />
        </div>
      </div>
    </div>
  );
}

/* ── MAIN ── */
export default function WasherDashboard() {
  const [stats, setStats] = useState<WasherStats>({ totalEarnings:0, completedOrders:0, pendingOrders:0, avgRating:0, totalRatings:0, weekEarnings:0 });
  const [availableMissions, setAvailableMissions] = useState<Mission[]>([]);
  const [myMissions, setMyMissions] = useState<Mission[]>([]);
  const [washerId, setWasherId] = useState<string|null>(null);
  const [washerStatus, setWasherStatus] = useState<WasherStatus>("pending");
  const [washerData, setWasherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"available"|"active"|"history">("available");
  const [isAvailable, setIsAvailable] = useState(true);
  const [fcmToken, setFcmToken] = useState<string|null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [stripeConnectStatus, setStripeConnectStatus] = useState<{ completed:boolean; onboardingUrl?:string }>({ completed:false });
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission|null>(null);
  const [modalMode, setModalMode] = useState<"available"|"active">("available");
  const [showMap, setShowMap] = useState(false);
  const [showAvailability, setShowAvailability] = useState(false);
  const [weightAdjustMission, setWeightAdjustMission] = useState<Mission|null>(null);
  const fetchLockRef = useRef(false);

  useEffect(() => {
    fetchWasherData();
    const t = setInterval(fetchWasherData, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const setup = async () => {
      try {
        const token = await requestNotificationPermission();
        if (token && washerId) {
          setFcmToken(token); setNotificationsEnabled(true);
          await supabase.from("washers").update({ fcm_token: token }).eq("id", washerId);
          toast.success("Notifications activees !", { duration: 2000 });
        }
      } catch(e) { console.error(e); }
    };
    if (washerStatus === "approved" && washerId && !fcmToken) setup();
  }, [washerId, washerStatus, fcmToken]);

  useEffect(() => {
    const check = async () => {
      if (!washerId || washerStatus !== "approved") return;
      try {
        const { data, error } = await supabase.functions.invoke("check-stripe-connect-status", { body: { washerId } });
        if (!error) setStripeConnectStatus({ completed: !!data?.completed, onboardingUrl: data?.onboardingUrl });
      } catch(e) { console.error(e); }
    };
    check();
  }, [washerId, washerStatus]);

  // Subscribe to realtime order notifications (FREE via Supabase)
  useEffect(() => {
    if (!washerId || washerStatus !== "approved" || !washerData?.postal_code) return;
    
    // Request browser notification permission
    requestBrowserNotif();
    
    // Subscribe to new orders in zone
    const unsubscribe = subscribeToZoneOrders(
      washerId,
      [washerData.postal_code],
      (newOrder) => {
        // Show browser notification
        showBrowserNotification(
          '🛒 Nouvelle commande !',
          `${newOrder.weight || '?'}kg - ${newOrder.total_price || '?'}€ à gagner`,
          '/icon-192x192.png'
        );
        // Show toast
        toast.success('Nouvelle commande disponible !', { duration: 5000 });
        // Refresh data
        fetchWasherData();
      }
    );
    
    return unsubscribe;
  }, [washerId, washerStatus, washerData?.postal_code]);

  const fetchWasherData = async () => {
    if (fetchLockRef.current) return;
    fetchLockRef.current = true;
    try {
      setRefreshing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Non authentifie"); setLoading(false); return; }
      const { data: wp, error: we } = await supabase.from("washers").select("*").eq("user_id", user.id).single();
      if (we || !wp) { toast.error("Profil Washer introuvable"); setLoading(false); return; }
      setWasherId(wp.id); setWasherStatus((wp.status||"pending") as WasherStatus);
      setIsAvailable(wp.is_available??true); setWasherData(wp);
      if (wp.fcm_token) { setFcmToken(wp.fcm_token); setNotificationsEnabled(true); }
      if (wp.status === "approved" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async pos => {
          try {
            const lat = pos.coords.latitude; const lng = pos.coords.longitude;
            if (wp.lat && wp.lng && calculateDistance(wp.lat, wp.lng, lat, lng) < 0.1) return;
            await supabase.from("washers").update({ lat, lng, last_location_update: new Date().toISOString() }).eq("id", wp.id);
          } catch(e) { console.error(e); }
        }, e => console.log("GPS refused:", e));
      }
      if (wp.status !== "approved") { setLoading(false); return; }
      const { data: available } = await supabase.from("orders").select("*").is("washer_id", null).is("partner_id", null).in("status", ["pending","confirmed"]).order("created_at", { ascending: false }).limit(20);
      setAvailableMissions((available||[]) as Mission[]);
      const { data: myOrders } = await supabase.from("orders").select("*").eq("washer_id", wp.id).order("created_at", { ascending: false });
      const missions = (myOrders||[]) as Mission[];
      setMyMissions(missions);
      const completed = missions.filter(o => o.status === "completed");
      const pending = missions.filter(o => o.status === "assigned" || o.status === "in_progress");
      const totalEarnings = completed.reduce((s,o) => s + safeNumber(o.total_price,0)*0.6, 0);
      const startWeek = startOfWeekMonday(new Date());
      const weekEarnings = completed.filter(o => { const t = o.completed_at||o.updated_at||o.created_at; return t ? new Date(t) >= startWeek : false; }).reduce((s,o) => s+safeNumber(o.total_price,0)*0.6, 0);
      setStats(prev => ({ ...prev, totalEarnings, completedOrders: completed.length, pendingOrders: pending.length, weekEarnings, avgRating: prev.avgRating||0, totalRatings: prev.totalRatings||0 }));
    } catch(e) { console.error(e); toast.error("Erreur de chargement"); }
    finally { setLoading(false); setRefreshing(false); fetchLockRef.current = false; }
  };

  const toggleAvailability = async () => {
    if (!washerId) return;
    if (!isAvailable && !stripeConnectStatus.completed) toast("Pensez a configurer votre compte bancaire", { duration: 4000 });
    try {
      const next = !isAvailable;
      await supabase.from("washers").update({ is_available: next }).eq("id", washerId);
      setIsAvailable(next);
      setWasherData((p: any) => p ? { ...p, is_available: next } : p);
      toast.success(next ? "Vous etes disponible" : "Vous etes indisponible");
    } catch { toast.error("Erreur"); }
  };

  const acceptMission = async (orderId: string) => {
    if (!washerId) return;
    if (!isAvailable) { toast.error("Activez votre disponibilite d'abord"); return; }
    try {
      const { error } = await supabase.from("orders").update({ washer_id: washerId, status: "assigned", assigned_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", orderId).is("washer_id", null);
      if (error) throw error;
      toast.success("Mission acceptee !");
      setActiveTab("active");
      fetchWasherData();
    } catch { toast.error("Mission deja prise ou erreur"); }
  };

  const updateMissionStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (!washerId) return;
    try {
      const updates: any = { status: newStatus, updated_at: new Date().toISOString() };
      if (newStatus === "completed") updates.completed_at = new Date().toISOString();
      const { error } = await supabase.from("orders").update(updates).eq("id", orderId).eq("washer_id", washerId);
      if (error) throw error;
      toast.success(newStatus === "completed" ? "Mission terminee !" : "Statut mis a jour !");
      fetchWasherData();
    } catch { toast.error("Erreur de mise a jour"); }
  };

  const handleStripeConnect = async () => {
    if (!washerId) return;
    try {
      toast.loading("Creation du compte...", { id: "stripe" });
      const { data: wi, error: wie } = await supabase.from("washers").select("full_name, email").eq("id", washerId).single();
      if (wie || !wi) throw wie;
      const names = String(wi.full_name||"").trim().split(" ").filter(Boolean);
      const { data, error } = await supabase.functions.invoke("create-stripe-connect-account", { body: { washerId, email: wi.email, firstName: names[0]||"Washer", lastName: names.slice(1).join(" ")||names[0]||"Washer" } });
      if (error) throw error;
      toast.dismiss("stripe");
      if (data?.onboardingUrl) { toast.success("Redirection..."); window.location.href = data.onboardingUrl; return; }
      setStripeConnectStatus({ completed: !!data?.onboardingCompleted });
      toast.success("Compte configure !");
    } catch(e: any) { toast.dismiss("stripe"); toast.error("Erreur: " + (e?.message||"inconnue")); }
  };

  const saveServiceRadius = async (r: number) => {
    if (!washerId) return;
    const { error } = await supabase.from("washers").update({ service_radius: r }).eq("id", washerId);
    if (error) { toast.error("Erreur mise a jour rayon"); return; }
    toast.success(`Rayon mis a jour: ${r} km`);
  };

  const saveSameCityOnly = async (checked: boolean) => {
    if (!washerId) return;
    const { error } = await supabase.from("washers").update({ accept_same_city_only: checked }).eq("id", washerId);
    if (!error) { setWasherData((p: any) => ({ ...p, accept_same_city_only: checked })); toast.success(checked ? `Limite a ${washerData?.city??"votre ville"}` : "Toutes villes acceptees"); }
    else toast.error("Erreur");
  };

  const activeMissions = useMemo(() => myMissions.filter(m => m.status === "assigned" || m.status === "in_progress"), [myMissions]);
  const historyMissions = useMemo(() => myMissions.filter(m => m.status === "completed"), [myMissions]);

  if (loading) return (
    <div className="min-h-screen bg-[#080e1d]">
      <Navbar />
      <WasherDashboardSkeleton />
    </div>
  );

  if (washerStatus === "pending") return (
    <div className="min-h-screen bg-[#080e1d]"><Navbar />
      <div className="pt-32 px-4 max-w-2xl mx-auto text-center">
        <div className="bg-[#0f1729] border border-white/10 rounded-3xl p-12">
          <Clock className="text-orange-400 mx-auto mb-6" size={64} />
          <h1 className="text-3xl font-black text-white mb-4">Validation en cours</h1>
          <p className="text-white/50 mb-6">Votre dossier est en cours de verification. Nous vous contacterons sous 24h.</p>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
            <p className="text-sm text-orange-300">En attendant : Procurez-vous un peson digital et de la lessive hypoallergenique.</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (washerStatus === "rejected") return (
    <div className="min-h-screen bg-[#080e1d]"><Navbar />
      <div className="pt-32 px-4 max-w-2xl mx-auto text-center">
        <div className="bg-[#0f1729] border border-white/10 rounded-3xl p-12">
          <AlertCircle className="text-red-400 mx-auto mb-6" size={64} />
          <h1 className="text-3xl font-black text-white mb-4">Inscription non validee</h1>
          <p className="text-white/50 mb-6">Votre candidature n'a pas pu etre acceptee.</p>
          <a href="mailto:support@kilolab.fr" className="text-teal-400 font-bold">support@kilolab.fr</a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080e1d]">
      <Navbar />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-teal-500/4 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-violet-500/4 rounded-full blur-3xl pointer-events-none" />

      {selectedMission && (
        <MissionModal
          mission={selectedMission}
          onClose={() => setSelectedMission(null)}
          onAccept={modalMode === "available" ? acceptMission : undefined}
          onUpdate={modalMode === "active" ? updateMissionStatus : undefined}
          isActive={modalMode === "active"}
          onWeightAdjust={(mission) => {
            setSelectedMission(null);
            setWeightAdjustMission(mission);
          }}
        />
      )}

      {/* Weight Adjustment Modal */}
      {weightAdjustMission && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <WeightAdjustment
            orderId={weightAdjustMission.id}
            currentWeight={weightAdjustMission.weight}
            clientId={weightAdjustMission.client_id || ''}
            onUpdate={(newWeight) => {
              fetchWasherData();
            }}
            onClose={() => setWeightAdjustMission(null)}
          />
        </div>
      )}

      <div className="pt-24 md:pt-28 px-4 max-w-6xl mx-auto pb-16">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-teal-400 text-xs font-bold tracking-widest uppercase">Dashboard Washer</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              {washerData?.first_name ? `Bonjour ${washerData.first_name}` : "Mon espace Washer"}
            </h1>
            <p className="text-white/40 text-sm mt-0.5">Gerez vos missions et vos revenus</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={fetchWasherData} disabled={refreshing}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold flex items-center gap-2 text-sm text-white/70 transition">
              <RefreshCcw size={15} className={refreshing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Rafraichir</span>
            </button>
            <div className={`px-3 py-2 rounded-xl flex items-center gap-2 ${notificationsEnabled ? "bg-green-500/10 border border-green-500/20" : "bg-orange-500/10 border border-orange-500/20"}`}>
              <Bell size={13} className={notificationsEnabled ? "text-green-400" : "text-orange-400"} />
              <span className={`text-xs font-bold ${notificationsEnabled ? "text-green-400" : "text-orange-400"}`}>
                {notificationsEnabled ? "Notifs ON" : "Notifs OFF"}
              </span>
            </div>
            <button onClick={toggleAvailability}
              className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all text-sm ${isAvailable ? "bg-teal-500 text-white hover:bg-teal-400 shadow-lg shadow-teal-500/25" : "bg-white/8 text-white/50 border border-white/10 hover:bg-white/15"}`}>
              <div className={`w-2 h-2 rounded-full ${isAvailable ? "bg-white animate-pulse" : "bg-white/30"}`} />
              {isAvailable ? "Disponible" : "Indisponible"}
            </button>
          </div>
        </div>

        {/* ALERTES */}
        {!isAvailable && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 mb-4 flex items-center gap-3">
            <AlertCircle className="text-orange-400 flex-shrink-0" size={18} />
            <p className="text-orange-300 text-sm font-medium">Vous etes indisponible. Activez votre disponibilite pour recevoir des missions.</p>
          </div>
        )}
        {!notificationsEnabled && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-4 flex items-center gap-3">
            <Bell className="text-blue-400 flex-shrink-0" size={18} />
            <p className="text-blue-300 text-sm font-medium">Notifications desactivees. Rechargez la page pour les activer.</p>
          </div>
        )}

        {/* STRIPE */}
        {!stripeConnectStatus.completed ? (
          <div className="relative bg-[#0f1729] border border-purple-500/20 rounded-3xl p-6 md:p-8 mb-8 overflow-hidden">
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 0% 50%, rgba(139,92,246,0.12) 0%, transparent 65%)" }} />
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(139,92,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.4) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="relative flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-purple-500/30">
                <CreditCard size={22} className="text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-1">Paiements</p>
                <h3 className="text-white font-black text-xl mb-2">Configurez vos virements automatiques</h3>
                <p className="text-white/40 text-sm mb-4">Connectez votre IBAN pour recevoir vos gains chaque dimanche.</p>
                <button onClick={handleStripeConnect}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/25 transition flex items-center gap-2 text-sm">
                  <ArrowRight size={16} /> Configurer mes paiements
                </button>
                <p className="text-xs text-white/25 mt-3">Tant que Stripe n'est pas configure, vous ne pouvez pas activer "Disponible".</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <CreditCard className="text-green-400" size={18} />
            </div>
            <div>
              <p className="font-bold text-green-300 text-sm">Compte bancaire connecte</p>
              <p className="text-green-400/60 text-xs">Virements chaque dimanche soir</p>
            </div>
          </div>
        )}

        {/* PREFERENCES */}
        {washerData && (
          <div className="relative bg-[#0f1729] border border-white/8 rounded-3xl p-6 mb-8 overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(20,184,166,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.3) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Settings size={18} className="text-teal-500" />
                  <h3 className="text-white font-bold">Mes preferences</h3>
                </div>
                <button
                  onClick={() => setShowAvailability(true)}
                  className="px-4 py-2 bg-teal-500/20 text-teal-400 rounded-xl font-bold text-sm hover:bg-teal-500/30 transition flex items-center gap-2"
                >
                  <Plane size={16} />
                  Gérer mes disponibilités
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-3">
                    Rayon d'action : <span className="text-teal-400">{washerData.service_radius||5} km</span>
                  </label>
                  <input type="range" min="1" max="50" step="1" value={washerData.service_radius||5}
                    onChange={e => setWasherData((p: any) => ({ ...p, service_radius: parseInt(e.target.value,10) }))}
                    onMouseUp={e => saveServiceRadius(parseInt((e.target as HTMLInputElement).value,10))}
                    onTouchEnd={e => saveServiceRadius(parseInt((e.target as HTMLInputElement).value,10))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500" />
                  <div className="flex justify-between text-xs text-white/30 mt-2">
                    <span>1 km</span><span>25 km</span><span>50 km</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2">Zone d'intervention</label>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={!!washerData.accept_same_city_only} onChange={e => saveSameCityOnly(e.target.checked)} className="w-4 h-4 accent-teal-500 cursor-pointer" />
                    <span className="text-sm text-white/50">Uniquement {washerData.city}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/8">
                  <label className="block text-sm font-bold text-white/60 mb-2">Notifications email</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={washerData.email_notifications !== false}
                      onChange={async (e) => {
                        const checked = e.target.checked;
                        const { error } = await supabase.from("washers").update({ email_notifications: checked }).eq("id", washerId);
                        if (!error) {
                          setWasherData((p: any) => ({ ...p, email_notifications: checked }));
                          toast.success(checked ? "Notifications email activees" : "Notifications email desactivees");
                        }
                      }}
                      className="w-4 h-4 accent-teal-500 cursor-pointer" 
                    />
                    <span className="text-sm text-white/50">Recevoir un email pour chaque nouvelle commande proche</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AVAILABILITY MODAL */}
        {showAvailability && washerId && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl bg-[#0a0f1a] rounded-3xl border border-white/10 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#0a0f1a] p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Plane className="text-teal-500" size={24} />
                  Gérer mes disponibilités
                </h2>
                <button
                  onClick={() => setShowAvailability(false)}
                  className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6">
                <WasherAvailability washerId={washerId} />
              </div>
            </div>
          </div>
        )}

        {/* STATS */}
        <FadeInOnScroll direction="up" delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <StatCard icon={<DollarSign className="text-green-400" size={24} />} label="Gains totaux" value={<CountUp end={Math.round(stats.totalEarnings)} suffix=" EUR" duration={1500} />} accent="#22c55e" />
            <StatCard icon={<TrendingUp className="text-teal-400" size={24} />} label="Cette semaine" value={<CountUp end={Math.round(stats.weekEarnings)} suffix=" EUR" duration={1500} />} accent="#14b8a6" />
            <StatCard icon={<Package className="text-blue-400" size={24} />} label="Terminees" value={<CountUp end={stats.completedOrders} duration={1500} />} accent="#3b82f6" />
            <StatCard icon={<Clock className="text-orange-400" size={24} />} label="En cours" value={<CountUp end={stats.pendingOrders} duration={1500} />} accent="#f97316" />
          </div>
        </FadeInOnScroll>

        {/* MAP VIEW TOGGLE */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Package size={20} className="text-teal-500" />
            Missions disponibles
          </h2>
          <button
            onClick={() => setShowMap(!showMap)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition ${
              showMap 
                ? 'bg-teal-500 text-white' 
                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20'
            }`}
          >
            <Map size={16} />
            {showMap ? 'Masquer la carte' : 'Voir la carte'}
          </button>
        </div>

        {/* MAP SECTION */}
        {showMap && (
          <div className="mb-8 h-[400px] rounded-2xl overflow-hidden border border-white/10">
            <Suspense fallback={
              <div className="h-full bg-slate-800 flex items-center justify-center">
                <Loader2 className="animate-spin text-teal-500" size={32} />
              </div>
            }>
              <OrdersMap
                orders={availableMissions.map(m => ({
                  id: m.id,
                  pickup_address: m.pickup_address,
                  city: m.pickup_address?.split(',').pop()?.trim(),
                  lat: m.pickup_lat || undefined,
                  lng: m.pickup_lng || undefined,
                  weight: m.weight,
                  total_price: m.total_price,
                  formula: m.formula
                }))}
                washerLocation={washerData?.lat && washerData?.lng ? {
                  lat: washerData.lat,
                  lng: washerData.lng,
                  maxDistance: washerData.service_radius || 10
                } : null}
                onOrderClick={(order) => {
                  const mission = availableMissions.find(m => m.id === order.id);
                  if (mission) {
                    setSelectedMission(mission);
                    setModalMode("available");
                  }
                }}
              />
            </Suspense>
          </div>
        )}

        {/* TABS */}
        <div className="flex gap-1 mb-6 bg-white/5 border border-white/8 rounded-2xl p-1">
          {([["available","Disponibles",availableMissions.length],["active","En cours",activeMissions.length],["history","Historique",historyMissions.length]] as const).map(([key,label,count]) => (
            <button key={key} onClick={() => setActiveTab(key as any)}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-sm transition-all ${activeTab === key ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20" : "text-white/40 hover:text-white/70"}`}>
              {label} ({count})
            </button>
          ))}
        </div>

        {/* TAB DISPONIBLES */}
        {activeTab === "available" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableMissions.map(m => (
              <MissionCard key={m.id} mission={m} onOpen={mission => { setSelectedMission(mission); setModalMode("available"); }} />
            ))}
            {availableMissions.length === 0 && (
              <div className="col-span-full bg-[#0f1729] border border-white/8 rounded-2xl py-16 text-center">
                <Package size={40} className="mx-auto mb-4 text-white/15" />
                <p className="text-white/30 font-bold text-lg mb-2">Aucune mission disponible</p>
                <p className="text-white/20 text-sm">Les nouvelles commandes apparaitront ici automatiquement</p>
                <p className="text-white/15 text-xs mt-3">Mise a jour toutes les 30s</p>
              </div>
            )}
          </div>
        )}

        {/* TAB ACTIVES */}
        {activeTab === "active" && (
          <div className="space-y-3">
            {activeMissions.map(m => (
              <ActiveMissionCard key={m.id} mission={m} onOpen={mission => { setSelectedMission(mission); setModalMode("active"); }} />
            ))}
            {activeMissions.length === 0 && (
              <div className="bg-[#0f1729] border border-white/8 rounded-2xl py-16 text-center">
                <Clock size={40} className="mx-auto mb-4 text-white/15" />
                <p className="text-white/30 font-bold text-lg mb-2">Aucune mission active</p>
                <p className="text-white/20 text-sm">Acceptez des missions depuis l'onglet Disponibles</p>
              </div>
            )}
          </div>
        )}

        {/* TAB HISTORIQUE - Improved with earnings breakdown */}
        {activeTab === "history" && (
          <div className="space-y-6">
            {/* Earnings Summary */}
            {historyMissions.length > 0 && (
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-bold text-sm uppercase tracking-wide mb-4">Résumé des gains</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <p className="text-white/40 text-xs mb-1">Cette semaine</p>
                    <p className="text-green-400 font-black text-xl">{stats.weekEarnings.toFixed(2)} €</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <p className="text-white/40 text-xs mb-1">Ce mois</p>
                    <p className="text-green-400 font-black text-xl">
                      {historyMissions
                        .filter(m => {
                          const d = new Date(m.completed_at || m.created_at);
                          const now = new Date();
                          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                        })
                        .reduce((s, m) => s + safeNumber(m.total_price, 0) * 0.6, 0)
                        .toFixed(2)} €
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <p className="text-white/40 text-xs mb-1">Missions totales</p>
                    <p className="text-white font-black text-xl">{historyMissions.length}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <p className="text-white/40 text-xs mb-1">Gain moyen</p>
                    <p className="text-white font-black text-xl">
                      {historyMissions.length > 0
                        ? (historyMissions.reduce((s, m) => s + safeNumber(m.total_price, 0) * 0.6, 0) / historyMissions.length).toFixed(2)
                        : 0} €
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Monthly breakdown */}
            {historyMissions.length > 0 && (
              <div className="bg-[#0f1729] border border-white/8 rounded-2xl p-5">
                <h3 className="text-white/60 font-bold text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Calendar size={16} className="text-teal-500" /> Historique par mois
                </h3>
                {(() => {
                  // Group missions by month
                  const grouped = historyMissions.reduce((acc, m) => {
                    const d = new Date(m.completed_at || m.created_at);
                    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                    const label = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
                    if (!acc[key]) acc[key] = { label, missions: [], total: 0 };
                    acc[key].missions.push(m);
                    acc[key].total += safeNumber(m.total_price, 0) * 0.6;
                    return acc;
                  }, {} as Record<string, { label: string; missions: Mission[]; total: number }>);

                  return Object.entries(grouped)
                    .sort((a, b) => b[0].localeCompare(a[0]))
                    .slice(0, 6)
                    .map(([key, { label, missions, total }]) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-white font-bold capitalize">{label}</p>
                          <p className="text-white/30 text-xs">{missions.length} mission(s)</p>
                        </div>
                        <p className="text-green-400 font-black text-lg">+{total.toFixed(2)} €</p>
                      </div>
                    ));
                })()}
              </div>
            )}

            {/* Mission list */}
            <div>
              <h3 className="text-white/60 font-bold text-sm uppercase tracking-wide mb-3">Détail des missions</h3>
              <div className="space-y-3">
                {historyMissions.map(m => (
                  <div key={m.id} className="bg-[#0f1729] border border-white/8 rounded-2xl p-5 hover:border-green-500/20 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 size={18} className="text-green-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-green-400 font-black text-lg">+{commissionEarnings(m.total_price)} EUR</p>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-bold">Payé</span>
                          </div>
                          <p className="text-white/30 text-xs">{formatDateFR(m.completed_at||m.created_at)} · {m.weight} kg · {formulaLabel(m.formula)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white/20 text-xs">#{m.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-white/15 text-xs truncate max-w-[120px]">{trimAddress(m.pickup_address)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {historyMissions.length === 0 && (
              <div className="bg-[#0f1729] border border-white/8 rounded-2xl py-16 text-center">
                <TrendingUp size={40} className="mx-auto mb-4 text-white/15" />
                <p className="text-white/30 font-bold text-lg mb-2">Pas encore d'historique</p>
                <p className="text-white/20 text-sm">Vos missions terminees apparaitront ici</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-10 text-center text-xs text-white/15">
          Derniere actualisation : {new Date().toLocaleTimeString("fr-FR")} · Mise a jour auto toutes les 30s
        </div>
      </div>
    </div>
  );
}
