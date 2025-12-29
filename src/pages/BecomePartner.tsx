import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';
import { Building2, User, Mail, CheckCircle, Loader2, Upload, FileText, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// ✅ 1. FONCTION DE GÉOCODAGE (Nominatim OpenStreetMap)
const geocodeAddress = async (address: string) => {
  try {
    // On ajoute "France" pour aider la précision
    const query = `${address}, France`;
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=fr`
    );
    
    const results = await response.json();
    
    if (results && results.length > 0) {
      return {
        latitude: parseFloat(results[0].lat),
        longitude: parseFloat(results[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur géocodage:', error);
    return null;
  }
};

export default function BecomePartner() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    company_name: '',
    siret: '',
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '' // J'ai ajouté city pour être plus précis si besoin, sinon on extrait de l'adresse
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast.success("Fichier Kbis ajouté !");
    }
  };

  const uploadKbis = async (fileToUpload: File) => {
    try {
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `kbis/${fileName}`;

      const { error } = await supabase.storage
        .from('documents')
        .upload(filePath, fileToUpload);

      if (error) throw error;
      return filePath;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ 2. GÉOCODAGE DE L'ADRESSE
      toast.loading("Vérification de l'adresse...", { id: 'geo' });
      const coordinates = await geocodeAddress(`${formData.address} ${formData.city}`);
      
      if (!coordinates) {
        toast.error("Adresse introuvable. Veuillez vérifier.", { id: 'geo' });
        setLoading(false);
        return;
      }
      toast.success("Adresse validée !", { id: 'geo' });

      // 3. UPLOAD KBIS (Optionnel)
      let kbisPath = null;
      if (file) {
        kbisPath = await uploadKbis(file);
      }

      // ✅ 4. INSERTION DANS SUPABASE AVEC LAT/LON
      const { error } = await supabase.from('partners').insert({
        company_name: formData.company_name,
        siret: formData.siret,
        address: formData.address,
        city: formData.city || 'Non spécifié', // Assure-toi d'avoir cette colonne ou retire-la
        contact_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        status: 'pending',
        latitude: coordinates.latitude,   // 📍 GPS
        longitude: coordinates.longitude, // 📍 GPS
        // kbis_url: kbisPath 
      });

      if (error) throw error;

      setStep(2);
      toast.success("Candidature envoyée avec succès !");

    } catch (error: any) {
      console.error(error);
      toast.error("Erreur : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 max-w-2xl mx-auto">
        
        {step === 1 ? (
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Building2 size={32}/>
                    </div>
                    <h1 className="text-3xl font-black mb-2">Devenir Partenaire</h1>
                    <p className="text-slate-500">Rejoignez le réseau Kilolab. Vérification Kbis obligatoire.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* SECTION ENTREPRISE */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider border-b pb-2">L'Entreprise</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Nom de la société</label>
                                <input required type="text" placeholder="Pressing des Lices..." className="w-full p-3 bg-slate-50 border rounded-xl"
                                    value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">SIRET</label>
                                <input required type="text" placeholder="123 456 789 00012" className="w-full p-3 bg-slate-50 border rounded-xl"
                                    value={formData.siret} onChange={e => setFormData({...formData, siret: e.target.value})} />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-1">Adresse (Numéro et Rue)</label>
                                <input required type="text" placeholder="12 Rue de la Paix" className="w-full p-3 bg-slate-50 border rounded-xl"
                                    value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Ville</label>
                                <input required type="text" placeholder="Paris" className="w-full p-3 bg-slate-50 border rounded-xl"
                                    value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    {/* SECTION DOCUMENTS */}
                    <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <label className="block text-sm font-bold mb-1 flex justify-between">
                            <span>Extrait Kbis (PDF/JPG)</span>
                            <span className="text-teal-600 text-xs">Obligatoire</span>
                        </label>
                        <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-white transition cursor-pointer group">
                            <input 
                                type="file" 
                                accept=".pdf,.jpg,.png,.jpeg" 
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            {file ? (
                                <div className="flex flex-col items-center justify-center gap-2 text-teal-600 font-bold">
                                    <FileText size={32}/> 
                                    <span>{file.name}</span>
                                    <span className="text-xs text-slate-400 bg-white px-2 py-1 rounded border">Changer</span>
                                </div>
                            ) : (
                                <div className="text-slate-400 group-hover:text-slate-600 transition">
                                    <Upload size={32} className="mx-auto mb-2"/>
                                    <span className="font-bold">Cliquez pour ajouter votre Kbis</span>
                                    <p className="text-xs mt-1">Max 5 Mo</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SECTION CONTACT */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider border-b pb-2 mt-6">Le Gérant</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Nom complet</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                                    <input required type="text" placeholder="Jean Dupont" className="w-full pl-10 p-3 bg-slate-50 border rounded-xl"
                                        value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Email Pro</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                                    <input required type="email" placeholder="jean@pressing.com" className="w-full pl-10 p-3 bg-slate-50 border rounded-xl"
                                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Téléphone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                                <input required type="tel" placeholder="06 12 34 56 78" className="w-full pl-10 p-3 bg-slate-50 border rounded-xl"
                                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    <button disabled={loading} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition flex justify-center items-center gap-2 shadow-lg">
                        {loading ? <Loader2 className="animate-spin"/> : "Envoyer ma candidature"}
                    </button>
                </form>
            </div>
        ) : (
            <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 text-center animate-fade-in">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={48}/>
                </div>
                <h2 className="text-3xl font-black mb-4">Dossier reçu !</h2>
                <p className="text-slate-500 text-lg mb-8">
                    Notre équipe conformité examine votre Kbis.<br/>
                    Vous recevrez une réponse sous 24h.
                </p>
                <button onClick={() => navigate('/')} className="px-8 py-3 border-2 border-slate-200 rounded-xl font-bold hover:border-slate-900 transition">
                    Retour à l'accueil
                </button>
            </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
