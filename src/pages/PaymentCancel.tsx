import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>

          <h1 className="text-3xl font-black text-slate-900 mb-4">
            Paiement annulé
          </h1>

          <p className="text-lg text-slate-600 mb-6">
            Votre commande n'a pas été finalisée. Vous pouvez réessayer quand vous voulez.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/partners-map')}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-xl transition"
            >
              Réessayer
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-xl font-bold hover:border-slate-400 transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
