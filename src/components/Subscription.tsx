// Système d'Abonnements Récurrents
// Lavage hebdo -15%, paiement auto, pause/reprise facile
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Calendar, CreditCard, Repeat, Pause, Play, Settings, 
  Check, Star, Zap, Clock, Package, ArrowRight, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAnalytics } from '../hooks/useAnalytics';

interface Subscription {
  id: string;
  plan: 'weekly' | 'biweekly' | 'monthly';
  status: 'active' | 'paused' | 'cancelled';
  weight_kg: number;
  formula: 'standard' | 'express';
  pickup_address: string;
  preferred_day: string;
  preferred_slot: string;
  next_pickup: string;
  price_per_order: number;
  discount_percent: number;
  created_at: string;
}

const PLANS = {
  weekly: { 
    name: 'Hebdo', 
    description: 'Chaque semaine', 
    discount: 15, 
    icon: '🔄',
    badge: 'POPULAIRE',
    color: 'from-teal-500 to-emerald-500'
  },
  biweekly: { 
    name: 'Bi-mensuel', 
    description: 'Toutes les 2 semaines', 
    discount: 10, 
    icon: '📅',
    badge: null,
    color: 'from-blue-500 to-cyan-500'
  },
  monthly: { 
    name: 'Mensuel', 
    description: 'Une fois par mois', 
    discount: 5, 
    icon: '📆',
    badge: null,
    color: 'from-purple-500 to-pink-500'
  },
};

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const SLOTS = ['8h-10h', '10h-12h', '14h-16h', '16h-18h', '18h-20h'];

