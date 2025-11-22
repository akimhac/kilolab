import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Package, Clock, Euro, CreditCard, Zap, Shield, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingButton from '../components/LoadingButton';

interface Partner {
  id: string;
  name: string;
  address: string;
  city: string;
  email: string;
  is_active: boolean;
  stripe_account_id?: string;
}

export default function NewOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [weightKg, setWeightKg] = useState<number>(5);
  const [serviceType, setServiceType] = useState<'standard' | 'express'>('standard');

  const servicePrices = {
    standard: 3.50,
    express: 5.00
  };

  useEffect(() => {
    checkAuth();
    loadPartner();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login', { state: { from: '/new-order' } });
      return;
    }
    setUser(session.user);
  };

  const loadPartner = () => {
    const state = location.state as any;
    if (state?.partner) {
      setPartner(state.partner);
    } else {
      toast.error('Aucun pressing sélectionné');
      setTimeout(() => navigate('/partners-map'), 2000);
    }
  };

  const calculateTotal = () => {
    return weightKg * servicePrices[serviceType];
  };

  const handleCreateOrder = async () => {
    if (!user || !partner) {
      toast.error('Informations manquantes');
      return;
    }

    if (weightKg < 1 || weightKg > 50) {
      toast.error('Le poids doit être entre 1 et 50 kg');
      return;
    }

    setLoading(true);

    try {
      const totalAmount = calculateTotal();

      // 1. Créer la commande dans Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          partner_id: partner.id,
          weight_kg: weightKg,
          service_type: serviceType,
          total_amount: totalAmount,
          status: 'pending',
          payment_status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      console.log('✅ Commande créée:', orderData.id);

      // 2. Créer session Stripe Checkout
      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.id,
          amount: totalAmount,
          serviceType: serviceType,
          weightKg: weightKg,
          partnerStripeAccountId: partner.stripe_account_id || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur création session Stripe');
      }

      const { url, error } = await response.json();

      if (error) throw new Error(error);

      // 3. Rediriger vers Stripe Checkout
      console.log('✅ Redirection vers Stripe Checkout');
      window.location.href = url;

    } catch (error: any) {
      console.error('❌ Erreur:', error);
      toast.error(error.message || 'Erreur lors de la création de la commande');
      setLoading(false);
    }
  };

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-8">
            Nouvelle commande
          </h1>

          {/* Info Pressing */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-8 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-xl text-slate-900 mb-1">{partner.name}</h2>
                <p className="text-slate-600">{partner.address}, {partner.city}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Poids */}
          <div className="mb-8">
            <label className="block text-lg font-bold text-slate-900 mb-4">
              <Package className="w-5 h-5 inline mr-2" />
              Poids estimé (kg)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              step="0.5"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full px-6 py-4 text-3xl font-black text-center border-4 border-blue-300 rounded-2xl focus:border-blue-600 focus:outline-none transition"
            />
            <p className="text-sm text-slate-500 mt-2 text-center">
              Le poids exact sera confirmé par le pressing lors du dépôt
            </p>
          </div>

          {/* Formules */}
          <div className="mb-8">
            <label className="block text-lg font-bold text-slate-900 mb-4">
              <Clock className="w-5 h-5 inline mr-2" />
              Choisissez votre formule
            </label>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Standard */}
              <button
                type="button"
                onClick={() => setServiceType('standard')}
                className={`p-6 rounded-2xl border-4 transition-all ${
                  serviceType === 'standard'
                    ? 'border-blue-600 bg-blue-50 shadow-xl scale-105'
                    : 'border-slate-200 hover:border-blue-300 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-black text-slate-900">Standard</span>
                  <Clock className="w-7 h-7 text-blue-600" />
                </div>
                <div className="text-5xl font-black text-blue-600 mb-3">
                  3,50€<span className="text-2xl">/kg</span>
                </div>
                <div className="text-slate-600 font-semibold">
                  48-72h de délai
                </div>
                <div className="mt-4 text-sm text-slate-500">
                  ✓ Lavage professionnel<br/>
                  ✓ Séchage<br/>
                  ✓ Pliage soigné
                </div>
              </button>

              {/* Express */}
              <button
                type="button"
                onClick={() => setServiceType('express')}
                className={`p-6 rounded-2xl border-4 transition-all relative ${
                  serviceType === 'express'
                    ? 'border-orange-600 bg-orange-50 shadow-xl scale-105'
                    : 'border-slate-200 hover:border-orange-300 hover:shadow-lg'
                }`}
              >
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-xs font-black shadow-lg">
                  ⚡ URGENT
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-black text-slate-900">Express</span>
                  <Zap className="w-7 h-7 text-orange-600" />
                </div>
                <div className="text-5xl font-black text-orange-600 mb-3">
                  5,00€<span className="text-2xl">/kg</span>
                </div>
                <div className="text-slate-600 font-semibold">
                  Prêt en 24h
                </div>
                <div className="mt-4 text-sm text-slate-500">
                  ✓ Tout inclus<br/>
                  ✓ Service prioritaire<br/>
                  ✓ Garantie 24h
                </div>
              </button>
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-6 mb-8 border-2 border-blue-300">
            <h3 className="font-bold text-xl text-slate-900 mb-4 flex items-center gap-2">
              <Euro className="w-6 h-6" />
              Récapitulatif
            </h3>
            <div className="space-y-3 text-slate-700">
              <div className="flex justify-between text-lg">
                <span>Poids :</span>
                <span className="font-bold">{weightKg} kg</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Formule :</span>
                <span className="font-bold">
                  {serviceType === 'express' ? 'Express (24h)' : 'Standard (48-72h)'}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Prix au kg :</span>
                <span className="font-bold">{servicePrices[serviceType].toFixed(2)}€</span>
              </div>
              <div className="border-t-4 border-blue-400 pt-4 flex justify-between items-center">
                <span className="text-2xl font-black text-slate-900">Total :</span>
                <span className="text-5xl font-black text-blue-600">
                  {calculateTotal().toFixed(2)}€
                </span>
              </div>
            </div>
          </div>

          {/* Sécurité */}
          <div className="bg-green-50 rounded-xl p-4 mb-6 border-2 border-green-200">
            <div className="flex items-center gap-3 text-green-800">
              <Shield className="w-6 h-6 flex-shrink-0" />
              <p className="text-sm font-semibold">
                Paiement 100% sécurisé par Stripe • Vos données bancaires sont protégées
              </p>
            </div>
          </div>

          {/* Bouton paiement */}
          <LoadingButton
            loading={loading}
            onClick={handleCreateOrder}
            className="w-full py-5 rounded-2xl font-bold text-xl text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>Redirection vers le paiement sécurisé...</>
            ) : (
              <>
                <CreditCard className="w-6 h-6" />
                Procéder au paiement sécurisé
              </>
            )}
          </LoadingButton>

          <p className="text-xs text-slate-500 text-center mt-4">
            En cliquant, vous serez redirigé vers notre plateforme de paiement sécurisée Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
