import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Timer,
  Star,
  Coins,
  Rocket,
  Shield,
  LineChart,
  Wrench,
  Check,
  ArrowRight,
  MapPin,
  BadgeEuro,
  Sparkles,
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

  const [lead, setLead] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `✅ Merci ${lead.name} !\nNous vous recontactons pour activer votre compte à ${lead.city}.\n\n(À connecter à Supabase/CRM)`
    );
    setLead({ name: '', email: '', phone: '', city: '' });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
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
            <button
              onClick={() => navigate('/login')}
              className="text-white/80 hover:text-white px-6 py-2 rounded-lg transition"
            >
              Connexion
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg shadow-emerald-900/30"
            >
              Devenir partenaire
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-6 pb-14 text-center">
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/15 text-emerald-200 rounded-full text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            Rejoignez le réseau KiloLab
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
          Développez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-300">chiffre d'affaires</span>
        </h2>
        <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto mb-8">
          Recevez des commandes qualifiées près de chez vous et augmentez vos revenus en moyenne de <b>30%</b>. 
          On s'occupe de l'acquisition, vous vous concentrez sur la production.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate('/signup')}
            className="group bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 shadow-xl shadow-emerald-900/40"
          >
            Rejoindre maintenant
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { icon: LineChart, label: 'Croissance moyenne', value: '+30%' },
            { icon: Users, label: 'Pressings partenaires', value: '500+' },
            { icon: Timer, label: 'Délai d'activation', value: '24h' },
            { icon: Star, label: 'Satisfaction', value: '4.8/5' },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white/10 border border-white/15 rounded-2xl p-5 text-left flex items-center gap-4 backdrop-blur"
            >
              <s.icon className="w-10 h-10 text-emerald-300" />
              <div>
                <p className="text-2xl font-extrabold text-white leading-none">{s.value}</p>
                <p className="text-white/70 text-sm">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-6">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Pourquoi rejoindre KiloLab ?</h3>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Coins,
              title: 'Revenus garantis',
              desc: 'Tarifs fixes et attractifs. Paiement client après chaque pesée. Aucune commission cachée.',
            },
            {
              icon: Rocket,
              title: 'Flux constant',
              desc: 'Commandes pré-qualifiées via notre plateforme. Visibilité maximale dans votre zone.',
            },
            {
              icon: Wrench,
              title: 'Outils gratuits',
              desc: 'Dashboard clair, gestion des commandes, statistiques, support dédié 7j/7.',
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white/10 border border-white/20 rounded-2xl p-8 hover:-translate-y-0.5 transition backdrop-blur"
            >
              <f.icon className="w-12 h-12 text-emerald-300 mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">{f.title}</h4>
              <p className="text-white/75">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-2">Commission transparente</h3>
          <p className="text-white/75">
            Pas de frais d'entrée. Pas d'abonnement mensuel. Vous gagnez sur chaque kilo traité.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Premium (72–96h)', price: '5€ / kg', note: 'Vous gardez 100%' },
            { name: 'Express (24h)', price: '10€ / kg', note: 'Vous gardez 100%' },
            { name: 'Ultra Express (6h)', price: '15€ / kg', note: 'Vous gardez 100%' },
          ].map((p, i) => (
            <div
              key={i}
              className="relative bg-white/10 border border-white/20 rounded-2xl p-8 text-center backdrop-blur"
            >
              {i === 1 && (
                <div className="absolute -top-3 inset-x-0 mx-auto w-max px-3 py-1 text-xs rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200">
                  Populaire
                </div>
              )}
              <p className="text-white/70">{p.name}</p>
              <p className="text-4xl font-extrabold text-white mt-2 mb-1">{p.price}</p>
              <p className="text-emerald-300 text-sm">{p.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-2">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Pressing Riviera', text: 'Le flux de commandes est régulier. +32% de CA le premier trimestre.' },
            { name: 'Laverie du Centre', text: 'Interface super simple, équipe réactive. Nous recommandons !' },
            { name: 'AquaPress', text: 'Ultra Express nous a permis de capter une nouvelle clientèle pro.' },
          ].map((t, i) => (
            <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur">
              <div className="flex items-center gap-2 text-yellow-300 mb-2">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-white/85">{t.text}</p>
              <p className="text-white/60 text-sm mt-3">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur max-w-lg mx-auto">
          <h4 className="text-2xl font-bold text-white mb-4">Devenir partenaire</h4>
          <p className="text-white/70 mb-6">
            Laissez-nous vos coordonnées — on vous active sous 24h.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required
              value={lead.name}
              onChange={(e) => setLead({ ...lead, name: e.target.value })}
              placeholder="Nom du pressing"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              required
              type="email"
              value={lead.email}
              onChange={(e) => setLead({ ...lead, email: e.target.value })}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              value={lead.phone}
              onChange={(e) => setLead({ ...lead, phone: e.target.value })}
              placeholder="Téléphone"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              value={lead.city}
              onChange={(e) => setLead({ ...lead, city: e.target.value })}
              placeholder="Ville"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Demander mon activation
            </button>

            <div className="flex items-center gap-2 text-sm text-white/60">
              <Check className="w-4 h-4 text-emerald-300" />
              Sans frais d'entrée. Sans engagement.
            </div>
          </form>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-white/60">
          <p>© {new Date().getFullYear()} KiloLab — Réseau de pressings nouvelle génération</p>
        </div>
      </footer>
    </div>
  );
}
