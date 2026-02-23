import { useEffect, useState, useCallback, useRef } from ‘react’;
import { supabase } from ‘../lib/supabase’;
import Navbar from ‘../components/Navbar’;
import {
Package, Clock, CheckCircle, MapPin, Loader2, ArrowRight,
Star, RefreshCw, Plus, Sparkles, Phone, TrendingUp,
Gift, Copy, ChevronDown, ChevronUp, ThumbsUp, X,
RotateCcw, AlertCircle
} from ‘lucide-react’;
import toast from ‘react-hot-toast’;

/* =========================================================
INTERFACES
========================================================= */

interface WasherInfo {
id: string;
first_name: string;
last_name: string;
avatar_url: string | null;
avg_rating: number | null;
total_ratings: number | null;
phone: string | null;
}

interface Order {
id: string;
created_at: string;
completed_at: string | null;
pickup_address: string;
pickup_date: string | null;
pickup_slot: string | null;
weight: number;
total_price: number;
formula: string;
status: string;
washer_id: string | null;
washer?: WasherInfo | null;
client_rating?: number | null;
client_review?: string | null;
}

interface ClientStats {
totalOrders: number;
totalSpent: number;
totalKg: number;
activeOrders: number;
avgOrderValue: number;
}

interface UserProfile {
id: string;
full_name: string | null;
referral_code: string | null;
referral_count: number;
referral_credit: number;
}

/* =========================================================
HELPERS
========================================================= */

function formatCurrency(amount: number): string {
return new Intl.NumberFormat(‘fr-FR’, { style: ‘currency’, currency: ‘EUR’ }).format(amount);
}

function formatDate(dateStr: string): string {
return new Date(dateStr).toLocaleDateString(‘fr-FR’, {
day: ‘2-digit’, month: ‘short’, year: ‘numeric’
});
}

function formatDateRelative(dateStr: string): string {
const date = new Date(dateStr);
const now = new Date();
const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
if (diffDays === 0) return “Aujourd’hui”;
if (diffDays === 1) return ‘Hier’;
if (diffDays < 7) return `Il y a ${diffDays} jours`;
return formatDate(dateStr);
}

function getFormulaLabel(formula: string): string {
const labels: Record<string, string> = {
eco: ‘🌿 Éco’,
standard: ‘🟢 Standard’,
premium: ‘⭐ Premium’,
express: ‘⚡ Express’,
};
return labels[formula] ?? formula;
}

function getFormulaBadgeClass(formula: string): string {
const map: Record<string, string> = {
express: ‘bg-purple-100 text-purple-700’,
eco: ‘bg-green-100 text-green-700’,
premium: ‘bg-yellow-100 text-yellow-700’,
};
return map[formula] ?? ‘bg-blue-100 text-blue-700’;
}

function getStatusInfo(status: string): { label: string; color: string; bg: string } {
const map: Record<string, { label: string; color: string; bg: string }> = {
pending:   { label: “📬 En attente d’un washer”, color: ‘text-orange-700’,  bg: ‘bg-orange-50 border-orange-200’   },
assigned:  { label: ‘👤 Washer assigné’,          color: ‘text-blue-700’,    bg: ‘bg-blue-50 border-blue-200’       },
picked_up: { label: ‘📦 Linge collecté’,          color: ‘text-violet-700’,  bg: ‘bg-violet-50 border-violet-200’   },
washing:   { label: ‘🫧 Lavage en cours’,         color: ‘text-teal-700’,    bg: ‘bg-teal-50 border-teal-200’       },
ready:     { label: ‘✅ Prêt pour livraison’,     color: ‘text-emerald-700’, bg: ‘bg-emerald-50 border-emerald-200’ },
completed: { label: ‘🎉 Livré !’,                 color: ‘text-green-700’,   bg: ‘bg-green-50 border-green-200’     },
};
return map[status] ?? { label: status, color: ‘text-slate-700’, bg: ‘bg-slate-50 border-slate-200’ };
}

/* =========================================================
PROGRESS BAR
========================================================= */

