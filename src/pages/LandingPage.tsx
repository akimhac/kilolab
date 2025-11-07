import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Clock,
  MapPin,
  Shield,
  ArrowRight,
  Package,
  Truck,
  Star,
  CheckCircle,
  BadgeEuro
} from 'lucide-react';

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1620042229612-6a7f8b2a3a5a?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581579188871-45ea61f2a0c8?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503342217505-b0a15cf70489?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1567063847162-6e85f2f0a86e?q=80&w=1600&auto=format&fit=crop'
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setBgIndex((i) => (i + 1) % BG_IMAGES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background carousel */}
      <div className="absolute inset-0 -z-10">
        {BG_IMAGES.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out bg-center bg-cover ${
              i === bgIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/90 to-slate-900/90" />
      </div>

      {/* Header */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group"
          >
            <Package className="w-8 h-8 text-purple-300 group-hover:scale-110 transition-transform" />
            <h1 className="text-2xl font-bold text-white">KiloLab</h1>
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-white/80 hover:text-white px-6 py-2 rounded-lg transition-all"
            >
              Connexion
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg transition-all font-semibold shadow-lg shadow-purple-900/30"
            >
              Inscription
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-16 text-center">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-200 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Pressing nouvelle génération
          </span>
        </div>
        <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Fini les corvées, place au confort.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
            Votre linge livré en 24h
          </span>
        </h2>
        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Lavage • Séchage • Pliage • Emballage. Réservez en 2 clics,
          <span className="whitespace-nowrap"> on s'occupe de tout.</span>
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate('/signup')}
            className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl transition-all font-bold text-lg flex items-center gap-2 shadow-xl shadow-purple-900/40"
          >
            Commander maintenant
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => navigate('/partners-map')}
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl transition-all font-semibold flex items-center gap-2 backdrop-blur"
          >
            <MapPin className="w-5 h-5" />
            Voir les laveries
          </button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-white/70">
          <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <Clock className="w-4 h-4" />
            <span>Retrait en 24h</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <Shield className="w-4 h-4" />
            <span>Satisfaction garantie</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <Truck className="w-4 h-4" />
            <span>Collecte & livraison</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <BadgeEuro className="w-4 h-4" />
            <span>Tarifs transparents</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:translate-y-[-2px] transition">
            <Clock className="w-12 h-12 text-blue-300 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Rapide</h3>
            <p className="text-white/70">
              Express 24h ou Ultra Express 6h. Votre linge propre quand vous en avez besoin.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:translate-y-[-2px] transition">
            <MapPin className="w-12 h-12 text-purple-300 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Pratique</h3>
            <p className="text-white/70">
              Laveries partenaires partout en France. Déposez et récupérez près de chez vous.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:translate-y-[-2px] transition">
            <Shield className="w-12 h-12 text-emerald-300 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Professionnel</h3>
            <p className="text-white/70">
              Partenaires certifiés, traitement soigné et contrôle qualité à chaque étape.
            </p>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="max-w-6xl mx-auto px-6 pb-8">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Leïla', text: 'Top ! Commandé le matin, récupéré plié le lendemain.' },
            { name: 'Yassine', text: 'Tarifs clairs et appli super simple. Je recommande.' },
            { name: 'Camille', text: 'Ultra Express en 6h — sauvé mon costume pour ce soir !' }
          ].map((t, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-2 text-yellow-300 mb-2">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-white/80">{t.text}</p>
              <p className="mt-4 text-white/60 text-sm">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Partenaire */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl p-12 border border-green-500/30 text-center">
          <Sparkles className="w-14 h-14 text-green-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-3">Vous êtes pressing ou laverie ?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez le réseau KiloLab, recevez des commandes qualifiées et augmentez vos revenus.
          </p>
          <button
            onClick={() => navigate('/partners')}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl transition-all font-bold text-lg shadow-xl shadow-green-900/30"
          >
            Devenir partenaire
          </button>
          <div className="mt-4 text-sm text-white/60 flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-300" />
            Sans frais d'entrée. Sans abonnement.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-white/60">
          <p>© {new Date().getFullYear()} KiloLab — Pressing nouvelle génération</p>
          <div className="flex gap-6 justify-center mt-4">
            <button onClick={() => navigate('/cgv')} className="hover:text-white transition-all">
              CGV
            </button>
            <button onClick={() => navigate('/partners')} className="hover:text-white transition-all">
              Devenir partenaire
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
