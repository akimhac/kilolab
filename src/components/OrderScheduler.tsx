// src/components/OrderScheduler.tsx
// Composant de planification immersive pour les commandes

import { useState, useMemo } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, Check, Zap, Package } from 'lucide-react';

interface TimeSlot {
  time: string;
  label: string;
  available: boolean;
}

interface SchedulerProps {
  onSelect: (date: Date, timeSlot: string, serviceType: 'standard' | 'express') => void;
  partnerName?: string;
}

export default function OrderScheduler({ onSelect, partnerName }: SchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState<'standard' | 'express'>('standard');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Générer les jours du mois
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: (Date | null)[] = [];
    
    // Jours vides avant le premier jour du mois
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    // Jours du mois
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  }, [currentMonth]);

  // Créneaux horaires
  const timeSlots: TimeSlot[] = [
    { time: '08:00', label: '8h - 10h', available: true },
    { time: '10:00', label: '10h - 12h', available: true },
    { time: '12:00', label: '12h - 14h', available: false },
    { time: '14:00', label: '14h - 16h', available: true },
    { time: '16:00', label: '16h - 18h', available: true },
    { time: '18:00', label: '18h - 20h', available: true }
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDateDisabled = (date: Date): boolean => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    
    // Pas les dates passées
    if (d < today) return true;
    
    // Pas les dimanches
    if (d.getDay() === 0) return true;
    
    return false;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const getEstimatedReady = (): string => {
    if (!selectedDate || !selectedTime) return '';
    
    const readyDate = new Date(selectedDate);
    const hoursToAdd = serviceType === 'express' ? 4 : 24;
    
    const [hours] = selectedTime.split(':').map(Number);
    readyDate.setHours(hours + hoursToAdd);
    
    return readyDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const fullDate = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      fullDate.setHours(hours, minutes);
      onSelect(fullDate, selectedTime, serviceType);
    }
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Planifiez votre dépôt
        </h2>
        {partnerName && (
          <p className="text-white/80 mt-1">Chez {partnerName}</p>
        )}
      </div>

      {/* Service Type */}
      <div className="p-4 border-b">
        <p className="text-sm font-medium text-slate-600 mb-3">Type de service</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setServiceType('standard')}
            className={`p-4 rounded-2xl border-2 transition ${
              serviceType === 'standard'
                ? 'border-purple-500 bg-purple-50'
                : 'border-slate-200 hover:border-purple-300'
            }`}
          >
            <Package className={`w-6 h-6 mx-auto mb-2 ${
              serviceType === 'standard' ? 'text-purple-600' : 'text-slate-400'
            }`} />
            <p className={`font-semibold ${
              serviceType === 'standard' ? 'text-purple-600' : 'text-slate-700'
            }`}>Standard</p>
            <p className="text-sm text-slate-500">3,50€/kg • 24h</p>
          </button>
          
          <button
            onClick={() => setServiceType('express')}
            className={`p-4 rounded-2xl border-2 transition relative ${
              serviceType === 'express'
                ? 'border-orange-500 bg-orange-50'
                : 'border-slate-200 hover:border-orange-300'
            }`}
          >
            <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              Rapide
            </div>
            <Zap className={`w-6 h-6 mx-auto mb-2 ${
              serviceType === 'express' ? 'text-orange-600' : 'text-slate-400'
            }`} />
            <p className={`font-semibold ${
              serviceType === 'express' ? 'text-orange-600' : 'text-slate-700'
            }`}>Express</p>
            <p className="text-sm text-slate-500">5€/kg • 4h</p>
          </button>
        </div>
      </div>

      {/* Calendrier */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
            disabled={currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear()}
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h3 className="font-semibold text-slate-800">
            {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Jours */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const disabled = isDateDisabled(date);
            const isSelected = selectedDate && 
              date.getDate() === selectedDate.getDate() && 
              date.getMonth() === selectedDate.getMonth();
            const isToday = date.getDate() === today.getDate() && 
              date.getMonth() === today.getMonth();

            return (
              <button
                key={date.toISOString()}
                onClick={() => !disabled && setSelectedDate(date)}
                disabled={disabled}
                className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition ${
                  disabled
                    ? 'text-slate-300 cursor-not-allowed'
                    : isSelected
                      ? 'bg-purple-600 text-white shadow-lg'
                      : isToday
                        ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                        : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Créneaux horaires */}
      {selectedDate && (
        <div className="p-4 border-b animate-fade-in">
          <p className="text-sm font-medium text-slate-600 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Créneau du {formatDate(selectedDate)}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map(slot => (
              <button
                key={slot.time}
                onClick={() => slot.available && setSelectedTime(slot.time)}
                disabled={!slot.available}
                className={`p-3 rounded-xl text-sm font-medium transition ${
                  !slot.available
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : selectedTime === slot.time
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-purple-100 hover:text-purple-700'
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Récapitulatif */}
      {selectedDate && selectedTime && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              serviceType === 'express' ? 'bg-orange-100' : 'bg-purple-100'
            }`}>
              {serviceType === 'express' ? (
                <Zap className="w-5 h-5 text-orange-600" />
              ) : (
                <Package className="w-5 h-5 text-purple-600" />
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                {serviceType === 'express' ? 'Express' : 'Standard'} - {formatDate(selectedDate)}
              </p>
              <p className="text-sm text-slate-600">
                Dépôt entre {timeSlots.find(s => s.time === selectedTime)?.label}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 mb-4">
            <p className="text-sm text-slate-500">Linge prêt estimé</p>
            <p className="font-semibold text-purple-600">{getEstimatedReady()}</p>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Confirmer ce créneau
          </button>
        </div>
      )}

      {/* Style pour l'animation */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
