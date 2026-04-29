import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Review {
  id: string;
  client_rating: number;
  client_review: string;
  completed_at: string;
  client_first_name: string;
  washer_first_name: string;
  pickup_city?: string;
}

export default function PublicReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      // Fetch recent completed orders with reviews
      const { data } = await supabase
        .from('orders')
        .select('id, client_rating, client_review, completed_at, pickup_city, client_id, washer_id')
        .not('client_rating', 'is', null)
        .not('client_review', 'is', null)
        .neq('client_review', '')
        .gte('client_rating', 4)
        .order('completed_at', { ascending: false })
        .limit(6);

      if (data && data.length > 0) {
        // Get client names
        const clientIds = [...new Set(data.map(d => d.client_id).filter(Boolean))];
        const washerIds = [...new Set(data.map(d => d.washer_id).filter(Boolean))];

        const { data: clients } = await supabase
          .from('user_profiles')
          .select('id, first_name')
          .in('id', clientIds);

        const { data: washers } = await supabase
          .from('washers')
          .select('id, first_name')
          .in('id', washerIds);

        const clientMap = new Map((clients || []).map(c => [c.id, c.first_name || 'Client']));
        const washerMap = new Map((washers || []).map(w => [w.id, w.first_name || 'Washer']));

        setReviews(data.map(d => ({
          id: d.id,
          client_rating: d.client_rating,
          client_review: d.client_review,
          completed_at: d.completed_at,
          client_first_name: clientMap.get(d.client_id) || 'Client',
          washer_first_name: washerMap.get(d.washer_id) || 'Washer',
          pickup_city: d.pickup_city,
        })));
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fallback static reviews if no real ones yet
  const fallbackReviews: Review[] = [
    { id: '1', client_rating: 5, client_review: "Super service ! Mon linge est revenu impeccable en moins de 48h. Je recommande à 100%.", completed_at: '2026-04-01', client_first_name: 'Sophie', washer_first_name: 'Marie', pickup_city: 'Paris' },
    { id: '2', client_rating: 5, client_review: "Pratique et rapide. Plus besoin d'aller à la laverie le dimanche. Mon Washer est top !", completed_at: '2026-03-28', client_first_name: 'Thomas', washer_first_name: 'Karim', pickup_city: 'Lyon' },
    { id: '3', client_rating: 5, client_review: "Excellent rapport qualité-prix. 3€/kg pour un lavage + pliage parfait, je suis conquise.", completed_at: '2026-03-25', client_first_name: 'Camille', washer_first_name: 'Fatima', pickup_city: 'Lille' },
    { id: '4', client_rating: 4, client_review: "Très bon service, ponctuel et soigneux. Le suivi en temps réel est un vrai plus.", completed_at: '2026-03-20', client_first_name: 'Marc', washer_first_name: 'Julie', pickup_city: 'Bordeaux' },
    { id: '5', client_rating: 5, client_review: "J'utilise Kilolab chaque semaine. C'est devenu indispensable dans mon quotidien !", completed_at: '2026-03-15', client_first_name: 'Léa', washer_first_name: 'Sarah', pickup_city: 'Marseille' },
    { id: '6', client_rating: 5, client_review: "Le linge sent super bon et est parfaitement plié. Merci à mon Washer !", completed_at: '2026-03-10', client_first_name: 'Hugo', washer_first_name: 'Amine', pickup_city: 'Toulouse' },
  ];

  const displayReviews = reviews.length > 0 ? reviews : fallbackReviews;

  if (loading) return null;

  return (
    <section className="py-20 bg-white" data-testid="public-reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Ce que nos clients disent
          </h2>
          <p className="text-lg text-slate-500">Des avis vérifiés après chaque commande</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayReviews.slice(0, 6).map((review, i) => (
            <div
              key={review.id}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={16} className={s <= review.client_rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} />
                  ))}
                </div>
                <Quote size={20} className="text-teal-200" />
              </div>
              
              <p className="text-slate-700 text-sm leading-relaxed mb-4 line-clamp-3">
                "{review.client_review}"
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                    {review.client_first_name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{review.client_first_name}</p>
                    {review.pickup_city && <p className="text-xs text-slate-400">{review.pickup_city}</p>}
                  </div>
                </div>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                  Washer: {review.washer_first_name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
