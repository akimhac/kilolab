import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Star, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  partner_id: string;
  user_id: string;
  status: string;
  partners: {
    name: string;
    address: string;
    city: string;
  };
}

export default function ReviewOrder() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    setUser(session.user);
    loadOrder(session.user.id);
  };

  const loadOrder = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          partners (name, address, city)
        `)
        .eq('id', orderId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (data.status !== 'completed') {
        toast.error('Cette commande n\'est pas encore terminée');
        setTimeout(() => navigate('/client-dashboard'), 2000);
        return;
      }

      // Vérifier si avis existe déjà
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('order_id', orderId)
        .single();

      if (existingReview) {
        toast.error('Vous avez déjà laissé un avis pour cette commande');
        setTimeout(() => navigate('/client-dashboard'), 2000);
        return;
      }

      setOrder(data);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Commande introuvable');
      setTimeout(() => navigate('/client-dashboard'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Veuillez sélectionner une note');
      return;
    }

    if (!order || !user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          order_id: orderId,
          user_id: user.id,
          partner_id: order.partner_id,
          rating,
          comment: comment.trim() || null
        });

      if (error) throw error;

      toast.success('Merci pour votre avis ! 🎉');
      setTimeout(() => navigate('/client-dashboard'), 2000);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Erreur lors de l\'envoi de l\'avis');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/client-dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Votre avis compte ! ⭐
          </h1>
          <p className="text-slate-600 mb-8">
            Partagez votre expérience avec {order.partners.name}
          </p>

          <div className="bg-blue-50 rounded-2xl p-6 mb-8 border-2 border-blue-200">
            <h2 className="font-bold text-lg text-slate-900 mb-1">
              {order.partners.name}
            </h2>
            <p className="text-slate-600 text-sm">
              {order.partners.address}, {order.partners.city}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Commande #{order.id.substring(0, 8).toUpperCase()}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label className="block text-lg font-bold text-slate-900 mb-4">
                Note globale *
              </label>
              <div className="flex gap-2 justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transform transition-all hover:scale-110"
                  >
                    <Star
                      className={`w-12 h-12 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-slate-600 text-sm">
                {rating === 0 && 'Cliquez pour noter'}
                {rating === 1 && 'Très insatisfait'}
                {rating === 2 && 'Insatisfait'}
                {rating === 3 && 'Correct'}
                {rating === 4 && 'Satisfait'}
                {rating === 5 && 'Très satisfait'}
              </p>
            </div>

            <div className="mb-8">
              <label className="block text-lg font-bold text-slate-900 mb-4">
                Votre commentaire (optionnel)
              </label>
              <textarea
                rows={6}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none resize-none"
                placeholder="Partagez votre expérience en détail : qualité du service, propreté, délais, accueil..."
                maxLength={500}
              />
              <p className="text-sm text-slate-500 text-right mt-2">
                {comment.length}/500 caractères
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="w-full py-5 rounded-2xl font-bold text-xl text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {submitting ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  Publier mon avis
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
