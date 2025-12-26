import Navbar from '../components/Navbar';
import { Copy, Gift, Share2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Referral() {
  const code = "KILO-AKIM"; // À dynamiser plus tard avec le nom du user

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copié !");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <div className="pt-32 px-4 max-w-2xl mx-auto text-center">
        
        <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Gift size={40}/>
        </div>

        <h1 className="text-4xl font-black mb-4">Invitez un ami,<br/>Gagnez du linge propre.</h1>
        <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">
            Offrez <span className="font-bold text-slate-900">10€</span> à vos amis sur leur première commande.
            Recevez <span className="font-bold text-slate-900">10€</span> dès qu'ils commandent.
        </p>

        <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100 flex items-center justify-between max-w-sm mx-auto mb-12">
            <div className="px-6 font-mono font-black text-2xl tracking-widest text-slate-900">{code}</div>
            <button onClick={copyCode} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition flex gap-2">
                <Copy size={18}/> Copier
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center text-blue-600 mb-3"><Share2 size={20}/></div>
                <h3 className="font-bold">1. Partagez</h3>
                <p className="text-xs text-slate-500">Envoyez votre lien unique à vos proches.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="bg-green-50 w-10 h-10 rounded-lg flex items-center justify-center text-green-600 mb-3"><Star size={20}/></div>
                <h3 className="font-bold">2. Ils commandent</h3>
                <p className="text-xs text-slate-500">Ils profitent de 10€ de réduction immédiate.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="bg-yellow-50 w-10 h-10 rounded-lg flex items-center justify-center text-yellow-600 mb-3"><Gift size={20}/></div>
                <h3 className="font-bold">3. Vous gagnez</h3>
                <p className="text-xs text-slate-500">Vos crédits sont ajoutés automatiquement.</p>
            </div>
        </div>

      </div>
    </div>
  );
}
