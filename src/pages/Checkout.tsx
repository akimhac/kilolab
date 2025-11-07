import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, ArrowLeft, Loader } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

function CheckoutForm({ order, clientSecret }: { order: any; clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/client-dashboard`,
        },
      });

      if (submitError) {
        setError(submitError.message || 'Erreur de paiement');
      } else {
        // Paiement réussi, mise à jour commande
        await supabase
          .from('orders')
          .update({
            status: 'paid',
            paid_at: new Date().toISOString(),
          })
          .eq('id', order.id);

        alert('✅ Paiement réussi !');
        navigate('/client-dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/5 rounded-xl p-6">
        <PaymentElement />
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 text-lg flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Traitement...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Payer {(order.price_gross_cents / 100).toFixed(2)} €
          </>
        )}
      </button>
    </form>
  );
}

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [order, setOrder] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (orderId) {
      loadOrder();
    } else {
      navigate('/client-dashboard');
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, partners(name, city)')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);

      // Appeler backend pour créer PaymentIntent
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: data.price_gross_cents,
          orderId: data.id,
        }),
      });

      const { clientSecret: secret } = await response.json();
      setClientSecret(secret);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur chargement commande');
      navigate('/client-dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loader className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (!order || !clientSecret) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/client-dashboard')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <CreditCard className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Paiement sécurisé</h1>
            <p className="text-white/60">Commande #{order.id.slice(0, 8)}</p>
          </div>

          <div className="bg-white/5 rounded-xl p-6 mb-8 space-y-4">
            <div className="flex justify-between pb-4 border-b border-white/10">
              <span className="text-white/60">Formule</span>
              <span className="text-white font-semibold capitalize">{order.speed}</span>
            </div>
            <div className="flex justify-between pb-4 border-b border-white/10">
              <span className="text-white/60">Poids</span>
              <span className="text-white font-semibold">{order.weight_kg} kg</span>
            </div>
            <div className="flex justify-between pb-4 border-b border-white/10">
              <span className="text-white/60">Laverie</span>
              <span className="text-white font-semibold">{order.partners?.name}</span>
            </div>
            <div className="flex justify-between pt-4">
              <span className="text-white text-xl font-bold">Total</span>
              <span className="text-yellow-400 text-3xl font-bold">
                {(order.price_gross_cents / 100).toFixed(2)} €
              </span>
            </div>
          </div>

          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm order={order} clientSecret={clientSecret} />
          </Elements>
        </div>
      </div>
    </div>
  );
}
