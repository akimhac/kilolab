import { useState } from 'react';
import { Clock, Calendar } from 'lucide-react';

interface TimeSlotPickerProps {
  onSelect: (date: string, time: string) => void;
}

export default function TimeSlotPicker({ onSelect }: TimeSlotPickerProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  const nextDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
    };
  });

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onSelect(selectedDate, selectedTime);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-white/80 font-semibold mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Choisissez un jour
        </label>
        <div className="grid grid-cols-4 gap-2">
          {nextDays.map((day) => (
            <button
              key={day.value}
              type="button"
              onClick={() => setSelectedDate(day.value)}
              className={`p-3 rounded-lg text-center transition-all ${
                selectedDate === day.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <p className="text-xs">{day.label.split(' ')[0]}</p>
              <p className="font-bold">{day.label.split(' ')[1]}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div>
          <label className="block text-white/80 font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Choisissez un créneau
          </label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`p-3 rounded-lg text-center font-semibold transition-all ${
                  selectedTime === time
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDate && selectedTime && (
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all"
        >
          ✅ Confirmer le créneau
        </button>
      )}
    </div>
  );
}
