import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { sendOrderConfirmation, sendPartnerNotification } from '../services/emailService';
import { ArrowLeft, Package, Clock, Euro, CreditCard, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface Partner {
  id: string;
  name: string;
  address: string;
  city: string;
  email: string;
  price_per_kg: number;
}

export default function NewOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [weight, setWeight] = useState<number>(5);
  const [serviceType, setServiceType] = useState<'standard' | 'express'>('standard');

  const servicePrices = {
    standard: 3.5,
    express: 5,
  };

  const serviceLabels = {
    standard: 'Standard',
    express: 'Express',
  };

  const serviceDescriptions = {
    standard: '48-72h de délai',
    express: 'Besoin urgent ? Votre linge prêt en 24h',
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

  const loadPartner = async () => {
    const state = location.state as any;
    if (state?.selectedPartner) {
      setPartner(state.selectedPartner);
    } else if (state?.partnerId) {
      const { data } = await supabase
        .from('partners')
        .select('*')
        .eq('id', state.partnerId)
        .single();
      if (data) setPartner(data);
    } else {
      toast.error('Aucun pressing sélectionné');
      setTimeout(() => navigate('/partners-map'), 2000);
    }
  };

  const calculateTotal = () => {
    return weight * servicePrices[serviceType];
  };

  const handleCreateOrder = async () => {
    if (!user || !partner) {
      toast.error('Informations manquantes');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        user_id: user.id,
        partner_id: partner.id,
        weight_kg: weight,
        service_type: serviceType,
        price_per_kg: servicePrices[serviceType],
        total_amount: calculateTotal(),
        status: 'pending',
        pickup_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      const { data: order, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      // Envoyer emails
      try {
        await Promise.all([
          sendOrderConfirmation({
            customerEmail: user.email,
            customerName: user.email.split('@')[0],
            orderNumber: order.id.substring(0, 8).toUpperCase(),
            partnerName: partner.name,
            partnerAddress: `${partner.address}, ${partner.city}`,
            weight,
            serviceType,
            total: calculateTotal(),
            pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')
          }),
          sendPartnerNotification({
            partnerEmail: partner.email || 'contact@kilolab.fr',
            partnerName: partner.name,
            orderNumber: order.id.substring(0, 8).toUpperCase(),
            customerEmail: user.email,
            weight,
            serviceType,
            total: calculateTotal()
          })
        ]);
        toast.success('Commande créée ! Email de confirmation envoyé.');
      } catch (emailError) {
        console.error('Email error:', emailError);
        toast.success('Commande créée avec succès !');
      }

      setTimeout(() => navigate('/client-dashboard'), 2000);
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement...</p>
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

          <div className="bg-blue-50 rounded-2xl p-6 mb-8 border-2 border-blue-200">
            <h2 className="font-bold text-xl text-slate-900 mb-2">{partner.name}</h2>
            <p className="text-slate-600">{partner.address}, {partner.city}</p>
          </div>

          <div className="mb-8">
            <label className="block text-lg font-bold text-slate-900 mb-4">
              <Package className="w-5 h-5 inline mr-2" />
              Poids estimé (kg)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full px-6 py-4 text-2xl font-bold text-center border-3 border-blue-300 rounded-2xl focus:border-blue-600 focus:outline-none"
            />
            <p className="text-sm text-slate-500 mt-2">
              Le poids exact sera confirmé par le pressing lors du dépôt
            </p>
          </div>

          <div className="mb-8">
            <label className="block text-lg font-bold text-slate-900 mb-4">
              <Clock className="w-5 h-5 inline mr-2" />
              Choisissez votre formule
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Standard */}
              <button
                onClick={() => setServiceType('standard')}
                className={`p-6 rounded-2xl border-3 transition-all ${
                  serviceType === 'standard'
                    ? 'border-blue-600 bg-blue-50 shadow-lg'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-black text-slate-900">Standard</span>
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-4xl font-black text-blue-600 mb-2">
                  3,50€<span className="text-lg">/kg</span>
                </div>
                <div className="text-slate-600">
                  48-72h de délai
                </div>
              </button>

              {/* Express */}
              <button
                onClick={() => setServiceType('express')}
                className={`p-6 rounded-2xl border-3 transition-all relative ${
                  serviceType === 'express'
                    ? 'border-orange-600 bg-orange-50 shadow-lg'
                    : 'border-slate-200 hover:border-orange-300'
                }`}
              >
                <div className="absolute -top-3 -right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  URGENT
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-black text-slate-900">Express</span>
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-4xl font-black text-orange-600 mb-2">
                  5€<span className="text-lg">/kg</span>
                </div>
                <div className="text-slate-600">
                  Besoin urgent ? Votre linge prêt en 24h
                </div>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-xl text-slate-900 mb-4">
              <Euro className="w-5 h-5 inline mr-2" />
              Récapitulatif
            </h3>
            <div className="space-y-3 text-slate-700">
              <div className="flex justify-between">
                <span>Poids :</span>
                <span className="font-bold">{weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Formule :</span>
                <span className="font-bold">{serviceLabels[serviceType]} ({serviceDescriptions[serviceType]})</span>
              </div>
              <div className="flex justify-between">
                <span>Prix au kg :</span>
                <span className="font-bold">{servicePrices[serviceType].toFixed(2)}€</span>
              </div>
              <div className="border-t-2 border-blue-300 pt-3 flex justify-between text-2xl font-black text-blue-900">
                <span>Total :</span>
                <span>{calculateTotal().toFixed(2)}€</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCreateOrder}
            disabled={loading}
            className="w-full py-5 rounded-2xl font-bold text-xl text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Création en cours...
              </>
            ) : (
              <>
                <CreditCard className="w-6 h-6" />
                Confirmer la commande
              </>
            )}
          </button>

          <p className="text-sm text-slate-500 text-center mt-4">
            Le paiement sera effectué lors du dépôt au pressing
          </p>
        </div>
      </div>
    </div>
  );
}
