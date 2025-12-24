import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Gift, Copy, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Referral() {
  const [copied, setCopied] = useState(false);
  const code = "KILO-PROMO-2024";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`Rejoins Kilolab avec ${code} et gagne 5€ ! https://kilolab.fr`);
    setCopied(true);
    toast.success('Copié !');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar />
      <div className="pt-32 max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white text-center shadow-xl mb-12 relative overflow-hidden">
            <div className="relative z-10">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6">
                    <Gift size={40} className="text-white"/>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Offrez 5€, Recevez 5€</h1>
                <p className="text-indigo-100 text-lg max-w-xl mx-auto">
                    Invitez vos amis à découvrir Kilolab. Ils gagnent 5€ sur leur première commande.
                </p>
            </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center max-w-md mx-auto">
            <h2 className="font-bold mb-6 text-xl">Votre code parrain unique</h2>
            <div onClick={copyToClipboard} className="bg-slate-100 p-6 rounded-2xl border-2 border-dashed border-slate-300 font-mono text-3xl font-bold cursor-pointer hover:bg-slate-200 transition text-slate-700 select-all">
                {code}
            </div>
            <button onClick={copyToClipboard} className="mt-6 w-full py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition">
                {copied ? <><CheckCircle size={18}/> Copié</> : <><Copy size={18}/> Copier le code</>}
            </button>
        </div>
      </div>
    </div>
  );
}
