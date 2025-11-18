import { Link, useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function PaymentCancelled() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-4">Paiement annulé</h1>
        <p className="text-gray-300 mb-6">
          Vous avez annulé le paiement. Votre commande n'a pas été validée.
        </p>
        <div className="flex gap-4">
          <Link
            to="/dashboard"
            className="flex-1 px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition"
          >
            Retour au dashboard
          </Link>
          {orderId && (
            <Link
              to={`/new-order`}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition"
            >
              Réessayer
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}