import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import { FadeInOnScroll } from "../components/animations/ScrollAnimations";
import { WeightEstimator } from "../components/WeightEstimator";
import {
  Scale,
  MapPin,
  ArrowRight,
  Sparkles,
  Tag,
  Search,
  Loader2,
  Calendar as CalendarIcon,
  Info,
  CheckCircle,
  CreditCard,
  Gift,
  Camera,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function NewOrder() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const [formula, setFormula] = useState<"eco" | "express" | "express_2h">("eco");
  const [weight, setWeight] = useState(5);
  const [showWeightEstimator, setShowWeightEstimator] = useState(false);

  const [pickupDate, setPickupDate] = useState("");
  const [pickupSlot, setPickupSlot] = useState("");
  const [isWeekend, setIsWeekend] = useState(false);

  // Washers
  const [allWashers, setAllWashers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [filteredWashers, setFilteredWashers] = useState<any[]>([]);
  const [selectedWasherId, setSelectedWasherId] = useState("");
  const [finalAddress, setFinalAddress] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Coupons
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    fetchWashers();
    requestGeolocation();
    restoreCartFromLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restoreCartFromLocalStorage = async () => {
    try {
      const pendingOrder = localStorage.getItem("kilolab_pending_order");
      if (!pendingOrder) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const order = JSON.parse(pendingOrder);

      setFormula(order.formula || "eco");
      setWeight(order.weight || 5);
      setPickupDate(order.pickup_date || "");
      setPickupSlot(order.pickup_slot || "");
      setSearchQuery(order.search_query || "");
      setFinalAddress(order.final_address || "");
      setStep(order.step || 0);

      if (order.coupon_code) setCouponCode(order.coupon_code);
      if (order.coupon_discount) {
        setCouponDiscount(order.coupon_discount);
        setCouponApplied(true);
      }

      localStorage.removeItem("kilolab_pending_order");
      toast.success("✅ Panier restauré !", { duration: 4000 });
    } catch (error) {
      console.error("Erreur restauration panier:", error);
    }
  };

  const requestGeolocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        toast.success("📍 Localisation détectée", { duration: 2000 });
      },
      (error) => {
        console.log("Géoloc refusée:", error);
      }
    );
  };

  useEffect(() => {
    if (!pickupDate) return;

    const day = new Date(pickupDate).getDay();
    const weekend = day === 0 || day === 6;
    setIsWeekend(weekend);

    if (weekend) {
      toast("📅 Majoration Week-end (+5€) appliquée", { icon: "📅" });
    }
  }, [pickupDate]);

  // ✅ FIX CRITIQUE : récupérer TOUS les washers approuvés (SANS filtre is_available)
  const fetchWashers = async () => {
    try {
      const { data, error } = await supabase
        .from("washers")
        .select("id, full_name, city, postal_code, lat, lng, is_available")
        .eq("status", "approved");

      if (error) {
        // Silently handle error - fallback to "Réseau Kilolab" will be shown
        return;
      }

      setAllWashers(data || []);
    } catch {
      // Silently handle error
    }
  };

  // Recherche locale dans les washers
  const handleSearchLocally = () => {
    if (!searchQuery.trim()) {
      toast.error("Veuillez entrer un code postal ou une ville");
      return;
    }

    setIsSearching(true);
    setSearchDone(false);

    setTimeout(() => {
      const searchLower = searchQuery.toLowerCase().trim();

      // Matching amélioré (ville, CP, département)
      const results = allWashers.filter((w) => {
        const cityMatch = String(w.city || "").toLowerCase().includes(searchLower);
        const postalMatch = String(w.postal_code || "").includes(searchQuery.trim());

        const userDept =
          searchQuery.trim().length >= 2 ? searchQuery.trim().substring(0, 2) : "";
        const washerDept = String(w.postal_code || "").substring(0, 2);
        const deptMatch = userDept && washerDept === userDept;

        return cityMatch || postalMatch || deptMatch;
      });

      setFilteredWashers(results);
      setIsSearching(false);
      setSearchDone(true);

      if (results.length > 0) {
        setSelectedWasherId(results[0].id);
        toast.success(`✅ ${results.length} Washer(s) trouvé(s) !`);
      } else {
        setSelectedWasherId("waiting_list");
        toast("ℹ️ Aucun Washer dans cette zone, la plateforme prendra en charge", {
          icon: "🌐",
          duration: 4000,
        });
      }
    }, 900);
  };

  useEffect(() => {
    if (searchDone) setSearchDone(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Prix
  const basePrice = formula === "eco" ? 3 : formula === "express" ? 5 : 8;
  let total = weight * basePrice;
  if (isWeekend) total += 5;
  const totalPrice = parseFloat(total.toFixed(2));
  const finalPrice = Math.max(0, parseFloat((totalPrice - couponDiscount).toFixed(2)));

  // Validation coupon
  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Entrez un code promo");
      return;
    }

    setCouponLoading(true);
    try {
      const { data, error } = await supabase.rpc("validate_and_use_coupon", {
        p_code: couponCode.toUpperCase(),
        p_order_amount: totalPrice,
        p_user_id: null,
      });

      if (error) throw error;

      if (data && data.valid) {
        const discount = parseFloat(data.discount_amount);
        setCouponDiscount(discount);
        setCouponApplied(true);
        toast.success(`✅ -${discount.toFixed(2)}€ appliqués !`);
      } else {
        toast.error(data?.error || "Code promo invalide");
        setCouponCode("");
        setCouponDiscount(0);
        setCouponApplied(false);
      }
    } catch (e: any) {
      console.error("Erreur validation coupon:", e);
      toast.error("❌ Erreur : " + (e.message || "validation coupon"));
      setCouponCode("");
      setCouponDiscount(0);
      setCouponApplied(false);
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePayment = async (orderId: string, email: string) => {
    try {
      toast.loading("🔄 Redirection vers le paiement…", { id: "payment" });

      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          orderId,
          email,
          finalAmount: finalPrice,
        },
      });

      if (error) {
        console.error("Erreur fonction Supabase:", error);
        throw new Error("Impossible de contacter le serveur de paiement");
      }

      if (!data || !data.url) {
        throw new Error("Pas d'URL de paiement reçue");
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error("Erreur paiement:", err);
      toast.dismiss("payment");
      toast.error("❌ " + err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        const cartData = {
          formula,
          weight,
          pickup_date: pickupDate,
          pickup_slot: pickupSlot,
          search_query: searchQuery,
          final_address: finalAddress,
          step,
          coupon_code: couponApplied ? couponCode : null,
          coupon_discount: couponApplied ? couponDiscount : 0,
        };

        localStorage.setItem("kilolab_pending_order", JSON.stringify(cartData));

        toast.error("🔐 Connectez-vous pour finaliser votre commande");
        navigate("/login?redirect=/new-order");
        setLoading(false);
        return;
      }

      if (!(user as any).email_confirmed_at) {
        toast.error("⚠️ Veuillez confirmer votre email avant de commander");
        setLoading(false);
        return;
      }

      const isNetwork = !selectedWasherId || selectedWasherId === "waiting_list";
      const cleanDate = pickupDate || new Date().toISOString().split("T")[0];
      const fullAddressInfo = `${finalAddress} (${searchQuery}) - Créneau : ${pickupSlot}`;

      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          client_id: user.id,
          washer_id: isNetwork ? null : selectedWasherId,
          partner_id: null,
          weight,
          pickup_address: fullAddressInfo,
          pickup_lat: userLocation?.lat || null,
          pickup_lng: userLocation?.lng || null,
          pickup_date: cleanDate,
          total_price: finalPrice,
          status: "pending",
          formula,
          pickup_slot: pickupSlot,
          coupon_code: couponApplied ? couponCode.toUpperCase() : null,
          coupon_discount: couponApplied ? couponDiscount : 0,
        })
        .select()
        .single();

      if (error) {
        console.error("Erreur création commande:", error);
        throw error;
      }

      if (order) {
        localStorage.removeItem("kilolab_pending_order");
        
        // Send admin alert for new order
        try {
          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'admin_new_order',
              data: {
                id: order.id,
                weight: order.weight,
                total_price: order.total_price,
                pickup_address: order.pickup_address,
                pickup_city: searchQuery,
                client_email: user?.email
              }
            })
          });
        } catch (alertError) {
          console.error('Admin order alert failed:', alertError);
        }
        
        await handlePayment(order.id, user.email || "");
      }
    } catch (error: any) {
      console.error("Erreur handleSubmit:", error);
      toast.error("❌ Erreur : " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar />

      <div className="pt-32 max-w-3xl mx-auto px-4 w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">Nouvelle Commande</h1>

        <div className="flex justify-center mb-8 text-xs md:text-sm overflow-x-auto">
          {["Formule", "Poids", "Localisation", "Date", "Paiement"].map((label, i) => (
            <div
              key={i}
              className={`px-3 py-1 md:px-4 md:py-2 rounded-full whitespace-nowrap mx-1 transition-all ${
                step >= i ? "bg-teal-600 text-white font-bold shadow-lg" : "bg-slate-200 text-slate-400"
              }`}
            >
              {i + 1}. {label}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden min-h-[500px] p-6 md:p-8">
          {/* STEP 0: FORMULE */}
          {step === 0 && (
            <div className="animate-in slide-in-from-right-8 fade-in">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Tag className="text-teal-500" /> Choisissez votre formule
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Standard */}
                <div
                  onClick={() => setFormula("eco")}
                  className={`group p-5 border-2 rounded-2xl cursor-pointer transition-all transform hover:scale-105 ${
                    formula === "eco"
                      ? "border-teal-500 bg-teal-50 shadow-xl"
                      : "border-slate-200 hover:border-teal-300 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-black text-lg uppercase text-slate-900">Standard</span>
                      <p className="text-xs text-slate-500 mt-1">Le choix malin</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-slate-900">3€</div>
                      <span className="text-xs text-slate-400">/kg</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-green-500" /> Lavage soigné
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-green-500" /> Séchage & Pliage
                    </li>
                  </ul>
                  <div className="bg-white rounded-xl p-2 border border-slate-200 text-center">
                    <span className="text-xs font-bold text-slate-500">⏱️ Prêt en 48-72h</span>
                  </div>
                </div>

                {/* Express 24h */}
                <div
                  onClick={() => setFormula("express")}
                  className={`group p-5 border-2 rounded-2xl cursor-pointer transition-all transform hover:scale-105 relative ${
                    formula === "express"
                      ? "border-purple-500 bg-purple-50 shadow-xl"
                      : "border-slate-200 hover:border-purple-300 bg-white"
                  }`}
                >
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-0.5 rounded-full shadow-lg">
                    POPULAIRE
                  </div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-black text-lg uppercase text-slate-900">Express</span>
                      <p className="text-xs text-slate-500 mt-1">24h chrono</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-slate-900">5€</div>
                      <span className="text-xs text-slate-400">/kg</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-purple-500" /> Priorité absolue
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-purple-500" /> Pliage "Boutique"
                    </li>
                  </ul>
                  <div className="bg-purple-100 rounded-xl p-2 border border-purple-200 text-center">
                    <span className="text-xs font-bold text-purple-700">⚡ Prêt en 24h</span>
                  </div>
                </div>

                {/* Express 2h */}
                <div
                  onClick={() => setFormula("express_2h")}
                  className={`group p-5 border-2 rounded-2xl cursor-pointer transition-all transform hover:scale-105 relative ${
                    formula === "express_2h"
                      ? "border-red-500 bg-red-50 shadow-xl"
                      : "border-slate-200 hover:border-red-300 bg-white"
                  }`}
                >
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-0.5 rounded-full shadow-lg animate-pulse">
                    NOUVEAU
                  </div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-black text-lg uppercase text-slate-900">Express 2h</span>
                      <p className="text-xs text-slate-500 mt-1">Collecte ultra-rapide</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-slate-900">8€</div>
                      <span className="text-xs text-slate-400">/kg</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-red-500" /> Collecte en 2h
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-red-500" /> Washer dédié
                    </li>
                  </ul>
                  <div className="bg-red-100 rounded-xl p-2 border border-red-200 text-center">
                    <span className="text-xs font-bold text-red-700">🚀 Collecte en 2h</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 transition shadow-lg flex items-center gap-2"
                >
                  Suivant <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: POIDS */}
          {step === 1 && (
            <div className="animate-in slide-in-from-right-8 fade-in text-center">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 justify-center">
                <Scale className="text-teal-500" /> Quel poids de linge ?
              </h2>

              {/* AI Estimation Button */}
              <button
                onClick={() => setShowWeightEstimator(true)}
                className="mb-6 w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <Camera size={20} />
                📸 Estimer avec une photo (IA)
              </button>

              <div className="mb-8">
                <div className="text-7xl font-black text-teal-600 mb-3">
                  {weight} <span className="text-3xl text-slate-400 font-normal">kg</span>
                </div>
                <p className="text-slate-500 text-lg">
                  ~ {Math.ceil(weight / 5)} machine(s) • Formule {formula === "eco" ? "Standard" : formula === "express" ? "Express" : "Express 2h"}
                </p>
              </div>

              <input
                type="range"
                min="3"
                max="30"
                step="1"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value, 10))}
                className="w-full h-4 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-500 mb-8"
              />

              <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
                <div className="bg-slate-50 p-4 rounded-xl border">
                  <div className="font-bold text-slate-900 mb-1">{weight} kg</div>
                  <div className="text-xs text-slate-500">Poids total</div>
                </div>
                <div className="bg-teal-50 p-4 rounded-xl border border-teal-200">
                  <div className="font-bold text-teal-700 mb-1">
                    {(weight * basePrice).toFixed(2)}€
                  </div>
                  <div className="text-xs text-teal-600">Prix estimé</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border">
                  <div className="font-bold text-slate-900 mb-1">{formula === "eco" ? "48-72h" : formula === "express" ? "24h" : "Collecte 2h"}</div>
                  <div className="text-xs text-slate-500">Délai</div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 py-4 border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition"
                >
                  ← Retour
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 transition shadow-lg flex items-center justify-center gap-2"
                >
                  Suivant <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LOCALISATION */}
          {step === 2 && (
            <div className="animate-in slide-in-from-right-8 fade-in h-full flex flex-col">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="text-teal-500" /> Où êtes-vous ?
              </h2>

              {userLocation && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" />
                  <span className="text-sm font-bold text-green-700">Localisation détectée ✅</span>
                </div>
              )}

              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="59000 ou Lille..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 p-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium text-lg transition"
                    onKeyDown={(e) => e.key === "Enter" && handleSearchLocally()}
                  />
                </div>
                <button
                  onClick={handleSearchLocally}
                  disabled={!searchQuery || isSearching}
                  className="px-6 bg-teal-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-500 transition shadow-lg"
                >
                  {isSearching ? <Loader2 className="animate-spin" size={20} /> : "Chercher"}
                </button>
              </div>

              <div className="flex-1 relative rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 min-h-[300px]">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 blur-sm" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
                  {isSearching && (
                    <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-slate-200 animate-pulse">
                      <Loader2 className="animate-spin text-teal-500 mx-auto mb-3" size={40} />
                      <p className="text-lg font-bold text-slate-700">Recherche en cours...</p>
                    </div>
                  )}

                  {!isSearching && searchDone && (
                    <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border-2 border-teal-200 animate-in zoom-in duration-300 max-w-md">
                      {filteredWashers.length > 0 ? (
                        <>
                          <Sparkles size={48} className="text-teal-500 mx-auto mb-4" />
                          <h3 className="text-2xl font-black text-slate-900 mb-2">Zone couverte ! 🎉</h3>
                          <p className="text-slate-600 font-medium mb-6">
                            {filteredWashers.length} Washer(s) disponible(s) près de chez vous
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles size={32} className="text-teal-600" />
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 mb-2">Réseau Kilolab 🌐</h3>
                          <p className="text-slate-600 font-medium mb-6">
                            Aucun Washer dans cette zone, mais notre plateforme prend en charge votre commande !
                          </p>
                        </>
                      )}
                      <button
                        onClick={() => setStep(3)}
                        className="px-8 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 transition w-full flex items-center justify-center gap-2 shadow-lg"
                      >
                        Poursuivre <ArrowRight size={20} />
                      </button>
                    </div>
                  )}

                  {!isSearching && !searchDone && (
                    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200 text-slate-600 font-medium flex items-center gap-3 shadow-lg">
                      <MapPin size={24} className="text-slate-400" />
                      <span>Entrez votre code postal pour démarrer</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-slate-500 font-bold hover:text-slate-700 transition"
                >
                  ← Retour
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DATE */}
          {step === 3 && (
            <div className="animate-in slide-in-from-right-8 fade-in">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CalendarIcon className="text-teal-500" /> Quand récupérer ?
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">📅 Date de dépôt</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  {isWeekend && (
                    <div className="mt-3 bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-2">
                      <Info size={18} className="text-orange-500" />
                      <span className="text-sm font-bold text-orange-700">Majoration Week-end : +5.00€</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">🕐 Créneau horaire (indicatif)</label>
                  <select
                    className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-medium text-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={pickupSlot}
                    onChange={(e) => setPickupSlot(e.target.value)}
                  >
                    <option value="">Choisir un créneau...</option>
                    <option value="Matin (09h - 12h)">☀️ Matin (09h - 12h)</option>
                    <option value="Midi (12h - 14h)">🌤️ Midi (12h - 14h)</option>
                    <option value="Après-midi (14h - 18h)">🌅 Après-midi (14h - 18h)</option>
                  </select>
                </div>

                <div className="bg-teal-50 border-2 border-teal-200 p-5 rounded-xl">
                  <p className="text-sm font-bold text-teal-700 mb-2">📍 Zone de collecte</p>
                  <p className="text-teal-900 font-black text-xl">{searchQuery}</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">🏠 Adresse précise de retrait</label>
                  <input
                    type="text"
                    placeholder="N°, Rue, Bâtiment, Digicode..."
                    value={finalAddress}
                    onChange={(e) => setFinalAddress(e.target.value)}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                {filteredWashers.length > 0 && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">👤 Washer (optionnel)</label>
                    <select
                      className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                      value={selectedWasherId}
                      onChange={(e) => setSelectedWasherId(e.target.value)}
                    >
                      {filteredWashers.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.full_name} - {w.city}
                        </option>
                      ))}
                      <option value="waiting_list">✨ Confier à un Washer disponible</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="text-slate-500 font-bold hover:text-slate-700 transition"
                >
                  ← Retour
                </button>
                <button
                  disabled={!finalAddress || !pickupDate || !pickupSlot}
                  onClick={() => setStep(4)}
                  className="px-8 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 transition shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Récapitulatif <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: RÉCAPITULATIF */}
          {step === 4 && (
            <div className="animate-in slide-in-from-right-8 fade-in">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle className="text-teal-500" /> Récapitulatif
              </h2>

              <div className="bg-gradient-to-br from-slate-50 to-teal-50 p-6 rounded-2xl border-2 border-slate-200 space-y-4 mb-8 shadow-inner">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Formule</span>
                  <span className="font-black text-lg uppercase">
                    {formula === "eco" ? "🟢 Standard" : formula === "express" ? "⚡ Express" : "🚀 Express 2h"}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Poids</span>
                  <span className="font-black text-lg">{weight} kg</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Collecte</span>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">
                      {pickupDate
                        ? new Date(pickupDate).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })
                        : "-"}
                    </div>
                    <div className="text-sm text-slate-500">{pickupSlot}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">📍 Zone</span>
                  <span className="font-bold text-slate-900">{searchQuery}</span>
                </div>

                {isWeekend && (
                  <div className="flex justify-between items-center text-orange-600 bg-orange-50 p-3 rounded-xl">
                    <span className="font-bold">Majoration Week-end</span>
                    <span className="font-black">+5.00 €</span>
                  </div>
                )}

                {!couponApplied ? (
                  <div className="p-4 bg-teal-50 rounded-xl border border-teal-200">
                    <label className="block text-sm font-bold text-teal-700 mb-2">
                      <span className="inline-flex items-center gap-2">
                        <Gift size={18} /> Code promo
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="PROMO5"
                        className="flex-1 px-4 py-2 border-2 border-teal-200 rounded-lg focus:border-teal-500 outline-none uppercase font-bold"
                      />
                      <button
                        type="button"
                        onClick={validateCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-6 py-2 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
                      >
                        {couponLoading ? <Loader2 className="animate-spin" size={18} /> : "Valider"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-green-700">✅ Code promo appliqué</p>
                      <p className="text-xs text-green-600 font-mono">{couponCode}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-green-700">-{couponDiscount.toFixed(2)}€</p>
                      <button
                        type="button"
                        onClick={() => {
                          setCouponApplied(false);
                          setCouponDiscount(0);
                          setCouponCode("");
                        }}
                        className="text-xs text-green-600 hover:text-green-800 underline mt-1"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                )}

                <div className="border-t-2 border-slate-300 pt-4 mt-4">
                  {couponApplied && (
                    <div className="flex justify-between items-center mb-2 text-slate-600">
                      <span className="font-medium">Sous-total</span>
                      <span className="font-bold line-through">{totalPrice.toFixed(2)} €</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="font-black text-xl text-slate-900">Total à payer</span>
                    <span className="font-black text-4xl text-teal-600">{finalPrice.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-bold mb-1">Paiement sécurisé par Stripe</p>
                  <p>Vous allez être redirigé vers notre page de paiement sécurisée.</p>
                </div>
              </div>

              <div className="flex justify-between items-center gap-4">
                <button
                  onClick={() => setStep(3)}
                  className="text-slate-500 font-bold hover:text-slate-700 transition"
                >
                  ← Retour
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-8 py-5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-black text-lg hover:from-teal-500 hover:to-cyan-500 transition shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <CreditCard size={24} />
                      Payer {finalPrice.toFixed(2)}€
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weight Estimator Modal */}
      {showWeightEstimator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg">
            <WeightEstimator
              onClose={() => setShowWeightEstimator(false)}
              onEstimationComplete={(estimatedWeight) => {
                setWeight(Math.round(estimatedWeight));
                setShowWeightEstimator(false);
                toast.success(`Poids estimé: ${Math.round(estimatedWeight)} kg`);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}