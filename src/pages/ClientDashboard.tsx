import { useEffect, useState, useCallback } from ‘react’;
import { supabase } from ‘../lib/supabase’;
import Navbar from ‘../components/Navbar’;
import {
Package, Clock, CheckCircle, MapPin, Loader2, ArrowRight,
Star, User, ChevronRight, RefreshCw, Plus, Sparkles,
AlertCircle, Phone, MessageCircle, TrendingUp
} from ‘lucide-react’;
import toast from ‘react-hot-toast’;

// ─── Interfaces ────────────────────────────────────────────────────────────────

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
}

interface ClientStats {
totalOrders: number;
totalSpent: number;
totalKg: number;
activeOrders: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
return new Intl.NumberFormat(‘fr-FR’, { style: ‘currency’, currency: ‘EUR’ }).format(amount);
}

function formatDate(dateStr: string): string {
return new Date(dateStr).toLocaleDateString(‘fr-FR’, {
day: ‘2-digit’, month: ‘short’, year: ‘numeric’
});
}

function getFormulaLabel(formula: string): string {
const labels: Record<string, string> = {
eco: ‘Formule Éco’,
standard: ‘Formule Standard’,
premium: ‘Formule Premium’,
express: ‘Formule Express’,
};
return labels[formula] ?? formula;
}

// ─── Progress steps ───────────────────────────────────────────────────────────

const STATUS_STEPS: { key: string; label: string; icon: string }[] = [
{ key: ‘pending’,   label: ‘Reçu’,     icon: ‘📬’ },
{ key: ‘assigned’,  label: ‘Expert’,   icon: ‘👤’ },
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
return (
<div className="mt-4">
{/* Labels desktop */}
<div className="hidden sm:flex justify-between mb-2">
{STATUS_STEPS.map((step, idx) => (
<span
key={step.key}
className={`text-xs font-medium ${idx <= currentIdx ? 'text-teal-600' : 'text-slate-300'}`}
>
{step.label}
</span>
))}
</div>
{/* Barre */}
<div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
<div
className=“absolute left-0 top-0 h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full transition-all duration-500”
style={{ width: `${((currentIdx + 1) / STATUS_STEPS.length) * 100}%` }}
/>
</div>
{/* Label mobile : étape courante seulement */}
<div className="sm:hidden mt-2 text-center">
<span className="text-sm font-bold text-teal-600">
{STATUS_STEPS[currentIdx]?.icon} {STATUS_STEPS[currentIdx]?.label}
</span>
<span className="text-slate-400 text-xs ml-2">({currentIdx + 1}/{STATUS_STEPS.length})</span>
</div>
</div>
);
}

// ─── WasherCard ───────────────────────────────────────────────────────────────

function WasherCard({ washer }: { washer: WasherInfo }) {
return (
<div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 flex items-center gap-4">
<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
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
<Star size={12} className="text-yellow-400 fill-yellow-400" />
<span className="text-xs text-slate-600 font-medium">
{washer.avg_rating.toFixed(1)}
{washer.total_ratings && washer.total_ratings > 0 && (
<span className="text-slate-400 ml-1">({washer.total_ratings} avis)</span>
)}
</span>
</div>
) : (
<span className="text-xs text-slate-400">Nouveau washer</span>
)}
</div>
{washer.phone && (
<a
href={`tel:${washer.phone}`}
className=“flex-shrink-0 w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white hover:bg-teal-600 transition”
>
<Phone size={18} />
</a>
)}
</div>
);
}

// ─── OrderCard active ─────────────────────────────────────────────────────────

function ActiveOrderCard({ order, onCancel }: { order: Order; onCancel?: (id: string) => void }) {
const isSearchingWasher = !order.washer_id;

return (
<div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
{/* Header */}
<div className="bg-gradient-to-r from-slate-900 to-slate-700 p-5 text-white">
<div className="flex items-center justify-between mb-1">
<span className="bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full uppercase">
En cours
</span>
<span className="text-white/60 text-xs font-mono">#{order.id.slice(0, 8)}</span>
</div>
<p className="text-white/70 text-sm mt-2">{formatDate(order.created_at)}</p>
</div>

```
  <div className="p-5 space-y-4">
    {/* Progress */}
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
        <MapPin size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">Collecte</p>
          <p className="text-sm text-slate-700 font-medium truncate">{order.pickup_address}</p>
          {order.pickup_slot && (
            <p className="text-xs text-slate-400 mt-1">🕐 {order.pickup_slot}</p>
          )}
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-3 flex items-start gap-2">
        <Package size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">Détails</p>
          <p className="text-sm text-slate-700 font-bold">{order.weight} kg</p>
          <p className="text-xs text-slate-500">{getFormulaLabel(order.formula)}</p>
        </div>
      </div>
    </div>

    {/* Prix */}
    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
      <span className="text-slate-500 text-sm">Total payé</span>
      <span className="text-xl font-black text-slate-900">{formatCurrency(parseFloat(String(order.total_price)))}</span>
    </div>

    {/* Annulation si encore pending */}
    {order.status === 'pending' && onCancel && (
      <button
        onClick={() => onCancel(order.id)}
        className="w-full text-red-400 text-sm font-medium hover:text-red-600 transition py-2"
      >
        Annuler cette commande
      </button>
    )}
  </div>
</div>
```

);
}

// ─── Component principal ──────────────────────────────────────────────────────

