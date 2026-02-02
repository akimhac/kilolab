import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Star, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  client_id: string;
  helpful_count: number;
  response: string | null;
  response_at: string | null;
}

interface WasherReviewsProps {
  washerId: string;
}

export default function WasherReviews({ washerId }: WasherReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    loadReviews();
  }, [washerId]);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('washer_id', washerId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);
      
      if (data && data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAverageRating(avg);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des avis...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun avis pour le moment
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Note moyenne */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl font-bold text-indigo-600">
            {averageRating.toFixed(1)}
          </div>
          <div>
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={
                    star <= Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Basé sur {reviews.length} avis
            </p>
          </div>
        </div>
      </div>

      {/* Liste des avis */}
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-2xl shadow-lg p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={
                    star <= review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(review.created_at), {
                addSuffix: true,
                locale: fr,
              })}
            </p>
          </div>

          {/* Commentaire */}
          {review.comment && (
            <p className="text-gray-700 mb-4">{review.comment}</p>
          )}

          {/* Réponse du Washer */}
          {review.response && (
            <div className="mt-4 pl-4 border-l-4 border-indigo-200 bg-indigo-50 p-4 rounded-r-lg">
              <p className="text-sm font-medium text-indigo-900 mb-1">
                Réponse du Washer
              </p>
              <p className="text-sm text-indigo-800">{review.response}</p>
              <p className="text-xs text-indigo-600 mt-2">
                {formatDistanceToNow(new Date(review.response_at!), {
                  addSuffix: true,
                  locale: fr,
                })}
              </p>
            </div>
          )}

          {/* Utile */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600">
              <ThumbsUp size={16} />
              <span>Utile ({review.helpful_count})</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
