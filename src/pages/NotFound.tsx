import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-slate-200">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Page non trouvée</h2>
        <p className="text-slate-600 mb-8">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition">
            <ArrowLeft className="w-5 h-5" /> Retour
          </button>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition">
            <Home className="w-5 h-5" /> Accueil
          </button>
        </div>
      </div>
    </div>
  );
}
