import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TrendingUp, Calendar, DollarSign, Award, ChevronDown, ChevronUp } from 'lucide-react';

interface EarningsData {
  today: number;
  week: number;
  month: number;
  total: number;
  completedToday: number;
  completedWeek: number;
  completedMonth: number;
  completedTotal: number;
}

interface Badge {
  badge_type: string;
  badge_name: string;
  earned_at: string;
}

const BADGE_ICONS: Record<string, string> = {
  first_mission: '\u2B50',
  ten_missions: '\uD83D\uDD1F',
  fifty_missions: '\uD83C\uDFC5',
  hundred_missions: '\uD83C\uDFC6',
};

export default function WasherEarnings({ washerId }: { washerId: string }) {
  const [earnings, setEarnings] = useState<EarningsData>({ today: 0, week: 0, month: 0, total: 0, completedToday: 0, completedWeek: 0, completedMonth: 0, completedTotal: 0 });
  const [badges, setBadges] = useState<Badge[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!washerId) return;
    fetchEarnings();
    fetchBadges();
  }, [washerId]);

  const fetchEarnings = async () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getTime() - 7 * 86400000).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { data: orders } = await supabase
      .from('orders')
      .select('total_price, completed_at')
      .eq('washer_id', washerId)
      .eq('status', 'completed');

    if (!orders) return;

    const calc = (from: string) => orders.filter(o => o.completed_at && o.completed_at >= from);
    const sum = (arr: typeof orders) => arr.reduce((s, o) => s + (parseFloat(String(o.total_price || 0)) * 0.6), 0);

    const todayOrders = calc(todayStart);
    const weekOrders = calc(weekStart);
    const monthOrders = calc(monthStart);

    setEarnings({
      today: sum(todayOrders), week: sum(weekOrders), month: sum(monthOrders), total: sum(orders),
      completedToday: todayOrders.length, completedWeek: weekOrders.length, completedMonth: monthOrders.length, completedTotal: orders.length,
    });
  };

  const fetchBadges = async () => {
    const { data } = await supabase.from('washer_badges').select('*').eq('washer_id', washerId).order('earned_at', { ascending: false });
    if (data) setBadges(data);
  };

  const fmt = (n: number) => n.toFixed(2);

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-white/10 overflow-hidden" data-testid="washer-earnings">
      {/* Header with key stats */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-black text-base flex items-center gap-2">
            <TrendingUp size={18} className="text-teal-400" /> Mes gains
          </h3>
          <button onClick={() => setExpanded(!expanded)} className="text-white/40 hover:text-white/70 transition">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-white/40 text-[10px] font-bold uppercase">Aujourd'hui</p>
            <p className="text-white font-black text-lg">{fmt(earnings.today)}</p>
            <p className="text-teal-400 text-[10px]">{earnings.completedToday} mission{earnings.completedToday !== 1 ? 's' : ''}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-white/40 text-[10px] font-bold uppercase">Semaine</p>
            <p className="text-white font-black text-lg">{fmt(earnings.week)}</p>
            <p className="text-teal-400 text-[10px]">{earnings.completedWeek} mission{earnings.completedWeek !== 1 ? 's' : ''}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-white/40 text-[10px] font-bold uppercase">Mois</p>
            <p className="text-white font-black text-lg">{fmt(earnings.month)}</p>
            <p className="text-teal-400 text-[10px]">{earnings.completedMonth} mission{earnings.completedMonth !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
          <div className="flex items-center justify-between bg-teal-500/10 rounded-xl p-4">
            <div>
              <p className="text-white/50 text-xs">Total cumule</p>
              <p className="text-teal-400 font-black text-2xl">{fmt(earnings.total)} EUR</p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-xs">Missions terminees</p>
              <p className="text-white font-black text-2xl">{earnings.completedTotal}</p>
            </div>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div>
              <p className="text-white/50 text-xs font-bold mb-2 flex items-center gap-1"><Award size={14} /> Badges gagnes</p>
              <div className="flex flex-wrap gap-2">
                {badges.map(b => (
                  <div key={b.badge_type} className="bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1 text-xs font-bold text-yellow-300 flex items-center gap-1">
                    {BADGE_ICONS[b.badge_type] || '\uD83C\uDFC5'} {b.badge_name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
