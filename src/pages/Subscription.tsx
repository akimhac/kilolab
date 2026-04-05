import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import AddressAutocomplete from '../components/AddressAutocomplete';
import type { AddressSuggestion } from '../components/AddressAutocomplete';
import {
  ArrowLeft, ArrowRight, Check, Zap, Calendar,
  Clock, Repeat, Loader2, Star, Shield, Package
} from 'lucide-react';
import toast from 'react-hot-toast';

const PLANS = {
  weekly: { name: 'Hebdomadaire', description: 'Chaque semaine', discount: 15, badge: 'POPULAIRE', color: 'from-teal-500 to-emerald-500' },
  biweekly: { name: 'Bi-mensuel', description: 'Toutes les 2 semaines', discount: 10, badge: null, color: 'from-blue-500 to-cyan-500' },
  monthly: { name: 'Mensuel', description: 'Une fois par mois', discount: 5, badge: null, color: 'from-purple-500 to-pink-500' },
};
const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const SLOTS = ['8h-10h', '10h-12h', '14h-16h', '16h-18h', '18h-20h'];

function getNextPickupDate(dayName: string): Date {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const targetDay = days.indexOf(dayName);
  const today = new Date();
  let daysUntilTarget = targetDay - today.getDay();
  if (daysUntilTarget <= 0) daysUntilTarget += 7;
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntilTarget);
  return nextDate;
}