const STATUS_STEPS = [
{ key: ‘pending’,   label: ‘Reçu’,     icon: ‘📬’ },
{ key: ‘assigned’,  label: ‘Washer’,   icon: ‘👤’ },
{ key: ‘picked_up’, label: ‘Collecté’, icon: ‘📦’ },
{ key: ‘washing’,   label: ‘Lavage’,   icon: ‘🫧’ },
{ key: ‘ready’,     label: ‘Prêt’,     icon: ‘✅’ },
{ key: ‘completed’, label: ‘Livré’,    icon: ‘🎉’ },
];

function getStepIndex(status: string): number {
return STATUS_STEPS.findIndex((s) => s.key === status);
}

function ProgressBar({ status }: { status: string }) {
const currentIdx = getStepIndex(status);
const progress = ((currentIdx + 1) / STATUS_STEPS.length) * 100;

return (
<div className="mt-4">
{/* Icônes desktop */}
<div className="hidden sm:flex justify-between mb-3">
{STATUS_STEPS.map((step, idx) => (
<div key={step.key} className="flex flex-col items-center gap-1">
<div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all ${ idx < currentIdx ? 'bg-teal-500 text-white' : idx === currentIdx ? 'bg-teal-500 text-white ring-4 ring-teal-100' : 'bg-slate-100 text-slate-300' }`}>
{idx < currentIdx ? ‘✓’ : step.icon}
</div>
<span className={`text-xs font-medium ${idx <= currentIdx ? 'text-teal-600' : 'text-slate-300'}`}>
{step.label}
</span>
</div>
))}
</div>

```
  {/* Barre */}
  <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
    <div
      className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full transition-all duration-700"
      style={{ width: `${progress}%` }}
    />
  </div>

  {/* Label mobile */}
  <div className="sm:hidden mt-2 flex items-center justify-between">
    <span className="text-sm font-bold text-teal-600">
      {STATUS_STEPS[currentIdx]?.icon} {STATUS_STEPS[currentIdx]?.label}
    </span>
    <span className="text-slate-400 text-xs">{currentIdx + 1}/{STATUS_STEPS.length}</span>
  </div>
</div>
```

);
}

/* =========================================================
WASHER CARD
========================================================= */

function WasherCard({ washer }: { washer: WasherInfo }) {
return (
<div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-4 flex items-center gap-4">
<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-sm">
{washer.avatar_url ? (
<img src={washer.avatar_url} alt="" className="w-full h-full rounded-2xl object-cover" />
) : (
`${washer.first_name?.[0] ?? ''}${washer.last_name?.[0] ?? ''}`
)}
</div>
<div className="flex-1 min-w-0">
<p className="text-xs text-teal-600 font-semibold uppercase tracking-wide mb-0.5">Votre washer</p>
<p className="font-black text-slate-800 truncate">{washer.first_name} {washer.last_name}</p>
{washer.avg_rating && washer.avg_rating > 0 ? (
<div className="flex items-center gap-1 mt-1">
{[1, 2, 3, 4, 5].map((star) => (
<Star
key={star}
size={10}
className={star <= Math.round(washer.avg_rating!) ? ‘text-yellow-400 fill-yellow-400’ : ‘text-slate-200’}
/>
))}
<span className="text-xs text-slate-500 ml-1">
{washer.avg_rating.toFixed(1)}
{washer.total_ratings ? ` (${washer.total_ratings})` : ‘’}
</span>
</div>
) : (
<span className="text-xs text-slate-400">✨ Nouveau washer</span>
)}
</div>
{washer.phone && (
<a
href={`tel:${washer.phone}`}
className=“flex-shrink-0 w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white hover:bg-teal-600 transition shadow-sm”
title=“Appeler le washer”
>
<Phone size={18} />
</a>
)}
</div>
);
}

/* =========================================================
MODAL NOTATION
========================================================= */

function RatingModal({
order,
onClose,
onSubmit,
}: {
order: Order;
onClose: () => void;
onSubmit: (orderId: string, rating: number, review: string) => Promise<void>;
}) {
const [rating, setRating] = useState(0);
const [hover, setHover] = useState(0);
const [review, setReview] = useState(’’);
const [submitting, setSubmitting] = useState(false);

const labels = [’’, ‘Décevant 😕’, ‘Moyen 😐’, ‘Bien 🙂’, ‘Très bien 😊’, ‘Excellent ! 🤩’];

const handleSubmit = async () => {
if (rating === 0) { toast.error(‘Choisissez une note’); return; }
setSubmitting(true);
await onSubmit(order.id, rating, review);
setSubmitting(false);
onClose();
};

return (
<div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
<div className=“bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl” onClick={(e) => e.stopPropagation()}>
<div className="flex items-center justify-between mb-5">
<h3 className="text-lg font-black text-slate-900">Votre avis</h3>
<button
type="button"
onClick={onClose}
className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"
>
<X size={16} />
</button>
</div>

```
    {order.washer && (
      <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
          {order.washer.first_name?.[0]}{order.washer.last_name?.[0]}
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">{order.washer.first_name} {order.washer.last_name}</p>
          <p className="text-xs text-slate-400">{order.weight} kg · {getFormulaLabel(order.formula)}</p>
        </div>
      </div>
    )}

    {/* Étoiles */}
    <div className="flex justify-center gap-2 mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            size={38}
            className={`transition-colors ${
              star <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'
            }`}
          />
        </button>
      ))}
    </div>

    <p className="text-center text-sm font-bold text-slate-600 mb-4 min-h-[20px]">
      {labels[hover || rating]}
    </p>

    <textarea
      placeholder="Un commentaire ? (optionnel)"
      value={review}
      onChange={(e) => setReview(e.target.value)}
      rows={3}
      className="w-full border border-slate-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 mb-4"
    />

    <button
      type="button"
      onClick={handleSubmit}
      disabled={submitting || rating === 0}
      className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {submitting ? <Loader2 size={18} className="animate-spin" /> : <ThumbsUp size={18} />}
      Envoyer mon avis
    </button>
  </div>
</div>
```

);
}

/* =========================================================
ACTIVE ORDER CARD
========================================================= */

function ActiveOrderCard({
order,
onCancel,
onRate,
}: {
order: Order;
onCancel?: (id: string) => void;
onRate?: (order: Order) => void;
}) {
const isSearchingWasher = !order.washer_id;
const statusInfo = getStatusInfo(order.status);
const canRate = order.status === ‘completed’ && !order.client_rating && onRate;

return (
<div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
{/* Header */}
<div className="bg-gradient-to-r from-slate-900 to-slate-700 p-5 text-white">
<div className="flex items-center justify-between mb-2">
<span className="bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
En cours
</span>
<span className="text-white/50 text-xs font-mono">#{order.id.slice(0, 8).toUpperCase()}</span>
</div>
<div className="flex items-center justify-between">
<p className="text-white/60 text-sm">{formatDateRelative(order.created_at)}</p>
<p className="text-white font-black text-xl">{formatCurrency(parseFloat(String(order.total_price)))}</p>
</div>
</div>

```
  <div className="p-5 space-y-4">
    {/* Badge statut */}
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-bold ${statusInfo.bg} ${statusInfo.color}`}>
      {statusInfo.label}
    </div>

    {/* Barre de progression */}
    <ProgressBar status={order.status} />

    {/* Washer ou recherche */}
    {isSearchingWasher ? (
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-orange-200 flex items-center justify-center flex-shrink-0">
          <Loader2 size={16} className="text-orange-600 animate-spin" />
        </div>
        <div>
          <p className="text-sm font-bold text-orange-700">Recherche d'un washer...</p>
          <p className="text-xs text-orange-500">Vous serez notifié dès qu'un washer accepte</p>
        </div>
      </div>
    ) : order.washer ? (
      <WasherCard washer={order.washer} />
    ) : null}

    {/* Détails collecte */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="bg-slate-50 rounded-xl p-3 flex items-start gap-2">
        <MapPin size={15} className="text-slate-400 flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Collecte</p>
          <p className="text-sm text-slate-700 font-medium truncate">{order.pickup_address}</p>
          {order.pickup_slot && (
            <p className="text-xs text-slate-400 mt-1">🕐 {order.pickup_slot}</p>
          )}
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-3 flex items-start gap-2">
        <Package size={15} className="text-slate-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Détails</p>
          <p className="text-sm text-slate-700 font-black">{order.weight} kg</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold mt-1 inline-block ${getFormulaBadgeClass(order.formula)}`}>
            {getFormulaLabel(order.formula)}
          </span>
        </div>
      </div>
    </div>

    {/* CTA notation */}
    {canRate && (
      <button
        type="button"
        onClick={() => onRate(order)}
        className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-bold hover:shadow-md transition flex items-center justify-center gap-2 text-sm"
      >
        <Star size={16} className="fill-white" />
        Notez votre washer — ça l'aide beaucoup !
      </button>
    )}

    {/* Note déjà donnée */}
    {order.client_rating && (
      <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-xl p-3">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={14} className={s <= order.client_rating! ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} />
          ))}
        </div>
        <span className="text-xs text-yellow-700 font-medium">Avis envoyé ✓</span>
      </div>
    )}

    {/* Annulation */}
    {order.status === 'pending' && onCancel && (
      <button
        type="button"
        onClick={() => onCancel(order.id)}
        className="w-full text-red-400 text-sm font-medium hover:text-red-600 transition py-2 border border-red-100 rounded-xl hover:bg-red-50"
      >
        Annuler cette commande
      </button>
    )}
  </div>
