import { useNavigate } from 'react-router-dom';
import { User, Store, ArrowLeft } from 'lucide-react';

export default function SelectDashboard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors">
          <ArrowLeft className="w-5 h-5" /> <span className="font-medium">Retour à l'accueil</span>
        </button>
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-2xl mb-4 shadow-lg shadow-teal-200">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenue sur Kilolab</h1>
          <p className="text-gray-600">Choisissez votre espace de connexion</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <button onClick={() => navigate('/login?type=client')} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-teal-600 group">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-colors">
                <User className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Espace Client</h2>
              <p className="text-gray-600 text-sm mb-4">Commandez votre pressing au kilo</p>
              <div className="mt-6 px-6 py-2 bg-teal-600 text-white rounded-lg font-medium group-hover:bg-teal-700 transition-colors">
                Se connecter
              </div>
            </div>
          </button>
          <button onClick={() => navigate('/login?type=partner')} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-teal-600 group">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-colors">
                <Store className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Espace Pressing</h2>
              <p className="text-gray-600 text-sm mb-4">Gérez vos commandes</p>
              <div className="mt-6 px-6 py-2 bg-teal-600 text-white rounded-lg font-medium group-hover:bg-teal-700 transition-colors">
                Se connecter
              </div>
            </div>
          </button>
        </div>
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Pas encore de compte ?{' '}
            <button onClick={() => navigate('/select-signup')} className="text-teal-600 font-medium hover:text-teal-700 underline decoration-2">
              S'inscrire
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
