import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, CheckCircle } from 'lucide-react';

export default function PartnerComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center font-sans text-white">
      <div className="max-w-lg w-full bg-slate-900 border border-teal-500/30 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-[50px] -mr-10 -mt-10"></div>
        
        <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-teal-400 animate-pulse" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">Dossier en cours d'analyse</h2>
        
        <p className="text-slate-400 mb-8 text-lg leading-relaxed">
          Merci pour votre inscription. Notre équipe vérifie vos informations (SIRET et zone de chalandise).
        </p>

        <div className="bg-slate-950 rounded-xl p-6 mb-8 text-left space-y-4 border border-white/5">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">1. Inscription reçue</p>
              <p className="text-sm text-slate-500">Vos données sont sécurisées.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">2. Validation manuelle</p>
              <p className="text-sm text-slate-500">Nous vous contacterons par email dès l'activation de votre compte.</p>
            </div>
          </div>
        </div>

        <button onClick={() => navigate('/')} className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl transition flex items-center justify-center gap-2">
          Retour à l'accueil <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
