import { useState } from 'react';
import { Repeat, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface ReorderProps {
  order: {
    id: string;
    pickup_address: string;
    weight: number;
    formula: string;
    pickup_slot?: string | null;
  };
}

export default function ReorderButton({ order }: ReorderProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReorder = () => {
    setLoading(true);
    // Store reorder data in sessionStorage for the NewOrder page
    sessionStorage.setItem('reorder', JSON.stringify({
      from_order_id: order.id,
      pickup_address: order.pickup_address,
      weight: order.weight,
      formula: order.formula,
      pickup_slot: order.pickup_slot,
    }));
    toast.success('Commande pre-remplie !', { duration: 2000 });
    navigate('/order');
    setLoading(false);
  };

  return (
    <button
      onClick={handleReorder}
      disabled={loading}
      data-testid="reorder-button"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold hover:bg-teal-100 transition border border-teal-200"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Repeat size={14} />}
      Re-commander
    </button>
  );
}