export default function Subscription() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingSub, setExistingSub] = useState<any>(null);

  // Form state
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [weight, setWeight] = useState(7);
  const [formula, setFormula] = useState<'standard' | 'express'>('standard');
  const [day, setDay] = useState('Samedi');
  const [slot, setSlot] = useState('10h-12h');
  const [address, setAddress] = useState('');
  const [addressValid, setAddressValid] = useState(false);
  const [addressCoords, setAddressCoords] = useState<[number, number] | null>(null);

  const basePrice = formula === 'express' ? 5 : 3;
  const totalPrice = weight * basePrice;
  const discount = PLANS[plan].discount;
  const finalPrice = totalPrice * (1 - discount / 100);

  useEffect(() => {
    const init = async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { navigate('/login'); return; }
      setUser(u);
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', u.id)
        .eq('status', 'active')
        .maybeSingle();
      if (sub) setExistingSub(sub);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const handleAddressSelect = (addr: AddressSuggestion) => {
    setAddress(addr.label);
    setAddressCoords(addr.coordinates);
    setAddressValid(true);
  };

  const handleSubmit = async () => {
    if (!addressValid) { toast.error("Veuillez sélectionner une adresse valide"); return; }
    if (!user) return;
    setSubmitting(true);
    try {
      const nextPickup = getNextPickupDate(day);
      const { error } = await supabase.from('subscriptions').insert({
        user_id: user.id,
        plan,
        status: 'active',
        weight_kg: weight,
        formula,
        pickup_address: address,
        preferred_day: day,
        preferred_slot: slot,
        next_pickup: nextPickup.toISOString(),
        price_per_order: finalPrice,
        discount_percent: discount,
      });
      if (error) throw error;
      toast.success("Abonnement activé avec succès !");
      navigate('/dashboard');
    } catch (err: any) {
      toast.error("Erreur : " + (err.message || "Impossible de créer l'abonnement"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-teal-600" size={48} />
      </div>
    );
  }

  if (existingSub) {
    const planInfo = PLANS[existingSub.plan as keyof typeof PLANS];
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
          <div className="max-w-lg mx-auto">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 font-medium" data-testid="back-to-dashboard">
              <ArrowLeft size={18} /> Retour au dashboard
            </button>
            <div className={`bg-gradient-to-br ${planInfo?.color || 'from-teal-500 to-emerald-500'} rounded-3xl p-8 text-white shadow-2xl`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Repeat size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black">Abonnement {planInfo?.name}</h2>
                  <p className="text-white/70">{planInfo?.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/15 rounded-2xl p-4">
                  <p className="text-white/70 text-xs mb-1">Prochaine collecte</p>
                  <p className="font-bold">{new Date(existingSub.next_pickup).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                </div>
                <div className="bg-white/15 rounded-2xl p-4">
                  <p className="text-white/70 text-xs mb-1">Réduction</p>
                  <p className="font-black text-2xl">-{existingSub.discount_percent}%</p>
                </div>
                <div className="bg-white/15 rounded-2xl p-4">
                  <p className="text-white/70 text-xs mb-1">Poids</p>
                  <p className="font-bold">{existingSub.weight_kg} kg</p>
                </div>
                <div className="bg-white/15 rounded-2xl p-4">
                  <p className="text-white/70 text-xs mb-1">Prix/commande</p>
                  <p className="font-black text-xl">{existingSub.price_per_order?.toFixed(2)}€</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 text-sm space-y-2">
                <div className="flex justify-between"><span className="text-white/70">Créneau</span><span className="font-bold">{existingSub.preferred_day} {existingSub.preferred_slot}</span></div>
                <div className="flex justify-between"><span className="text-white/70">Formule</span><span className="font-bold capitalize">{existingSub.formula}</span></div>
                <div className="flex justify-between"><span className="text-white/70">Adresse</span><span className="font-bold text-right max-w-[60%] truncate">{existingSub.pickup_address}</span></div>
              </div>
            </div>
            <p className="text-center text-slate-400 text-sm mt-6">Pour modifier ou annuler votre abonnement, contactez le support.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 font-medium" data-testid="back-to-dashboard-btn">
            <ArrowLeft size={18} /> Retour au dashboard
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Repeat size={16} /> Abonnement récurrent
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">Créez votre abonnement</h1>
            <p className="text-slate-500 text-lg">Programmez vos lavages et économisez jusqu'à 15%</p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-600">Étape {step}/4</span>
              <span className="text-sm text-slate-400">{Math.round(step / 4 * 100)}%</span>
            </div>
            <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${step / 4 * 100}%` }} />
            </div>
          </div>

          {/* Avantages badges */}
          {step === 1 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                <Shield size={24} className="mx-auto mb-2 text-teal-600" />
                <p className="text-xs font-bold text-slate-700">Sans engagement</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                <Star size={24} className="mx-auto mb-2 text-amber-500" />
                <p className="text-xs font-bold text-slate-700">Priorité washer</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                <Package size={24} className="mx-auto mb-2 text-purple-600" />
                <p className="text-xs font-bold text-slate-700">Collecte auto</p>
              </div>
            </div>
          )}

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden" data-testid="subscription-form">
            <div className="p-6 sm:p-8">

              {/* Step 1: Plan */}
              {step === 1 && (
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Choisissez votre rythme</h3>
                  <p className="text-slate-500 mb-6">Plus vous commandez souvent, plus vous économisez !</p>
                  <div className="space-y-3">
                    {(Object.keys(PLANS) as Array<keyof typeof PLANS>).map((key) => {
                      const p = PLANS[key];
                      const isSelected = plan === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setPlan(key)}
                          data-testid={`plan-${key}`}
                          className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${isSelected ? 'border-teal-500 bg-teal-50 shadow-lg shadow-teal-100' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                <Repeat size={22} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900">{p.name}</span>
                                  {p.badge && <span className="px-2 py-0.5 bg-teal-500 text-white text-xs font-bold rounded-full">{p.badge}</span>}
                                </div>
                                <span className="text-sm text-slate-500">{p.description}</span>
                              </div>
                            </div>
                            <span className="text-2xl font-black text-teal-600">-{p.discount}%</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Weight & Formula */}
              {step === 2 && (
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Configurez votre commande</h3>
                  <p className="text-slate-500 mb-6">Poids estimé et type de lavage</p>
                  <div className="mb-8">
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      Poids estimé : <span className="text-teal-600 text-lg">{weight} kg</span>
                    </label>
                    <input
                      type="range" min={3} max={20} value={weight}
                      onChange={(e) => setWeight(parseInt(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                      data-testid="weight-slider"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                      <span>3 kg</span><span>10 kg</span><span>20 kg</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Formule</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setFormula('standard')}
                        data-testid="formula-standard"
                        className={`p-5 rounded-2xl border-2 transition-all ${formula === 'standard' ? 'border-teal-500 bg-teal-50 shadow-lg shadow-teal-100' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                        <Clock size={24} className={`mb-2 ${formula === 'standard' ? 'text-teal-600' : 'text-slate-400'}`} />
                        <p className="font-bold text-slate-900">Standard</p>
                        <p className="text-sm text-slate-500">3€/kg - 48h</p>
                      </button>
                      <button
                        onClick={() => setFormula('express')}
                        data-testid="formula-express"
                        className={`p-5 rounded-2xl border-2 transition-all ${formula === 'express' ? 'border-teal-500 bg-teal-50 shadow-lg shadow-teal-100' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                        <Zap size={24} className={`mb-2 ${formula === 'express' ? 'text-amber-500' : 'text-slate-400'}`} />
                        <p className="font-bold text-slate-900">Express</p>
                        <p className="text-sm text-slate-500">5€/kg - 24h</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Schedule */}
              {step === 3 && (
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Choisissez votre créneau</h3>
                  <p className="text-slate-500 mb-6">Jour et heure de collecte récurrente</p>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      <Calendar size={16} className="inline mr-1" /> Jour préféré
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {DAYS.map((d) => (
                        <button
                          key={d}
                          onClick={() => setDay(d)}
                          data-testid={`day-${d}`}
                          className={`p-2.5 rounded-xl text-sm font-bold transition-all ${day === d ? 'bg-teal-500 text-white shadow-lg shadow-teal-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          {d.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      <Clock size={16} className="inline mr-1" /> Créneau horaire
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {SLOTS.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSlot(s)}
                          data-testid={`slot-${s}`}
                          className={`p-3 rounded-xl text-sm font-bold transition-all ${slot === s ? 'bg-teal-500 text-white shadow-lg shadow-teal-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Address & Confirm */}
              {step === 4 && (
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Confirmez votre abonnement</h3>
                  <p className="text-slate-500 mb-6">Adresse de collecte et récapitulatif</p>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Adresse de collecte</label>
                    <AddressAutocomplete
                      value={address}
                      onChange={(v) => { setAddress(v); setAddressValid(false); }}
                      onSelect={handleAddressSelect}
                      onValidChange={setAddressValid}
                      placeholder="Tapez votre adresse..."
                      required
                    />
                    {address && !addressValid && (
                      <p className="text-xs text-amber-600 mt-1 font-medium">Sélectionnez une adresse dans la liste</p>
                    )}
                  </div>
                  {/* Summary */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4 text-lg">Récapitulatif</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Rythme</span><span className="font-bold text-slate-900">{PLANS[plan].name}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Poids</span><span className="font-bold text-slate-900">{weight} kg</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Formule</span><span className="font-bold text-slate-900 capitalize">{formula}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Créneau</span><span className="font-bold text-slate-900">{day} {slot}</span></div>
                      {addressValid && <div className="flex justify-between"><span className="text-slate-500">Adresse</span><span className="font-bold text-slate-900 text-right max-w-[55%] truncate">{address}</span></div>}
                      <div className="border-t border-slate-200 pt-3 flex justify-between">
                        <span className="text-slate-500">Prix normal</span>
                        <span className="text-slate-400 line-through">{totalPrice.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Réduction abonnement</span>
                        <span className="text-teal-600 font-bold">-{discount}%</span>
                      </div>
                      <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                        <span className="font-bold text-slate-900">Prix par commande</span>
                        <span className="font-black text-2xl text-teal-600">{finalPrice.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    data-testid="prev-step-btn"
                    className="flex-1 py-3.5 border-2 border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} /> Retour
                  </button>
                )}
                {step < 4 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    data-testid="next-step-btn"
                    className="flex-1 py-3.5 bg-teal-500 rounded-2xl font-bold text-white hover:bg-teal-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-200"
                  >
                    Continuer <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !addressValid}
                    data-testid="submit-subscription-btn"
                    className="flex-1 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl font-bold text-white hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-200"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>Activer l'abonnement <Check size={18} /></>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
