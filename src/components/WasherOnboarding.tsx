import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, Circle, User, CreditCard, MapPin, Bell, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface OnboardingProps {
  washerId: string;
  washerData: any;
  stripeCompleted: boolean;
  onComplete?: () => void;
}

const STEPS = [
  { key: 'profile', label: 'Profil complet', icon: User, desc: 'Nom, prenom, telephone' },
  { key: 'stripe', label: 'Compte bancaire', icon: CreditCard, desc: 'Configurer Stripe Connect' },
  { key: 'zone', label: 'Zone de service', icon: MapPin, desc: 'Adresse et rayon d\'action' },
  { key: 'notifications', label: 'Notifications', icon: Bell, desc: 'Activer les alertes missions' },
];

export default function WasherOnboarding({ washerId, washerData, stripeCompleted, onComplete }: OnboardingProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    checkSteps();
  }, [washerData, stripeCompleted]);

  const checkSteps = () => {
    const done = new Set<string>();
    // Profile: has first_name and phone
    if (washerData?.first_name || washerData?.full_name) done.add('profile');
    // Stripe
    if (stripeCompleted) done.add('stripe');
    // Zone: has city or postal_code
    if (washerData?.city || washerData?.postal_code) done.add('zone');
    // Notifications: check permission
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') done.add('notifications');
    setCompletedSteps(done);

    // Mark onboarding complete in DB
    if (done.size === STEPS.length && washerData?.onboarding_completed !== true) {
      supabase.from('washers').update({ onboarding_completed: true, onboarding_step: STEPS.length }).eq('id', washerId);
      toast.success('Onboarding termine ! Vous etes pret pour vos premieres missions.', { duration: 4000 });
      onComplete?.();
    }
  };

  // Don't show if all done or dismissed
  if (completedSteps.size === STEPS.length || dismissed) return null;

  const progress = (completedSteps.size / STEPS.length) * 100;

  return (
    <div className="bg-gradient-to-br from-teal-900/30 to-emerald-900/20 rounded-2xl border border-teal-500/20 p-5 mb-6" data-testid="washer-onboarding">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-black text-base">Bienvenue sur Kilolab !</h3>
          <p className="text-white/50 text-xs mt-0.5">Completez ces etapes pour commencer</p>
        </div>
        <button onClick={() => setDismissed(true)} className="text-white/30 text-xs hover:text-white/60">Plus tard</button>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-teal-400 text-xs font-bold mb-3">{completedSteps.size}/{STEPS.length} etapes</p>

      {/* Steps */}
      <div className="space-y-2">
        {STEPS.map((step) => {
          const done = completedSteps.has(step.key);
          const Icon = step.icon;
          return (
            <div key={step.key} className={`flex items-center gap-3 p-3 rounded-xl transition ${done ? 'bg-teal-500/10' : 'bg-white/5 hover:bg-white/10'}`}>
              {done ? (
                <CheckCircle size={20} className="text-teal-400 flex-shrink-0" />
              ) : (
                <Circle size={20} className="text-white/20 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${done ? 'text-teal-300 line-through' : 'text-white'}`}>{step.label}</p>
                <p className="text-white/40 text-xs">{step.desc}</p>
              </div>
              {!done && <ChevronRight size={16} className="text-white/20" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
