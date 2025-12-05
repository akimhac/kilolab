// src/pages/NewOrder.tsx
// Page de création de commande - 3€/kg Standard, 5€/kg Express

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, Package, Zap, MapPin, Phone, Euro, 
  Minus, Plus, Calendar, Clock, CheckCircle, Loader2,
  AlertCircle, Search
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Partner {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  phone?: string;
  price_per_kg?: number;
}

export default function NewOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [noPartnerSelected, setNoPartnerSelected] = useState(false);
  
  // Données de commande
  const [serviceType, setServiceType] = useState<'standard' | 'express'>('standard');
  const [weightKg, setWeightKg] = useState(5);
  const [notes, setNotes] = useState('');

  // PRIX CORRIGÉS : 3€ standard, 5€ express
  const pricePerKg = serviceType === 'express' ? 5 : 3;
  const totalAmount = weightKg * pricePerKg;

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Veuillez vous connecter');
        navigate('/login', { state: { from: '/new-order' } });
        return;
      }
      
      setUser(session.user);

      const selectedPartner = location.state?.selectedPartner;
      
      if (selectedPartner) {
        setPartner(selectedPartner);
        setNoPartnerSelected(false);
      } else {
        setNoPartnerSelected(true);
      }

    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!partner || !user) {
      toast.error('Données manquantes');
      return;
    }

    if (weightKg < 1) {
      toast.error('Minimum 1 kg');
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        user_id: user.id,
        partner_id: partner.id,
        weight_kg: weightKg,
        service_type: serviceType,
        price_per_kg: pricePerKg,
        total_amount: totalAmount,
        status: 'pending',
        notes: notes.trim() || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error('Erreur création:', error);
        throw error;
      }

      toast.success('Commande créée avec succès !');
      navigate(`/tracking/${data.id}`, { replace: true });

    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de la création');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Aucun pressing sélectionné
  if (noPartnerSelected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-orange-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Aucun pressing sélectionné
          </h1>
          
          <p className="text-slate-600 mb-8">
            Veuillez d'abord choisir un pressing partenaire pour créer votre commande.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/partners-map')}
              className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Trouver un pressing
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <h1 className="text-lg font-bold text-slate-900">Nouvelle commande</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Pressing sélectionné */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h2 className="text-sm font-medium text-slate-500 mb-3">Pressing sélectionné</h2>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">{partner?.name}</h3>
              <p className="text-sm text-slate-600">{partner?.address}</p>
              <p className="text-sm text-slate-600">{partner?.postal_code} {partner?.city}</p>
              {partner?.phone && (
                <a href={`tel:${partner.phone}`} className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <Phone className="w-3 h-3" />
                  {partner.phone}
                </a>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate('/partners-map')}
            className="mt-4 text-sm text-green-600 font-medium hover:underline"
          >
            Changer de pressing
          </button>
        </div>

        {/* Type de service */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h2 className="text-sm font-medium text-slate-500 mb-4">Type de service</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Standard - 3€/kg */}
            <button
              onClick={() => setServiceType('standard')}
              className={`p-4 rounded-2xl border-2 transition text-left ${
                serviceType === 'standard'
                  ? 'border-green-500 bg-green-50'
                  : 'border-slate-200 hover:border-green-300'
              }`}
            >
              <Package className={`w-8 h-8 mb-2 ${
                serviceType === 'standard' ? 'text-green-600' : 'text-slate-400'
              }`} />
              <p className={`font-bold ${
                serviceType === 'standard' ? 'text-green-600' : 'text-slate-700'
              }`}>Standard</p>
              <p className="text-3xl font-bold text-green-600 mt-1">3€<span className="text-sm font-normal">/kg</span></p>
              <p className="text-xs text-slate-500 mt-1">Retrait sous 24-48h</p>
            </button>

            {/* Express - 5€/kg */}
            <button
              onClick={() => setServiceType('express')}
              className={`p-4 rounded-2xl border-2 transition text-left relative ${
                serviceType === 'express'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-slate-200 hover:border-orange-300'
              }`}
            >
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                RAPIDE
              </div>
              <Zap className={`w-8 h-8 mb-2 ${
                serviceType === 'express' ? 'text-orange-600' : 'text-slate-400'
              }`} />
              <p className={`font-bold ${
                serviceType === 'express' ? 'text-orange-600' : 'text-slate-700'
              }`}>Express</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">5€<span className="text-sm font-normal">/kg</span></p>
              <p className="text-xs text-slate-500 mt-1">Retrait sous 4h</p>
            </button>
          </div>
        </div>

        {/* Poids */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h2 className="text-sm font-medium text-slate-500 mb-4">Poids estimé (kg)</h2>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setWeightKg(Math.max(1, weightKg - 1))}
              className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition"
            >
              <Minus className="w-6 h-6 text-slate-600" />
            </button>
            
            <div className="text-center">
              <span className="text-5xl font-bold text-green-600">{weightKg}</span>
              <span className="text-2xl text-slate-400 ml-1">kg</span>
            </div>
            
            <button
              onClick={() => setWeightKg(Math.min(50, weightKg + 1))}
              className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition"
            >
              <Plus className="w-6 h-6 text-green-600" />
            </button>
          </div>
          
          {/* Raccourcis */}
          <div className="flex justify-center gap-2 mt-4">
            {[3, 5, 8, 10, 15].map(w => (
              <button
                key={w}
                onClick={() => setWeightKg(w)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  weightKg === w
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {w} kg
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-4">
            💡 Le poids exact sera mesuré au pressing
          </p>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h2 className="text-sm font-medium text-slate-500 mb-3">Instructions (optionnel)</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Attention aux vêtements délicats, ne pas sécher le pull rouge..."
            rows={3}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:outline-none resize-none"
          />
        </div>

        {/* Récapitulatif */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-lg font-bold mb-4">Récapitulatif</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-white/80">Service</span>
              <span className="font-medium">
                {serviceType === 'express' ? '⚡ Express' : '📦 Standard'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Poids estimé</span>
              <span className="font-medium">{weightKg} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Prix au kg</span>
              <span className="font-medium">{pricePerKg}€</span>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-4 flex justify-between items-center">
            <span className="text-lg">Total estimé</span>
            <span className="text-3xl font-bold">{totalAmount.toFixed(2)}€</span>
          </div>

          {/* Économie par rapport au traditionnel */}
          <div className="mt-4 bg-white/20 rounded-xl p-3 text-center">
            <p className="text-sm">
              💰 Vous économisez environ <strong>{Math.round(totalAmount * 9)}€</strong> par rapport au pressing traditionnel !
            </p>
          </div>
        </div>

        {/* Bouton commander */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-5 bg-white text-green-600 border-2 border-green-600 rounded-2xl font-bold text-lg hover:bg-green-50 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Création en cours...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Confirmer la commande
            </>
          )}
        </button>

        <p className="text-center text-sm text-slate-500">
          Le paiement s'effectue directement au pressing lors du retrait
        </p>
      </div>
    </div>
  );
}
