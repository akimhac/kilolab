import { useState } from 'react';
import { Star, ExternalLink, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface GoogleReviewPromptProps {
  rating: number;
  onDismiss: () => void;
}

export default function GoogleReviewPrompt({ rating, onDismiss }: GoogleReviewPromptProps) {
  const [visible, setVisible] = useState(true);

  if (!visible || rating < 5) return null;

  const handleReview = () => {
    // Open Google Business review link (replace with actual link)
    window.open('https://g.page/r/kilolab/review', '_blank');
    toast.success('Merci pour votre avis !', { duration: 3000 });
    setVisible(false);
    onDismiss();
  };

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-4 relative" data-testid="google-review-prompt">
      <button onClick={() => { setVisible(false); onDismiss(); }} className="absolute top-3 right-3 text-yellow-400 hover:text-yellow-600">
        <X size={16} />
      </button>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Star size={24} className="text-yellow-500 fill-yellow-500" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-slate-800 text-sm">Vous aimez Kilolab ?</p>
          <p className="text-slate-500 text-xs mt-0.5">Aidez-nous en laissant un avis Google !</p>
        </div>
      </div>
      <button
        onClick={handleReview}
        className="w-full mt-3 py-2.5 bg-yellow-400 text-yellow-900 rounded-xl font-bold text-sm hover:bg-yellow-500 transition flex items-center justify-center gap-2"
      >
        <ExternalLink size={14} /> Laisser un avis Google
      </button>
    </div>
  );
}
