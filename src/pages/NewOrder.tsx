import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Scale, MapPin, ArrowRight, CheckCircle, Loader2, Sparkles, X, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showWaitingModal, setShowWaitingModal] = useState(false);
  
  // Données
  const [weight, setWeight] = useState(5);
  const [address, setAddress] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [partnerId, setPartnerId] = useState<string>('');
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
        const { data } = await supabase
          .from('user_profiles')
          .select('id, full_name')
          .eq('role', 'partner')
          .eq('status', 'active');
          
        if (data && data.length > 0) {
            setPartners(data);
            setPartnerId(data[0].id);
        } else {
            setPartners([{ id: 'waiting_list', full_name: '📍 Zone en cours d\'ouverture (Service Conciergerie)' }]);
            setPartnerId('waiting_list');
        }
    } catch (e) { console.error(e); }
  };

  const totalPrice = (weight * 4.90).toFixed(2);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non connecté");

      // QU'IL Y AIT UN PARTENAIRE OU NON, ON SAUVEGARDE LA DEMANDE !
      // Si waiting_list, on met le statut 'waiting_list' pour que l'Admin le sache
      const isConcierge = partnerId === 'waiting_list';
      
      const { error } = await supabase.from('orders').insert({
        client_id: user.id,
        partner_id: isConcierge ? null : partnerId, // NULL si pas de partenaire
        weight: weight,
        pickup_address: address,
        pickup_date: pickupDate,
        total_price: parseFloat(totalPrice),
        status: isConcierge ? 'waiting_list' : 'pending' // Statut spécial
      });

      if (error) throw error;

      if (isConcierge) {
          // Si c'est conciergerie, on ouvre la pop-up APRÈS avoir sauvegardé
          setShowWaitingModal(true);
      } else {
          // Si c'est normal
          toast.success("Commande validée !");
          navigate('/dashboard');
      }

    } catch (error: any) {
      toast.error("Erreur : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 relative">
      <Navbar />
      
      {/* POP-UP CONCIERGERIE */}
      {showWaitingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-300 text-center border border-white/20">
                <button onClick={() => navigate('/dashboard')} className="absolute top-4 right-4 p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition"><X size={20}/></button>
                
                <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/20">
                    <Sparkles size={40} />
                </div>
                
                <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Demande bien reçue !</h2>
                
                <div className="space-y-4 mb-8 text-left bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Votre demande est <strong>enregistrée et sécurisée</strong>.
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm font-medium text-slate-800">
                            <CheckCircle size={16} className="text-teal-500 mt-0.5 shrink-0"/>
                            Notre équipe Conciergerie a reçu votre alerte.
                        </li>
                        <li className="flex items-start gap-2 text-sm font-medium text-slate-800">
                            <CheckCircle size={16} className="text-teal-500 mt-0.5 shrink-0"/>
                            Nous vous appelons sous 24h pour organiser le ramassage.
                        </li>
                    </ul>
                </div>

                <button onClick={() => navigate('/dashboard')} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg transform hover:-translate-y-1 mb-4">
                    Voir mon suivi
                </button>
            </div>
        </div>
      )}

      {/* RESTE DU FORMULAIRE (NE CHANGE PAS) */}
      <div className="pt-32 max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Nouvelle Commande</h1>
        {/* ... (Garder le reste du code des étapes 1, 2, 3 identique) ... */}
        {/* INDICATEUR D'ÉTAPES */}
        <div className="flex justify-center mb-12 text-sm md:text-base">
            <StepIndicator num={1} current={step} label="Panier" />
            <div className="w-8 md:w-12 h-0.5 bg-slate-200 mx-2 self-center"></div>
            <StepIndicator num={2} current={step} label="Détails" />
            <div className="w-8 md:w-12 h-0.5 bg-slate-200 mx-2 self-center"></div>
            <StepIndicator num={3} current={step} label="Validation" />
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
            {step === 1 && (
                <div className="p-8 animate-in slide-in-from-right-8 duration-300">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Scale className="text-teal-500"/> Volume de linge</h2>
                    <div className="mb-8 text-center">
                        <div className="text-6xl font-extrabold text-slate-900 mb-2">{weight} <span className="text-2xl text-slate-400 font-normal">kg</span></div>
                        <p className="text-slate-500">~ {Math.ceil(weight / 5)} machine(s)</p>
                    </div>
                    <input type="range" min="3" max="30" step="1" value={weight} onChange={(e) => setWeight(parseInt(e.target.value))} className="w-full h-4 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-500 mb-8"/>
                    <div className="bg-teal-50 p-4 rounded-xl flex justify-between items-center border border-teal-100">
                        <span className="font-bold text-teal-800">Prix estimé</span>
                        <span className="text-2xl font-bold text-teal-600">{totalPrice} €</span>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button onClick={() => setStep(2)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition flex items-center gap-2">Continuer <ArrowRight size={18}/></button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="p-8 animate-in slide-in-from-right-8 duration-300">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><MapPin className="text-teal-500"/> Retrait & Partenaire</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Choisir un Pressing</label>
                            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 font-medium" value={partnerId} onChange={(e) => setPartnerId(e.target.value)}>
                                {partners.map(p => (
                                    <option key={p.id} value={p.id}>{p.full_name}</option>
                                ))}
                            </select>
                            {partnerId === 'waiting_list' && (
                                <p className="text-xs text-teal-700 mt-2 flex items-center gap-1 font-medium bg-teal-50 p-2 rounded-lg border border-teal-100">
                                    <Sparkles size={14}/> Service Conciergerie activé pour votre zone.
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Adresse de collecte</label>
                            <input type="text" placeholder="Ex: 10 rue de la Paix, Paris" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"/>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Date souhaitée</label>
                            <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"/>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-between">
                        <button onClick={() => setStep(1)} className="text-slate-500 font-bold hover:text-slate-800">Retour</button>
                        <button disabled={!address || !pickupDate} onClick={() => setStep(3)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition flex items-center gap-2 disabled:opacity-50">Continuer <ArrowRight size={18}/></button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="p-8 animate-in slide-in-from-right-8 duration-300">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><CheckCircle className="text-teal-500"/> Récapitulatif</h2>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 mb-8 text-sm md:text-base">
                        <div className="flex justify-between"><span className="text-slate-500">Poids</span><span className="font-bold">{weight} kg</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Adresse</span><span className="font-bold text-right truncate max-w-[200px]">{address}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Date</span><span className="font-bold">{pickupDate}</span></div>
                        <div className="border-t border-slate-200 pt-4 flex justify-between items-center"><span className="font-bold text-lg">Total</span><span className="font-extrabold text-3xl text-teal-600">{totalPrice} €</span></div>
                    </div>
                    <div className="flex justify-between items-center">
                         <button onClick={() => setStep(2)} className="text-slate-500 font-bold hover:text-slate-800">Retour</button>
                         <button onClick={handleSubmit} disabled={loading} className={`px-8 py-4 text-white rounded-xl font-bold transition shadow-lg w-full ml-4 flex justify-center items-center gap-2 ${partnerId === 'waiting_list' ? 'bg-slate-900 hover:bg-slate-800' : 'bg-teal-500 hover:bg-teal-400 text-slate-900'}`}>
                            {loading ? <Loader2 className="animate-spin"/> : (partnerId === 'waiting_list' ? "Valider ma demande" : "Valider et Payer")}
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ num, current, label }: { num: number, current: number, label: string }) {
    const isActive = current >= num;
    return (
        <div className={`flex items-center gap-2 ${isActive ? 'text-teal-600 font-bold' : 'text-slate-300'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isActive ? 'border-teal-600 bg-teal-50' : 'border-slate-200'}`}>{num}</div>
            <span className="hidden md:inline">{label}</span>
        </div>
    );
}