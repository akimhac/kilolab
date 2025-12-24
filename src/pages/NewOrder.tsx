import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Scale, MapPin, ArrowRight, Sparkles, Tag, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); 
  const [showWaitingModal, setShowWaitingModal] = useState(false);
  
  // Données Commande
  const [formula, setFormula] = useState<'eco' | 'express'>('eco');
  const [weight, setWeight] = useState(5);
  const [pickupDate, setPickupDate] = useState('');
  
  // Données Recherche & Partenaires
  const [allPartners, setAllPartners] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [filteredPartners, setFilteredPartners] = useState<any[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('');
  const [finalAddress, setFinalAddress] = useState('');

  useEffect(() => { fetchPartners(); }, []);

  const fetchPartners = async () => {
    const { data } = await supabase.from('user_profiles')
      .select('id, full_name, address') 
      .eq('role', 'partner')
      .eq('status', 'active');
    setAllPartners(data || []);
  };

  const handleSearchLocally = () => {
    if (!searchQuery) return;
    setIsSearching(true);
    setSearchDone(false);

    // TON RADAR (Je n'y touche pas, il est très bien)
    setTimeout(() => {
        const results = allPartners.filter(p => 
            (p.address && p.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.full_name && p.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredPartners(results);
        setIsSearching(false);
        setSearchDone(true);
        
        if (results.length > 0) setSelectedPartnerId(results[0].id);
        else setSelectedPartnerId('waiting_list');
    }, 1500);
  };

  // Reset de la recherche si on change l'input
  useEffect(() => { if(searchDone) setSearchDone(false); }, [searchQuery]);

  // CALCUL DU PRIX
  const pricePerKg = formula === 'eco' ? 3 : 5;
  const totalPrice = (weight * pricePerKg).toFixed(2);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
         // Si pas connecté, on renvoie au login
         toast.error("Veuillez vous connecter pour commander");
         navigate('/login');
         return;
      }
      
      const isNetwork = !selectedPartnerId || selectedPartnerId === 'waiting_list';
      
      const { data: order, error } = await supabase.from('orders').insert({
        client_id: user.id,
        partner_id: isNetwork ? null : selectedPartnerId,
        weight: weight,
        pickup_address: finalAddress + ' (' + searchQuery + ')', 
        pickup_date: pickupDate,
        total_price: parseFloat(totalPrice),
        status: 'pending' // On garde 'pending' pour que ça apparaisse dans ton Admin
      }).select().single();

      if (error) throw error;

      // Envoi email (optionnel si tu n'as pas l'API Resend active, je le laisse commenté au cas où)
      // sendConfirmationEmail(...)

      if (isNetwork) setShowWaitingModal(true);
      else { 
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 relative overflow-x-hidden">
      <Navbar />
      
      {/* MODALE SUCCÈS (MISE À JOUR AVEC LE BON TEXTE) */}
      {showWaitingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
                <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6"><Sparkles size={40} /></div>
                <h2 className="text-2xl font-extrabold mb-3">Commande enregistrée !</h2>
                {/* ICI LA MODIFICATION DE TEXTE QUE TU VOULAIS */}
                <p className="text-slate-600 mb-6">Votre pressing est en cours de vérification. Nous vous confirmerons le créneau rapidement.</p>
                <button onClick={() => navigate('/dashboard')} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold">Voir mon suivi</button>
            </div>
        </div>
      )}

      <div className="pt-32 max-w-3xl mx-auto px-4 w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">Nouvelle Commande</h1>
        
        {/* PROGRESS BAR */}
        <div className="flex justify-center mb-8 text-xs md:text-sm overflow-x-auto">
            {['Formule', 'Poids', 'Localisation', 'Validation'].map((label, i) => (
                <div key={i} className={`px-3 py-1 md:px-4 md:py-2 rounded-full whitespace-nowrap mx-1 ${step >= i ? 'bg-teal-100 text-teal-800 font-bold' : 'text-slate-400'}`}>{i+1}. {label}</div>
            ))}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[450px] p-6 md:p-8 relative">
            
            {/* ETAPE 0 : CHOIX FORMULE */}
            {step === 0 && (
                <div className="animate-in slide-in-from-right-8 fade-in">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Tag className="text-teal-500"/> Votre formule</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div onClick={() => setFormula('eco')} className={`p-6 border-2 rounded-2xl cursor-pointer transition ${formula === 'eco' ? 'border-teal-500 bg-teal-50' : 'border-slate-100 hover:border-slate-200'}`}>
                            <div className="flex justify-between items-center mb-2"><span className="font-bold text-lg">ÉCO</span><span className="text-2xl font-bold">3€<span className="text-sm font-normal text-slate-500">/kg</span></span></div>
                            <p className="text-slate-500 text-sm">Lavage Soigneux 48h.</p>
                        </div>
                        <div onClick={() => setFormula('express')} className={`p-6 border-2 rounded-2xl cursor-pointer transition ${formula === 'express' ? 'border-teal-500 bg-teal-50' : 'border-slate-100 hover:border-slate-200'}`}>
                            <div className="flex justify-between items-center mb-2"><span className="font-bold text-lg">EXPRESS</span><span className="text-2xl font-bold">5€<span className="text-sm font-normal text-slate-500">/kg</span></span></div>
                            <p className="text-slate-500 text-sm">Prioritaire 24h.</p>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button onClick={() => setStep(1)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2">Suivant <ArrowRight size={18}/></button>
                    </div>
                </div>
            )}

            {/* ETAPE 1 : POIDS */}
            {step === 1 && (
                <div className="animate-in slide-in-from-right-8 fade-in">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Scale className="text-teal-500"/> Volume ({formula === 'eco' ? 'Éco' : 'Express'})</h2>
                    <div className="mb-8 text-center">
                        <div className="text-6xl font-extrabold text-slate-900 mb-2">{weight} <span className="text-2xl text-slate-400 font-normal">kg</span></div>
                        <p className="text-slate-500">~ {Math.ceil(weight / 5)} machine(s)</p>
                    </div>
                    <input type="range" min="3" max="30" step="1" value={weight} onChange={(e) => setWeight(parseInt(e.target.value))} className="w-full h-4 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-500 mb-8"/>
                    <div className="bg-teal-50 p-4 rounded-xl flex justify-between items-center border border-teal-100">
                        <span className="font-bold text-teal-800">Prix estimé</span>
                        <span className="text-2xl font-bold text-teal-600">{totalPrice} €</span>
                    </div>
                    <div className="mt-8 flex justify-between">
                        <button onClick={() => setStep(0)} className="text-slate-500 font-bold">Retour</button>
                        <button onClick={() => setStep(2)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2">Suivant <ArrowRight size={18}/></button>
                    </div>
                </div>
            )}

            {/* ETAPE 2 : TON RADAR */}
            {step === 2 && (
                <div className="animate-in slide-in-from-right-8 fade-in h-full flex flex-col">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin className="text-teal-500"/> Votre zone</h2>
                    
                    <div className="flex gap-2 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3.5 text-slate-400" size={20}/>
                            <input 
                                type="text" 
                                placeholder="Code postal ou ville..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 font-bold text-lg"
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchLocally()}
                            />
                        </div>
                        <button onClick={handleSearchLocally} disabled={!searchQuery || isSearching} className="px-6 bg-slate-900 text-white rounded-xl font-bold disabled:opacity-50">
                            {isSearching ? <Loader2 className="animate-spin"/> : 'Chercher'}
                        </button>
                    </div>

                    <div className="flex-1 relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 min-h-[250px]">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 blur-[2px] grayscale"></div>
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
                            
                            {isSearching && (
                                <div className="flex flex-col items-center justify-center">
                                    <div className="relative flex items-center justify-center mb-4">
                                        <div className="w-4 h-4 bg-teal-500 rounded-full z-20 relative"></div>
                                        <div className="absolute w-24 h-24 bg-teal-500/30 rounded-full animate-ping opacity-75 z-10"></div>
                                        <div className="absolute w-48 h-48 bg-teal-500/10 rounded-full animate-ping opacity-50 animation-delay-500 z-0"></div>
                                    </div>
                                    <p className="font-bold text-slate-700 bg-white/80 px-4 py-2 rounded-full backdrop-blur-md">Recherche des artisans à proximité...</p>
                                </div>
                            )}

                            {!isSearching && searchDone && (
                                <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-teal-100 animate-in zoom-in duration-300">
                                    {filteredPartners.length > 0 ? (
                                        <>
                                            <div className="text-teal-500 mx-auto mb-2"><Sparkles size={40}/></div>
                                            <h3 className="text-xl font-extrabold text-slate-900">Bonne nouvelle !</h3>
                                            <p className="text-slate-600 font-medium mb-4">{filteredPartners.length} pressing(s) trouvés dans votre zone.</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-indigo-500 mx-auto mb-2"><Sparkles size={40}/></div>
                                            <h3 className="text-xl font-extrabold text-slate-900">Zone couverte !</h3>
                                            <p className="text-slate-600 font-medium mb-4">Le Réseau Kilolab est disponible chez vous.</p>
                                        </>
                                    )}
                                    <button onClick={() => setStep(3)} className="px-8 py-3 bg-teal-500 text-slate-900 rounded-xl font-bold hover:bg-teal-400 transition w-full flex items-center justify-center gap-2 shadow-md">
                                        Poursuivre ma commande <ArrowRight size={18}/>
                                    </button>
                                </div>
                            )}

                             {!isSearching && !searchDone && (
                                <div className="bg-white/80 backdrop-blur-md p-4 rounded-full text-slate-500 font-medium flex items-center gap-2">
                                    <MapPin size={18}/> Localisez-vous pour voir les disponibilités.
                                </div>
                             )}
                        </div>
                    </div>
                     <div className="mt-6 flex justify-between">
                        <button onClick={() => setStep(1)} className="text-slate-500 font-bold">Retour</button>
                    </div>
                </div>
            )}

            {/* ETAPE 3 : SÉLECTION FINALE & DATE */}
            {step === 3 && (
                <div className="animate-in slide-in-from-right-8 fade-in">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><MapPin className="text-teal-500"/> Finalisation</h2>
                    
                    <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 mb-6 flex items-center gap-3">
                        <MapPin className="text-teal-600"/>
                        <div>
                            <p className="text-sm text-teal-800 font-bold">Zone de collecte</p>
                            <p className="text-teal-900 font-extrabold text-lg">{searchQuery}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredPartners.length > 0 && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Choisir un artisan (Optionnel)</label>
                                <select className="w-full p-3 bg-slate-50 border rounded-xl font-medium" value={selectedPartnerId} onChange={(e) => setSelectedPartnerId(e.target.value)}>
                                    {filteredPartners.map(p => <option key={p.id} value={p.id}>{p.full_name} {p.address ? `(${p.address})` : ''}</option>)}
                                    <option value="waiting_list">✨ Confier au Réseau Kilolab (Recommandé)</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Adresse exacte de retrait</label>
                            <input type="text" placeholder="N°, Rue, Digicode..." value={finalAddress} onChange={(e) => setFinalAddress(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl"/>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Date souhaitée</label>
                            <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl"/>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Code Promo / Parrainage (Optionnel)</label>
                            <input type="text" placeholder="Ex: KILO-2025" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl dashed-border" />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-between">
                        <button onClick={() => setStep(2)} className="text-slate-500 font-bold">Retour zone</button>
                        <button disabled={!finalAddress || !pickupDate} onClick={() => setStep(4)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">Résumé <ArrowRight size={18}/></button>
                    </div>
                </div>
            )}

            {/* ETAPE 4 : RÉCAPITULATIF */}
            {step === 4 && (
                <div className="animate-in slide-in-from-right-8 fade-in">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><CheckCircle className="text-teal-500"/> Récapitulatif</h2>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 mb-8">
                        <div className="flex justify-between"><span className="text-slate-500">Formule</span><span className="font-bold uppercase">{formula}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Poids</span><span className="font-bold">{weight} kg</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Lieu</span><span className="font-bold text-right truncate max-w-[150px]">{searchQuery}</span></div>
                         <div className="flex justify-between items-center"><span className="text-slate-500">Prestataire</span><span className="font-bold text-sm bg-white px-2 py-1 rounded-md border truncate max-w-[180px]">{selectedPartnerId === 'waiting_list' ? '✨ Réseau Kilolab' : partnersFound.find(p=>p.id===selectedPartnerId)?.full_name || 'Réseau Kilolab'}</span></div>
                        <div className="border-t border-slate-200 pt-4 flex justify-between items-center"><span className="font-bold text-lg">Total estimé</span><span className="font-extrabold text-3xl text-teal-600">{totalPrice} €</span></div>
                    </div>
                    <div className="flex justify-between items-center">
                         <button onClick={() => setStep(3)} className="text-slate-500 font-bold">Retour</button>
                         <button onClick={handleSubmit} disabled={loading} className="px-8 py-4 bg-teal-500 text-slate-900 rounded-xl font-bold hover:bg-teal-400 transition w-full ml-4 shadow-lg">
                            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Valider la commande"}
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