export default function ClientDashboard() {
const [activeOrders, setActiveOrders] = useState<Order[]>([]);
const [pastOrders, setPastOrders] = useState<Order[]>([]);
const [stats, setStats] = useState<ClientStats>({ totalOrders: 0, totalSpent: 0, totalKg: 0, activeOrders: 0 });
const [loading, setLoading] = useState(true);
const [cancelling, setCancelling] = useState<string | null>(null);

// ─── Chargement ─────────────────────────────────────────────────────────────

const loadDashboard = useCallback(async () => {
try {
const { data: { user } } = await supabase.auth.getUser();
if (!user) { window.location.href = ‘/login’; return; }

```
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
  const past = allOrders.filter((o) => o.status === 'completed');

  setActiveOrders(active);
  setPastOrders(past);
  setStats({
    totalOrders: allOrders.length,
    totalSpent: past.reduce((s, o) => s + (parseFloat(String(o.total_price)) || 0), 0),
    totalKg: allOrders.reduce((s, o) => s + (parseFloat(String(o.weight)) || 0), 0),
    activeOrders: active.length,
  });
} catch (err) {
  console.error('Erreur loadDashboard:', err);
} finally {
  setLoading(false);
}
```

}, []);

useEffect(() => {
loadDashboard();
// Polling toutes les 30s pour les commandes actives
const interval = setInterval(loadDashboard, 30000);
return () => clearInterval(interval);
}, [loadDashboard]);

// Realtime subscription pour les mises à jour instantanées
useEffect(() => {
const sub = supabase
.channel(‘client_orders’)
.on(‘postgres_changes’, { event: ‘UPDATE’, schema: ‘public’, table: ‘orders’ }, () => {
loadDashboard();
})
.subscribe();
return () => { supabase.removeChannel(sub); };
}, [loadDashboard]);

// ─── Annulation ─────────────────────────────────────────────────────────────

const cancelOrder = async (orderId: string) => {
if (!window.confirm(‘Voulez-vous vraiment annuler cette commande ?’)) return;
setCancelling(orderId);
try {
const { error } = await supabase
.from(‘orders’)
.update({ status: ‘cancelled’ })
.eq(‘id’, orderId)
.eq(‘status’, ‘pending’); // sécurité : on ne peut annuler que si encore pending

```
  if (error) throw error;
  toast.success('Commande annulée');
  await loadDashboard();
} catch {
  toast.error('Impossible d\'annuler cette commande');
} finally {
  setCancelling(null);
}
```

};

// ─── Loading ─────────────────────────────────────────────────────────────────

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

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

return (
<div className="min-h-screen bg-slate-50">
<Navbar />

```
  <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">

    {/* ── HEADER ───────────────────────────────────────────────────────────── */}
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900">Mes commandes</h1>
        <p className="text-slate-400 text-sm mt-1">Suivez vos lavages en temps réel</p>
      </div>
      <button
        onClick={() => window.location.href = '/new-order'}
        className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-teal-600 transition shadow-sm"
      >
        <Plus size={16} /> Commander
      </button>
    </div>

    {/* ── STATS ─────────────────────────────────────────────────────────────── */}
    {stats.totalOrders > 0 && (
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
          <p className="text-2xl font-black text-teal-600">{stats.totalOrders}</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Commandes</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
          <p className="text-2xl font-black text-purple-600">{stats.totalKg.toFixed(0)} kg</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Lavés</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
          <p className="text-2xl font-black text-green-600">{formatCurrency(stats.totalSpent)}</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Dépensés</p>
        </div>
      </div>
    )}

    {/* ── COMMANDES ACTIVES ─────────────────────────────────────────────────── */}
    {activeOrders.length > 0 && (
      <div className="mb-8">
        <h2 className="font-black text-lg text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
          En cours ({activeOrders.length})
        </h2>
        <div className="space-y-4">
          {activeOrders.map((order) => (
            <ActiveOrderCard
              key={order.id}
              order={order}
              onCancel={cancelling === order.id ? undefined : cancelOrder}
            />
          ))}
        </div>
      </div>
    )}

    {/* ── ÉTAT VIDE (0 commandes) ───────────────────────────────────────────── */}
    {activeOrders.length === 0 && pastOrders.length === 0 && (
      <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-100 mb-8">
        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles size={32} className="text-teal-500" />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">Bienvenue sur Kilolab !</h3>
        <p className="text-slate-400 text-sm mb-6">
          Votre linge lavé, séché et plié — sans bouger de chez vous.
        </p>
        <button
          onClick={() => window.location.href = '/new-order'}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-8 py-3.5 rounded-2xl font-black hover:shadow-lg transition flex items-center gap-2 mx-auto"
        >
          Lancer ma première lessive <ArrowRight size={16} />
        </button>
      </div>
    )}

    {/* ── HISTORIQUE ───────────────────────────────────────────────────────── */}
    {pastOrders.length > 0 && (
      <div>
        <h2 className="font-black text-lg text-slate-900 mb-4 flex items-center gap-2">
          <Clock size={18} className="text-slate-400" /> Historique
        </h2>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {pastOrders.map((order, idx) => (
            <div
              key={order.id}
              className={`p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-slate-50 transition ${
                idx < pastOrders.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="bg-green-100 p-2.5 rounded-xl flex-shrink-0">
                  <CheckCircle size={18} className="text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-sm">#{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {formatDate(order.completed_at ?? order.created_at)} · {order.weight} kg · {getFormulaLabel(order.formula)}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-black text-slate-800">{formatCurrency(parseFloat(String(order.total_price)))}</p>
                {order.washer && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    par {order.washer.first_name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA bas de page */}
        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.href = '/new-order'}
            className="text-teal-500 font-bold text-sm hover:underline flex items-center gap-1 mx-auto"
          >
            Commander à nouveau <ArrowRight size={14} />
          </button>
        </div>
      </div>
    )}

  </div>
</div>
```

);
}