export function SubscriptionCard({ subscription, onManage }: { subscription: Subscription; onManage: () => void }) {
  const plan = PLANS[subscription.plan];
  const isPaused = subscription.status === 'paused';

  return (
    <div className={`relative bg-gradient-to-br ${plan.color} rounded-3xl p-6 text-white overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
              {plan.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg">Abo {plan.name}</h3>
                {isPaused && (
                  <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                    PAUSE
                  </span>
                )}
              </div>
              <p className="text-white/70 text-sm">{plan.description}</p>
            </div>
          </div>
          <button onClick={onManage} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all">
            <Settings size={20} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-white/70 text-xs mb-1">Prochaine collecte</p>
            <p className="font-bold">{new Date(subscription.next_pickup).toLocaleDateString('fr-FR', { 
              weekday: 'short', day: 'numeric', month: 'short' 
            })}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-white/70 text-xs mb-1">Économie</p>
            <p className="font-bold">-{subscription.discount_percent}%</p>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white/10 rounded-xl p-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/70">Poids</span>
            <span className="font-bold">{subscription.weight_kg} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Formule</span>
            <span className="font-bold capitalize">{subscription.formula}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Créneau</span>
            <span className="font-bold">{subscription.preferred_day} {subscription.preferred_slot}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-white/20">
            <span className="text-white/70">Prix/commande</span>
            <span className="font-black text-lg">{subscription.price_per_order.toFixed(2)}€</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SubscriptionSetup({ 
  userId, 
  onComplete 
}: { 
  userId: string; 
  onComplete: (subscription: Subscription) => void;
}) {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [weight, setWeight] = useState(7);
  const [formula, setFormula] = useState<'standard' | 'express'>('standard');
  const [day, setDay] = useState('Samedi');
  const [slot, setSlot] = useState('10h-12h');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { trackSubscriptionStarted } = useAnalytics();

  const basePrice = formula === 'express' ? 5 : 3;
  const totalPrice = weight * basePrice;
  const discount = PLANS[plan].discount;
  const finalPrice = totalPrice * (1 - discount / 100);

  const handleSubmit = async () => {
    if (!address.trim()) {
      toast.error('Veuillez entrer votre adresse');
      return;
    }

    setLoading(true);
    try {
      // Calculate next pickup date
      const nextPickup = getNextPickupDate(day, plan);

      const { data, error } = await supabase.from('subscriptions').insert({
        user_id: userId,
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
      }).select().single();

      if (error) throw error;

      trackSubscriptionStarted(plan, finalPrice);
      toast.success('Abonnement activé !');
      onComplete(data);
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const getNextPickupDate = (dayName: string, planType: string): Date => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const targetDay = days.indexOf(dayName);
    const today = new Date();
    const currentDay = today.getDay();
    let daysUntilTarget = targetDay - currentDay;
    
    if (daysUntilTarget <= 0) daysUntilTarget += 7;
    
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntilTarget);
    return nextDate;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      {/* Progress */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-slate-600">Étape {step}/4</span>
          <span className="text-sm text-slate-400">{Math.round(step/4*100)}%</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${step/4*100}%` }}
          />
        </div>
      </div>

      <div className="p-6">
        {/* Step 1: Choose Plan */}
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
                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                      isSelected 
                        ? 'border-teal-500 bg-teal-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{p.name}</span>
                            {p.badge && (
                              <span className="px-2 py-0.5 bg-teal-500 text-white text-xs font-bold rounded-full">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-slate-500">{p.description}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-teal-600">-{p.discount}%</span>
                      </div>
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
            <p className="text-slate-500 mb-6">Définissez le poids et la formule par défaut</p>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Poids estimé: {weight} kg
              </label>
              <input
                type="range"
                min={3}
                max={20}
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>3 kg</span>
                <span>20 kg</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Formule</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFormula('standard')}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    formula === 'standard' ? 'border-teal-500 bg-teal-50' : 'border-slate-200'
                  }`}
                >
                  <p className="font-bold text-slate-900">Standard</p>
                  <p className="text-sm text-slate-500">3€/kg • 48h</p>
                </button>
                <button
                  onClick={() => setFormula('express')}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    formula === 'express' ? 'border-teal-500 bg-teal-50' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Zap size={16} className="text-amber-500" />
                    <p className="font-bold text-slate-900">Express</p>
                  </div>
                  <p className="text-sm text-slate-500">5€/kg • 24h</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Schedule */}
        {step === 3 && (
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Choisissez votre créneau</h3>
            <p className="text-slate-500 mb-6">Sélectionnez le jour et l'heure de collecte</p>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Jour préféré</label>
              <div className="grid grid-cols-4 gap-2">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDay(d)}
                    className={`p-2 rounded-xl text-sm font-medium transition-all ${
                      day === d 
                        ? 'bg-teal-500 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Créneau horaire</label>
              <div className="grid grid-cols-3 gap-2">
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlot(s)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all ${
                      slot === s 
                        ? 'bg-teal-500 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
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
            <p className="text-slate-500 mb-6">Vérifiez les détails et entrez votre adresse</p>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Adresse de collecte</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Rue de Paris, 75001 Paris"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Summary */}
            <div className="bg-slate-50 rounded-2xl p-4 mb-4">
              <h4 className="font-bold text-slate-900 mb-3">Récapitulatif</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Rythme</span>
                  <span className="font-bold">{PLANS[plan].name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Poids</span>
                  <span className="font-bold">{weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Formule</span>
                  <span className="font-bold capitalize">{formula}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Créneau</span>
                  <span className="font-bold">{day} {slot}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-600">Prix normal</span>
                  <span className="text-slate-400 line-through">{totalPrice.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Réduction abo</span>
                  <span className="text-teal-600 font-bold">-{discount}%</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Prix/commande</span>
                  <span className="font-black text-xl text-teal-600">{finalPrice.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 border-2 border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Retour
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex-1 py-3 bg-teal-500 rounded-2xl font-bold text-white hover:bg-teal-600 transition-all flex items-center justify-center gap-2"
            >
              Continuer <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl font-bold text-white hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Activer l'abonnement <Check size={18} /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Manage subscription modal
export function SubscriptionManager({ 
  subscription, 
  onUpdate,
  onClose 
}: { 
  subscription: Subscription; 
  onUpdate: (sub: Subscription) => void;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const togglePause = async () => {
    setLoading(true);
    try {
      const newStatus = subscription.status === 'paused' ? 'active' : 'paused';
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ status: newStatus })
        .eq('id', subscription.id)
        .select()
        .single();

      if (error) throw error;
      toast.success(newStatus === 'paused' ? 'Abonnement mis en pause' : 'Abonnement réactivé');
      onUpdate(data);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const cancel = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', subscription.id);

      if (error) throw error;
      toast.success('Abonnement annulé');
      onClose();
    } catch (error) {
      toast.error('Erreur lors de l\'annulation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-900">Gérer l'abonnement</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={togglePause}
            disabled={loading}
            className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${
              subscription.status === 'paused'
                ? 'bg-teal-500 text-white hover:bg-teal-600'
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
          >
            {subscription.status === 'paused' ? <Play size={20} /> : <Pause size={20} />}
            <span className="font-bold">
              {subscription.status === 'paused' ? 'Reprendre l\'abonnement' : 'Mettre en pause'}
            </span>
          </button>

          <button
            onClick={cancel}
            disabled={loading}
            className="w-full p-4 rounded-2xl bg-red-100 text-red-600 hover:bg-red-200 flex items-center gap-3 transition-all"
          >
            <X size={20} />
            <span className="font-bold">Annuler l'abonnement</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default { SubscriptionCard, SubscriptionSetup, SubscriptionManager };
