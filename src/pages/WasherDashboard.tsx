import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { requestNotificationPermission } from "../lib/firebase";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import {
  DollarSign,
  Package,
  Clock,
  MapPin,
  Check,
  TrendingUp,
  Loader2,
  AlertCircle,
  Bell,
  Calendar,
  ArrowRight,
  Settings,
  CreditCard,
  RefreshCcw,
  Play,
  CheckCircle2,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type WasherStatus = "pending" | "approved" | "rejected";

interface WasherStats {
  totalEarnings: number;
  completedOrders: number;
  pendingOrders: number;
  avgRating: number;
  totalRatings: number;
  weekEarnings: number;
}

type OrderStatus = "confirmed" | "assigned" | "in_progress" | "completed" | string;

interface Mission {
  id: string;
  client_id?: string | null;

  weight: number;
  formula: string;
  total_price: number;

  status: OrderStatus;

  pickup_address: string;
  pickup_date: string;
  pickup_slot?: string | null;

  pickup_lat?: number | null;
  pickup_lng?: number | null;

  created_at: string;
  updated_at?: string | null;
  assigned_at?: string | null;
  completed_at?: string | null;

  washer_id?: string | null;
  partner_id?: string | null;
}

/* =========================================================
   HELPERS
========================================================= */

// Distance Haversine (km)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function startOfWeekMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay(); // 0 Sunday, 1 Monday...
  const diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function safeNumber(v: any, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function formatDateFR(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR");
  } catch {
    return iso;
  }
}

function trimAddress(addr?: string | null) {
  if (!addr) return "Adresse non définie";
  return addr.split(" (")[0];
}

function commissionEarnings(total_price: any, commission = 0.6) {
  const total = safeNumber(total_price, 0);
  return (total * commission).toFixed(2);
}

/* =========================================================
   UI SMALL COMPONENTS
========================================================= */

function StatCard(props: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  valueClassName?: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-lg transition">
      <div className="mb-4">{props.icon}</div>
      <p className="text-slate-500 text-sm font-bold">{props.label}</p>
      <p className={`text-3xl font-black ${props.valueClassName ?? ""}`}>{props.value}</p>
    </div>
  );
}

