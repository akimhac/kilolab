import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Loader2, Upload, Check, Sparkles, 
  TrendingUp, Clock, MapPin, Wallet, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function BecomeWasher() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [volume, setVolume] = useState(20);

  const revenue = (volume * 2.80 * 4).toFixed(0);

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', city: '', postalCode: '', address: '', idCardUrl: '',
    has_machine: false, 
    has_scale: false, 
    use_hypoallergenic: false,
    legal_capacity: false,      
    accept_terms: false,        
    data_consent: false         
  });

  const uploadIdCard = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `id-cards/${fileName}`;
      
      const { error } = await supabase.storage.from('documents').upload(filePath, file);
      if (error) throw error;
      
      const { data } = supabase.storage.from('documents').getPublicUrl(filePath);
      setFormData({ ...formData, idCardUrl: data.publicUrl });
      toast.success("Pièce d'identité reçue !");
    } catch (error: any) {
      toast.error("Erreur upload: " + error.message);
    }
  };

  // ✅ FONCTION DE GÉOCODAGE
  const geocodeAddress = async (address: string, city: string, postalCode: string): Promise<{lat: number, lng: number} | null> => {
    try {
      const fullAddress = `${address}, ${postalCode} ${city}, France`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Erreur géocodage:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validation
      if (!formData.has_machine || !formData.has_scale || !formData.use_hypoallergenic) {
        toast.error("Veuillez valider les engagements qualité");
        setLoading(false); return;
      }
      if (!formData.legal_capacity || !formData.accept_terms || !formData.data_consent) {
        toast.error("Veuillez accepter les conditions légales");
        setLoading(false); return;
      }

      // ✅ GÉOCODAGE DE L'ADRESSE
      toast.loading("Géolocalisation de l'adresse...", { id: 'geocoding' });
      const coords = await geocodeAddress(formData.address, formData.city, formData.postalCode);
      toast.dismiss('geocoding');

      if (!coords) {
        toast.error("Impossible de géolocaliser l'adresse. Vérifie qu'elle est correcte.");
        setLoading(false);
        return;
      }

      // ✅ INSERTION AVEC COORDONNÉES GPS
      const { error } = await supabase.from('washers').insert({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        postal_code: formData.postalCode,
        address: formData.address,
        lat: coords.lat,              // ← NOUVEAU
        lng: coords.lng,              // ← NOUVEAU
        id_card_url: formData.idCardUrl,
        status: 'pending',
        has_machine: formData.has_machine,
        has_scale: formData.has_scale,
        use_hypoallergenic: formData.use_hypoallergenic,
        is_available: true
      });

      if (error) throw error;

      setStep(4);
      toast.success("Candidature envoyée !");
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      <div className="pt-32 pb-20 px-4 max-w-6xl mx-auto">
        
        {step < 4 && (
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-teal-100">
              <Sparkles size={16} /> Rejoignez la communauté Kilolab
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Générez un revenu complémentaire<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">
                avec votre machine à laver.
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Mettez votre équipement à profit en rendant service à vos voisins. 
              Flexibilité totale, rémunération juste, sans abonnement.
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-teal-600">
                <Wallet size={24} />
              </div>
              <h3 className="font-bold text-xl mb-3">Revenus attractifs</h3>
              <p className="text-slate-500">Gagnez jusqu'à 20€ par mission standard. Payé chaque semaine par virement.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-teal-600">
                <Clock size={24} />
              </div>
              <h3 className="font-bold text-xl mb-3">Liberté totale</h3>
              <p className="text-slate-500">Pas d'horaires imposés. Vous acceptez les missions quand votre machine est libre.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-teal-600">
                <MapPin size={24} />
              </div>
              <h3 className="font-bold text-xl mb-3">Proximité</h3>
              <p className="text-slate-500">Des clients dans votre ville. Optimisez vos trajets pour récupérer plusieurs sacs.</p>
            </div>
          </div>
        )}

        {step < 4 && (
          <div className="flex justify-between mb-8 max-w-lg mx-auto">
            {[1, 2, 3].map(num => (
              <div key={num} className={`flex-1 h-1.5 rounded-full mx-1 transition-all duration-500 ${step >= num ? 'bg-teal-600' : 'bg-slate-100'}`}></div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          
          {step === 1 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl font-bold mb-8">1. Vos informations</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nom complet *</label>
                  <input required type="text" placeholder="Ex: Thomas Dupont" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full p-4 bg-slate-50 border-slate-200 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email *</label>
                        <input required type="email" placeholder="thomas@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-4 bg-slate-50 border-slate-200 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Téléphone *</label>
                        <input required type="tel" placeholder="06 12 34 56 78" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-4 bg-slate-50 border-slate-200 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Ville *</label>
                        <input required type="text" placeholder="Lille" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-4 bg-slate-50 border-slate-200 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Code postal *</label>
                        <input required type="text" placeholder="59000" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} className="w-full p-4 bg-slate-50 border-slate-200 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
                    </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Adresse complète *</label>
                  <input required type="text" placeholder="12 rue de la République" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-4 bg-slate-50 border-slate-200 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
              </div>
              <button type="button" onClick={() => setStep(2)} className="w-full mt-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition text-lg">
                Suivant
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">2. Vérification d'identité</h2>
              <p className="text-slate-500 mb-8">Obligatoire pour garantir la sécurité de la communauté.</p>
              
              <div className="mb-8 border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center bg-slate-50 hover:bg-teal-50 hover:border-teal-300 transition relative group">
                {!formData.idCardUrl ? (
                    <>
                        <Upload className="mx-auto mb-4 text-slate-400 group-hover:text-teal-500 transition" size={40}/>
                        <p className="font-bold text-slate-700">Cliquez pour uploader CNI ou Passeport</p>
                        <p className="text-xs text-slate-400 mt-2">Format JPG, PNG ou PDF</p>
                        <input type="file" accept="image/*,application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files?.[0] && uploadIdCard(e.target.files[0])} />
                    </>
                ) : (
                    <div className="text-green-600 font-bold flex flex-col items-center justify-center gap-2">
                      <div className="bg-green-100 p-3 rounded-full"><Check size={24}/></div>
                      Document reçu avec succès
                    </div>
                )}
              </div>
              
              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="px-8 py-4 border font-bold rounded-xl hover:bg-slate-50">Retour</button>
                <button type="button" onClick={() => setStep(3)} disabled={!formData.idCardUrl} className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-xl disabled:opacity-50 hover:bg-black transition">Suivant</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid lg:grid-cols-2 gap-8">
              
              <div className="lg:sticky lg:top-32 h-fit">
                <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 rounded-full blur-[60px] opacity-20"></div>
                  
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="text-teal-400"/> Potentiel de gains
                  </h3>
                  
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 text-sm">Volume estimé</span>
                      <span className="text-2xl font-black text-white">{volume}kg<span className="text-sm text-slate-500 font-normal">/sem</span></span>
                    </div>
                    <input 
                      type="range" min="10" max="100" step="5" value={volume} 
                      onChange={e => setVolume(parseInt(e.target.value))} 
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                  </div>
                  
                  <div className="bg-white/10 p-6 rounded-2xl border border-white/10 text-center backdrop-blur-sm">
                    <p className="text-slate-300 text-xs uppercase tracking-widest mb-1">Revenus mensuels</p>
                    <p className="text-5xl font-black text-teal-400">{revenue}€</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">3. Charte Qualité & Légal</h2>
                
                <div className="space-y-4 mb-8">
                  
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Sparkles size={18} className="text-teal-600"/> Matériel Requis</h4>
                    
                    <label className="flex items-start gap-3 mb-3 cursor-pointer">
                      <input type="checkbox" className="mt-1 w-5 h-5 accent-teal-600" checked={formData.has_machine} onChange={e => setFormData({...formData, has_machine: e.target.checked})} />
                      <span className="text-sm text-slate-600">Machine à laver propre et entretenue.</span>
                    </label>
                    
                    <label className="flex items-start gap-3 mb-3 cursor-pointer">
                      <input type="checkbox" className="mt-1 w-5 h-5 accent-teal-600" checked={formData.has_scale} onChange={e => setFormData({...formData, has_scale: e.target.checked})} />
                      <span className="text-sm text-slate-600">Achat d'un <strong>peson digital</strong> (env. 10€).</span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" className="mt-1 w-5 h-5 accent-teal-600" checked={formData.use_hypoallergenic} onChange={e => setFormData({...formData, use_hypoallergenic: e.target.checked})} />
                      <span className="text-sm text-slate-600">Usage exclusif de <strong>lessive hypoallergénique</strong>.</span>
                    </label>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2"><ShieldCheck size={18}/> Légal & Admin</h4>
                    
                    <label className="flex items-start gap-3 mb-3 cursor-pointer">
                      <input type="checkbox" className="mt-1 w-5 h-5 accent-orange-600" checked={formData.legal_capacity} onChange={e => setFormData({...formData, legal_capacity: e.target.checked})} />
                      <span className="text-sm text-orange-900">Je suis majeur(e) et apte à exercer une activité indépendante.</span>
                    </label>

                    <label className="flex items-start gap-3 mb-3 cursor-pointer">
                      <input type="checkbox" className="mt-1 w-5 h-5 accent-orange-600" checked={formData.accept_terms} onChange={e => setFormData({...formData, accept_terms: e.target.checked})} />
                      <span className="text-sm text-orange-900">J'accepte les <Link to="/cgu" target="_blank" className="underline font-bold">CGU/CGV</Link> et le statut d'indépendant.</span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" className="mt-1 w-5 h-5 accent-orange-600" checked={formData.data_consent} onChange={e => setFormData({...formData, data_consent: e.target.checked})} />
                      <span className="text-sm text-orange-900">J'accepte le traitement de mes données (RGPD).</span>
                    </label>
                  </div>

                </div>

                <div className="flex gap-4 flex-col sm:flex-row">
                  <button type="button" onClick={() => setStep(2)} className="py-4 px-6 border font-bold rounded-xl hover:bg-slate-50">Retour</button>
                  <button type="submit" disabled={loading} className="flex-1 py-4 bg-teal-600 text-white font-bold rounded-xl flex justify-center items-center gap-2 disabled:opacity-50 hover:bg-teal-700 transition shadow-lg">
                      {loading ? <Loader2 className="animate-spin"/> : "Valider ma candidature"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 shadow-xl text-center max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={48}/>
              </div>
              <h2 className="text-3xl font-black mb-4 text-slate-900">Candidature reçue ! 🎉</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Votre profil est en cours d'analyse. <br/>
                Préparez votre matériel (Peson + Lessive), notre équipe vous contactera sous 24h pour l'activation.
              </p>
              <button onClick={() => navigate('/')} className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition">
                Retour à l'accueil
              </button>
            </div>
          )}

        </form>
      </div>
      <Footer />
    </div>
  );
}
