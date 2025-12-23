import { X, Check } from 'lucide-react';

export default function ComparisonSection() {
  return (
    <section id="comparator" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Arrêtez de brûler votre argent.
          </h2>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Le modèle traditionnel "à la pièce" est obsolète. Passez au modèle "au poids" et redonnez du pouvoir d'achat à votre foyer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
          {/* CARTE GAUCHE : TRADITIONNEL */}
          {/* Order-2 sur mobile pour mettre Kilolab en premier ? Non, gardons la comparaison logique Avant/Après */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-full text-red-500"><X size={20} /></div>
              <h3 className="text-lg md:text-xl font-bold text-slate-400">Pressing Traditionnel</h3>
            </div>
            <div className="space-y-4 mb-8 text-sm md:text-base">
              <div className="flex justify-between text-slate-500"><span>3 Chemises</span><span>24.00€</span></div>
              <div className="flex justify-between text-slate-500"><span>2 Pantalons</span><span>20.00€</span></div>
              <div className="flex justify-between text-slate-500"><span>1 Manteau</span><span>25.00€</span></div>
            </div>
            <div className="pt-6 border-t border-slate-200 flex justify-end">
              <div className="text-right">
                <span className="text-xl md:text-2xl font-bold text-red-400">Total: 69.00€</span>
              </div>
            </div>
          </div>

          {/* CARTE DROITE : KILOLAB */}
          <div className="bg-[#0F172A] rounded-3xl p-6 md:p-8 shadow-2xl relative transform md:scale-105 z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-500 rounded-full text-white"><Check size={20} /></div>
              <h3 className="text-lg md:text-xl font-bold text-white">La Méthode Kilolab</h3>
            </div>
            <div className="space-y-4 md:space-y-6 mb-8 text-sm md:text-base">
              <div className="flex justify-between text-slate-300 border-b border-white/10 pb-3">
                <span>3 Chemises (0.6kg)</span><span className="text-teal-400 font-bold">1.80€</span>
              </div>
              <div className="flex justify-between text-slate-300 border-b border-white/10 pb-3">
                <span>2 Pantalons (1kg)</span><span className="text-teal-400 font-bold">3.00€</span>
              </div>
              <div className="flex justify-between text-slate-300 border-b border-white/10 pb-3">
                <span>1 Manteau (1.5kg)</span><span className="text-teal-400 font-bold">4.50€</span>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
              <p className="text-slate-400 text-sm mb-1">Total Kilolab</p>
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">9.30€</div>
              <div className="inline-block bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full text-xs font-bold">
                Vous économisez 59.70€
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
