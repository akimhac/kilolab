import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, Clock, Euro, Check, X as XIcon, Menu, X, 
  ArrowRight, Star, ShieldCheck, Truck, Sparkles 
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stats = [
    { value: "2600+", label: "Pressings partenaires" },
    { value: "4.9/5", label: "Note moyenne clients" },
    { value: "24h", label: "Délai moyen" }
  ];

  const priceComparison = [
    { item: "Chemise", weight: "0.2kg", traditional: "8.00€", kilolab: "0.60€" },
    { item: "Pantalon", weight: "0.5kg", traditional: "10.00€", kilolab: "1.50€" },
    { item: "Pull", weight: "0.6kg", traditional: "12.00€", kilolab: "1.80€" },
    { item: "Manteau", weight: "1.5kg", traditional: "25.00€", kilolab: "4.50€" },
  ];

  const steps = [
    { icon: "🧺", title: "1. Préparez", desc: "Mettez tout votre linge dans un sac, sans trier." },
    { icon: "⚖️", title: "2. Pesez", desc: "Le prix est fixé au poids, pas à la pièce." },
    { icon: "✨", title: "3. Récupérez", desc: "Linge lavé, plié et frais en 24h chrono." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">K</div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">Kilolab</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/pricing" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition">Tarifs</Link>
              <Link to="/become-partner" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition">Devenir Partenaire</Link>
              <Link to="/login" className="text-sm font-medium text-slate-900 hover:text-teal-600 transition">Connexion</Link>
              <button onClick={() => navigate('/partners-map')} className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-medium hover:bg-slate-800 transition shadow-lg shadow-slate-900/20">
                Trouver un pressing
              </button>
            </div>
            <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 p-4 flex flex-col gap-4 shadow-xl">
            <Link to="/pricing" className="text-lg font-medium text-slate-600">Tarifs</Link>
            <Link to="/become-partner" className="text-lg font-medium text-slate-600">Devenir Partenaire</Link>
            <Link to="/login" className="text-lg font-medium text-slate-600">Connexion</Link>
            <button onClick={() => navigate('/partners-map')} className="bg-teal-600 text-white py-3 rounded-xl font-bold">Trouver un pressing</button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold mb-6 border border-teal-100">
              <Sparkles className="w-4 h-4" /> Nouvelle approche du pressing
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Votre linge lavé <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">au kilo.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Fini le paiement à la pièce. Déposez votre linge en vrac, on le lave, sèche et plie. <span className="font-semibold text-slate-900">À partir de 3€/kg.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/partners-map')} className="px-8 py-4 bg-teal-600 text-white rounded-full font-bold text-lg hover:bg-teal-700 transition shadow-xl shadow-teal-600/20 flex items-center justify-center gap-2">
                Commander maintenant <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('/pricing')} className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition flex items-center justify-center">
                Voir les tarifs
              </button>
            </div>
            <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                  </div>
                ))}
              </div>
              <p>Rejoint par 10,000+ utilisateurs</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/30 to-blue-500/30 blur-3xl rounded-[3rem] opacity-50 -z-10" />
            <img src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=1000&q=80" alt="Linge propre" className="rounded-[2.5rem] shadow-2xl border border-white/50 w-full object-cover h-[500px] lg:h-[600px]" />
            <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-slate-100 max-w-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600"><Check size={20} /></div>
                <div><p className="font-bold text-slate-900">Commande terminée</p><p className="text-xs text-slate-500">Il y a 2 min</p></div>
              </div>
              <p className="text-sm text-slate-600">5kg de linge sauvés de la corvée !</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-slate-900">{stat.value}</span>
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wide mt-1">{stat.label}</span>
            </div>
          ))}
          <div className="flex flex-col items-center justify-center">
            <div className="flex text-yellow-400 gap-1 mb-1"><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /></div>
            <span className="text-sm font-medium text-slate-500">Excellence Client</span>
          </div>
        </div>
      </div>

      {/* Comment ça marche */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Aussi simple que de commander un VTC</h2>
            <p className="text-lg text-slate-600">Notre processus est optimisé pour vous faire gagner un temps précieux.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-teal-100 via-teal-200 to-teal-100 -z-0" />
            {steps.map((step, i) => (
              <div key={i} className="relative bg-white p-8 rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 z-10 text-center group">
                <div className="w-24 h-24 mx-auto bg-teal-50 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:bg-teal-100 transition-colors shadow-inner">{step.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparateur */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Arrêtez de payer à la pièce.</h2>
            <p className="text-xl text-slate-400">Voyez combien vous économisez avec Kilolab.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm opacity-80 hover:opacity-100 transition">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-red-500/20 rounded-xl text-red-400"><XIcon /></div>
                <h3 className="text-2xl font-bold">Pressing Traditionnel</h3>
              </div>
              <ul className="space-y-6">
                {priceComparison.map((row, i) => (
                  <li key={i} className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-slate-400">{row.item} <span className="text-xs">({row.weight})</span></span>
                    <span className="text-xl font-semibold text-red-300">{row.traditional}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white text-slate-900 rounded-3xl p-8 shadow-2xl relative transform md:scale-105 border-4 border-teal-500">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">Le choix malin</div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-teal-100 rounded-xl text-teal-600"><Check /></div>
                <h3 className="text-2xl font-bold text-teal-700">Kilolab</h3>
              </div>
              <ul className="space-y-6">
                {priceComparison.map((row, i) => (
                  <li key={i} className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <span className="font-medium text-slate-700">{row.item}</span>
                    <span className="text-xl font-bold text-teal-600">{row.kilolab}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-green-600 font-bold mb-4">✅ Vous économisez ~85%</p>
                <button onClick={() => navigate('/partners-map')} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg">Profiter de ces tarifs</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Euro, title: "Économique", text: "Jusqu'à 90% moins cher qu'un pressing traditionnel." },
              { icon: Clock, title: "Ultra Rapide", text: "Prêt en 24h standard, ou option express 4h." },
              { icon: MapPin, title: "Proximité", text: "Plus de 2600 points de collecte en France." },
              { icon: ShieldCheck, title: "Qualité Pro", text: "Traité par des artisans pressings certifiés." }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-2xl hover:bg-teal-50 transition-colors group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-teal-600 mb-4 group-hover:scale-110 transition-transform"><feature.icon /></div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h4>
                <p className="text-slate-600 text-sm">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Partenaires */}
      <section className="py-20 bg-teal-600 text-white text-center px-4">
        <div className="max-w-4xl mx-auto">
          <Truck className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Vous possédez un pressing ?</h2>
          <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">Remplissez vos machines pendant les heures creuses. Zéro frais d'entrée. Rentable dès le premier kilo.</p>
          <button onClick={() => navigate('/become-partner')} className="px-10 py-4 bg-white text-teal-700 rounded-full font-bold text-lg hover:shadow-2xl transition hover:scale-105">Devenir Partenaire Kilolab</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-sm">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white font-bold text-xl mb-4">Kilolab.</h3>
            <p className="mb-4">Le futur du pressing est au poids.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Service</h4>
            <ul className="space-y-3">
              <li><Link to="/partners-map" className="hover:text-white transition">Trouver un pressing</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition">Grille tarifaire</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Entreprise</h4>
            <ul className="space-y-3">
              <li><Link to="/become-partner" className="hover:text-white transition">Espace Partenaires</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Légal</h4>
            <ul className="space-y-3">
              <li><Link to="/legal/cgu" className="hover:text-white transition">CGU</Link></li>
              <li><Link to="/legal/privacy" className="hover:text-white transition">Confidentialité</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-900 text-center text-xs">© 2025 Kilolab. Tous droits réservés.</div>
      </footer>
    </div>
  );
}
