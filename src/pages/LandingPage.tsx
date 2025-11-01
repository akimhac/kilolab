import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock, MapPin, Shield, ArrowRight, Package } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">KiloLab</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-white/80 hover:text-white px-6 py-2 rounded-lg transition-all"
            >
              Connexion
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg transition-all font-semibold"
            >
              Inscription
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold mb-4">
            🚀 Pressing nouvelle génération
          </span>
        </div>
        <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
          Votre pressing,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            livré en 24h
          </span>
        </h1>
        <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
          Lavage + Séchage + Pliage + Emballage.<br />
          Déposez votre linge, on s'occupe du reste.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/signup')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg transition-all font-bold text-lg flex items-center gap-2"
          >
            Commander maintenant
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/partners-map')}
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg transition-all font-semibold flex items-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            Voir les laveries
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <Clock className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Rapide</h3>
            <p className="text-white/70">
              Service Express en 24h, Ultra Express en 6h. Votre linge propre quand vous en avez besoin.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <MapPin className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Pratique</h3>
            <p className="text-white/70">
              Laveries partenaires partout en France. Déposez et récupérez près de chez vous.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <Shield className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Professionnel</h3>
            <p className="text-white/70">
              Partenaires certifiés, traitement soigné de votre linge, satisfaction garantie.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Partenaire */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl p-12 border border-green-500/30 text-center">
          <Sparkles className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Vous êtes pressing ou laverie ?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez notre réseau de partenaires et augmentez votre chiffre d'affaires.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-lg transition-all font-bold text-lg"
          >
            Devenir partenaire
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-white/60">
          <p>© 2025 KiloLab - Pressing nouvelle génération</p>
        </div>
      </footer>
    </div>
  );
}
