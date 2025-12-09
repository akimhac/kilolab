import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, Calculator, Euro, Clock, Sparkles } from 'lucide-react';

export default function Pricing() {
  const navigate = useNavigate();
  
  const priceComparison = [
    { item: "Chemise", weight: 0.2, traditional: 8 },
    { item: "Pantalon", weight: 0.5, traditional: 10 },
    { item: "Pull", weight: 0.6, traditional: 12 },
    { item: "Veste", weight: 0.8, traditional: 18 },
    { item: "Manteau", weight: 1.5, traditional: 25 },
    { item: "Robe", weight: 0.3, traditional: 15 },
    { item: "Jupe", weight: 0.25, traditional: 10 },
    { item: "T-shirt", weight: 0.15, traditional: 5 },
  ];

  const services = [
    { name: "Standard", delay: "48-72h", price: 3, color: "bg-slate-100", textColor: "text-slate-900", popular: false },
    { name: "Express", delay: "24h", price: 5, color: "bg-teal-500", textColor: "text-white", popular: true },
    { name: "Ultra Express", delay: "4-6h", price: 8, color: "bg-purple-600", textColor: "text-white", popular: false },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" /> Retour
          </button>
          <Link to="/" className="text-xl font-bold">Kilolab</Link>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 text-center px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 text-teal-400 text-sm font-bold mb-6 border border-teal-500/20">
          <Euro className="w-4 h-4" /> Tarification transparente
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          Simple. Au kilo.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">À partir de 3€/kg.</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Pas de surprise, pas de frais cachés. Vous payez uniquement le poids de votre linge.
        </p>
      </section>

      {/* Services */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Choisissez votre vitesse</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={i} className={`${service.color} ${service.textColor} rounded-3xl p-8 relative ${service.popular ? 'ring-4 ring-teal-400 scale-105' : ''}`}>
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
                    Le plus populaire
                  </div>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">{service.delay}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                <div className="text-4xl font-extrabold mb-6">
                  {service.price}€<span className="text-lg font-normal opacity-70">/kg</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2"><Check className="w-5 h-5" /> Lavage professionnel</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5" /> Séchage inclus</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5" /> Pliage soigné</li>
                  <li className="flex items-center gap-2"><Check className="w-5 h-5" /> Assurance incluse</li>
                </ul>
                <button 
                  onClick={() => navigate('/partners-map')}
                  className={`w-full py-3 rounded-xl font-bold transition ${service.popular ? 'bg-white text-teal-600 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  Commander
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparateur */}
      <section className="py-20 px-6 bg-white text-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center">
              <Calculator className="w-7 h-7 text-teal-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Comparateur de prix</h2>
              <p className="text-slate-600">Pressing traditionnel vs Kilolab</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 bg-slate-100 font-bold text-sm">
              <div>Article</div>
              <div className="text-center">Poids</div>
              <div className="text-center text-slate-400">Traditionnel</div>
              <div className="text-center text-teal-600">Kilolab</div>
            </div>
            {priceComparison.map((item, i) => (
              <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b border-slate-100 hover:bg-teal-50 transition">
                <div className="font-medium">{item.item}</div>
                <div className="text-center text-slate-500">{item.weight}kg</div>
                <div className="text-center text-slate-400 line-through">{item.traditional}€</div>
                <div className="text-center text-teal-600 font-bold">{(item.weight * 3).toFixed(2)}€</div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-teal-50 rounded-2xl text-center border border-teal-100">
            <Sparkles className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <p className="text-teal-800 font-medium text-lg">
              En moyenne, nos clients économisent <strong>85%</strong> sur leur pressing !
            </p>
          </div>

          <button 
            onClick={() => navigate('/partners-map')}
            className="w-full mt-8 py-4 bg-teal-600 text-white rounded-2xl font-bold text-lg hover:bg-teal-700 transition"
          >
            Trouver un pressing près de chez moi
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-950 border-t border-white/5 text-center text-slate-400">
        <Link to="/" className="text-xl font-bold text-white mb-4 block">Kilolab</Link>
        <p className="text-sm">© 2025 Kilolab. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
