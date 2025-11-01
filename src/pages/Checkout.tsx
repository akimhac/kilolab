import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, ArrowLeft, Loader } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

function CheckoutForm({ order, onSuccess }: { order: any; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // Créer un PaymentIntent côté client (mode simplifié)
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Marquer la commande comme payée
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (updateError) throw updateError;

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erreur lors du paiement');
    } finally {
      setProcessing(false);
    }
  };

  const priceEur = (order.price_gross_cents / 100).toFixed(2);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/5 rounded-xl p-6">
        <label className="block text-white/80 font-semibold mb-3">
          Informations de carte bancaire
        </label>
        <div className="bg-white p-4 rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        <p className="text-white/40 text-xs mt-2">
          🔒 Paiement sécurisé par Stripe
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
        <p className="text-blue-200 text-sm">
          💳 <strong>Carte de test Stripe :</strong><br/>
          Numéro : 4242 4242 4242 4242<br/>
          Date : n'importe quelle date future<br/>
          CVC : n'importe quel 3 chiffres
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Payer {priceEur} €
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
        .select('*, partners(name, address, city)')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
      alert('Commande introuvable');
      navigate('/client-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    alert('✅ Paiement réussi !\n\nVotre commande est maintenant confirmée.');
    navigate('/client-dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (!order) return null;

  const priceEur = (order.price_gross_cents / 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/client-dashboard')}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au Dashboard
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <CreditCard className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Finaliser votre commande</h1>
            <p className="text-white/60">Commande #{order.id.slice(0, 8)}</p>
          </div>

          <div className="bg-white/5 rounded-xl p-6 mb-8 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-white/60">Formule</span>
              <span className="text-white font-semibold">
                {order.speed === 'premium' ? 'Premium (72-96h)' : 
                 order.speed === 'express' ? 'Express (24h)' : 
                 'Ultra Express (6h)'}
              </span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-white/60">Poids</span>
              <span className="text-white font-semibold">{order.weight_kg} kg</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-white/60">Laverie partenaire</span>
              <span className="text-white font-semibold text-right">
                {order.partners?.name}<br/>
                <span className="text-sm text-white/60">{order.partners?.city}</span>
              </span>
            </div>

            <div className="flex justify-between items-center pt-4">
              <span className="text-white text-xl font-bold">Total</span>
              <span className="text-yellow-400 text-3xl font-bold">{priceEur} €</span>
            </div>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm order={order} onSuccess={handleSuccess} />
          </Elements>
        </div>
      </div>
    </div>
  );
}