</div>
```

);
}

/* =========================================================
HISTORY ROW (expandable)
========================================================= */

function HistoryRow({ order, onRate }: { order: Order; onRate?: (order: Order) => void }) {
const [expanded, setExpanded] = useState(false);
const canRate = !order.client_rating && onRate;

return (
<div className="border-b border-slate-100 last:border-0">
<button
type=“button”
onClick={() => setExpanded(!expanded)}
className=“w-full p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-slate-50 transition text-left”
>
<div className="flex items-center gap-3 min-w-0">
<div className="bg-green-100 p-2.5 rounded-xl flex-shrink-0">
<CheckCircle size={18} className="text-green-600" />
</div>
<div className="min-w-0">
<p className="font-bold text-slate-800 text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
<p className="text-xs text-slate-400 truncate mt-0.5">
{formatDateRelative(order.completed_at ?? order.created_at)} · {order.weight} kg · {getFormulaLabel(order.formula)}
</p>
{/* Étoiles si noté */}
{order.client_rating && (
<div className="flex gap-0.5 mt-1">
{[1, 2, 3, 4, 5].map((s) => (
<Star key={s} size={10} className={s <= order.client_rating! ? ‘text-yellow-400 fill-yellow-400’ : ‘text-slate-200’} />
))}
</div>
)}
</div>
</div>
<div className="flex items-center gap-2 flex-shrink-0">
<div className="text-right">
<p className="font-black text-slate-800 text-sm">{formatCurrency(parseFloat(String(order.total_price)))}</p>
{order.washer && (
<p className="text-xs text-slate-400">par {order.washer.first_name}</p>
)}
</div>
{expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
</div>
</button>

```
  {/* Détails expandés */}
  {expanded && (
    <div className="px-4 pb-4 space-y-3 bg-slate-50 border-t border-slate-100">
      <div className="grid grid-cols-2 gap-3 pt-3">
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Adresse</p>
          <p className="text-sm text-slate-700">{order.pickup_address}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Livré le</p>
          <p className="text-sm text-slate-700">{formatDate(order.completed_at ?? order.created_at)}</p>
        </div>
      </div>

      {order.client_review && (
        <div className="bg-white rounded-xl p-3 border border-slate-200">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Votre avis</p>
          <p className="text-sm text-slate-600 italic">"{order.client_review}"</p>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        {canRate && (
          <button
            type="button"
            onClick={() => onRate(order)}
            className="flex-1 py-2.5 bg-yellow-400 text-yellow-900 rounded-xl font-bold text-xs hover:bg-yellow-500 transition flex items-center justify-center gap-1"
          >
            <Star size={13} className="fill-yellow-900" /> Noter
          </button>
        )}
        <button
          type="button"
          onClick={() => window.location.href = '/new-order'}
          className="flex-1 py-2.5 bg-teal-500 text-white rounded-xl font-bold text-xs hover:bg-teal-600 transition flex items-center justify-center gap-1"
        >
          <RotateCcw size={13} /> Re-commander
        </button>
      </div>
    </div>
  )}
</div>
```

);
}

/* =========================================================
REFERRAL CARD
========================================================= */

function ReferralCard({ profile }: { profile: UserProfile }) {
const code = profile.referral_code ?? ‘—’;

const copyCode = () => {
navigator.clipboard.writeText(code);
toast.success(‘Code copié ! 🎉’);
};

const share = () => {
if (navigator.share) {
navigator.share({
title: ‘Kilolab — Le linge lavé à domicile’,
text: `Utilise mon code ${code} sur Kilolab et économise sur ta première commande !`,
url: ‘https://kilolab.fr’,
});
} else {
copyCode();
}
};

return (
<div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl">
<div className="flex items-start gap-3 mb-5">
<div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
<Gift size={24} />
</div>
<div>
<h3 className="font-black text-lg leading-tight">Invitez vos amis,<br />gagnez 5 € !</h3>
<p className="text-purple-200 text-xs mt-1">5 € offerts pour chaque ami qui commande</p>
</div>
</div>

```
  <div className="bg-white/20 rounded-2xl p-3 flex items-center justify-between mb-4">
    <div>
      <p className="text-purple-200 text-xs mb-0.5">Votre code</p>
      <p className="font-black text-2xl tracking-widest">{code}</p>
    </div>
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={copyCode}
        className="bg-white text-purple-600 px-3 py-1.5 rounded-xl font-bold text-xs hover:bg-purple-50 transition flex items-center gap-1"
      >
        <Copy size={12} /> Copier
      </button>
      <button
        type="button"
        onClick={share}
        className="bg-white/20 text-white px-3 py-1.5 rounded-xl font-bold text-xs hover:bg-white/30 transition flex items-center gap-1"
      >
        Partager
      </button>
    </div>
  </div>

  <div className="grid grid-cols-2 gap-3">
    <div className="bg-white/10 rounded-xl p-3 text-center">
      <p className="text-2xl font-black">{profile.referral_count ?? 0}</p>
      <p className="text-purple-200 text-xs mt-0.5">Amis invités</p>
    </div>
    <div className="bg-white/10 rounded-xl p-3 text-center">
      <p className="text-2xl font-black">{formatCurrency(profile.referral_credit ?? 0)}</p>
      <p className="text-purple-200 text-xs mt-0.5">Crédits gagnés</p>
    </div>
  </div>
</div>
```

);
}

/* =========================================================
MAIN COMPONENT
========================================================= */

export default function ClientDashboard() {
const [activeOrders, setActiveOrders] = useState<Order[]>([]);
const [pastOrders, setPastOrders] = useState<Order[]>([]);
const [stats, setStats] = useState<ClientStats>({
totalOrders: 0,
totalSpent: 0,
totalKg: 0,
activeOrders: 0,
avgOrderValue: 0,
});
const [profile, setProfile] = useState<UserProfile | null>(null);
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [cancelling, setCancelling] = useState<string | null>(null);
const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
const [showAllHistory, setShowAllHistory] = useState(false);

const fetchLockRef = useRef(false);

/* ─── Chargement ─────────────────────────────────────────────────────────── */

const loadDashboard = useCallback(async () => {
if (fetchLockRef.current) return;
fetchLockRef.current = true;

```
try {
  setRefreshing(true);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { window.location.href = '/login'; return; }

  // Commandes + washer joint
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      washer:washers(
        id,
        first_name,
        last_name,
        avatar_url,
        avg_rating,
        total_ratings,
        phone
      )
    `)
    .eq('client_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur chargement commandes:', error);
    toast.error('Erreur lors du chargement');
    return;
  }

  const allOrders = (orders ?? []) as Order[];

  const active = allOrders.filter((o) =>
    ['pending', 'assigned', 'picked_up', 'washing', 'ready'].includes(o.status)
  );
  // Les commandes "completed" non notées remontent aussi en "actives" pour afficher le CTA notation
  const completedUnrated = allOrders.filter((o) => o.status === 'completed' && !o.client_rating);
  const past = allOrders.filter((o) => o.status === 'completed');

  setActiveOrders([...active, ...completedUnrated]);
  setPastOrders(past);

  const totalSpent = past.reduce((s, o) => s + (parseFloat(String(o.total_price)) || 0), 0);
  const totalKg = allOrders.reduce((s, o) => s + (parseFloat(String(o.weight)) || 0), 0);
  const validOrders = allOrders.filter((o) => o.status !== 'cancelled');

  setStats({
    totalOrders: validOrders.length,
    totalSpent,
    totalKg,
    activeOrders: active.length,
    avgOrderValue: past.length > 0 ? totalSpent / past.length : 0,
  });

  // Profil utilisateur (parrainage)
  const { data: prof } = await supabase
    .from('profiles')
    .select('id, full_name, referral_code, referral_count, referral_credit')
    .eq('id', user.id)
    .single();

  if (prof) setProfile(prof as UserProfile);

} catch (err) {
  console.error('Erreur loadDashboard:', err);
} finally {
  setLoading(false);
  setRefreshing(false);
  fetchLockRef.current = false;
}
```

}, []);

useEffect(() => {
loadDashboard();
const interval = setInterval(loadDashboard, 30000);
return () => clearInterval(interval);
}, [loadDashboard]);

// Realtime subscription
useEffect(() => {
const sub = supabase
.channel(‘client_orders_realtime’)
.on(‘postgres_changes’, { event: ‘UPDATE’, schema: ‘public’, table: ‘orders’ }, () => {
loadDashboard();
})
.subscribe();
return () => { supabase.removeChannel(sub); };
}, [loadDashboard]);

/* ─── Annulation ─────────────────────────────────────────────────────────── */

const cancelOrder = async (orderId: string) => {
if (!window.confirm(‘Voulez-vous vraiment annuler cette commande ?’)) return;
setCancelling(orderId);
try {
const { error } = await supabase
.from(‘orders’)
.update({ status: ‘cancelled’ })
.eq(‘id’, orderId)
.eq(‘status’, ‘pending’);

```
  if (error) throw error;
  toast.success('Commande annulée');
  await loadDashboard();
} catch {
  toast.error("Impossible d'annuler cette commande");
} finally {
  setCancelling(null);
}
```

};

/* ─── Notation ───────────────────────────────────────────────────────────── */

const submitRating = async (orderId: string, rating: number, review: string) => {
try {
const { error } = await supabase
.from(‘orders’)
.update({ client_rating: rating, client_review: review })
.eq(‘id’, orderId);

```
  if (error) throw error;
  toast.success('Merci pour votre avis ! ⭐');
  await loadDashboard();
} catch {
  toast.error("Erreur lors de l'envoi de l'avis");
}
```

};

/* ─── Loading ────────────────────────────────────────────────────────────── */

if (loading) {
return (
<div className="min-h-screen bg-slate-50">
<Navbar />
<div className="flex items-center justify-center h-[80vh]">
<div className="text-center">
<Loader2 className="animate-spin mx-auto mb-4 text-teal-500" size={40} />
<p className="text-slate-500 font-medium">Chargement de vos commandes…</p>
</div>
</div>
</div>
);
}

const hasNoOrders = activeOrders.length === 0 && pastOrders.length === 0;
const displayedHistory = showAllHistory ? pastOrders : pastOrders.slice(0, 5);

/* ─── DASHBOARD ──────────────────────────────────────────────────────────── */

return (
<div className="min-h-screen bg-slate-50">
<Navbar />

```
  {/* Modal de notation */}
  {ratingOrder && (
    <RatingModal
      order={ratingOrder}
      onClose={() => setRatingOrder(null)}
      onSubmit={submitRating}
    />
  )}

  <div className="max-w-2xl mx-auto px-4 pt-24 md:pt-28 pb-12">

    {/* ── HEADER ─────────────────────────────────────────────────────────── */}
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900">
          {profile?.full_name ? `Bonjour ${profile.full_name.split(' ')[0]} 👋` : 'Mes commandes'}
        </h1>
        <p className="text-slate-400 text-sm mt-1">Suivez vos lavages en temps réel</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={loadDashboard}
          disabled={refreshing}
          className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition"
          title="Rafraîchir"
        >
          <RefreshCw size={16} className={`text-slate-500 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
        <button
          type="button"
          onClick={() => window.location.href = '/new-order'}
          className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-teal-600 transition shadow-sm"
        >
          <Plus size={16} /> Commander
        </button>
      </div>
    </div>

    {/* ── STATS ─────────────────────────────────────────────────────────── */}
    {stats.totalOrders > 0 && (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
          <p className="text-2xl font-black text-teal-600">{stats.totalOrders}</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Commandes</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
          <p className="text-2xl font-black text-purple-600">{stats.totalKg.toFixed(0)} kg</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Lavés</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
          <p className="text-xl font-black text-green-600">{formatCurrency(stats.totalSpent)}</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Total dépensé</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
          <p className="text-xl font-black text-orange-500">{formatCurrency(stats.avgOrderValue)}</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Panier moyen</p>
        </div>
      </div>
    )}

    {/* ── COMMANDES ACTIVES ─────────────────────────────────────────────── */}
    {activeOrders.length > 0 && (
      <div className="mb-8">
        <h2 className="font-black text-lg text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
          En cours ({activeOrders.filter(o => ['pending','assigned','picked_up','washing','ready'].includes(o.status)).length})
        </h2>
        <div className="space-y-4">
          {activeOrders.map((order) => (
            <ActiveOrderCard
              key={order.id}
              order={order}
              onCancel={cancelling === order.id ? undefined : cancelOrder}
              onRate={setRatingOrder}
            />
          ))}
        </div>
      </div>
    )}

    {/* ── ÉTAT VIDE ─────────────────────────────────────────────────────── */}
    {hasNoOrders && (
      <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-100 mb-8">
        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles size={32} className="text-teal-500" />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">Bienvenue sur Kilolab !</h3>
        <p className="text-slate-400 text-sm mb-6">
          Votre linge lavé, séché et plié — sans bouger de chez vous.
        </p>
        <button
          type="button"
          onClick={() => window.location.href = '/new-order'}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-8 py-3.5 rounded-2xl font-black hover:shadow-lg transition flex items-center gap-2 mx-auto"
        >
          Lancer ma première lessive <ArrowRight size={16} />
        </button>
      </div>
    )}

    {/* ── PARRAINAGE (après 1ère commande) ─────────────────────────────── */}
    {profile && stats.totalOrders >= 1 && (
      <div className="mb-8">
        <ReferralCard profile={profile} />
      </div>
    )}

    {/* ── HISTORIQUE ────────────────────────────────────────────────────── */}
    {pastOrders.length > 0 && (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-lg text-slate-900 flex items-center gap-2">
            <Clock size={18} className="text-slate-400" />
            Historique
            <span className="text-sm font-normal text-slate-400">({pastOrders.length})</span>
          </h2>
          {stats.totalSpent > 0 && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <TrendingUp size={13} />
              <span>{formatCurrency(stats.totalSpent)}</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {displayedHistory.map((order) => (
            <HistoryRow
              key={order.id}
              order={order}
              onRate={setRatingOrder}
            />
          ))}
        </div>

        {/* Voir plus */}
        {pastOrders.length > 5 && (
          <button
            type="button"
            onClick={() => setShowAllHistory(!showAllHistory)}
            className="w-full mt-3 py-3 bg-white border border-slate-200 rounded-2xl text-slate-500 font-bold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2"
          >
            {showAllHistory ? (
              <><ChevronUp size={16} /> Réduire</>
            ) : (
              <><ChevronDown size={16} /> Voir {pastOrders.length - 5} commandes de plus</>
            )}
          </button>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => window.location.href = '/new-order'}
            className="text-teal-500 font-bold text-sm hover:underline flex items-center gap-1 mx-auto"
          >
            Commander à nouveau <ArrowRight size={14} />
          </button>
        </div>
      </div>
    )}

    {!hasNoOrders && (
      <p className="text-center text-xs text-slate-300 mt-8">
        Mise à jour automatique toutes les 30s
      </p>
    )}
  </div>
</div>
```

);
}