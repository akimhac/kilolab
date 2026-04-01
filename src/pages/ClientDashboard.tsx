import { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { FadeInOnScroll, StaggerChildren, CountUp } from '../components/animations/ScrollAnimations';
import { ClientDashboardSkeleton } from '../components/animations/Skeleton';
import { OrderTrackerMini } from '../components/OrderTracker';
import { LoyaltyCard } from '../components/Loyalty';
import { SubscriptionCard } from '../components/Subscription';
import { ReferralSystem } from '../components/ReferralSystem';
import { Chat, ChatBubble } from '../components/Chat';
import NotificationToggle from '../components/NotificationToggle';
import OrderTracking from '../components/OrderTracking';
import {
  Package, Clock, CheckCircle, MapPin, Loader2, ArrowRight,
  Star, RefreshCw, Plus, Sparkles, Phone, TrendingUp,
  Gift, Copy, ChevronDown, ChevronUp, ThumbsUp, X,
  RotateCcw, Zap, Crown, Repeat, MessageCircle, Users, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import InvoiceGenerator from '../components/InvoiceGenerator';

interface WasherInfo {
  id: string; first_name: string; last_name: string;
  avatar_url: string | null; avg_rating: number | null;
  total_ratings: number | null; phone: string | null;
}
interface Order {
  id: string; created_at: string; completed_at: string | null;
  pickup_address: string; pickup_date: string | null; pickup_slot: string | null;
  weight: number; total_price: number; formula: string; status: string;
  washer_id: string | null; washer?: WasherInfo | null;
  client_rating?: number | null; client_review?: string | null;
}
interface UserProfile {
  id: string; full_name: string | null; first_name?: string | null; referral_code: string | null;
  uses_count: number; bonus_earned_cents: number; referral_credit: number;
  loyalty_points?: number;
}

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
}

function formatCurrency(a: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(a);
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatDateRelative(d: string) {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return 'Hier';
  if (diff < 7) return `Il y a ${diff} jours`;
  return formatDate(d);
}
function getFormulaLabel(f: string) {
  return ({ eco: 'Eco', standard: 'Standard', premium: 'Premium', express: 'Express' }[f] ?? f);
}
function getFormulaBadge(f: string) {
  return ({ express: 'bg-purple-100 text-purple-700', eco: 'bg-green-100 text-green-700', premium: 'bg-amber-100 text-amber-700' }[f] ?? 'bg-blue-100 text-blue-700');
}

const STATUS_STEPS = [
  { key: 'pending',   label: 'Recu',     icon: '📬' },
  { key: 'confirmed', label: 'Confirme', icon: '✓' },
  { key: 'paid',      label: 'Paye',     icon: '💳' },
  { key: 'assigned',  label: 'Washer',   icon: '👤' },
  { key: 'picked_up', label: 'Collecte', icon: '📦' },
  { key: 'washing',   label: 'Lavage',   icon: '🫧' },
  { key: 'ready',     label: 'Pret',     icon: '✅' },
  { key: 'completed', label: 'Livre',    icon: '🎉' },
];
const STATUS_INFO: Record<string, { label: string; emoji: string; color: string; bg: string; desc: string }> = {
  pending:   { label: 'En attente',      emoji: '📬', color: 'text-orange-600',  bg: 'bg-orange-50 border-orange-200',   desc: 'On cherche un washer disponible pres de vous' },
  confirmed: { label: 'Commande confirmee', emoji: '✓', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', desc: 'Votre commande est confirmee' },
  paid:      { label: 'Paiement recu',   emoji: '💳', color: 'text-green-600',   bg: 'bg-green-50 border-green-200',     desc: 'Paiement confirme - recherche d\'un washer' },
  assigned:  { label: 'Washer assigne',  emoji: '👤', color: 'text-blue-600',    bg: 'bg-blue-50 border-blue-200',       desc: 'Votre washer se prepare a venir collecter' },
  picked_up: { label: 'Linge collecte',  emoji: '📦', color: 'text-violet-600',  bg: 'bg-violet-50 border-violet-200',   desc: 'Votre linge est en route vers le washer' },
  washing:   { label: 'Lavage en cours', emoji: '🫧', color: 'text-teal-600',    bg: 'bg-teal-50 border-teal-200',       desc: 'Lavage, sechage et pliage en cours...' },
  ready:     { label: 'Pret !',          emoji: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', desc: 'Votre linge est pret -- livraison en cours' },
  completed: { label: 'Livre !',         emoji: '🎉', color: 'text-green-600',   bg: 'bg-green-50 border-green-200',     desc: 'Votre linge a ete livre propre et plie' },
  cancelled: { label: 'Annulee',         emoji: '❌', color: 'text-red-600',     bg: 'bg-red-50 border-red-200',         desc: 'Cette commande a ete annulee' },
  refunded:  { label: 'Remboursee',      emoji: '💸', color: 'text-slate-600',   bg: 'bg-slate-50 border-slate-200',     desc: 'Cette commande a ete remboursee' },
};

function ProgressStepper({ status }: { status: string }) {
  const idx = STATUS_STEPS.findIndex(s => s.key === status);
  return (
    <div className="relative pt-2">
      <div className="absolute top-[18px] left-[14px] right-[14px] h-1 bg-slate-100 rounded-full" />
      <div className="absolute top-[18px] left-[14px] h-1 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-700"
        style={{ width: idx === 0 ? '0%' : `${(idx / (STATUS_STEPS.length - 1)) * 100}%` }} />
      <div className="relative flex justify-between">
        {STATUS_STEPS.map((step, i) => (
          <div key={step.key} className="flex flex-col items-center gap-1.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base transition-all duration-300 shadow-sm
              ${i < idx ? 'bg-teal-500 text-white scale-90' : i === idx ? 'bg-teal-500 text-white ring-4 ring-teal-100 scale-110' : 'bg-white border-2 border-slate-200 text-slate-300'}`}>
              {i < idx ? '✓' : step.icon}
            </div>
            <span className={`text-[10px] font-semibold hidden sm:block ${i === idx ? 'text-teal-600' : i < idx ? 'text-teal-400' : 'text-slate-300'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <div className="sm:hidden mt-3 flex items-center justify-between px-1">
        <span className="text-sm font-bold text-teal-600">{STATUS_STEPS[idx]?.icon} {STATUS_STEPS[idx]?.label}</span>
        <span className="text-xs text-slate-400">{idx + 1} / {STATUS_STEPS.length}</span>
      </div>
    </div>
  );
}

function RatingModal({ order, onClose, onSubmit }: { order: Order; onClose: () => void; onSubmit: (id: string, r: number, rev: string) => Promise<void> }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { t } = useTranslation();
  const labels = t('clientDashboard.ratingLabels', { returnObjects: true }) as string[];
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black">{t('clientDashboard.rateWasher')}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><X size={16} /></button>
        </div>
        {order.washer && (
          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
              {order.washer.first_name?.[0]}{order.washer.last_name?.[0]}
            </div>
            <div>
              <p className="font-bold text-sm">{order.washer.first_name} {order.washer.last_name}</p>
              <p className="text-xs text-slate-400">{order.weight} kg</p>
            </div>
          </div>
        )}
        <div className="flex justify-center gap-2 mb-2">
          {[1,2,3,4,5].map(s => (
            <button key={s} onClick={() => setRating(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} className="transition-transform hover:scale-110">
              <Star size={36} className={`transition-colors ${s <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
            </button>
          ))}
        </div>
        <p className="text-center text-sm font-bold text-slate-500 mb-4 h-5">{labels[hover || rating]}</p>
        <textarea placeholder={t('clientDashboard.ratePlaceholder')} value={review} onChange={e => setReview(e.target.value)} rows={3}
          className="w-full border border-slate-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 mb-4" />
        <button onClick={async () => { if (!rating) { toast.error(t('clientDashboard.chooseRating')); return; } setSubmitting(true); await onSubmit(order.id, rating, review); setSubmitting(false); onClose(); }}
          disabled={submitting || rating === 0}
          className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2">
          {submitting ? <Loader2 size={18} className="animate-spin" /> : <ThumbsUp size={18} />} {t('clientDashboard.rateBtn')}
        </button>
      </div>
    </div>
  );
}

function ActiveOrderCard({ order, onCancel, onRate, onTrack, clientName, clientEmail }: { order: Order; onCancel?: (id: string) => void; onRate?: (o: Order) => void; onTrack?: (id: string) => void; clientName?: string; clientEmail?: string }) {
  const si = STATUS_INFO[order.status] ?? { label: order.status, emoji: '📦', color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200', desc: '' };
  const canRate = order.status === 'completed' && !order.client_rating && onRate;
  const isActive = ['pending','assigned','picked_up','washing','ready'].includes(order.status);
  const canTrack = ['assigned','picked_up','ready'].includes(order.status) && order.washer_id;
  const showInvoice = order.status === 'completed';
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className={`px-5 py-4 border-b ${si.bg} ${si.color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{si.emoji}</span>
            <div>
              <p className="font-black text-base leading-tight">{si.label}</p>
              <p className="text-xs opacity-70 mt-0.5">{si.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showInvoice && clientName && clientEmail && (
              <InvoiceGenerator
                order={{
                  id: order.id,
                  created_at: order.created_at,
                  weight: order.weight,
                  formula: order.formula,
                  total_price: order.total_price,
                  pickup_address: order.pickup_address,
                  status: order.status,
                }}
                clientName={clientName}
                clientEmail={clientEmail}
              />
            )}
            {isActive && (
              <span className="flex items-center gap-1.5 text-xs font-bold opacity-60">
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" /> Live
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="px-5 pt-5 pb-4 border-b border-slate-50">
        <ProgressStepper status={order.status} />
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-2xl p-3.5">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Commande</p>
            <p className="font-black text-slate-800 font-mono text-sm">#{order.id.slice(0,8).toUpperCase()}</p>
            <p className="text-xs text-slate-400 mt-0.5">{formatDateRelative(order.created_at)}</p>
          </div>
          <div className="bg-teal-50 rounded-2xl p-3.5">
            <p className="text-xs text-teal-500 font-semibold uppercase tracking-wide mb-1">Montant</p>
            <p className="font-black text-teal-700 text-xl">{formatCurrency(parseFloat(String(order.total_price)))}</p>
            <p className="text-xs text-teal-400 mt-0.5">{order.weight} kg</p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-slate-50 rounded-2xl p-3.5">
          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <MapPin size={15} className="text-teal-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Lieu de collecte</p>
            <p className="text-sm text-slate-700 font-semibold leading-snug">{order.pickup_address}</p>
            {order.pickup_slot && <p className="text-xs text-slate-400 mt-1">{order.pickup_slot}</p>}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${getFormulaBadge(order.formula)}`}>{getFormulaLabel(order.formula)}</span>
          {order.washer && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-black text-xs">
                {order.washer.first_name?.[0]}{order.washer.last_name?.[0]}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">{order.washer.first_name} {order.washer.last_name}</p>
                {order.washer.avg_rating && order.washer.avg_rating > 0 && (
                  <div className="flex items-center gap-0.5">
                    <Star size={9} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-slate-400">{order.washer.avg_rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              {order.washer.phone && (
                <a href={`tel:${order.washer.phone}`} className="w-8 h-8 bg-teal-500 rounded-xl flex items-center justify-center text-white hover:bg-teal-600 transition">
                  <Phone size={14} />
                </a>
              )}
            </div>
          )}
        </div>
        {!order.washer_id && (
          <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-2xl p-3.5">
            <Loader2 size={18} className="text-orange-400 animate-spin flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-orange-600">Recherche d'un washer...</p>
              <p className="text-xs text-orange-400">Vous serez notifie par notification</p>
            </div>
          </div>
        )}
        {order.client_rating && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-xl p-3">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => <Star key={s} size={13} className={s <= order.client_rating! ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} />)}
            </div>
            <span className="text-xs text-yellow-700 font-bold">Votre avis a ete envoye</span>
          </div>
        )}
        {canRate && (
          <button onClick={() => onRate!(order)} className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl font-black hover:shadow-lg transition flex items-center justify-center gap-2">
            <Star size={16} className="fill-white" /> Notez votre washer
          </button>
        )}
        {order.status === 'pending' && onCancel && (
          <button onClick={() => onCancel(order.id)} className="w-full py-2.5 text-red-400 text-sm font-semibold hover:text-red-600 transition border border-red-100 rounded-xl hover:bg-red-50">
            Annuler cette commande
          </button>
        )}
        {canTrack && onTrack && (
          <button onClick={() => onTrack(order.id)} className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl font-black hover:shadow-lg transition flex items-center justify-center gap-2">
            <MapPin size={16} /> Suivre en temps reel
          </button>
        )}
      </div>
    </div>
  );
}

function HistoryRow({ order, onRate, clientName, clientEmail }: { order: Order; onRate?: (o: Order) => void; clientName?: string; clientEmail?: string }) {
  const [expanded, setExpanded] = useState(false);
  const canRate = !order.client_rating && onRate;
  return (
    <div className="border-b border-slate-50 last:border-0">
      <button onClick={() => setExpanded(!expanded)} className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle size={17} className="text-green-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800">#{order.id.slice(0,8).toUpperCase()}</p>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{formatDateRelative(order.completed_at ?? order.created_at)} · {order.weight} kg · {getFormulaLabel(order.formula)}</p>
            {order.client_rating && (
              <div className="flex gap-0.5 mt-1">{[1,2,3,4,5].map(s => <Star key={s} size={9} className={s <= order.client_rating! ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} />)}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <p className="font-black text-sm text-slate-800">{formatCurrency(parseFloat(String(order.total_price)))}</p>
          {expanded ? <ChevronUp size={15} className="text-slate-300" /> : <ChevronDown size={15} className="text-slate-300" />}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-2 bg-slate-50 border-t border-slate-100 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase mb-0.5">Adresse</p>
              <p className="text-sm text-slate-600">{order.pickup_address}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase mb-0.5">Date livraison</p>
              <p className="text-sm text-slate-600">{formatDate(order.completed_at ?? order.created_at)}</p>
            </div>
          </div>
          {order.client_review && (
            <div className="bg-white rounded-xl p-3 border border-slate-200">
              <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Votre avis</p>
              <p className="text-sm text-slate-600 italic">"{order.client_review}"</p>
            </div>
          )}
          <div className="flex gap-2">
            {clientName && clientEmail && (
              <div onClick={(e) => e.stopPropagation()}>
                <InvoiceGenerator
                  order={{
                    id: order.id,
                    created_at: order.created_at,
                    weight: order.weight,
                    formula: order.formula,
                    total_price: order.total_price,
                    pickup_address: order.pickup_address,
                    status: order.status,
                  }}
                  clientName={clientName}
                  clientEmail={clientEmail}
                />
              </div>
            )}
            {canRate && (
              <button onClick={() => onRate!(order)} className="flex-1 py-2.5 bg-yellow-400 text-yellow-900 rounded-xl font-bold text-xs hover:bg-yellow-500 transition flex items-center justify-center gap-1">
                <Star size={12} className="fill-yellow-900" /> Noter
              </button>
            )}
            <button onClick={() => window.location.href = '/new-order'} className="flex-1 py-2.5 bg-teal-500 text-white rounded-xl font-bold text-xs hover:bg-teal-600 transition flex items-center justify-center gap-1">
              <RotateCcw size={12} /> Re-commander
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ReferralCard({ profile }: { profile: UserProfile }) {
  const code = profile.referral_code ?? '--';
  const copy = () => { navigator.clipboard.writeText(code); toast.success('Code copie !'); };
  const share = () => {
    if (navigator.share) navigator.share({ title: 'Kilolab', text: `Utilise mon code ${code} sur Kilolab !`, url: 'https://kilolab.fr' });
    else copy();
  };
  return (
    <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-5 text-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0"><Gift size={20} /></div>
        <div>
          <p className="font-black text-base">Invitez vos amis -- gagnez 5 EUR !</p>
          <p className="text-purple-200 text-xs mt-0.5">5 EUR offerts par ami qui commande</p>
        </div>
      </div>
      <div className="bg-white/20 rounded-2xl p-3 flex items-center justify-between mb-3">
        <div>
          <p className="text-purple-200 text-xs mb-0.5">Votre code</p>
          <p className="font-black text-2xl tracking-widest">{code}</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <button onClick={copy} className="bg-white text-purple-600 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1"><Copy size={11} /> Copier</button>
          <button onClick={share} className="bg-white/20 text-white px-3 py-1.5 rounded-xl font-bold text-xs">Partager</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/10 rounded-xl p-2.5 text-center">
          <p className="text-xl font-black">{profile.uses_count ?? 0}</p>
          <p className="text-purple-200 text-xs">Amis invites</p>
        </div>
        <div className="bg-white/10 rounded-xl p-2.5 text-center">
          <p className="text-xl font-black">{((profile.bonus_earned_cents ?? 0) / 100).toFixed(0)} EUR</p>
          <p className="text-purple-200 text-xs">Bonus gagne</p>
        </div>
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  const { t } = useTranslation();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [cancelledOrders, setCancelledOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0, totalKg: 0, avgOrderValue: 0 });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'loyalty' | 'subscription' | 'referral'>('orders');
  const [showChat, setShowChat] = useState(false);
  const [chatOrder, setChatOrder] = useState<Order | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [showCancelled, setShowCancelled] = useState(false);
  const fetchLockRef = useRef(false);

  const loadDashboard = useCallback(async () => {
    if (fetchLockRef.current) return;
    fetchLockRef.current = true;
    try {
      setRefreshing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUserId(user.id);
      setUserEmail(user.email || '');
      
      // Try with washer join first, fallback to simple query
      let orders: any[] | null = null;
      let queryError: any = null;
      
      // Attempt 1: Query with left join on washers
      const { data: ordersWithJoin, error: joinError } = await supabase
        .from('orders')
        .select('*, washer:washers(id, first_name, last_name, avatar_url, avg_rating, total_ratings, phone)')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });
      
      if (!joinError && ordersWithJoin) {
        orders = ordersWithJoin;
      } else {
        // Attempt 2: Simple query without join
        const { data: simpleOrders, error: simpleError } = await supabase
          .from('orders')
          .select('*')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false });
        
        orders = simpleOrders;
        queryError = simpleError;
        
        // If we got orders, fetch washer info separately
        if (simpleOrders && simpleOrders.length > 0) {
          const washerIds = [...new Set(simpleOrders.filter(o => o.washer_id).map(o => o.washer_id))];
          if (washerIds.length > 0) {
            const { data: washers } = await supabase
              .from('washers')
              .select('id, first_name, last_name, avatar_url, avg_rating, total_ratings, phone')
              .in('id', washerIds);
            
            if (washers) {
              const washerMap = new Map(washers.map(w => [w.id, w]));
              orders = simpleOrders.map(o => ({
                ...o,
                washer: o.washer_id ? washerMap.get(o.washer_id) ?? null : null,
              }));
            }
          }
        }
      }
      
      if (queryError) console.error('Error fetching orders:', queryError);
      
      const all = (orders ?? []) as Order[];
      
      const inactiveStatuses = ['cancelled', 'completed', 'refunded'];
      const active = all.filter(o => !inactiveStatuses.includes(o.status));
      const completedUnrated = all.filter(o => o.status === 'completed' && !o.client_rating);
      const past = all.filter(o => o.status === 'completed');
      const cancelled = all.filter(o => o.status === 'cancelled' || o.status === 'refunded');
      setActiveOrders([...active, ...completedUnrated]);
      setPastOrders(past);
      setCancelledOrders(cancelled);
      const totalSpent = past.reduce((s, o) => s + (parseFloat(String(o.total_price)) || 0), 0);
      const totalKg = all.reduce((s, o) => s + (parseFloat(String(o.weight)) || 0), 0);
      const valid = all.filter(o => o.status !== 'cancelled');
      setStats({ totalOrders: valid.length, totalSpent, totalKg, avgOrderValue: past.length > 0 ? totalSpent / past.length : 0 });
      
      const { data: prof } = await supabase.from('user_profiles').select('id, full_name, first_name, referral_credit, loyalty_points').eq('id', user.id).maybeSingle();
      const { data: refCode } = await supabase.from('referral_codes').select('code, uses_count, bonus_earned_cents').eq('user_id', user.id).maybeSingle();
      const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).eq('status', 'active').maybeSingle();
      
      if (prof) setProfile({ 
        id: prof.id, 
        full_name: prof.full_name ?? null,
        first_name: prof.first_name ?? null,
        referral_code: refCode?.code ?? null, 
        uses_count: refCode?.uses_count ?? 0, 
        bonus_earned_cents: refCode?.bonus_earned_cents ?? 0, 
        referral_credit: prof.referral_credit ?? 0,
        loyalty_points: prof.loyalty_points ?? 0,
      });
      if (sub) setSubscription(sub);
    } catch (err) { console.error(err); }
    finally { setLoading(false); setRefreshing(false); fetchLockRef.current = false; }
  }, []);

  useEffect(() => {
    loadDashboard();
    const t = setInterval(loadDashboard, 30000);
    return () => clearInterval(t);
  }, [loadDashboard]);

  useEffect(() => {
    const sub = supabase.channel('client_rt')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, loadDashboard)
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [loadDashboard]);

  const cancelOrder = async (id: string) => {
    if (!confirm('Annuler cette commande ?')) return;
    setCancelling(id);
    try {
      const { error } = await supabase.from('orders').update({ status: 'cancelled' }).eq('id', id).eq('status', 'pending');
      if (error) throw error;
      toast.success('Commande annulee');
      await loadDashboard();
    } catch { toast.error("Impossible d'annuler"); }
    finally { setCancelling(null); }
  };

  const submitRating = async (id: string, rating: number, review: string) => {
    try {
      // Get the order to find the washer
      const { data: order } = await supabase.from('orders').select('washer_id').eq('id', id).single();
      
      // Update order with rating
      const { error } = await supabase.from('orders').update({ 
        client_rating: rating, 
        client_review: review,
        rated_at: new Date().toISOString()
      }).eq('id', id);
      if (error) throw error;
      
      // Update washer's average rating
      if (order?.washer_id) {
        // Get all ratings for this washer
        const { data: washerOrders } = await supabase
          .from('orders')
          .select('client_rating')
          .eq('washer_id', order.washer_id)
          .not('client_rating', 'is', null);
        
        if (washerOrders && washerOrders.length > 0) {
          const totalRatings = washerOrders.length;
          const avgRating = washerOrders.reduce((sum, o) => sum + (o.client_rating || 0), 0) / totalRatings;
          
          // Update washer profile with new average
          await supabase.from('washers').update({
            avg_rating: parseFloat(avgRating.toFixed(2)),
            total_ratings: totalRatings,
            updated_at: new Date().toISOString()
          }).eq('id', order.washer_id);
        }
      }
      
      // Award loyalty points for leaving a review
      if (userId) {
        await supabase.rpc('add_loyalty_points', { 
          p_user_id: userId, 
          p_points: 50,
          p_reason: 'Avis laissé'
        }).catch(() => {/* ignore if function doesn't exist */});
      }
      
      toast.success(t('clientDashboard.ratingThanks'));
      await loadDashboard();
    } catch { toast.error(t('clientDashboard.ratingError')); }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <ClientDashboardSkeleton />
    </div>
  );

  const hasNoOrders = activeOrders.length === 0 && pastOrders.length === 0 && cancelledOrders.length === 0;
  const displayed = showAllHistory ? pastOrders : pastOrders.slice(0, 5);
  // Use first_name if available, otherwise extract from full_name
  const firstName = profile?.first_name || profile?.full_name?.split(' ')[0];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      {ratingOrder && <RatingModal order={ratingOrder} onClose={() => setRatingOrder(null)} onSubmit={submitRating} />}
      <div className="max-w-lg mx-auto px-4 pt-24 md:pt-28 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">{firstName ? t('clientDashboard.greeting', { name: firstName }) : t('clientDashboard.greetingDefault')}</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {activeOrders.filter(o => ['pending','assigned','picked_up','washing','ready'].includes(o.status)).length > 0
                ? `${activeOrders.filter(o => ['pending','assigned','picked_up','washing','ready'].includes(o.status)).length} ${t('clientDashboard.activeOrders')}`
                : t('clientDashboard.noActiveOrders')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadDashboard} disabled={refreshing} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition shadow-sm">
              <RefreshCw size={15} className={`text-slate-400 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => window.location.href = '/new-order'} className="flex items-center gap-1.5 bg-teal-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-teal-600 transition shadow-sm">
              <Plus size={15} /> {t('clientDashboard.order')}
            </button>
          </div>
        </div>
        {stats.totalOrders > 0 && (
          <FadeInOnScroll direction="up" delay={100}>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { label: t('clientDashboard.stats.orders'), value: stats.totalOrders, color: 'text-teal-600', isCount: true },
                { label: t('clientDashboard.stats.kgWashed'), value: stats.totalKg, color: 'text-purple-600', suffix: ' kg', isCount: true },
                { label: t('clientDashboard.stats.total'), value: stats.totalSpent, color: 'text-green-600', prefix: '', suffix: ' EUR', isCount: true },
                { label: t('clientDashboard.stats.points'), value: profile?.loyalty_points || 0, color: 'text-amber-500', suffix: ' pts', isCount: true },
              ].map((s, i) => (
                <div key={s.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-slate-100 hover:shadow-md hover:scale-105 transition-all duration-300">
                  <p className={`font-black text-base ${s.color}`}>
                    {s.isCount ? (
                      <CountUp 
                        end={typeof s.value === 'number' ? Math.round(s.value) : 0} 
                        prefix={s.prefix || ''} 
                        suffix={s.suffix || ''} 
                        duration={1500} 
                      />
                    ) : s.value}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeInOnScroll>
        )}

        {/* Tabs Navigation */}
        {stats.totalOrders > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === 'orders' ? 'bg-teal-500 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              <Package size={16} /> {t('dashboard.tabs.orders')}
            </button>
            <button 
              onClick={() => setActiveTab('loyalty')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === 'loyalty' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              <Crown size={16} /> {t('dashboard.tabs.loyalty')}
            </button>
            <button 
              onClick={() => setActiveTab('subscription')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === 'subscription' ? 'bg-purple-500 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              <Repeat size={16} /> {t('dashboard.tabs.subscription')}
            </button>
            <button 
              onClick={() => setActiveTab('referral')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === 'referral' ? 'bg-violet-500 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              <Users size={16} /> {t('dashboard.tabs.referral')}
            </button>
          </div>
        )}

        {/* Tab Content - Orders */}
        {activeTab === 'orders' && (
          <>
        {/* Notification Toggle */}
        <FadeInOnScroll direction="up" delay={100}>
          <div className="mb-6">
            <NotificationToggle />
          </div>
        </FadeInOnScroll>

        {activeOrders.length > 0 && (
          <FadeInOnScroll direction="up" delay={200}>
            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <h2 className="font-black text-slate-900">{t('clientDashboard.active')}</h2>
                <span className="text-sm text-slate-400">({activeOrders.filter(o => ['pending','assigned','picked_up','washing','ready'].includes(o.status)).length})</span>
              </div>
              {activeOrders.map((order, idx) => (
                <div key={order.id} style={{ animationDelay: `${idx * 100}ms` }} className="animate-in fade-in slide-in-from-bottom-4">
                  <ActiveOrderCard 
                    order={order} 
                    onCancel={cancelling === order.id ? undefined : cancelOrder} 
                    onRate={setRatingOrder} 
                    onTrack={setTrackingOrderId}
                    clientName={profile?.full_name || 'Client'}
                    clientEmail={userEmail}
                  />
                </div>
              ))}
            </div>
          </FadeInOnScroll>
        )}
        {hasNoOrders && (
          <FadeInOnScroll direction="up" delay={100}>
            <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-100 mb-8 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Sparkles size={30} className="text-teal-500" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">{t('clientDashboard.welcome')}</h3>
              <p className="text-slate-400 text-sm mb-6">{t('clientDashboard.welcomeDesc')}</p>
              <button onClick={() => window.location.href = '/new-order'} className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-8 py-3.5 rounded-2xl font-black hover:shadow-lg hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
                {t('clientDashboard.firstOrder')} <ArrowRight size={15} />
              </button>
            </div>
          </FadeInOnScroll>
        )}
        {profile && stats.totalOrders >= 1 && <FadeInOnScroll direction="up" delay={300}><div className="mb-8"><ReferralCard profile={profile} /></div></FadeInOnScroll>}
        {pastOrders.length > 0 && (
          <FadeInOnScroll direction="up" delay={400}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-black text-slate-900 flex items-center gap-2">
                  <Clock size={16} className="text-slate-400" /> {t('clientDashboard.history')}
                  <span className="text-sm font-normal text-slate-400">({pastOrders.length})</span>
                </h2>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300">
                {displayed.map(order => <HistoryRow key={order.id} order={order} onRate={setRatingOrder} clientName={profile?.full_name || 'Client'} clientEmail={userEmail} />)}
              </div>
              {pastOrders.length > 5 && (
                <button onClick={() => setShowAllHistory(!showAllHistory)} className="w-full mt-3 py-3 bg-white border border-slate-200 rounded-2xl text-slate-500 font-bold text-sm hover:bg-slate-50 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
                  {showAllHistory ? <><ChevronUp size={15} /> {t('clientDashboard.collapse')}</> : <><ChevronDown size={15} /> {pastOrders.length - 5} {t('clientDashboard.showMore')}</>}
                </button>
              )}
              
              {/* Cancelled Orders Section */}
              {cancelledOrders.length > 0 && (
                <div className="mt-6">
                  <button 
                    onClick={() => setShowCancelled(!showCancelled)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-700 font-bold text-sm mb-3"
                  >
                    <X size={14} />
                    Commandes annulées ({cancelledOrders.length})
                    {showCancelled ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  
                  {showCancelled && (
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                      {cancelledOrders.map(order => (
                        <div key={order.id} className="px-4 py-3.5 border-b border-slate-100 last:border-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <X size={17} className="text-red-500" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-600">#{order.id.slice(0,8).toUpperCase()}</p>
                                <p className="text-xs text-slate-400">{formatDateRelative(order.created_at)} · {order.weight} kg</p>
                              </div>
                            </div>
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full font-bold">{t('clientDashboard.cancelled')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-5 text-center">
                <button onClick={() => window.location.href = '/new-order'} className="text-teal-500 font-bold text-sm hover:underline inline-flex items-center gap-1 hover:gap-2 transition-all duration-300">
                  {t('clientDashboard.orderAgain')} <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </FadeInOnScroll>
        )}
          </>
        )}

        {/* Tab Content - Loyalty */}
        {activeTab === 'loyalty' && userId && (
          <FadeInOnScroll direction="up" delay={100}>
            <div className="space-y-6">
              <LoyaltyCard userId={userId} />
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Gift size={18} className="text-teal-500" /> Comment gagner des points
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <span className="text-2xl">🛒</span>
                    <div>
                      <p className="font-bold text-slate-900">Commander du lavage</p>
                      <p className="text-sm text-slate-500">10 points par euro dépensé</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <p className="font-bold text-slate-900">Laisser un avis</p>
                      <p className="text-sm text-slate-500">+50 points par avis</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <span className="text-2xl">👥</span>
                    <div>
                      <p className="font-bold text-slate-900">Parrainer un ami</p>
                      <p className="text-sm text-slate-500">+100 points par filleul</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInOnScroll>
        )}

        {/* Tab Content - Subscription */}
        {activeTab === 'subscription' && (
          <FadeInOnScroll direction="up" delay={100}>
            <div className="space-y-6">
              {subscription ? (
                <SubscriptionCard 
                  subscription={subscription} 
                  onManage={() => {/* TODO: open manager modal */}} 
                />
              ) : (
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
                      🔄
                    </div>
                    <div>
                      <h3 className="font-black text-lg">Passez à l'abonnement</h3>
                      <p className="text-white/70 text-sm">Économisez jusqu'à 15%</p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-4">
                    Programmez vos lavages et profitez de réductions automatiques. 
                    Plus besoin d'y penser !
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="font-black text-lg">-15%</p>
                      <p className="text-xs text-white/70">Hebdo</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="font-black text-lg">-10%</p>
                      <p className="text-xs text-white/70">Bi-mensuel</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="font-black text-lg">-5%</p>
                      <p className="text-xs text-white/70">Mensuel</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/new-order?subscription=true'}
                    className="w-full py-3 bg-white text-purple-600 rounded-2xl font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                  >
                    Créer mon abonnement <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </FadeInOnScroll>
        )}

        {/* Tab Content - Referral */}
        {activeTab === 'referral' && userId && (
          <FadeInOnScroll direction="up" delay={100}>
            <div className="space-y-6">
              <ReferralSystem userId={userId} />
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Gift size={18} className="text-purple-500" /> Comment ça marche
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                    <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">1</span>
                    <div>
                      <p className="font-bold text-slate-900">Partagez votre code</p>
                      <p className="text-sm text-slate-500">Via WhatsApp, SMS ou Email</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                    <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">2</span>
                    <div>
                      <p className="font-bold text-slate-900">Votre ami commande</p>
                      <p className="text-sm text-slate-500">Il obtient -20% sur sa 1ère commande</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                    <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</span>
                    <div>
                      <p className="font-bold text-slate-900">Vous gagnez des récompenses</p>
                      <p className="text-sm text-slate-500">+100 points fidélité par filleul</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInOnScroll>
        )}

        {!hasNoOrders && <p className="text-center text-xs text-slate-300 mt-8">Mise a jour automatique toutes les 30s</p>}
      </div>

      {/* Chat Bubble - Show only when there's an active order with a washer */}
      {activeOrders.filter(o => o.washer_id && ['assigned', 'picked_up', 'washing', 'ready'].includes(o.status)).length > 0 && !showChat && (
        <ChatBubble
          orderId={activeOrders.find(o => o.washer_id)?.id || ''}
          participantName={activeOrders.find(o => o.washer_id)?.washer?.first_name || 'Washer'}
          onClick={() => {
            const orderWithWasher = activeOrders.find(o => o.washer_id);
            if (orderWithWasher) {
              setChatOrder(orderWithWasher);
              setShowChat(true);
            }
          }}
        />
      )}

      {/* Chat Modal */}
      {showChat && chatOrder && chatOrder.washer && userId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-lg h-[80vh] sm:h-[600px]">
            <Chat
              orderId={chatOrder.id}
              currentUserId={userId}
              participant={{
                id: chatOrder.washer.id,
                name: `${chatOrder.washer.first_name} ${chatOrder.washer.last_name}`,
                avatar_url: chatOrder.washer.avatar_url || undefined,
                role: 'washer',
              }}
              onClose={() => {
                setShowChat(false);
                setChatOrder(null);
              }}
            />
          </div>
        </div>
      )}

      {/* GPS Tracking Modal */}
      {trackingOrderId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setTrackingOrderId(null)}>
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <button 
                onClick={() => setTrackingOrderId(null)}
                className="absolute -top-12 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg z-10"
              >
                <X size={20} />
              </button>
              <OrderTracking orderId={trackingOrderId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
