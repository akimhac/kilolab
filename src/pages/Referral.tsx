import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Gift, Copy, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Referral() {
  const [code, setCode] = useState('...');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const prefix = user.email ? user.email.split('@')[0].toUpperCase().slice(0,4) : 'KILO';
        setCode(prefix + '-PROMO');
      }
    }
    loadUser();
  }, []);

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
                    Le linge sale, c'est mieux quand on ne le lave pas soi-même. Invitez vos amis à découvrir Kilolab.
                </p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center h-full">
                <h2 className="font-bold mb-6 text-xl">Votre code parrain unique</h2>
                <div onClick={copyToClipboard} className="bg-slate-100 p-6 rounded-2xl border-2 border-dashed border-slate-300 font-mono text-3xl font-bold cursor-pointer hover:bg-slate-200 transition text-slate-700 select-all">
                    {code}
                </div>
                <button onClick={copyToClipboard} className="mt-6 w-full py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition">
                    {copied ? <><CheckCircle size={18}/> Copié</> : <><Copy size={18}/> Copier le code</>}
                </button>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 h-full">
                <h2 className="font-bold mb-6 text-xl">Comment ça marche ?</h2>
                <p className="text-slate-500">Partagez votre code. Vos amis gagnent 5€ sur leur première commande, et vous aussi !</p>
            </div>
        </div>
      </div>
    </div>
  );
}
