import { TrendingDown, AlertCircle, X, Check } from 'lucide-react';

export default function PriceComparator() {
  return (
    // FOND GRIS CLAIR (Slate-50)
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-200 rounded-full text-red-600 text-sm font-bold mb-6">
            <AlertCircle size={16} />
            Arrêtez de brûler votre argent
          </div>
          {/* TITRE FONCÉ */}
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Le modèle traditionnel "à la pièce" est obsolète.
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Passez au modèle "au poids" et redonnez du pouvoir d'achat à votre foyer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* CARTE GAUCHE : BLANCHE (Look Ticket de caisse) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 relative shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-50 rounded-full text-red-500"><X size={20} /></div>
              <h3 className="text-2xl font-bold text-slate-700">Pressing Traditionnel</h3>
            </div>
            <div className="space-y-4 mb-6 text-lg text-slate-600">
              <div className="flex justify-between border-b border-slate-100 pb-2"><span>3 Chemises</span><span className="font-medium">24.00€</span></div>
              <div className="flex justify-between border-b border-slate-100 pb-2"><span>2 Pantalons</span><span className="font-medium">20.00€</span></div>
              <div className="flex justify-between border-b border-slate-100 pb-2"><span>1 Manteau</span><span className="font-medium">25.00€</span></div>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
              <p className="text-slate-500 text-sm mb-1">Total</p>
              <p className="text-4xl font-extrabold text-red-500">69.00€</p>
            </div>
          </div>

          {/* CARTE DROITE : KILOLAB (RESTE SOMBRE POUR LE CONTRASTE PREMIUM) */}
          <div className="bg-[#0F172A] border border-teal-500/30 rounded-3xl p-8 relative shadow-2xl transform md:scale-105 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-500 text-slate-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
              La Méthode Kilolab
            </div>
            <div className="flex items-center gap-3 mb-6 mt-2">
              <div className="p-2 bg-teal-500 rounded-full text-slate-900"><Check size={20} /></div>
              <h3 className="text-2xl font-bold text-white">Lavage au Kilo</h3>
            </div>
            <div className="space-y-4 mb-6 text-lg text-slate-300">
              <div className="flex justify-between border-b border-white/10 pb-2"><span>3 Chemises (0.6kg)</span><span className="font-bold text-teal-400">1.80€</span></div>
              <div className="flex justify-between border-b border-white/10 pb-2"><span>2 Pantalons (1kg)</span><span className="font-bold text-teal-400">3.00€</span></div>
              <div className="flex justify-between border-b border-white/10 pb-2"><span>1 Manteau (1.5kg)</span><span className="font-bold text-teal-400">4.50€</span></div>
            </div>
            <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 text-center">
              <p className="text-slate-400 text-sm mb-1">Total Kilolab</p>
              <p className="text-5xl font-extrabold text-white">9.30€</p>
              <div className="mt-2 inline-flex items-center gap-1 text-teal-400 font-bold text-sm bg-teal-500/10 px-2 py-1 rounded">
                <TrendingDown size={16}/> Vous économisez 59.70€
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
