import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Users, Timer, Star, Coins, Rocket, Shield,
  LineChart, Wrench, ArrowRight, Sparkles
} from 'lucide-react';

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1574172368371-7a7c87c92f1a?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556909212-d5a1799b7263?q=80&w=1600&auto=format&fit=crop',
];

export default function PartnerLanding() {
  const navigate = useNavigate();
  const [bg, setBg] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setBg((i) => (i + 1) % BG_IMAGES.length), 6000);
    return () => clearInterval(id);
  }, []);

  const [lead, setLead] = useState({ name: '', email: '', phone: '', city: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Merci ! Nous vous recontactons sous 24h.');
    setLead({ name: '', email: '', phone: '', city: '' });
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      <div className="absolute inset-0 -z-10">
        {BG_IMAGES.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 bg-center bg-cover transition-opacity duration-[1200ms] ${
              i === bg ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-emerald-950/90 to-slate-900/90" />
      </div>

      <header className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
            <Building2 className="w-8 h-8 text-emerald-300 group-hover:scale-110 transition" />
            <h1 className="text-2xl font-bold text-white">KiloLab Partenaires</h1>
          </button>
          <div className="flex gap-3">
            <button onClick={() => navigate('/login')} className="text-white/80 hover:text-white px-6 py-2 rounded-lg transition hidden sm:block">Connexion</button>
            <button onClick={() => navigate('/signup')} className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg">Devenir partenaire</button>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-6 pb-14 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/15 text-emerald-200 rounded-full text-sm font-semibold mb-4 border border-emerald-500/20">
          <Sparkles className="w-4 h-4" /> Rejoignez le réseau KiloLab
        </span>
        <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          Développez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-300">chiffre d'affaires</span>
        </h2>
        <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto mb-8">Recevez des commandes qualifiées et augmentez vos revenus de 30% en moyenne sans effort marketing supplémentaire.</p>
        <button onClick={() => navigate('/signup')} className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 mx-auto shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
          Rejoindre maintenant <ArrowRight className="w-5 h-5" />
        </button>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[{ icon: LineChart, label: 'Croissance moyenne', value: '+30%' }, { icon: Users, label: 'Pressings partenaires', value: '500+' }, { icon: Timer, label: "Délai d'activation", value: '24h' }, { icon: Star, label: 'Satisfaction', value: '4.8/5' }].map((s, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/10 transition">
              <s.icon className="w-10 h-10 text-emerald-300" />
              <div className="text-left"><p className="text-2xl font-bold text-white">{s.value}</p><p className="text-white/70 text-sm">{s.label}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {[{ icon: Coins, title: 'Revenus garantis', desc: 'Tarifs fixes et transparents. Paiement sécurisé après pesée.' }, { icon: Rocket, title: 'Flux constant', desc: 'Nous vous apportons des commandes pré-qualifiées toute l\'année.' }, { icon: Wrench, title: 'Outils gratuits', desc: 'Application pro, dashboard statistique et support dédié 7j/7.' }].map((f, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-emerald-500/30 transition duration-300">
              <f.icon className="w-12 h-12 text-emerald-300 mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">{f.title}</h4>
              <p className="text-white/70 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 md:p-12 backdrop-blur-lg">
          <div className="text-center mb-8"><h4 className="text-3xl font-bold text-white mb-2">Devenir partenaire</h4><p className="text-white/60">Remplissez ce formulaire, on vous rappelle dans la journée.</p></div>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            <input required value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} placeholder="Nom du pressing" className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
            <input required type="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} placeholder="Email professionnel" className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"><Shield className="w-5 h-5" /> Demander mon activation</button>
          </form>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-white/40 text-sm"><p>© {new Date().getFullYear()} KiloLab Partenaires. Tous droits réservés.</p></div>
      </footer>
    </div>
  );
}
