import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Loader2, Upload, Check, Sparkles, TrendingUp, Clock, 
  MapPin, Wallet, ShieldCheck, ArrowRight, Smile, Home, 
  DollarSign, Package, Users
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function BecomeWasher() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // Step 0 = Landing
  const [volume, setVolume] = useState(20);

  const revenue = (volume * 2.80 * 4).toFixed(0);

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', city: '', postalCode: '', address: '', idCardUrl: '',
    has_machine: false, has_scale: false, use_hypoallergenic: false,
    legal_capacity: false, accept_terms: false, data_consent: false         
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

  const geocodeAddress = async (address: string, city: string, postalCode: string): Promise<{lat: number, lng: number} | null> => {
    try {
      const fullAddress = `${address}, ${postalCode} ${city}, France`;
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`);
      const data = await response.json();
      return (data && data.length > 0) ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) } : null;
    } catch (error) { 
      console.error('Erreur géocodage:', error);
      return null; 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!formData.has_machine || !formData.has_scale || !formData.use_hypoallergenic) {
        toast.error("Veuillez valider les engagements qualité");
        setLoading(false); return;
      }
      if (!formData.legal_capacity || !formData.accept_terms || !formData.data_consent) {
        toast.error("Veuillez accepter les conditions légales");
        setLoading(false); return;
      }

      toast.loading("Géolocalisation de l'adresse...", { id: 'geo' });
      const coords = await geocodeAddress(formData.address, formData.city, formData.postalCode);
      toast.dismiss('geo');

      if (!coords) {
        toast.error("Impossible de géolocaliser l'adresse. Vérifiez qu'elle est correcte.");
        setLoading(false); return;
      }

      const { error } = await supabase.from('washers').insert({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        postal_code: formData.postalCode,
        address: formData.address,
        lat: coords.lat,
        lng: coords.lng,
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
        
        {/* ==================== STEP 0 : LANDING ==================== */}
        {step === 0 && (
          <div className="animate-fade-in">
            {/* HERO */}
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
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
                Transformez votre électroménager en actif rentable. Aidez vos voisins tout en générant 
                jusqu'à <strong>600€/mois</strong> depuis chez vous.
              </p>
              
              <button 
                onClick={() => setStep(1)} 
                className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
              >
                Commencer mon inscription <ArrowRight size={20}/>
              </button>
            </div>

            {/* BÉNÉFICES */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg mb-6 text-white">
                  <DollarSign size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3">Revenu flexible</h3>
                <p className="text-slate-600 leading-relaxed">
                  Jusqu'à <strong>600€/mois</strong> en complément. Idéal pour étudiants, freelances ou retraités.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg mb-6 text-white">
                  <Home size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3">Depuis chez vous</h3>
                <p className="text-slate-600 leading-relaxed">
                  Zéro déplacement. Travaillez à votre rythme, quand votre machine est disponible.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg mb-6 text-white">
                  <Users size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3">Impact local</h3>
                <p className="text-slate-600 leading-relaxed">
                  Aidez vos voisins qui manquent de temps. Créez du lien social dans votre quartier.
                </p>
              </div>
            </div>

            {/* COMMENT ÇA MARCHE */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 mb-16">
              <h2 className="text-3xl font-black mb-8 text-center">Comment ça marche ?</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">1</div>
                  <h3 className="font-bold mb-2">Inscrivez-vous</h3>
                  <p className="text-slate-400 text-sm">Remplissez le formulaire en 3 minutes</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">2</div>
                  <h3 className="font-bold mb-2">Validation rapide</h3>
                  <p className="text-slate-400 text-sm">Nous vérifions votre profil sous 24h</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">3</div>
                  <h3 className="font-bold mb-2">Recevez des missions</h3>
                  <p className="text-slate-400 text-sm">Acceptez les commandes près de chez vous</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">4</div>
                  <h3 className="font-bold mb-2">Soyez payé</h3>
                  <p className="text-slate-400 text-sm">Virement automatique chaque dimanche</p>
                </div>
              </div>
            </div>

            {/* SIMULATEUR */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 md:p-12 border-2 border-teal-200">
              <h2 className="text-3xl font-black mb-6 text-center">Simulez vos revenus</h2>
              <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-600 font-bold">Volume hebdomadaire estimé</span>
                    <span className="text-3xl font-black text-teal-600">{volume}kg</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    step="5" 
                    value={volume} 
                    onChange={e => setVolume(parseInt(e.target.value))} 
                    className="w-full h-3 bg-teal-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                </div>
                <div className="bg-white p-8 rounded-2xl border-2 border-teal-300 text-center">
                  <p className="text-slate-500 text-sm uppercase tracking-wider mb-2">Revenus mensuels estimés</p>
                  <p className="text-6xl font-black text-teal-600 mb-2">{revenue}€</p>
                  <p className="text-slate-600 text-sm">Soit {(parseFloat(revenue) / 4).toFixed(0)}€/semaine</p>
                </div>
              </div>
            </div>

            {/* CTA FINAL */}
            <div className="text-center mt-16">
              <button 
                onClick={() => setStep(1)} 
                className="px-10 py-5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-black text-xl hover:shadow-2xl transition-all transform hover:scale-110 flex items-center gap-3 mx-auto"
              >
                Je commence maintenant <ArrowRight size={24}/>
              </button>
              <p className="text-sm text-slate-500 mt-4">Gratuit • Sans engagement • Activation en 24h</p>
            </div>
          </div>
        )}

        {/* PROGRESS BAR */}
        {step > 0 && step < 4 && (
          <div className="flex justify-between mb-8 max-w-lg mx-auto">
            {[1, 2, 3].map(num => (
              <div key={num} className={`flex-1 h-2 rounded-full mx-1 transition-all duration-500 ${step >= num ? 'bg-teal-600' : 'bg-slate-200'}`}></div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          
          {/* ==================== STEP 1 : INFOS ==================== */}
          {step === 1 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl animate-fade-in">
              <h2 className="text-2xl font-bold mb-8">📝 Vos informations</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nom complet *</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Ex: Thomas Dupont"
                    value={formData.fullName} 
                    onChange={e => setFormData({...formData, fullName: e.target.value})} 
                    className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition" 
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email *</label>
                    <input 
                      required 
                      type="email" 
                      placeholder="thomas@email.com"
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                      className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Téléphone *</label>
                    <input 
                      required 
                      type="tel" 
                      placeholder="06 12 34 56 78"
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value})} 
                      className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition" 
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Ville *</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Lille"
                      value={formData.city} 
                      onChange={e => setFormData({...formData, city: e.target.value})} 
                      className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Code postal *</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="59000"
                      value={formData.postalCode} 
                      onChange={e => setFormData({...formData, postalCode: e.target.value})} 
                      className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Adresse complète *</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="12 rue de la République"
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})} 
                    className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition" 
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  type="button" 
                  onClick={() => setStep(0)} 
                  className="px-8 py-4 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition"
                >
                  Retour
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(2)} 
                  className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition shadow-lg"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {/* ==================== STEP 2 : CNI ==================== */}
          {step === 2 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">🔐 Vérification d'identité</h2>
              <p className="text-slate-500 mb-8">Obligatoire pour garantir la sécurité de la communauté.</p>
              
              <div className="mb-8 border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center bg-slate-50 hover:bg-teal-50 hover:border-teal-400 transition-all cursor-pointer relative group">
                {!formData.idCardUrl ? (
                  <>
                    <Upload className="mx-auto mb-4 text-slate-400 group-hover:text-teal-500 transition" size={48}/>
                    <p className="font-bold text-slate-700 text-lg mb-2">Cliquez pour uploader votre CNI ou Passeport</p>
                    <p className="text-sm text-slate-500">Format JPG, PNG ou PDF • Max 10MB</p>
                    <input 
                      type="file" 
                      accept="image/*,application/pdf" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => e.target.files?.[0] && uploadIdCard(e.target.files[0])} 
                    />
                  </>
                ) : (
                  <div className="text-green-600 font-bold flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <Check size={32}/>
                    </div>
                    <p className="text-xl">Document reçu avec succès ✅</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="px-8 py-4 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition"
                >
                  Retour
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(3)} 
                  disabled={!formData.idCardUrl} 
                  className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition shadow-lg"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {/* ==================== STEP 3 : ENGAGEMENTS ==================== */}
          {step === 3 && (
            <div className="grid lg:grid-cols-2 gap-8 animate-fade-in">
              
              {/* SIMULATEUR STICKY */}
              <div className="lg:sticky lg:top-32 h-fit">
                <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 rounded-full blur-[80px] opacity-30"></div>
                  
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                    <TrendingUp className="text-teal-400"/> Potentiel de gains
                  </h3>
                  
                  <div className="mb-8 relative z-10">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-slate-400 text-sm">Volume estimé</span>
                      <span className="text-2xl font-black text-white">{volume}kg<span className="text-sm text-slate-500 font-normal">/sem</span></span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      step="5" 
                      value={volume} 
                      onChange={e => setVolume(parseInt(e.target.value))} 
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-center relative z-10">
                    <p className="text-slate-300 text-xs uppercase tracking-widest mb-1">Revenus mensuels estimés</p>
                    <p className="text-5xl font-black text-teal-400 mb-1">{revenue}€</p>
                    <p className="text-slate-400 text-sm">Payé chaque dimanche</p>
                  </div>
                </div>
              </div>

              {/* FORMULAIRE ENGAGEMENTS */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">✅ Charte Qualité & Légal</h2>
                
                <div className="space-y-4 mb-8">
                  
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Sparkles size={18} className="text-teal-600"/> Matériel requis
                    </h4>
                    
                    <label className="flex items-start gap-3 mb-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="mt-1 w-5 h-5 accent-teal-600 cursor-pointer" 
                        checked={formData.has_machine} 
                        onChange={e => setFormData({...formData, has_machine: e.target.checked})} 
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition">
                        Machine à laver propre et entretenue
                      </span>
                    </label>
                    
                    <label className="flex items-start gap-3 mb-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="mt-1 w-5 h-5 accent-teal-600 cursor-pointer" 
                        checked={formData.has_scale} 
                        onChange={e => setFormData({...formData, has_scale: e.target.checked})} 
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition">
                        J'achèterai un <strong>peson digital</strong> (~10€)
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="mt-1 w-5 h-5 accent-teal-600 cursor-pointer" 
                        checked={formData.use_hypoallergenic} 
                        onChange={e => setFormData({...formData, use_hypoallergenic: e.target.checked})} 
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition">
                        Lessive <strong>hypoallergénique</strong> uniquement
                      </span>
                    </label>
                  </div>

                  <div className="p-5 bg-orange-50 rounded-xl border border-orange-200">
                    <h4 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
                      <ShieldCheck size={18}/> Mentions légales
                    </h4>
                    
                    <label className="flex items-start gap-3 mb-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="mt-1 w-5 h-5 accent-orange-600 cursor-pointer" 
                        checked={formData.legal_capacity} 
                        onChange={e => setFormData({...formData, legal_capacity: e.target.checked})} 
                      />
                      <span className="text-sm text-orange-900 group-hover:text-orange-700 transition">
                        Je suis majeur(e) et apte à exercer une activité indépendante
                      </span>
                    </label>

                    <label className="flex items-start gap-3 mb-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="mt-1 w-5 h-5 accent-orange-600 cursor-pointer" 
                        checked={formData.accept_terms} 
                        onChange={e => setFormData({...formData, accept_terms: e.target.checked})} 
                      />
                      <span className="text-sm text-orange-900 group-hover:text-orange-700 transition">
                        J'accepte les <Link to="/cgu" target="_blank" className="underline font-bold hover:text-orange-600">CGU/CGV</Link> et le statut d'indépendant
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="mt-1 w-5 h-5 accent-orange-600 cursor-pointer" 
                        checked={formData.data_consent} 
                        onChange={e => setFormData({...formData, data_consent: e.target.checked})} 
                      />
                      <span className="text-sm text-orange-900 group-hover:text-orange-700 transition">
                        J'accepte le traitement de mes données (RGPD)
                      </span>
                    </label>
                  </div>

                </div>

                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setStep(2)} 
                    className="px-8 py-4 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition"
                  >
                    Retour
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="flex-1 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold rounded-xl disabled:opacity-50 hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20}/>
                        Envoi en cours...
                      </>
                    ) : (
                      "Valider ma candidature"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== STEP 4 : SUCCÈS ==================== */}
          {step === 4 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 shadow-2xl text-center max-w-2xl mx-auto animate-fade-in">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={48}/>
              </div>
              <h2 className="text-3xl font-black mb-4 text-slate-900">Candidature reçue ! 🎉</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Votre profil est en cours d'analyse par notre équipe.<br/>
                <strong>Nous vous contacterons sous 24h</strong> pour valider votre inscription.
              </p>
              
              <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-6 mb-8">
                <p className="text-sm font-bold text-teal-900 mb-2">📦 Préparez votre matériel :</p>
                <ul className="text-sm text-teal-700 space-y-1">
                  <li>• Peson digital (~10€ sur Amazon)</li>
                  <li>• Lessive hypoallergénique</li>
                  <li>• Machine à laver propre</li>
                </ul>
              </div>

              <button 
                onClick={() => navigate('/')} 
                className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition shadow-lg"
              >
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
