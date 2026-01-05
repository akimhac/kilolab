import { X, Clock, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
}

export default function PartnerPendingModal({ isOpen, onClose, partnerName }: Props) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
            <Clock className="w-7 h-7 text-orange-600" />
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-4">
          Pressing en cours de validation
        </h3>
        
        <p className="text-slate-600 leading-relaxed mb-6">
          <strong className="text-slate-900">{partnerName}</strong> n'est pas encore activé sur Kilolab. 
          Ce pressing est actuellement en cours de validation par notre équipe.
        </p>

        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <h4 className="font-bold text-blue-900 mb-3">💡 Vous êtes ce pressing ?</h4>
          <p className="text-blue-800 text-sm mb-4">
            Inscrivez-vous maintenant et bénéficiez de votre <strong>1er mois GRATUIT</strong> !
          </p>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-center gap-2">
              <Gift className="w-4 h-4 flex-shrink-0" />
              <span>0€ de commission pendant 30 jours</span>
            </li>
            <li className="flex items-center gap-2">
              <Gift className="w-4 h-4 flex-shrink-0" />
              <span>Validation en 24-48h</span>
            </li>
            <li className="flex items-center gap-2">
              <Gift className="w-4 h-4 flex-shrink-0" />
              <span>Seulement 20% après</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-bold hover:border-slate-400 transition"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              navigate('/become-partner');
              onClose();
            }}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-xl transition"
          >
            Devenir partenaire
          </button>
        </div>
      </div>
    </div>
  );
}
