import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Users, Target, Heart } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" /> Retour
          </button>
          <Link to="/" className="text-xl font-bold text-teal-600">Kilolab</Link>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">À propos de Kilolab</h1>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Notre mission</h2>
          <p className="text-slate-600 leading-relaxed">
            Kilolab révolutionne le pressing en proposant un service au kilo, simple et économique. 
            Notre objectif : rendre le pressing accessible à tous en supprimant la tarification à la pièce 
            qui pénalise les familles et les gros volumes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-7 h-7 text-teal-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Vision</h3>
            <p className="text-sm text-slate-600">Démocratiser le pressing professionnel</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-teal-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Réseau</h3>
            <p className="text-sm text-slate-600">+1800 pressings partenaires</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-teal-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Engagement</h3>
            <p className="text-sm text-slate-600">Satisfaction client garantie</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact</h2>
          <p className="text-slate-600">
            Email : <a href="mailto:contact@kilolab.fr" className="text-teal-600 hover:underline">contact@kilolab.fr</a>
          </p>
        </div>
      </div>
    </div>
  );
}
