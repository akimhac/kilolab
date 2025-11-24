import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Package, Clock, CheckCircle, Sparkles, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrderTracking() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      // Charger commande
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', session.user.id)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      // Charger pressing
      const { data: partnerData } = await supabase
        .from('partners')
        .select('*')
        .eq('id', orderData.partner_id)
        .single();

      setPartner(partnerData);
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('Commande introuvable');
      navigate('/client-dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }

  const steps = [
    { 
      key: 'pending', 
      label: 'Commandé', 
      icon: Package, 
      color: 'blue',
      description: 'Votre commande a été créée'
    },
    { 
      key: 'confirmed', 
      label: 'Confirmé', 
      icon: CheckCircle, 
      color: 'green',
      description: 'Le pressing a accepté votre commande'
    },
    { 
      key: 'in_progress', 
      label: 'En cours', 
      icon: Clock, 
      color: 'orange',
      description: 'Votre linge est en cours de nettoyage'
    },
    { 
      key: 'ready', 
      label: 'Prêt', 
      icon: Sparkles, 
      color: 'purple',
      description: 'Votre linge est prêt à être récupéré'
    },
    { 
      key: 'completed', 
      label: 'Récupéré', 
      icon: CheckCircle, 
      color: 'green',
      description: 'Commande terminée'
    }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/client-dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            Suivi de commande
          </h1>
          <p className="text-slate-600 mb-8">
            Commande #{order.id.substring(0, 8).toUpperCase()}
          </p>

          {/* Infos pressing */}
          {partner && (
            <div className="bg-blue-50 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{partner.name}</p>
                  <p className="text-sm text-slate-600">{partner.address}, {partner.city}</p>
                  {partner.phone && (
                    <p className="text-sm text-blue-600 font-semibold">{partner.phone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-6 mb-8">
            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.key} className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted 
                      ? `bg-${step.color}-600` 
                      : 'bg-slate-200'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      isCompleted ? 'text-white' : 'text-slate-400'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className={`font-bold text-lg ${
                        isCompleted ? 'text-slate-900' : 'text-slate-400'
                      }`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                          En cours
                        </span>
                      )}
                      {isCompleted && !isCurrent && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <p className={`text-sm ${
                      isCompleted ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                      {step.description}
                    </p>
                    {isCompleted && (
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(order.created_at).toLocaleString('fr-FR')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Détails commande */}
          <div className="bg-slate-50 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4">Détails de la commande</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Poids :</span>
                <span className="font-bold text-slate-900">{order.weight_kg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Service :</span>
                <span className="font-bold text-slate-900">
                  {order.service_type === 'express' ? 'Express (24h)' : 'Standard (48-72h)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Montant :</span>
                <span className="font-bold text-blue-600 text-lg">
                  {order.total_amount.toFixed(2)}€
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Statut paiement :</span>
                <span className={`font-bold ${
                  order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {order.payment_status === 'paid' ? 'Payé' : 'En attente'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
