import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Calendar, Clock, Sun, Moon, Coffee, Plane, Save, Loader2, 
  CheckCircle, XCircle, AlertTriangle, Plus, Trash2
} from 'lucide-react';
import { toast } from 'sonner';

type DaySchedule = {
  enabled: boolean;
  start: string;
  end: string;
};

type WeekSchedule = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
};

type Absence = {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
};

const DAY_LABELS: Record<string, string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
};

const DEFAULT_SCHEDULE: WeekSchedule = {
  monday: { enabled: true, start: '08:00', end: '18:00' },
  tuesday: { enabled: true, start: '08:00', end: '18:00' },
  wednesday: { enabled: true, start: '08:00', end: '18:00' },
  thursday: { enabled: true, start: '08:00', end: '18:00' },
  friday: { enabled: true, start: '08:00', end: '18:00' },
  saturday: { enabled: true, start: '09:00', end: '14:00' },
  sunday: { enabled: false, start: '09:00', end: '12:00' },
};

export default function WasherAvailability({ washerId }: { washerId: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Availability status
  const [isAvailable, setIsAvailable] = useState(true);
  const [vacationMode, setVacationMode] = useState(false);
  const [vacationStart, setVacationStart] = useState('');
  const [vacationEnd, setVacationEnd] = useState('');
  
  // Working hours
  const [schedule, setSchedule] = useState<WeekSchedule>(DEFAULT_SCHEDULE);
  
  // Planned absences
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [newAbsence, setNewAbsence] = useState({ start: '', end: '', reason: '' });
  const [showAddAbsence, setShowAddAbsence] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, [washerId]);

  const fetchAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from('washers')
        .select('is_available, vacation_mode, vacation_start, vacation_end, working_hours, planned_absences')
        .eq('id', washerId)
        .single();

      if (error) throw error;

      if (data) {
        setIsAvailable(data.is_available ?? true);
        setVacationMode(data.vacation_mode ?? false);
        setVacationStart(data.vacation_start || '');
        setVacationEnd(data.vacation_end || '');
        setSchedule(data.working_hours || DEFAULT_SCHEDULE);
        setAbsences(data.planned_absences || []);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAvailability = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('washers')
        .update({
          is_available: isAvailable,
          vacation_mode: vacationMode,
          vacation_start: vacationMode ? vacationStart : null,
          vacation_end: vacationMode ? vacationEnd : null,
          working_hours: schedule,
          planned_absences: absences,
          updated_at: new Date().toISOString(),
        })
        .eq('id', washerId);

      if (error) throw error;
      toast.success('Disponibilités enregistrées !');
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleDayEnabled = (day: keyof WeekSchedule) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  const updateDayTime = (day: keyof WeekSchedule, field: 'start' | 'end', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const addAbsence = () => {
    if (!newAbsence.start || !newAbsence.end) {
      toast.error('Veuillez remplir les dates');
      return;
    }
    const absence: Absence = {
      id: Date.now().toString(),
      start_date: newAbsence.start,
      end_date: newAbsence.end,
      reason: newAbsence.reason || 'Absence planifiée',
    };
    setAbsences(prev => [...prev, absence]);
    setNewAbsence({ start: '', end: '', reason: '' });
    setShowAddAbsence(false);
  };

  const removeAbsence = (id: string) => {
    setAbsences(prev => prev.filter(a => a.id !== id));
  };

  // Check if currently in vacation
  const isOnVacation = vacationMode && vacationStart && vacationEnd &&
    new Date() >= new Date(vacationStart) && new Date() <= new Date(vacationEnd);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin text-teal-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Availability Toggle */}
      <div className={`p-6 rounded-2xl border-2 transition ${
        isAvailable && !isOnVacation
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-red-500/10 border-red-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              isAvailable && !isOnVacation ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {isAvailable && !isOnVacation ? (
                <CheckCircle className="text-white" size={28} />
              ) : (
                <XCircle className="text-white" size={28} />
              )}
            </div>
            <div>
              <p className={`text-xl font-black ${isAvailable && !isOnVacation ? 'text-green-400' : 'text-red-400'}`}>
                {isOnVacation ? 'En vacances' : isAvailable ? 'Disponible' : 'Indisponible'}
              </p>
              <p className="text-white/50 text-sm">
                {isOnVacation 
                  ? `Jusqu'au ${new Date(vacationEnd).toLocaleDateString('fr-FR')}`
                  : isAvailable 
                    ? 'Vous recevez des missions' 
                    : 'Vous ne recevez pas de missions'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            disabled={isOnVacation}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              isAvailable
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            } ${isOnVacation ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isAvailable ? 'Me rendre indisponible' : 'Me rendre disponible'}
          </button>
        </div>
      </div>

      {/* Vacation Mode */}
      <div className="bg-[#0f1729] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Plane className="text-blue-400" size={20} />
          <h3 className="text-white font-bold">Mode vacances</h3>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            checked={vacationMode}
            onChange={(e) => setVacationMode(e.target.checked)}
            className="w-5 h-5 accent-teal-500"
          />
          <span className="text-white/70">Activer le mode vacances</span>
        </div>

        {vacationMode && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm text-white/50 mb-2">Date de début</label>
              <input
                type="date"
                value={vacationStart}
                onChange={(e) => setVacationStart(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-2">Date de fin</label>
              <input
                type="date"
                value={vacationEnd}
                onChange={(e) => setVacationEnd(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {isOnVacation && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-blue-300 text-sm flex items-center gap-2">
              <AlertTriangle size={16} />
              Vous êtes actuellement en vacances. Aucune mission ne vous sera proposée.
            </p>
          </div>
        )}
      </div>

      {/* Working Hours */}
      <div className="bg-[#0f1729] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="text-teal-400" size={20} />
          <h3 className="text-white font-bold">Horaires de travail</h3>
        </div>

        <div className="space-y-3">
          {(Object.keys(schedule) as Array<keyof WeekSchedule>).map((day) => (
            <div 
              key={day}
              className={`flex items-center gap-4 p-3 rounded-xl transition ${
                schedule[day].enabled ? 'bg-white/5' : 'bg-white/2 opacity-50'
              }`}
            >
              <input
                type="checkbox"
                checked={schedule[day].enabled}
                onChange={() => toggleDayEnabled(day)}
                className="w-5 h-5 accent-teal-500"
              />
              <span className="w-24 text-white font-medium">{DAY_LABELS[day]}</span>
              
              {schedule[day].enabled ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={schedule[day].start}
                    onChange={(e) => updateDayTime(day, 'start', e.target.value)}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-teal-500 focus:outline-none"
                  />
                  <span className="text-white/30">→</span>
                  <input
                    type="time"
                    value={schedule[day].end}
                    onChange={(e) => updateDayTime(day, 'end', e.target.value)}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
              ) : (
                <span className="text-white/30 text-sm">Fermé</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Planned Absences */}
      <div className="bg-[#0f1729] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="text-orange-400" size={20} />
            <h3 className="text-white font-bold">Absences planifiées</h3>
          </div>
          <button
            onClick={() => setShowAddAbsence(true)}
            className="px-4 py-2 bg-teal-500/20 text-teal-400 rounded-lg font-bold text-sm hover:bg-teal-500/30 transition flex items-center gap-2"
          >
            <Plus size={16} /> Ajouter
          </button>
        </div>

        {absences.length === 0 ? (
          <p className="text-white/30 text-center py-6">Aucune absence planifiée</p>
        ) : (
          <div className="space-y-3">
            {absences.map((absence) => (
              <div key={absence.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div>
                  <p className="text-white font-medium">
                    {new Date(absence.start_date).toLocaleDateString('fr-FR')} → {new Date(absence.end_date).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-white/50 text-sm">{absence.reason}</p>
                </div>
                <button
                  onClick={() => removeAbsence(absence.id)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Absence Form */}
        {showAddAbsence && (
          <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-white/50 mb-1">Début</label>
                <input
                  type="date"
                  value={newAbsence.start}
                  onChange={(e) => setNewAbsence(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Fin</label>
                <input
                  type="date"
                  value={newAbsence.end}
                  onChange={(e) => setNewAbsence(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
            </div>
            <input
              type="text"
              value={newAbsence.reason}
              onChange={(e) => setNewAbsence(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Raison (optionnel)"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddAbsence(false)}
                className="flex-1 py-2 bg-white/10 text-white/70 rounded-lg font-bold text-sm"
              >
                Annuler
              </button>
              <button
                onClick={addAbsence}
                className="flex-1 py-2 bg-teal-500 text-white rounded-lg font-bold text-sm"
              >
                Ajouter
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={saveAvailability}
        disabled={saving}
        className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-teal-500/25 transition disabled:opacity-50"
      >
        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
        Enregistrer mes disponibilités
      </button>
    </div>
  );
}
