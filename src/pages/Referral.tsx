import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Gift, Users, Euro } from 'lucide-react';

export default function Referral() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" /> Retour
          </button>
          <Link to="/" className="text-xl font-bold text-teal-600">Kilolab</Link>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <Gift className="w-16 h-16 text-purple-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Programme de parrainage</h1>
        <p className="text-xl text-slate-600 mb-12">Parrainez vos amis et gagnez des réductions !</p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Invitez</h3>
            <p className="text-sm text-slate-600">Partagez votre code avec vos amis</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Gift className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Ils profitent</h3>
            <p className="text-sm text-slate-600">-5€ sur leur première commande</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Euro className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Vous gagnez</h3>
            <p className="text-sm text-slate-600">5€ de crédit par filleul</p>
          </div>
        </div>

        <p className="text-slate-500">Programme bientôt disponible. Inscrivez-vous pour être notifié !</p>
      </div>
    </div>
  );
}
