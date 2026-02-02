// src/components/ReviewForm.tsx

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Star, Loader2, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ReviewFormProps {
  orderId: string;
  washerId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ orderId, washerId, onSuccess }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Vous devez être connecté');
      return;
    }

    if (rating === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('reviews')
        .insert({
          order_id: orderId,
          washer_id: washerId,
          client_id: user.id,
          rating,
          comment: comment.trim() || null,
        });

      if (insertError) throw insertError;

      // Succès
      if (onSuccess) onSuccess();
      
      // Reset form
      setRating(0);
      setComment('');
      
      alert('✅ Merci pour votre avis !');
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError(err.message || 'Erreur lors de l\'envoi de l\'avis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Laisser un avis
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Étoiles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={`${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {rating === 5 && '⭐ Excellent !'}
              {rating === 4 && '👍 Très bien'}
              {rating === 3 && '😊 Bien'}
              {rating === 2 && '😕 Moyen'}
              {rating === 1 && '😞 Décevant'}
            </p>
          )}
        </div>

        {/* Commentaire */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commentaire (optionnel)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience..."
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/500 caractères
          </p>
        </div>

        {/* Erreur */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || rating === 0}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Envoyer mon avis
            </>
          )}
        </button>
      </form>
    </div>
  );
}
