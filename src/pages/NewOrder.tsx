import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MapPin, Scale, Calendar, ArrowRight, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewOrder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // États du formulaire
  const [address, setAddress] = useState('');
  const [weight, setWeight] = useState(5);
  const [formula, setFormula] = useState('eco');
  const [selectedSlot, setSelectedSlot] = useState('');

  // État pour la Modale de "Succès / Liste d'attente"
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user);
      else navigate('/login'); // Redirection si pas connecté
    });
  }, [navigate]);

  // Génération des créneaux (Dates dynamiques)
  const generateSlots = () => {
    const slots = [];
    const today = new Date();
    for (let i = 1; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
      slots.push(`${dateStr} (Midi (12h - 14h))`);
      slots.push(`${dateStr} (Soir (18h - 20h))`);
    }
    return slots;
  };

  const slots = generateSlots();
  const price = formula === 'express' ? weight * 4.5 : weight * 3;

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. CORRECTION DU BUG DE DATE (Le fameux message rouge)
      // On extrait juste la partie "2025-12-26" de la chaîne
      const cleanDate = selectedSlot.split(' ')[0]; 
      
      // On garde le reste pour info (Midi/Soir)
      const cleanSlotInfo = selectedSlot.substring(selectedSlot.indexOf('('));

      // 2. INSERTION EN BASE DE DONNÉES
      const { error } = await supabase.from('orders').insert({
        client_id: user.id,
        pickup_address: address,
        pickup_date: cleanDate, // Date propre pour SQL
        // On peut stocker le créneau complet dans une colonne texte si elle existe, 
        // ou juste l'ignorer pour l'instant pour éviter les erreurs.
        weight: weight,
        total_price: price,
        status: 'pending' // On met en attente
      });

      if (error) {
        console.error(error);
        toast.error("Erreur technique. Vérifiez votre connexion.");
      } else {
        // 3. SUCCÈS : ON AFFICHE LA MODALE MARKETING
        setShowSuccessModal(true);
      }
    } catch (err) {
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar />
      
      <div className="pt-32 px-4 max-w-3xl mx-auto">
        
        {/* BARRE DE PROGRESSION */}
        <div className="flex justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10"></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 1 ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-400'}`}>1</div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 2 ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-400'}`}>2</div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 3 ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-400'}`}>3</div>
        </div>

        {/* ÉTAPE 1 : ADRESSE & POIDS */}
        {step === 1 && (
            <div className="bg-white p-8 rounded-3xl shadow-sm animate-fade-in">
                <h2 className="text-2xl font-black mb-6">Détails de la collecte</h2>
                
                <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-500 mb-2">Adresse de récupération</label>
                    <div className="flex items-center bg-slate-50 rounded-xl px-4 border border-slate-200 focus-within:border-teal-500 transition">
                        <MapPin className="text-slate-400 mr-3"/>
                        <input 
                            type="text" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="ex: 12 Rue de la Paix, Paris"
                            className="w-full bg-transparent py-4 outline-none font-medium"
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-bold text-slate-500 mb-4">Poids estimé (kg)</label>
                    <div className="flex items-center gap-4">
                        <Scale className="text-teal-500" size={32}/>
                        <input 
                            type="range" 
                            min="3" 
                            max="20" 
                            value={weight} 
                            onChange={(e) => setWeight(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                        />
                        <span className="text-2xl font-black w-16 text-right">{weight}kg</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Nous pèserons précisément à l'arrivée. Min 3kg.</p>
                </div>

                <button 
                    onClick={() => { if(address) setStep(2); else toast.error('Adresse requise'); }}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition"
                >
                    Suivant <ArrowRight size={20}/>
                </button>
            </div>
        )}

        {/* ÉTAPE 2 : CRÉNEAU & FORMULE */}
        {step === 2 && (
            <div className="bg-white p-8 rounded-3xl shadow-sm animate-fade-in">
                <h2 className="text-2xl font-black mb-6">Créneau & Formule</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div 
                        onClick={() => setFormula('eco')}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition ${formula === 'eco' ? 'border-teal-500 bg-teal-50' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                        <div className="font-bold text-lg mb-1">ECO 🌱</div>
                        <div className="text-sm text-slate-500">Lavage standard, pliage soigné.</div>
                        <div className="mt-2 font-black text-teal-600">3€ / kg</div>
                    </div>
                    <div 
                        onClick={() => setFormula('express')}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition ${formula === 'express' ? 'border-teal-500 bg-teal-50' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                        <div className="font-bold text-lg mb-1">EXPRESS ⚡</div>
                        <div className="text-sm text-slate-500">Traité en priorité (24h).</div>
                        <div className="mt-2 font-black text-teal-600">4.5€ / kg</div>
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-bold text-slate-500 mb-4">Créneau de collecte</label>
                    <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto pr-2">
                        {slots.map((slot, index) => (
                            <div 
                                key={index}
                                onClick={() => setSelectedSlot(slot)}
                                className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition ${selectedSlot === slot ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                            >
                                <Calendar size={18}/>
                                <span className="text-sm font-bold">{slot}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition">Retour</button>
                    <button 
                        onClick={() => { if(selectedSlot) setStep(3); else toast.error('Créneau requis'); }}
                        className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition"
                    >
                        Suivant <ArrowRight size={20}/>
                    </button>
                </div>
            </div>
        )}

        {/* ÉTAPE 3 : RÉCAP & VALIDATION */}
        {step === 3 && (
            <div className="bg-white p-8 rounded-3xl shadow-sm animate-fade-in">
                <div className="flex items-center gap-3 mb-6 text-teal-600">
                    <CheckCircle size={28}/>
                    <h2 className="text-2xl font-black text-slate-900">Récapitulatif</h2>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl mb-8 space-y-3 text-sm">
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
                        <span className="font-bold text-right max-w-[200px]">{selectedSlot}</span>
                    </div>
                    <div className="border-t border-slate-200 my-3"></div>
                    <div className="flex justify-between items-center text-lg">
                        <span className="font-bold text-slate-900">Total estimé</span>
                        <span className="font-black text-teal-600 text-2xl">{price.toFixed(2)} €</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="font-bold text-slate-400 hover:text-slate-600 transition px-4">Retour</button>
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-teal-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-400 transition shadow-lg shadow-teal-500/30 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin"/> : 'Valider la commande'}
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* --- MODALE DE SUCCÈS (MARKETING / LISTE D'ATTENTE) --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl relative overflow-hidden">
                {/* Confettis ou déco */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-blue-500"></div>
                
                <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40}/>
                </div>

                <h3 className="text-2xl font-black mb-2 text-slate-900">Commande Reçue ! 🚀</h3>
                
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6 text-left">
                    <p className="text-orange-800 font-bold text-sm flex items-center gap-2 mb-1">
                        <AlertTriangle size={16}/> Zone en forte demande
                    </p>
                    <p className="text-orange-700 text-xs leading-relaxed">
                        Nos artisans partenaires dans votre secteur sont actuellement complets ou en cours de validation.
                    </p>
                </div>

                <p className="text-slate-600 mb-8 leading-relaxed">
                    Pas de panique ! Votre commande est placée en <strong>liste d'attente prioritaire</strong>.
                    <br/>Un partenaire vous contactera sous 24h-48h pour confirmer le ramassage.
                </p>

                <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition"
                >
                    Voir mon suivi
                </button>
            </div>
        </div>
      )}

    </div>
  );
}
