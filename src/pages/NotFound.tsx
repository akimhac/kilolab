import { useNavigate } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Page introuvable
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-xl transition"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </button>
          <button
            onClick={() => navigate('/partners-map')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-blue-300 text-slate-900 rounded-xl font-bold hover:border-blue-500 transition"
          >
            <Search className="w-5 h-5" />
            Trouver un pressing
          </button>
        </div>
      </div>
    </div>
  );
}
