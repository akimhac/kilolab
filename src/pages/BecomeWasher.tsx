import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Loader2, Upload, Check, AlertCircle, Sparkles, Scale, Droplets, ShieldCheck, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BecomeWasher() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [volume, setVolume] = useState(20);

  const revenue = (volume * 2.80).toFixed(0);

  const [formData, setFormData] = useState({
    fullName: '', 
    email: '', 
    phone: '', 
    city: '', 
    postalCode: '', 
    address: '', 
    idCardUrl: '',
    has_machine: false, 
    has_scale: false, 
    use_hypoallergenic: false,
    legal_capacity: false,      // ← NOUVEAU
    accept_terms: false,         // ← NOUVEAU
    data_consent: false          // ← NOUVEAU
  });

  const uploadIdCard = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `id-cards/${fileName}`;
      
      const { error } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (error) throw error;
      
      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      setFormData({ ...formData, idCardUrl: data.publicUrl });
      toast.success("✅ Pièce d'identité reçue !");
    } catch (error: any) {
      toast.error("❌ Erreur upload: " + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Vérifications
      if (!formData.has_machine || !formData.has_scale || !formData.use_hypoallergenic) {
        toast.error("⚠️ Veuillez cocher tous les engagements qualité");
        setLoading(false);
        return;
      }

      if (!formData.legal_capacity) {
        toast.error("⚠️ Vous devez certifier avoir la capacité juridique d'exercer");
        setLoading(false);
        return;
      }

      if (!formData.accept_terms) {
        toast.error("⚠️ Vous devez accepter les CGU/CGV");
        setLoading(false);
        return;
      }

      if (!formData.data_consent) {
        toast.error("⚠️ Vous devez accepter le traitement des données");
        setLoading(false);
        return;
      }

      if (!formData.idCardUrl) {
        toast.error("⚠️ Merci d'uploader votre pièce d'identité");
        setLoading(false);
        return;
      }

      // Insert dans washers
      const { error } = await supabase.from('washers').insert({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        postal_code: formData.postalCode,
        address: formData.address,
        id_card_url: formData.idCardUrl,
        status: 'pending',
        has_machine: formData.has_machine,
        has_scale: formData.has_scale,
        use_hypoallergenic: formData.use_hypoallergenic,
        legal_capacity: formData.legal_capacity,
        accept_terms: formData.accept_terms,
        data_consent: formData.data_consent
      });

      if (error) throw error;

      setStep(4);
      toast.success("🎉 Candidature envoyée !");
    } catch (error: any) {
      console.error(error);
      toast.error("❌ " + (error.message || "Erreur"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Sparkles size={16} /> Rejoins les Washers Kilolab
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Transforme ta machine à laver<br/>
            <span className="text-teal-600">en machine à cash 💰</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Gagne de l'argent en lavant le linge de ta ville. Liberté totale, sans abonnement.
          </p>
        </div>

        {/* PROGRESSION */}
        <div className="flex justify-between mb-12 max-w-2xl mx-auto">
          {[1, 2, 3].map(num => (
            <div key={num} className={`flex-1 ${num < 3 ? 'mr-2' : ''}`}>
              <div className={`h-2 rounded-full transition-all ${step >= num ? 'bg-teal-600' : 'bg-slate-200'}`}></div>
              <p className={`text-xs mt-2 font-bold text-center ${step >= num ? 'text-teal-600' : 'text-slate-400'}`}>
                {num === 1 ? 'Infos' : num === 2 ? 'Identité' : 'Engagements'}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* STEP 1: INFOS */}
          {step === 1 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">1. Tes informations</h2>
              
              <div className="space-y-4">
                <input 
                  required 
                  type="text" 
                  placeholder="Nom complet *" 
                  value={formData.fullName} 
                  onChange={e => setFormData({...formData, fullName: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <input 
                    required 
                    type="email" 
                    placeholder="Email *" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <input 
                    required 
                    type="tel" 
                    placeholder="Téléphone *" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <input 
                    required 
                    type="text" 
                    placeholder="Ville *" 
                    value={formData.city} 
                    onChange={e => setFormData({...formData, city: e.target.value})} 
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <input 
                    required 
                    type="text" 
                    placeholder="Code postal *" 
                    value={formData.postalCode} 
                    onChange={e => setFormData({...formData, postalCode: e.target.value})} 
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <input 
                  required 
                  type="text" 
                  placeholder="Adresse complète *" 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              
              <button 
                type="button" 
                onClick={() => setStep(2)} 
                className="w-full mt-6 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 transition"
              >
                Continuer →
              </button>
            </div>
          )}

          {/* STEP 2: ID */}
          {step === 2 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">2. Vérification d'identité</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-blue-900">
                  <p className="font-bold mb-1">Pourquoi cette étape ?</p>
                  <p>Pour la sécurité des clients. Toutes les données sont cryptées et conformes RGPD.</p>
                </div>
              </div>

              <label className="block text-sm font-bold mb-2">Pièce d'identité (CNI ou Passeport) *</label>
              
              <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-teal-50 hover:border-teal-500 transition cursor-pointer">
                {!formData.idCardUrl ? (
                  <>
                    <Upload className="mx-auto mb-3 text-slate-400" size={32} />
                    <p className="font-bold text-slate-600 mb-1">Clique pour uploader</p>
                    <p className="text-sm text-slate-500">JPG, PNG (max 5MB)</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => e.target.files?.[0] && uploadIdCard(e.target.files[0])} 
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-3 text-green-600 font-bold">
                    <Check size={24} />
                    <span>Document reçu ✅</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-6">
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition"
                >
                  ← Retour
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(3)} 
                  disabled={!formData.idCardUrl} 
                  className="flex-1 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ENGAGEMENTS + CONSENTEMENTS */}
          {step === 3 && (
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                
                {/* SIMULATEUR (GAUCHE) */}
                <div className="lg:sticky lg:top-32 h-fit">
                  <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="text-teal-400"/> Potentiel de gains
                    </h3>
                    
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400">Volume hebdo</span>
                        <span className="text-2xl font-black text-white">{volume}kg</span>
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

                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-700 text-center">
                      <p className="text-slate-400 text-sm mb-1">Gains mensuels potentiels</p>
                      <p className="text-5xl font-black text-teal-400">{parseInt(revenue) * 4}€</p>
                      <p className="text-xs text-slate-500 mt-2">*Commission 70%</p>
                    </div>
                  </div>
                </div>

                {/* ENGAGEMENTS (DROITE) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">3. Charte Qualité & Consentements</h2>
                  
                  <div className="space-y-4 mb-8">
                    
                    {/* 1. MACHINE */}
                    <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition">
                      <input 
                        type="checkbox" 
                        required
                        className="mt-1 w-5 h-5 accent-teal-600" 
                        checked={formData.has_machine} 
                        onChange={e => setFormData({...formData, has_machine: e.target.checked})} 
                      />
                      <span className="text-sm text-slate-700">
                        <span className="font-bold block mb-1">✓ Machine fonctionnelle</span>
                        Je possède une machine à laver propre et entretenue.
                      </span>
                    </label>

                    {/* 2. PESON */}
                    <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition">
                      <input 
                        type="checkbox" 
                        required
                        className="mt-1 w-5 h-5 accent-teal-600" 
                        checked={formData.has_scale} 
                        onChange={e => setFormData({...formData, has_scale: e.target.checked})} 
                      />
                      <span className="text-sm text-slate-700">
                        <span className="font-bold flex items-center gap-2 mb-1">
                          <Scale size={16} className="text-teal-600"/> Peson à bagage
                        </span>
                        Je m'engage à acheter un peson (env. 10€) pour peser le linge.
                      </span>
                    </label>

                    {/* 3. LESSIVE */}
                    <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition">
                      <input 
                        type="checkbox" 
                        required
                        className="mt-1 w-5 h-5 accent-teal-600" 
                        checked={formData.use_hypoallergenic} 
                        onChange={e => setFormData({...formData, use_hypoallergenic: e.target.checked})} 
                      />
                      <span className="text-sm text-slate-700">
                        <span className="font-bold flex items-center gap-2 mb-1">
                          <Droplets size={16} className="text-blue-600"/> Lessive hypoallergénique
                        </span>
                        J'utilise exclusivement une lessive douce (type Le Chat, Maison Verte).
                      </span>
                    </label>

                    {/* 4. CAPACITÉ JURIDIQUE - NOUVEAU */}
                    <label className="flex items-start gap-3 p-4 border-2 border-orange-200 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition bg-orange-50/50">
                      <input 
                        type="checkbox" 
                        required
                        className="mt-1 w-5 h-5 accent-orange-600" 
                        checked={formData.legal_capacity} 
                        onChange={e => setFormData({...formData, legal_capacity: e.target.checked})} 
                      />
                      <span className="text-sm text-slate-700">
                        <span className="font-bold flex items-center gap-2 mb-1 text-orange-700">
                          <ShieldCheck size={16}/> Capacité d'exercer *
                        </span>
                        Je certifie être majeur(e), avoir la capacité juridique d'exercer une activité indépendante, 
                        et m'engage à déclarer mes revenus aux impôts.
                      </span>
                    </label>

                    {/* 5. CGU - NOUVEAU */}
                    <label className="flex items-start gap-3 p-4 border-2 border-red-200 rounded-xl cursor-pointer hover:border-red-400 hover:bg-red-50 transition bg-red-50/50">
                      <input 
                        type="checkbox" 
                        required
                        className="mt-1 w-5 h-5 accent-red-600" 
                        checked={formData.accept_terms} 
                        onChange={e => setFormData({...formData, accept_terms: e.target.checked})} 
                      />
                      <span className="text-sm text-slate-700">
                        <span className="font-bold block mb-1 text-red-700">✓ Conditions générales *</span>
                        J'accepte les{' '}
                        <Link to="/cgu" target="_blank" className="text-red-600 underline font-bold">
                          CGU
                        </Link>
                        ,{' '}
                        <Link to="/cgv" target="_blank" className="text-red-600 underline font-bold">
                          CGV
                        </Link>
                        {' '}et la{' '}
                        <Link to="/privacy" target="_blank" className="text-red-600 underline font-bold">
                          politique de confidentialité
                        </Link>
                        . Je reconnais être travailleur indépendant (commission 30%).
                      </span>
                    </label>

                    {/* 6. RGPD - NOUVEAU */}
                    <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition">
                      <input 
                        type="checkbox" 
                        required
                        className="mt-1 w-5 h-5 accent-slate-600" 
                        checked={formData.data_consent} 
                        onChange={e => setFormData({...formData, data_consent: e.target.checked})} 
                      />
                      <span className="text-sm text-slate-700">
                        <span className="font-bold block mb-1">🔒 Traitement des données *</span>
                        J'autorise Kilolab à traiter mes données personnelles (nom, email, téléphone, ID) 
                        pour la gestion de mon compte Washer, conformément au RGPD.
                      </span>
                    </label>

                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setStep(2)} 
                      className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition"
                    >
                      ← Retour
                    </button>
                    <button 
                      type="submit" 
                      disabled={loading} 
                      className="flex-1 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? <><Loader2 className="animate-spin" size={20}/> Envoi...</> : "Valider mon inscription"}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 4: SUCCÈS */}
          {step === 4 && (
            <div className="max-w-2xl mx-auto text-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} />
              </div>
              <h2 className="text-3xl font-black mb-4">Dossier reçu ! 🎉</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Prochaine étape : Prépare ton matériel (Peson + Lessive hypoallergénique).
                <br/>On t'appelle sous 24h pour valider ton profil et t'activer dans l'app.
              </p>
              <button 
                onClick={() => navigate('/')} 
                className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition"
              >
                Retour Accueil
              </button>
            </div>
          )}

        </form>
      </div>
      
      <Footer />
    </div>
  );
}
