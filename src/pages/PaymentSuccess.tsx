import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/client-dashboard');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-black text-slate-900 mb-4">
            Paiement réussi ! 🎉
          </h1>

          <p className="text-lg text-slate-600 mb-6">
            Votre commande a été confirmée. Le pressing va prendre en charge votre linge.
          </p>

          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-800 font-semibold">
              📧 Un email de confirmation vous a été envoyé
            </p>
          </div>

          <button
            onClick={() => navigate('/client-dashboard')}
            className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-xl transition flex items-center justify-center gap-2"
          >
            Voir mes commandes
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-sm text-slate-500 mt-4">
            Redirection automatique dans 5 secondes...
          </p>
        </div>
      </div>
    </div>
  );
}