function TabButton(props: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={props.onClick}
      className={`pb-3 px-4 font-bold whitespace-nowrap transition ${
        props.active ? "text-teal-600 border-b-2 border-teal-600" : "text-slate-400 hover:text-slate-600"
      }`}
      type="button"
    >
      {props.children}
    </button>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function WasherDashboard() {
  // Stats
  const [stats, setStats] = useState<WasherStats>({
    totalEarnings: 0,
    completedOrders: 0,
    pendingOrders: 0,
    avgRating: 0,
    totalRatings: 0,
    weekEarnings: 0,
  });

  // Missions
  const [availableMissions, setAvailableMissions] = useState<Mission[]>([]);
  const [myMissions, setMyMissions] = useState<Mission[]>([]);

  // Washer state
  const [washerId, setWasherId] = useState<string | null>(null);
  const [washerStatus, setWasherStatus] = useState<WasherStatus>("pending");
  const [washerData, setWasherData] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"available" | "active" | "history">("available");

  const [isAvailable, setIsAvailable] = useState(true);

  // Notifications
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Stripe
  const [stripeConnectStatus, setStripeConnectStatus] = useState<{
    completed: boolean;
    onboardingUrl?: string;
  }>({ completed: false });

  // UI helper
  const [refreshing, setRefreshing] = useState(false);

  /* =========================================================
     AUTO REFRESH
  ========================================================= */

  useEffect(() => {
    fetchWasherData();
    const interval = setInterval(fetchWasherData, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================================================
     PUSH NOTIFICATIONS (FCM)
  ========================================================= */

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        console.log("🔔 Setup notifications...");

        const token = await requestNotificationPermission();

        if (token && washerId) {
          setFcmToken(token);
          setNotificationsEnabled(true);

          const { error } = await supabase.from("washers").update({ fcm_token: token }).eq("id", washerId);

          if (error) {
            console.error("❌ Error saving FCM token:", error);
          } else {
            console.log("✅ FCM token saved");
            toast.success("🔔 Notifications activées !", { duration: 2000 });
          }
        }
      } catch (e) {
        console.error("Notification setup error:", e);
      }
    };

    if (washerStatus === "approved" && washerId && !fcmToken) {
      setupNotifications();
    }
  }, [washerId, washerStatus, fcmToken]);

  /* =========================================================
     CHECK STRIPE CONNECT STATUS
  ========================================================= */

  useEffect(() => {
    const checkStripeConnect = async () => {
      if (!washerId || washerStatus !== "approved") return;

      try {
        const { data, error } = await supabase.functions.invoke("check-stripe-connect-status", {
          body: { washerId },
        });

        if (error) throw error;

        setStripeConnectStatus({
          completed: !!data?.completed,
          onboardingUrl: data?.onboardingUrl,
        });
      } catch (err) {
        console.error("Stripe status check error:", err);
      }
    };

    checkStripeConnect();
  }, [washerId, washerStatus]);

  /* =========================================================
     FETCH WASHER DATA + MISSIONS
  ========================================================= */

  const fetchWasherData = async () => {
    try {
      setRefreshing(true);

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) console.error(authError);

      const user = authData?.user;
      if (!user) {
        toast.error("Non authentifié");
        setLoading(false);
        return;
      }

      // Fetch washer profile
      const { data: washerProfile, error: washerError } = await supabase
        .from("washers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (washerError || !washerProfile) {
        console.error("Washer profile error:", washerError);
        toast.error("Profil Washer introuvable");
        setLoading(false);
        return;
      }

      setWasherId(washerProfile.id);
      setWasherStatus((washerProfile.status || "pending") as WasherStatus);
      setIsAvailable(washerProfile.is_available ?? true);
      setWasherData(washerProfile);

      if (washerProfile.fcm_token) {
        setFcmToken(washerProfile.fcm_token);
        setNotificationsEnabled(true);
      }

      // GEOLOCATION (approved only)
      if (washerProfile.status === "approved" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const newLat = position.coords.latitude;
              const newLng = position.coords.longitude;

              if (washerProfile.lat && washerProfile.lng) {
                const dist = calculateDistance(washerProfile.lat, washerProfile.lng, newLat, newLng);
                if (dist < 0.1) return; // < 100m no update
              }

              await supabase
                .from("washers")
                .update({
                  lat: newLat,
                  lng: newLng,
                  last_location_update: new Date().toISOString(),
                })
                .eq("id", washerProfile.id);

              console.log("📍 GPS position updated");
            } catch (e) {
              console.error("GPS update error:", e);
            }
          },
          (error) => {
            console.log("⚠️ Geolocation refused:", error);
          }
        );
      }

      // If not approved: stop here (but keep UI for pending/rejected)
      if (washerProfile.status !== "approved") {
        setLoading(false);
        return;
      }

      // Available missions
      const { data: available, error: availableError } = await supabase
        .from("orders")
        .select("*")
        .is("washer_id", null)
        .is("partner_id", null)
        .eq("status", "confirmed")
        .order("created_at", { ascending: false })
        .limit(20);

      if (availableError) console.error("Available missions error:", availableError);
      setAvailableMissions((available || []) as Mission[]);

      // My missions
      const { data: myOrders, error: myOrdersError } = await supabase
        .from("orders")
        .select("*")
        .eq("washer_id", washerProfile.id)
        .order("created_at", { ascending: false });

      if (myOrdersError) console.error("My missions error:", myOrdersError);

      const missions = (myOrders || []) as Mission[];
      setMyMissions(missions);

      // Stats compute
      const completed = missions.filter((o) => o.status === "completed");
      const pending = missions.filter((o) => o.status === "assigned" || o.status === "in_progress");

      const totalEarnings = completed.reduce((sum, o) => sum + safeNumber(o.total_price, 0) * 0.6, 0);

      const startWeek = startOfWeekMonday(new Date());
      const weekEarnings = completed
        .filter((o) => {
          const t = o.completed_at || o.updated_at || o.created_at;
          return t ? new Date(t) >= startWeek : false;
        })
        .reduce((sum, o) => sum + safeNumber(o.total_price, 0) * 0.6, 0);

      setStats((prev) => ({
        ...prev,
        totalEarnings,
        completedOrders: completed.length,
        pendingOrders: pending.length,
        weekEarnings,
        // rating not implemented here, kept for compatibility
        avgRating: prev.avgRating || 0,
        totalRatings: prev.totalRatings || 0,
      }));
    } catch (error) {
      console.error("fetchWasherData error:", error);
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =========================================================
     ACTIONS
  ========================================================= */

  const toggleAvailability = async () => {
    // Stripe required when switching from OFF -> ON
    if (!isAvailable && !stripeConnectStatus.completed) {
      toast.error("⚠️ Configurez d'abord votre compte bancaire pour recevoir vos paiements");
      return;
    }

    try {
      const next = !isAvailable;
      const { error } = await supabase.from("washers").update({ is_available: next }).eq("id", washerId);

      if (error) throw error;

      setIsAvailable(next);
      setWasherData((prev: any) => (prev ? { ...prev, is_available: next } : prev));
      toast.success(next ? "Vous êtes maintenant disponible" : "Vous êtes maintenant indisponible");
    } catch (error) {
      console.error("toggleAvailability error:", error);
      toast.error("Erreur");
    }
  };

  const acceptMission = async (orderId: string) => {
    if (!isAvailable) {
      toast.error("Activez votre disponibilité d’abord");
      return;
    }

    try {
      const { error } = await supabase
        .from("orders")
        .update({
          washer_id: washerId,
          status: "assigned",
          assigned_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)
        .is("washer_id", null);

      if (error) throw error;

      toast.success("Mission acceptée ! 🎉");
      fetchWasherData();
    } catch (error) {
      console.error("acceptMission error:", error);
      toast.error("Mission déjà prise ou erreur");
    }
  };

  const updateMissionStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updates: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (newStatus === "completed") {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase.from("orders").update(updates).eq("id", orderId).eq("washer_id", washerId);

      if (error) throw error;

      toast.success(newStatus === "completed" ? "Mission terminée ! 🎉" : "Statut mis à jour !");
      fetchWasherData();
    } catch (error) {
      console.error("updateMissionStatus error:", error);
      toast.error("Erreur de mise à jour");
    }
  };

  // Stripe Connect onboarding
  const handleStripeConnect = async () => {
    try {
      toast.loading("Création de votre compte de paiement…", { id: "stripe" });

      const { data: washerInfo, error: washerInfoError } = await supabase
        .from("washers")
        .select("full_name, email")
        .eq("id", washerId)
        .single();

      if (washerInfoError) throw washerInfoError;
      if (!washerInfo) throw new Error("Washer introuvable");

      const names = String(washerInfo.full_name || "").trim().split(" ").filter(Boolean);
      const firstName = names[0] || "Washer";
      const lastName = names.slice(1).join(" ") || firstName;

      const { data, error } = await supabase.functions.invoke("create-stripe-connect-account", {
        body: {
          washerId,
          email: washerInfo.email,
          firstName,
          lastName,
        },
      });

      if (error) throw error;

      toast.dismiss("stripe");

      if (data?.onboardingUrl) {
        toast.success("Redirection vers Stripe...");
        window.location.href = data.onboardingUrl;
        return;
      }

      // If no onboardingUrl, assume already configured
      setStripeConnectStatus({ completed: !!data?.onboardingCompleted });
      toast.success("Compte déjà configuré !");
    } catch (error: any) {
      console.error("handleStripeConnect error:", error);
      toast.dismiss("stripe");
      toast.error("Erreur : " + (error?.message || "inconnue"));
    }
  };

  /* =========================================================
     DERIVED LISTS
  ========================================================= */

  const activeMissions = useMemo(
    () => myMissions.filter((m) => m.status === "assigned" || m.status === "in_progress"),
    [myMissions]
  );

  const historyMissions = useMemo(() => myMissions.filter((m) => m.status === "completed"), [myMissions]);

  /* =========================================================
     UI STATES (loading / pending / rejected)
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-teal-600 mx-auto mb-4" size={48} />
          <p className="text-slate-600 font-medium">Chargement de votre dashboard…</p>
        </div>
      </div>
    );
  }

  if (washerStatus === "pending") {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-32 px-4 max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm border">
            <Clock className="text-orange-600 mx-auto mb-6" size={64} />
            <h1 className="text-3xl font-black mb-4">Validation en cours ⏳</h1>
            <p className="text-slate-600 mb-6">
              Votre dossier est en cours de vérification par notre équipe. Nous vous contacterons sous 24h.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm text-orange-800">
                <strong>En attendant :</strong> Procurez-vous un peson digital (~10€) et de la lessive hypoallergénique.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (washerStatus === "rejected") {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-32 px-4 max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm border">
            <AlertCircle className="text-red-600 mx-auto mb-6" size={64} />
            <h1 className="text-3xl font-black mb-4">Inscription non validée</h1>
            <p className="text-slate-600 mb-6">Votre candidature n’a pas pu être acceptée.</p>
            <p className="text-sm text-slate-500">
              Contactez-nous à{" "}
              <a href="mailto:support@kilolab.fr" className="text-teal-600 font-bold">
                support@kilolab.fr
              </a>{" "}
              pour plus d’informations.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN DASHBOARD UI (approved)
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="pt-32 px-4 max-w-7xl mx-auto pb-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black mb-2">Mon Dashboard Washer</h1>
            <p className="text-slate-600">Gérez vos missions et vos revenus</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Refresh */}
            <button
              type="button"
              onClick={fetchWasherData}
              className="px-4 py-3 rounded-xl border bg-white hover:bg-slate-50 font-bold flex items-center gap-2"
              disabled={refreshing}
              title="Rafraîchir"
            >
              <RefreshCcw size={18} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Actualisation..." : "Rafraîchir"}
            </button>

            {/* Notifications */}
            {notificationsEnabled ? (
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                <Bell size={16} className="text-green-600" />
                <span className="text-sm font-bold text-green-700">Notifs ON</span>
              </div>
            ) : (
              <div className="px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-2">
                <Bell size={16} className="text-orange-600" />
                <span className="text-sm font-bold text-orange-700">Notifs OFF</span>
              </div>
            )}

            {/* Availability */}
            <button
              type="button"
              onClick={toggleAvailability}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 ${
                isAvailable ? "bg-green-500 text-white hover:bg-green-600 shadow-lg" : "bg-slate-300 text-slate-600 hover:bg-slate-400"
              }`}
            >
              <div className={`w-3 h-3 rounded-full animate-pulse ${isAvailable ? "bg-white" : "bg-slate-500"}`} />
              {isAvailable ? "Disponible" : "Indisponible"}
            </button>
          </div>
        </div>

        {/* ALERTES */}
        {!isAvailable && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-orange-600 shrink-0" size={20} />
            <p className="text-orange-800 font-medium">
              Vous êtes indisponible. Activez votre disponibilité pour recevoir des missions.
            </p>
          </div>
        )}

        {!notificationsEnabled && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-blue-600 shrink-0" size={20} />
            <p className="text-blue-800 font-medium">
              Les notifications sont désactivées. Rechargez la page et autorisez les notifications pour être alerté des nouvelles missions.
            </p>
          </div>
        )}

        {/* STRIPE SECTION */}
        {!stripeConnectStatus.completed ? (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-3xl mb-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <CreditCard size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black mb-2">Configurez vos virements automatiques</h3>
                <p className="text-purple-100 mb-6">
                  Connectez votre compte bancaire pour recevoir vos paiements automatiquement chaque dimanche soir.
                </p>
                <button
                  type="button"
                  onClick={handleStripeConnect}
                  className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition shadow-lg flex items-center gap-2"
                >
                  <ArrowRight size={20} />
                  Configurer mes paiements
                </button>
                <p className="text-xs text-white/80 mt-3">
                  ⚠️ Tant que Stripe n’est pas configuré, vous ne pouvez pas activer “Disponible”.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border-2 border-green-200 p-6 rounded-2xl mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CreditCard className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-green-900">Compte bancaire connecté ✅</h3>
                <p className="text-sm text-green-700">Vos virements seront effectués chaque dimanche soir.</p>
              </div>
            </div>
          </div>
        )}

        {/* PREFERENCES */}
        {washerData && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Settings size={24} className="text-teal-600" />
              <h3 className="text-xl font-bold">⚙️ Mes préférences</h3>
            </div>

            <div className="space-y-6">
              {/* Rayon */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Rayon d'action :{" "}
                  <span className="text-teal-600">{washerData.service_radius || 5} km</span>
                </label>

                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={washerData.service_radius || 5}
                  onChange={async (e) => {
                    const newRadius = parseInt(e.target.value, 10);

                    const { error } = await supabase
                      .from("washers")
                      .update({ service_radius: newRadius })
                      .eq("id", washerId);

                    if (!error) {
                      setWasherData((prev: any) => ({ ...prev, service_radius: newRadius }));
                      toast.success(`Rayon mis à jour : ${newRadius} km`);
                    } else {
                      toast.error("Erreur mise à jour rayon");
                    }
                  }}
                  className="w-full h-3 bg-teal-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>1 km (hyper local)</span>
                  <span>25 km</span>
                  <span>50 km (large zone)</span>
                </div>
              </div>

              {/* Same city only */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Zone d'intervention
                </label>
                <div className="flex items-center gap-3 text-slate-600">
                  <input
                    type="checkbox"
                    checked={!!washerData.accept_same_city_only}
                    onChange={async (e) => {
                      const checked = e.target.checked;

                      const { error } = await supabase
                        .from("washers")
                        .update({ accept_same_city_only: checked })
                        .eq("id", washerId);

                      if (!error) {
                        setWasherData((prev: any) => ({ ...prev, accept_same_city_only: checked }));
                        toast.success(checked ? `✅ Limité à ${washerData.city}` : "✅ Toutes villes acceptées");
                      } else {
                        toast.error("Erreur mise à jour préférence");
                      }
                    }}
                    className="w-5 h-5 accent-teal-600 cursor-pointer"
                  />
                  <span>Uniquement ma ville ({washerData.city})</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Si activé, seules les commandes de votre ville seront proposées (à utiliser si vous voulez rester local).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<DollarSign className="text-green-600" size={32} />}
            label="Gains totaux"
            value={`${stats.totalEarnings.toFixed(2)} €`}
            valueClassName="text-green-600"
          />
          <StatCard
            icon={<TrendingUp className="text-teal-600" size={32} />}
            label="Cette semaine"
            value={`${stats.weekEarnings.toFixed(2)} €`}
            valueClassName="text-teal-600"
          />
          <StatCard
            icon={<Package className="text-blue-600" size={32} />}
            label="Missions terminées"
            value={stats.completedOrders}
            valueClassName="text-blue-600"
          />
          <StatCard
            icon={<Clock className="text-orange-600" size={32} />}
            label="En cours"
            value={stats.pendingOrders}
            valueClassName="text-orange-600"
          />
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-6 border-b overflow-x-auto">
          <TabButton active={activeTab === "available"} onClick={() => setActiveTab("available")}>
            📦 Disponibles ({availableMissions.length})
          </TabButton>
          <TabButton active={activeTab === "active"} onClick={() => setActiveTab("active")}>
            🔄 Mes missions ({activeMissions.length})
          </TabButton>
          <TabButton active={activeTab === "history"} onClick={() => setActiveTab("history")}>
            ✅ Historique ({historyMissions.length})
          </TabButton>
        </div>

        {/* TAB: DISPONIBLES */}
        {activeTab === "available" && (
          <div className="grid md:grid-cols-3 gap-6">
            {availableMissions.map((mission) => (
              <div
                key={mission.id}
                className="bg-white rounded-2xl p-6 border hover:shadow-xl transition-all transform hover:scale-[1.02]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Vous gagnez</p>
                    <p className="font-bold text-3xl text-teal-600">
                      {commissionEarnings(mission.total_price)}€
                    </p>
                  </div>

                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      mission.formula === "express" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {mission.formula === "express" ? "⚡ Express" : "🟢 Standard"}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">{trimAddress(mission.pickup_address)}</span>
                  </p>

                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Package size={14} className="shrink-0" />
                    {mission.weight} kg
                  </p>

                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Calendar size={14} className="shrink-0" />
                    {formatDateFR(mission.pickup_date)}
                  </p>

                  {mission.pickup_slot && (
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Clock size={14} className="shrink-0" />
                      {mission.pickup_slot}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => acceptMission(mission.id)}
                  disabled={!isAvailable}
                  className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl font-bold hover:from-teal-500 hover:to-teal-400 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  <Check size={20} />
                  Accepter la mission
                </button>

                {!stripeConnectStatus.completed && (
                  <p className="text-xs text-slate-500 mt-3">
                    ⚠️ Stripe non configuré : vous ne pourrez pas passer “Disponible”.
                  </p>
                )}
              </div>
            ))}

            {availableMissions.length === 0 && (
              <div className="col-span-3 text-center py-20 bg-white rounded-2xl border">
                <Package size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="font-bold text-slate-400 text-lg mb-2">Aucune mission disponible pour le moment</p>
                <p className="text-sm text-slate-400">Les nouvelles commandes apparaîtront ici automatiquement</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: MES MISSIONS */}
        {activeTab === "active" && (
          <div className="space-y-4">
            {activeMissions.map((mission) => (
              <div key={mission.id} className="bg-white rounded-2xl p-6 border hover:shadow-lg transition">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <p className="font-bold text-2xl text-teal-600">{commissionEarnings(mission.total_price)}€</p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          mission.status === "assigned"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {mission.status === "assigned" ? "📦 Nouvelle mission" : "🔄 En cours"}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-2 text-sm text-slate-600">
                      <p className="flex items-center gap-2">
                        <MapPin size={14} />
                        {trimAddress(mission.pickup_address)}
                      </p>
                      <p className="flex items-center gap-2">
                        <Package size={14} />
                        {mission.weight} kg • {mission.formula === "express" ? "⚡ Express" : "🟢 Standard"}
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar size={14} />
                        {formatDateFR(mission.pickup_date)}
                      </p>
                      {mission.pickup_slot && (
                        <p className="flex items-center gap-2">
                          <Clock size={14} />
                          {mission.pickup_slot}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    {mission.status === "assigned" && (
                      <button
                        type="button"
                        onClick={() => updateMissionStatus(mission.id, "in_progress")}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500 whitespace-nowrap transition flex items-center justify-center gap-2"
                      >
                        <Play size={18} />
                        Commencer
                      </button>
                    )}

                    {mission.status === "in_progress" && (
                      <button
                        type="button"
                        onClick={() => updateMissionStatus(mission.id, "completed")}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 whitespace-nowrap transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={18} />
                        Terminer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {activeMissions.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border">
                <Clock size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="font-bold text-slate-400 text-lg mb-2">Aucune mission active</p>
                <p className="text-sm text-slate-400">Acceptez des missions depuis l'onglet "Disponibles"</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: HISTORIQUE */}
        {activeTab === "history" && (
          <div className="space-y-4">
            {historyMissions.map((mission) => (
              <div
                key={mission.id}
                className="bg-white rounded-2xl p-6 border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-lg transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-bold text-xl text-green-600">+{commissionEarnings(mission.total_price)}€</p>
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">
                      ✅ Payé dimanche
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-2 text-sm text-slate-500">
                    <p className="flex items-center gap-2">
                      <Calendar size={14} />
                      {formatDateFR(mission.completed_at || mission.created_at)}
                    </p>
                    <p className="flex items-center gap-2">
                      <Package size={14} />
                      {mission.weight} kg
                    </p>
                    <p className="flex items-center gap-2">
                      {mission.formula === "express" ? "⚡ Express" : "🟢 Standard"}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {historyMissions.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border">
                <TrendingUp size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="font-bold text-slate-400 text-lg mb-2">Pas encore d'historique</p>
                <p className="text-sm text-slate-400">Vos missions terminées apparaîtront ici</p>
              </div>
            )}
          </div>
        )}

        {/* FOOTER SMALL NOTE */}
        <div className="mt-10 text-center text-xs text-slate-400">
          Dernière actualisation : {new Date().toLocaleTimeString("fr-FR")} • Mise à jour auto toutes les 30s
        </div>
      </div>
    </div>
  );
}