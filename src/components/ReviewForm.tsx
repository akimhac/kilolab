import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReviewForm({ orderId, clientName, onSubmitted }: any) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);

  const submitReview = async () => {
    if (rating === 0) return toast.error('Notez avec des étoiles');
    
    const { error } = await supabase.from('reviews').insert({
      order_id: orderId,
      rating: rating,
      comment: comment,
      client_name: clientName
    });

    if (error) toast.error('Erreur');
    else {
      toast.success('Merci pour votre avis !');
      onSubmitted();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-teal-100 shadow-sm text-center">
      <h3 className="font-bold text-lg mb-4">Notez votre expérience</h3>
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition"
          >
            <Star size={32} className={`${star <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
          </button>
        ))}
      </div>
      <textarea 
        className="w-full p-3 border rounded-lg mb-4 text-sm" 
        placeholder="Le linge était-il propre ? Le service rapide ?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={submitReview} className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-black">
        Publier mon avis certifié
      </button>
    </div>
  );
}

