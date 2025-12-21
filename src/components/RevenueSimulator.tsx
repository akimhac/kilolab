import { useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';

export default function RevenueSimulator() {
  // ON REVIENT À LA LOGIQUE KILO (Ce que vous vouliez)
  const [kilos, setKilos] = useState(50); 
  const [days, setDays] = useState(6);
  
  // Calcul : Kilos * Jours * 4 semaines * 3.5€ (Marge moyenne)
  const monthlyRevenue = Math.round(kilos * days * 4 * 3.5); 
  const yearlyRevenue = monthlyRevenue * 12;

  return (
    // DESIGN DARK/VERT (Ce que vous aimiez)
    <div className="bg-[#0B1221] border border-slate-800 rounded-2xl p-8 max-w-4xl mx-auto my-12 shadow-2xl relative overflow-hidden">
      
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
          <Calculator className="text-teal-400" /> Combien pouvez-vous gagner ?
        </h2>
        <p className="text-slate-400 mt-2">Estimez votre chiffre d'affaires additionnel basé sur le volume.</p>
      </div>

      <div className="space-y-8">
        {/* SLIDER KILOS */}
        <div>
          <div className="flex justify-between mb-2">
             <label className="text-white font-bold">Volume traité (kg / jour):</label>
             <span className="text-teal-400 font-bold text-xl">{kilos} kg</span>
          </div>
          <input 
            type="range" min="10" max="200" step="5" value={kilos} 
            onChange={(e) => setKilos(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
          />
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <TrendingUp size={12}/> Correspond environ à {Math.round(kilos/6)} machines de 6kg.
          </p>
        </div>

        {/* SLIDER JOURS */}
        <div>
          <div className="flex justify-between mb-2">
             <label className="text-white font-bold">Jours d'ouverture Kilolab:</label>
             <span className="text-teal-400 font-bold text-xl">{days}j / sem</span>
          </div>
          <input 
            type="range" min="1" max="7" value={days} 
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
          />
        </div>

        {/* RÉSULTAT */}
        <div className="mt-8 bg-gradient-to-r from-[#0F292D] to-[#0B1221] border border-teal-500/30 rounded-xl p-8 text-center shadow-[0_0_30px_rgba(20,184,166,0.1)]">
          <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Revenus Estimés</p>
          <div className="text-5xl font-extrabold text-white mb-2 tracking-tight">
            +{monthlyRevenue}€ <span className="text-lg text-slate-500 font-normal">/mois</span>
          </div>
          <div className="inline-block bg-teal-500/10 text-teal-400 px-4 py-1 rounded-full text-sm font-bold border border-teal-500/20 mt-2">
            Soit +{yearlyRevenue}€ / an
          </div>
        </div>
      </div>
    </div>
  );
}
