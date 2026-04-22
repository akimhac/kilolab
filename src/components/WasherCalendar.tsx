import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, X, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const DAYS_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

interface AvailabilitySlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface OffDay {
  id: string;
  off_date: string;
  reason: string | null;
}

export default function WasherCalendar({ washerId }: { washerId: string }) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [offDays, setOffDays] = useState<OffDay[]>([]);
  const [saving, setSaving] = useState(false);
  const [newOffDate, setNewOffDate] = useState('');

  useEffect(() => {
    fetchAvailability();
    fetchOffDays();
  }, [washerId]);

  const fetchAvailability = async () => {
    const { data } = await supabase.from('washer_availability').select('*').eq('washer_id', washerId);
    if (data && data.length > 0) {
      setSlots(data);
    } else {
      // Initialize default: Mon-Sat 8h-20h
      const defaults: AvailabilitySlot[] = [];
      for (let i = 0; i < 7; i++) {
        defaults.push({ day_of_week: i, start_time: '08:00', end_time: '20:00', is_available: i !== 0 }); // Off Sunday
      }
      setSlots(defaults);
    }
  };

  const fetchOffDays = async () => {
    const { data } = await supabase.from('washer_off_days').select('*').eq('washer_id', washerId).gte('off_date', new Date().toISOString().split('T')[0]).order('off_date');
    if (data) setOffDays(data);
  };

  const toggleDay = (dayIndex: number) => {
    setSlots(prev => prev.map(s => s.day_of_week === dayIndex ? { ...s, is_available: !s.is_available } : s));
  };

  const updateTime = (dayIndex: number, field: 'start_time' | 'end_time', value: string) => {
    setSlots(prev => prev.map(s => s.day_of_week === dayIndex ? { ...s, [field]: value } : s));
  };

  const save = async () => {
    setSaving(true);
    for (const slot of slots) {
      await supabase.from('washer_availability').upsert({
        washer_id: washerId,
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_available: slot.is_available,
      }, { onConflict: 'washer_id,day_of_week' });
    }
    toast.success('Disponibilites enregistrees !');
    setSaving(false);
  };

  const addOffDay = async () => {
    if (!newOffDate) return;
    await supabase.from('washer_off_days').upsert({ washer_id: washerId, off_date: newOffDate }, { onConflict: 'washer_id,off_date' });
    setNewOffDate('');
    fetchOffDays();
    toast.success('Jour off ajoute');
  };

  const removeOffDay = async (id: string) => {
    await supabase.from('washer_off_days').delete().eq('id', id);
    fetchOffDays();
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-white/10 p-5" data-testid="washer-calendar">
      <h3 className="text-white font-black text-base flex items-center gap-2 mb-4">
        <Calendar size={18} className="text-blue-400" /> Mes disponibilites
      </h3>

      {/* Weekly schedule */}
      <div className="space-y-2 mb-5">
        {slots.sort((a, b) => a.day_of_week - b.day_of_week).map(slot => (
          <div key={slot.day_of_week} className={`flex items-center gap-3 p-2.5 rounded-xl transition ${slot.is_available ? 'bg-teal-500/10' : 'bg-white/5'}`}>
            <button
              onClick={() => toggleDay(slot.day_of_week)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition flex-shrink-0 ${slot.is_available ? 'bg-teal-500 text-white' : 'bg-white/10 text-white/30'}`}
            >
              {slot.is_available ? <Check size={16} /> : <X size={16} />}
            </button>
            <span className={`text-sm font-bold w-12 ${slot.is_available ? 'text-white' : 'text-white/30'}`}>
              {DAYS_SHORT[slot.day_of_week]}
            </span>
            {slot.is_available && (
              <div className="flex items-center gap-1.5 text-xs">
                <input type="time" value={slot.start_time} onChange={e => updateTime(slot.day_of_week, 'start_time', e.target.value)}
                  className="bg-white/10 border-none rounded-lg px-2 py-1 text-white text-xs w-20" />
                <span className="text-white/30">-</span>
                <input type="time" value={slot.end_time} onChange={e => updateTime(slot.day_of_week, 'end_time', e.target.value)}
                  className="bg-white/10 border-none rounded-lg px-2 py-1 text-white text-xs w-20" />
              </div>
            )}
            {!slot.is_available && <span className="text-white/20 text-xs">Repos</span>}
          </div>
        ))}
      </div>

      <button onClick={save} disabled={saving}
        className="w-full py-2.5 bg-teal-500 text-white rounded-xl font-bold text-sm hover:bg-teal-600 transition flex items-center justify-center gap-2 mb-5">
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Enregistrer
      </button>

      {/* Off days */}
      <div className="border-t border-white/10 pt-4">
        <h4 className="text-white/70 text-xs font-bold mb-2">Jours de conge</h4>
        <div className="flex gap-2 mb-3">
          <input type="date" value={newOffDate} onChange={e => setNewOffDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="flex-1 bg-white/10 border-none rounded-lg px-3 py-2 text-white text-xs" />
          <button onClick={addOffDay} className="px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold">Ajouter</button>
        </div>
        {offDays.length > 0 && (
          <div className="space-y-1">
            {offDays.map(d => (
              <div key={d.id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                <span className="text-white/70 text-xs">{new Date(d.off_date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                <button onClick={() => removeOffDay(d.id)} className="text-red-400 hover:text-red-300"><X size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
