import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Scale, MapPin, ArrowRight, Sparkles, Tag, Search, Loader2, Calendar as CalendarIcon, Info, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); 
  const [showWaitingModal, setShowWaitingModal] = useState(false);
  
  // Données Commande
  const [formula, setFormula] = useState<'eco' | 'express'>('eco');
  const [weight, setWeight] = useState(5);
  
  // Date & Surtaxe Week-end
  const [pickupDate, setPickupDate] = useState('');
  const [pickupSlot, setPickupSlot] = useState('');
  const [isWeekend, setIsWeekend] = useState(false);
  
  // Données Recherche & Partenaires
  const [allPartners, setAllPartners] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [filteredPartners, setFilteredPartners] = useState<any[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('');
  const [finalAddress, setFinalAddress] = useState('');

  useEffect(() => { fetchPartners(); }, []);

  // Détection du Week-end (+5€)
  useEffect(() => {
    if (pickupDate) {
      const day = new Date(pickupDate).getDay();
      const weekend = day === 0 || day === 6;
      setIsWeekend(weekend);
      if (weekend) toast('Majoration Week-end (+5€) appliquée', { icon: '📅' });
    }
  }, [pickupDate]);

  const fetchPartners = async () => {
    const { data } = await supabase.from('profiles')
      .select('id, full_name, address') 
      .eq('role', 'partner')
      .eq('status', 'active');
    setAllPartners(data || []);
  };

  const handleSearchLocally = () => {
    if (!searchQuery) return;
    setIsSearching(true);
    setSearchDone(false);

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

  useEffect(() => { if(searchDone) setSearchDone(false); }, [searchQuery]);

  const basePrice = formula === 'eco' ? 3 : 5;
  let total = weight * basePrice;
  if (isWeekend) total += 5; 
  const totalPrice = total.toFixed(2);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Veuillez vous connecter pour commander');
        navigate('/login');
        return;
      }
      
      const isNetwork = !selectedPartnerId || selectedPartnerId === 'waiting_list';
      
      // 🔥 FIX CRITIQUE : Nettoyage de la date
      const cleanDate = pickupDate || new Date().toISOString().split('T')[0];
      
      // 🔥 On met le créneau dans l'adresse pour ne rien perdre
      const fullAddressInfo = `${finalAddress} (${searchQuery}) - Créneau : ${pickupSlot}`;

      const { error } = await supabase.from('orders').insert({
        client_id: user.id,
        partner_id: isNetwork ? null : selectedPartnerId,
        weight: weight,
        pickup_address: fullAddressInfo, // Créneau inclus ici
        pickup_date: cleanDate,          // Date propre YYYY-MM-DD
        total_price: parseFloat(totalPrice),
        status: 'pending',
        formula: formula
      });

      if (error) throw error;

      if (isNetwork) setShowWaitingModal(true);
      else { 
        toast.success('Commande validée !'); 
        navigate('/dashboard'); 
      }

    } catch (error: any) { 
      console.error(error);
      toast.error('Erreur technique : ' + error.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 relative overflow-x-hidden">
      <Navbar />
      
      {showWaitingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles size={40} />
            </div>
            <h2 className="text-2xl font-extrabold mb-3">Recherche en cours...</h2>
            <p className="text-slate-600 mb-6">Nous sélectionnons le meilleur artisan disponible dans votre zone pour garantir la qualité Kilolab.</p>
            <button onClick={() => navigate('/dashboard')} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold">
              Voir mon suivi
            </button>
          </div>
        </div>
      )}

      <div className="pt-32 max-w-3xl mx-auto px-4 w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">Nouvelle Commande</h1>
        
        <div className="flex justify-center mb-8 text-xs md:text-sm overflow-x-auto">
          {['Formule', 'Poids', 'Localisation', 'Date', 'Validation'].map((label, i) => (
            <div key={i} className={`px-3 py-1 md:px-4 md:py-2 rounded-full whitespace-nowrap mx-1 ${step >= i ? 'bg-teal-100 text-teal-800 font-bold' : 'text-slate-400'}`}>
              {i+1}. {label}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[450px] p-6 md:p-8 relative">
          
          {step === 0 && (
            <div className="animate-in slide-in-from-right-8 fade-in">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Tag className="text-teal-500"/> Votre formule
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div onClick={() => setFormula('eco')} className={`p-6 border-2 rounded-2xl cursor-pointer transition ${formula === 'eco' ? 'border-teal-500 bg-teal-50' : 'border-slate-100 hover:border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">ÉCO</span>
                    <span className="text-2xl font-bold">3€<span className="text-sm font-normal text-slate-500">/kg</span></span>
                  </div>
                  <p className="text-slate-500 text-sm">Lavage Soigneux 48h.</p>
                </div>
                <div onClick={() => setFormula('express')} className={`p-6 border-2 rounded-2xl cursor-pointer transition ${formula === 'express' ? 'border-teal-500 bg-teal-50' : 'border-slate-100 hover:border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">EXPRESS</span>
                    <span className="text-2xl font-bold">5€<span className="text-sm font-normal text-slate-500">/kg</span></span>
                  </div>
                  <p className="text-slate-500 text-sm">Prioritaire 24h.</p>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={() => setStep(1)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2">
                  Suivant <ArrowRight size={18}/>
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-in slide-in-from-right-8 fade-in text-center">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 justify-center">
                <Scale className="text-teal-500"/> Volume ({formula === 'eco' ? 'Éco' : 'Express'})
              </h2>
              <div className="mb-8">
                <div className="text-6xl font-extrabold text-slate-900 mb-2">
                  {weight} <span className="text-2xl text-slate-400 font-normal">kg</span>
                </div>
                <p className="text-slate-500">~ {Math.ceil(weight / 5)} machine(s)</p>
              </div>
              <input 
                type="range" 
                min="3" 
                max="30" 
                step="1" 
                value={weight} 
                onChange={(e) => setWeight(parseInt(e.target.value))} 
                className="w-full h-4 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-500 mb-8"
              />
              <div className="flex gap-4">
                <button onClick={() => setStep(0)} className="flex-1 py-3 text-slate-500 font-bold">
                  Retour
                </button>
                <button onClick={() => setStep(2)} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                  Suivant <ArrowRight size={18}/>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right-8 fade-in h-full flex flex-col">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="text-teal-500"/> Votre zone
              </h2>
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
                <button 
                  onClick={handleSearchLocally} 
                  disabled={!searchQuery || isSearching} 
                  className="px-6 bg-slate-900 text-white rounded-xl font-bold disabled:opacity-50"
                >
                  {isSearching ? <Loader2 className="animate-spin"/> : 'Chercher'}
                </button>
              </div>

              <div className="flex-1 relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 min-h-[250px]">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 blur-[2px] grayscale"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
                  {isSearching && (
                    <div className="text-center">
                      <Loader2 className="animate-spin text-teal-500 mx-auto mb-2"/>
                      <p className="text-sm font-bold text-slate-500">Recherche partenaires...</p>
                    </div>
                  )}
                  {!isSearching && searchDone && (
                    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-teal-100 animate-in zoom-in duration-300">
                      <Sparkles size={40} className="text-teal-500 mx-auto mb-2"/>
                      <h3 className="text-xl font-extrabold text-slate-900">Zone couverte !</h3>
                      <p className="text-slate-600 font-medium mb-4">
                        {filteredPartners.length > 0 ? `${filteredPartners.length} pressing(s) trouvés.` : 'Le Réseau Kilolab est disponible.'}
                      </p>
                      <button 
                        onClick={() => setStep(3)} 
                        className="px-8 py-3 bg-teal-500 text-slate-900 rounded-xl font-bold hover:bg-teal-400 transition w-full flex items-center justify-center gap-2 shadow-md"
                      >
                        Poursuivre <ArrowRight size={18}/>
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

          {step === 3 && (
            <div className="animate-in slide-in-from-right-8 fade-in">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CalendarIcon className="text-teal-500"/> Date de dépôt
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-500 mb-2 block">Quand déposez-vous le linge ?</label>
                  <input 
                    type="date" 
                    value={pickupDate} 
                    onChange={(e) => setPickupDate(e.target.value)} 
                    className="w-full p-3 bg-slate-50 border rounded-xl font-bold"
                  />
                  {isWeekend && (
                    <p className="text-xs text-orange-500 font-bold mt-2 flex items-center gap-1">
                      <Info size={12}/> Tarif Week-end appliqué (+5.00€)
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-500 mb-2 block">Créneau (Indicatif)</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border rounded-xl" 
                    value={pickupSlot} 
                    onChange={e => setPickupSlot(e.target.value)}
                  >
                    <option value="">Choisir...</option>
                    <option>Matin (09h - 12h)</option>
                    <option>Midi (12h - 14h)</option>
                    <option>Après-midi (14h - 18h)</option>
                  </select>
                </div>
                <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 mt-4">
                  <p className="text-sm text-teal-800 font-bold mb-1">Zone de collecte</p>
                  <p className="text-teal-900 font-extrabold text-lg">{searchQuery}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Adresse exacte de retrait</label>
                  <input 
                    type="text" 
                    placeholder="N°, Rue, Digicode..." 
                    value={finalAddress} 
                    onChange={(e) => setFinalAddress(e.target.value)} 
                    className="w-full p-3 bg-slate-50 border rounded-xl"
                  />
                </div>
                {filteredPartners.length > 0 && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Choisir un artisan</label>
                    <select 
                      className="w-full p-3 bg-slate-50 border rounded-xl font-medium" 
                      value={selectedPartnerId} 
                      onChange={(e) => setSelectedPartnerId(e.target.value)}
                    >
                      {filteredPartners.map(p => (
                        <option key={p.id} value={p.id}>{p.full_name}</option>
                      ))}
                      <option value="waiting_list">✨ Confier au Réseau Kilolab</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(2)} className="text-slate-500 font-bold">Retour zone</button>
                <button 
                  disabled={!finalAddress || !pickupDate || !pickupSlot} 
                  onClick={() => setStep(4)} 
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  Résumé <ArrowRight size={18}/>
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in slide-in-from-right-8 fade-in">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle className="text-teal-500"/> Récapitulatif
              </h2>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 mb-8">
                <div className="flex justify-between">
                  <span className="text-slate-500">Formule</span>
                  <span className="font-bold uppercase">{formula}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Poids</span>
                  <span className="font-bold">{weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Créneau</span>
                  <span className="font-bold">{new Date(pickupDate).toLocaleDateString()} ({pickupSlot})</span>
                </div>
                {isWeekend && (
                  <div className="flex justify-between text-orange-600">
                    <span className="font-bold">Majoration WE</span>
                    <span>+5.00 €</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-4 mt-2 flex justify-between items-center">
                  <span className="font-bold text-lg">Total estimé</span>
                  <span className="font-extrabold text-3xl text-teal-600">{totalPrice} €</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button onClick={() => setStep(3)} className="text-slate-500 font-bold">Retour</button>
                <button 
                  onClick={handleSubmit} 
                  disabled={loading} 
                  className="px-8 py-4 bg-teal-500 text-slate-900 rounded-xl font-bold hover:bg-teal-400 transition w-full ml-4 shadow-lg"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto"/> : 'Valider la commande'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
