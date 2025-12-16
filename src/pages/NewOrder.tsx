import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Scale, Calendar, MapPin, ArrowRight, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Données du formulaire
  const [weight, setWeight] = useState(5);
  const [address, setAddress] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [partnerId, setPartnerId] = useState<string | null>(null);
  
  // Liste des pressings (Mockup pour l'instant, ou fetch DB)
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    // On récupère les partenaires "actifs"
    const { data } = await supabase
      .from('user_profiles')
      .select('id, full_name')
      .eq('role', 'partner')
      .eq('status', 'active');
      
    if (data && data.length > 0) {
        setPartners(data);
        setPartnerId(data[0].id); // Sélectionne le premier par défaut
    }
  };

  const totalPrice = (weight * 4.90).toFixed(2); // 4.90€ le Kg

  const handleSubmit = async () => {
    if (!partnerId) {
        toast.error("Aucun pressing disponible pour le moment.");
        return;
    }
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non connecté");

      // Création de la commande dans Supabase
      const { error } = await supabase.from('orders').insert({
        client_id: user.id,
        partner_id: partnerId,
        total_price: parseFloat(totalPrice),
        status: 'pending',
        // On pourrait ajouter des champs: weight, pickup_date, address... 
        // (Il faudra ajouter ces colonnes dans Supabase plus tard)
      });

      if (error) throw error;

      toast.success("Commande validée !");
      navigate('/dashboard'); // Retour au dashboard client

    } catch (error: any) {
      console.error(error);
      toast.error("Erreur lors de la commande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar />
      
      <div className="pt-32 max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Nouvelle Commande</h1>

        {/* INDICATEUR D'ÉTAPES */}
        <div className="flex justify-center mb-12">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-teal-600 font-bold' : 'text-slate-300'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-teal-600 bg-teal-50' : 'border-slate-200'}`}>1</div>
                Panier
            </div>
            <div className="w-12 h-0.5 bg-slate-200 mx-2"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-teal-600 font-bold' : 'text-slate-300'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-teal-600 bg-teal-50' : 'border-slate-200'}`}>2</div>
                Détails
            </div>
            <div className="w-12 h-0.5 bg-slate-200 mx-2"></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-teal-600 font-bold' : 'text-slate-300'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-teal-600 bg-teal-50' : 'border-slate-200'}`}>3</div>
                Validation
            </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* ÉTAPE 1 : POIDS */}
            {step === 1 && (
                <div className="p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Scale className="text-teal-500"/> Volume de linge</h2>
                    
                    <div className="mb-8 text-center">
                        <div className="text-6xl font-extrabold text-slate-900 mb-2">{weight} <span className="text-2xl text-slate-400 font-normal">kg</span></div>
                        <p className="text-slate-500">Environ {Math.ceil(weight / 5)} machine(s)</p>
                    </div>

                    <input 
                       type="range" min="3" max="30" step="1"
                       value={weight} onChange={(e) => setWeight(parseInt(e.target.value))}
                       className="w-full h-4 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-500 mb-8"
                    />

                    <div className="bg-teal-50 p-4 rounded-xl flex justify-between items-center border border-teal-100">
                        <span className="font-bold text-teal-800">Prix estimé</span>
                        <span className="text-2xl font-bold text-teal-600">{totalPrice} €</span>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button onClick={() => setStep(2)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition flex items-center gap-2">
                            Continuer <ArrowRight size={18}/>
                        </button>
                    </div>
                </div>
            )}

            {/* ÉTAPE 2 : INFOS */}
            {step === 2 && (
                <div className="p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><MapPin className="text-teal-500"/> Retrait & Partenaire</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Choisir un Pressing Partenaire</label>
                            {partners.length > 0 ? (
                                <select 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                                    value={partnerId || ''}
                                    onChange={(e) => setPartnerId(e.target.value)}
                                >
                                    {partners.map(p => (
                                        <option key={p.id} value={p.id}>{p.full_name}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="p-3 bg-yellow-50 text-yellow-700 rounded-xl text-sm flex items-center gap-2 border border-yellow-100">
                                    <AlertCircle size={16}/> Aucun partenaire disponible. Une démo sera créée.
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Adresse de collecte</label>
                            <input 
                                type="text" placeholder="10 rue de la Paix, Paris"
                                value={address} onChange={(e) => setAddress(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Date souhaitée</label>
                            <input 
                                type="date"
                                value={pickupDate} onChange={(e) => setPickupDate(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                        <button onClick={() => setStep(1)} className="text-slate-500 font-bold hover:text-slate-800">Retour</button>
                        <button disabled={!address || !pickupDate} onClick={() => setStep(3)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition flex items-center gap-2 disabled:opacity-50">
                            Continuer <ArrowRight size={18}/>
                        </button>
                    </div>
                </div>
            )}

            {/* ÉTAPE 3 : RÉSUMÉ */}
            {step === 3 && (
                <div className="p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><CheckCircle className="text-teal-500"/> Récapitulatif</h2>
                    
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 mb-8">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Poids</span>
                            <span className="font-bold">{weight} kg</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Adresse</span>
                            <span className="font-bold text-right">{address}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Date</span>
                            <span className="font-bold">{pickupDate}</span>
                        </div>
                        <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                            <span className="font-bold text-lg">Total à payer</span>
                            <span className="font-extrabold text-3xl text-teal-600">{totalPrice} €</span>
                        </div>
                    </div>

                    <p className="text-xs text-center text-slate-400 mb-6">
                        En validant, vous acceptez les CGV. Le paiement se fera lors de la pesée réelle par le partenaire.
                    </p>

                    <div className="flex justify-between items-center">
                         <button onClick={() => setStep(2)} className="text-slate-500 font-bold hover:text-slate-800">Retour</button>
                         <button onClick={handleSubmit} disabled={loading} className="px-8 py-4 bg-teal-500 text-slate-900 rounded-xl font-bold hover:bg-teal-400 transition shadow-lg w-full ml-4 flex justify-center items-center gap-2">
                            {loading ? <Loader2 className="animate-spin"/> : "Valider la commande"}
                        </button>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}
