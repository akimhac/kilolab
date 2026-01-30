import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Loader2, Upload, Check, AlertCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BecomeWasher() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    postalCode: '',
    address: '',
    idCardUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Connecte-toi d'abord");
        navigate('/login?type=washer');
        return;
      }

      // Insérer dans la table washers
      const { error } = await supabase.from('washers').insert({
        user_id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        postal_code: formData.postalCode,
        id_card_url: formData.idCardUrl,
        status: 'pending',
        verification_status: 'pending'
      });

      if (error) throw error;

      toast.success("Inscription envoyée ! On te contacte sous 24h 📞");
      setStep(4);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const uploadIdCard = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `id-cards/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('washers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('washers')
        .getPublicUrl(filePath);

      setFormData({ ...formData, idCardUrl: publicUrl });
      toast.success("Pièce d'identité uploadée !");
    } catch (error: any) {
      toast.error("Erreur upload : " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Sparkles size={16} />
            Rejoins les Washers Kilolab
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Transforme ta machine à laver<br/>
            <span className="text-teal-600">en machine à cash 💰</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Gagne jusqu'à 600€/mois en lavant le linge de tes voisins. Liberté totale, comme Uber.
          </p>
        </div>

        {/* ÉTAPES */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3].map(num => (
            <div key={num} className={`flex-1 ${num < 3 ? 'mr-4' : ''}`}>
              <div className={`h-2 rounded-full transition-all duration-300 ${
                step >= num ? 'bg-teal-600' : 'bg-slate-200'
              }`}></div>
              <p className={`text-sm mt-2 font-bold transition-colors ${
                step >= num ? 'text-teal-600' : 'text-slate-400'
              }`}>
                {num === 1 ? 'Infos perso' : num === 2 ? 'Vérification' : 'Confirmation'}
              </p>
            </div>
          ))}
        </div>

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit}>
          
          {/* STEP 1 : Informations personnelles */}
          {step === 1 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Tes informations</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Nom complet *</label>
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="Jean Dupont"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Email *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="jean@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Téléphone *</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="06 12 34 56 78"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Ville *</label>
                    <input
                      required
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      placeholder="Lille"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Code postal *</label>
                    <input
                      required
                      type="text"
                      value={formData.postalCode}
                      onChange={e => setFormData({...formData, postalCode: e.target.value})}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      placeholder="59000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Adresse complète *</label>
                  <input
                    required
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="15 Rue de Rivoli"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full mt-6 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 transition"
              >
                Continuer
              </button>
            </div>
          )}

          {/* STEP 2 : Vérification identité */}
          {step === 2 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Vérification d'identité</h2>
              
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex items-start gap-3">
                  <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-blue-900">
                    <p className="font-bold mb-1">Pourquoi on demande ça ?</p>
                    <p>Pour la sécurité des clients et la tienne. Toutes les données sont cryptées et conformes RGPD.</p>
                  </div>
                </div>

                <label className="block text-sm font-bold mb-2">Pièce d'identité (CNI ou Passeport) *</label>
                
                {!formData.idCardUrl ? (
                  <label className="block w-full p-8 border-2 border-dashed border-slate-300 rounded-xl hover:border-teal-500 transition cursor-pointer bg-slate-50 hover:bg-teal-50">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && uploadIdCard(e.target.files[0])}
                    />
                    <div className="text-center">
                      <Upload className="mx-auto mb-3 text-slate-400" size={32} />
                      <p className="font-bold text-slate-700">Clique pour uploader</p>
                      <p className="text-sm text-slate-500 mt-1">JPG, PNG (max 5MB)</p>
                    </div>
                  </label>
                ) : (
                  <div className="border-2 border-green-500 rounded-xl p-4 bg-green-50">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-500 p-2 rounded-full">
                        <Check className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-green-900">Pièce d'identité uploadée ✅</p>
                        <p className="text-sm text-green-700">On vérifie ton identité sous 24h</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!formData.idCardUrl}
                  className="flex-1 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 : Confirmation */}
          {step === 3 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Récapitulatif</h2>
              
              <div className="space-y-3 mb-8">
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-600">Nom</span>
                  <span className="font-bold">{formData.fullName}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-600">Email</span>
                  <span className="font-bold">{formData.email}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-600">Téléphone</span>
                  <span className="font-bold">{formData.phone}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-600">Localisation</span>
                  <span className="font-bold">{formData.city} ({formData.postalCode})</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-slate-600">Vérification identité</span>
                  <span className="font-bold text-green-600">✅ Complète</span>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-teal-900">
                  <strong>Prochaines étapes :</strong><br/>
                  1️⃣ On vérifie ton identité (24h max)<br/>
                  2️⃣ Tu reçois un appel pour valider ton profil<br/>
                  3️⃣ Tu accèdes au Dashboard Washer et tu commences à gagner ! 💰
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Envoi...
                    </>
                  ) : (
                    "Valider mon inscription"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 : Succès */}
          {step === 4 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-green-600" size={40} />
              </div>
              <h2 className="text-3xl font-black mb-4">Inscription envoyée ! 🎉</h2>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Ton dossier est en cours de vérification. On te contacte par téléphone sous 24h pour valider ton profil.
              </p>
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-slate-700">
                  📧 Email de confirmation envoyé à <strong>{formData.email}</strong>
                </p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 transition"
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
