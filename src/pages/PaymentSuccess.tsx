import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(true);
  
  const orderId = searchParams.get('order_id');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    updateOrderStatus();
  }, [orderId]);

  const updateOrderStatus = async () => {
    if (!orderId) return;

    try {
      // Marquer la commande comme payée
      await supabase
        .from('orders')
        .update({ status: 'pending' })
        .eq('id', orderId);
      
      setUpdating(false);
      
      // Redirection automatique après 3 secondes
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error updating order:', error);
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
        {updating ? (
          <>
            <Loader className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-white mb-2">Confirmation du paiement...</h1>
          </>
        ) : (
          <>
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">Paiement réussi !</h1>
            <p className="text-gray-300 mb-6">
              Votre commande a été confirmée. Vous allez recevoir un email de confirmation.
            </p>
            <p className="text-sm text-gray-400">
              Redirection automatique vers le dashboard...
            </p>
          </>
        )}
      </div>
    </div>
  );
}