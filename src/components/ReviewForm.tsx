import { useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ReviewFormProps {
  orderId: string;
  partnerId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ orderId, partnerId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('reviews').insert({
        order_id: orderId,
        partner_id: partnerId,
        client_id: user.id,
        rating,
        comment,
      });

      if (error) throw error;

      alert('✅ Merci pour votre avis !');
      onSuccess();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 rounded-xl p-6 space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">⭐ Donnez votre avis</h3>
      
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'
              }`}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Partagez votre expérience..."
        rows={4}
        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? 'Envoi...' : 'Envoyer mon avis'}
      </button>
    </form>
  );
}
