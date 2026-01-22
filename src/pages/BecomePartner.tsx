import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';
import { Building2, User, Mail, Loader2, Upload, FileText, Phone, CheckSquare, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { trackPartnerSignup } from '../lib/facebookPixel'; // ← AJOUTÉ

// ========================================
// GÉOCODAGE AUTOMATIQUE
// ========================================
const geocodeAddress = async (address: string, postalCode: string, city: string) => {
  try {
    const query = `${address}, ${postalCode} ${city}, France`;
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=fr&limit=1`,
      {
        headers: {
          'User-Agent': 'Kilolab/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Geocoding API error');
    }
    
    const results = await response.json();
    
    if (results && results.length > 0) {
      return {
        latitude: parseFloat(results[0].lat),
        longitude: parseFloat(results[0].lon),
        displayName: results[0].display_name
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur géocodage:', error);
    return null;
  }
};

// ========================================
// COMPOSANT PRINCIPAL
// ========================================
export default function BecomePartner() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [formData, setFormData] = useState({
    company_name: '',
    siret: '',
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: ''
  });

  // ========================================
  // GESTION UPLOAD KBIS
  // ========================================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Vérification type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Format non accepté. Utilisez PDF, JPG ou PNG.");
        return;
      }
      
      // Vérification taille (5 Mo max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Le fichier est trop volumineux (5 Mo max)");
        return;
      }
      
      setFile(selectedFile);
      toast.success("Fichier Kbis ajouté !");
    }
  };

  const uploadKbis = async (fileToUpload: File): Promise<string | null> => {
    try {
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `kbis/${fileName}`;

      const { error } = await supabase.storage
        .from('documents')
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Kbis upload failed:', error);
        throw error;
      }

      return filePath;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  // ========================================
  // SOUMISSION FORMULAIRE
  // ========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ 0. VÉRIFICATION JURIDIQUE
      if (!acceptTerms) {
        toast.error("Vous devez accepter les conditions de commission.");
        setLoading(false);
        return;
      }

      // ✅ 1. VALIDATION FICHIER
      if (!file) {
        toast.error("Le Kbis est obligatoire");
        setLoading(false);
        return;
      }

      // Validation SIRET (14 chiffres)
      const siretClean = formData.siret.replace(/\s/g, '');
      if (!/^\d{14}$/.test(siretClean)) {
        toast.error("Le SIRET doit contenir 14 chiffres");
        setLoading(false);
        return;
      }

      // ✅ 2. GÉOCODAGE
      toast.loading("Vérification de l'adresse...", { id: 'geo' });
      
      const coordinates = await geocodeAddress(
        formData.address,
        formData.postal_code,
        formData.city
      );
      
      if (!coordinates) {
        toast.error("Adresse introuvable. Vérifiez votre saisie.", { id: 'geo' });
        setLoading(false);
        return;
      }
      
      console.log('📍 Adresse géocodée:', coordinates.displayName);
      toast.success("Adresse validée !", { id: 'geo' });

      // ✅ 3. UPLOAD KBIS
      toast.loading("Upload du Kbis...", { id: 'upload' });
      const kbisPath = await uploadKbis(file);
      
      if (!kbisPath) {
        toast.error("Erreur lors de l'upload du Kbis", { id: 'upload' });
        setLoading(false);
        return;
      }
      
      toast.success("Kbis uploadé !", { id: 'upload' });

      // ✅ 4. INSERTION SUPABASE
      toast.loading("Envoi de la candidature...", { id: 'submit' });
      
      const fullAddress = `${formData.address}, ${formData.postal_code} ${formData.city}`;
      
      const { error: insertError } = await supabase.from('partners').insert({
        company_name: formData.company_name.trim(),
        siret: siretClean,
        address: fullAddress,
        contact_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.replace(/\s/g, ''),
        status: 'pending',
        is_active: false,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        kbis_url: kbisPath,
        created_at: new Date().toISOString()
      });

      if (insertError) {
        console.error('Partner insertion failed:', insertError);
        throw insertError;
      }

      // ✅ 5. TRACKING FACEBOOK PIXEL ← AJOUTÉ ICI
      trackPartnerSignup(formData.company_name);

      toast.success("Candidature envoyée avec succès !", { id: 'submit' });
      
      // ✅ 6. REDIRECTION
      setTimeout(() => {
        navigate('/partner-pending');
      }, 1500);

    } catch (error: any) {
      console.error('Erreur inscription partenaire:', error);
      
      if (error.message?.includes('duplicate')) {
        toast.error("Cette entreprise est déjà inscrite");
      } else if (error.message?.includes('RLS') || error.message?.includes('policy')) {
        toast.error("Erreur de permissions. Contactez le support.");
      } else {
        toast.error(`Erreur : ${error.message || 'Veuillez réessayer'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 size={32}/>
            </div>
            <h1 className="text-3xl font-black mb-2">Devenir Partenaire</h1>
            <p className="text-slate-500">Rejoignez le réseau Kilolab. Vérification Kbis obligatoire.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ENTREPRISE */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider border-b pb-2">L'Entreprise</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Nom de la société <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Pressing des Lices" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    value={formData.company_name} 
                    onChange={e => setFormData({...formData, company_name: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    SIRET <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    placeholder="123 456 789 00012" 
                    maxLength={17}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    value={formData.siret} 
                    onChange={e => setFormData({...formData, siret: e.target.value})} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Adresse (Numéro et Rue) <span className="text-red-500">*</span>
                </label>
                <input 
                  required 
                  type="text" 
                  placeholder="12 Rue de la Paix" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Code postal <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    placeholder="75001" 
                    maxLength={5}
                    pattern="\d{5}"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    value={formData.postal_code} 
                    onChange={e => setFormData({...formData, postal_code: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Paris" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    value={formData.city} 
                    onChange={e => setFormData({...formData, city: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            {/* KBIS */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-sm font-bold flex justify-between">
                <span>Extrait Kbis (PDF/JPG)</span>
                <span className="text-red-600 text-xs">* Obligatoire</span>
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
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-slate-400">({(file.size / 1024 / 1024).toFixed(2)} Mo)</span>
                    <span className="text-xs text-slate-400 bg-white px-2 py-1 rounded border">Changer</span>
                  </div>
                ) : (
                  <div className="text-slate-400 group-hover:text-slate-600 transition">
                    <Upload size={32} className="mx-auto mb-2"/>
                    <span className="font-bold">Cliquez pour ajouter votre Kbis</span>
                    <p className="text-xs mt-1">PDF, JPG ou PNG - Max 5 Mo</p>
                  </div>
                )}
              </div>
            </div>

            {/* CONTACT */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider border-b pb-2">Le Gérant</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                    <input 
                      required 
                      type="text" 
                      placeholder="Jean Dupont" 
                      className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      value={formData.full_name} 
                      onChange={e => setFormData({...formData, full_name: e.target.value})} 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Email Pro <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                    <input 
                      required 
                      type="email" 
                      placeholder="jean@pressing.com" 
                      className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                  <input 
                    required 
                    type="tel" 
                    placeholder="06 12 34 56 78" 
                    pattern="[0-9\s]{10,14}"
                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            {/* --- VALIDATION JURIDIQUE ET COMMISSIONS --- */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
              <div className="pt-1">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
              </div>
              <label htmlFor="terms" className="text-sm text-slate-700 cursor-pointer">
                Je certifie l'exactitude des informations fournies. J'accepte les <a href="/partner-terms" target="_blank" className="font-bold text-teal-700 underline">Conditions Générales de Partenariat</a> et je valide le barème de <strong>commissions KiloLab (20%)</strong> appliqué sur chaque commande apportée. Je comprends que mes responsabilités (traitement du linge, délais) sont engagées.
              </label>
            </div>

            <button 
              type="submit"
              disabled={loading || !file} 
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition flex justify-center items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20}/>
                  Traitement en cours...
                </>
              ) : (
                "Envoyer ma candidature"
              )}
            </button>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}