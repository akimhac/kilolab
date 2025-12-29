import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, MessageSquare, Send, CheckCircle, Loader2, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { analytics } from "../lib/analytics"; // 📊 Import Analytics

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  // Ajout du champ 'subject' pour correspondre à ton analytics
  const [formData, setFormData] = useState({ email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Envoi réel vers Supabase
      const { error } = await supabase
        .from("contact_messages")
        .insert({ 
            email: formData.email, 
            subject: formData.subject, 
            message: formData.message 
        });

      if (error) throw error;

      // 2. 📊 Tracking Analytics
      analytics.contactFormSubmitted(formData.subject); 

      // 3. UI Update
      setSent(true);
      toast.success("Message envoyé à l'équipe Kilolab !");

    } catch (error: any) {
      console.error(error);
      toast.error("Erreur lors de l'envoi : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
      <Navbar />
      <div className="pt-32 pb-20 px-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Contactez-nous</h1>
        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            {!sent ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="font-bold text-slate-700 block mb-2">Votre Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                            <input 
                                required type="email" 
                                className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="client@kilolab.fr"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Ajout du champ Sujet pour Analytics */}
                    <div>
                        <label className="font-bold text-slate-700 block mb-2">Sujet</label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                            <input 
                                required type="text" 
                                className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="Commande, Partenariat..."
                                value={formData.subject}
                                onChange={e => setFormData({...formData, subject: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="font-bold text-slate-700 block mb-2">Votre Message</label>
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                            <textarea 
                                required rows={5}
                                className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="Une question sur une commande ? Un partenariat ?"
                                value={formData.message}
                                onChange={e => setFormData({...formData, message: e.target.value})}
                            />
                        </div>
                    </div>
                    <button disabled={loading} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin"/> : <>Envoyer <Send size={18}/></>}
                    </button>
                </form>
            ) : (
                <div className="text-center py-12 animate-in zoom-in">
                    <CheckCircle size={64} className="text-green-500 mx-auto mb-4"/>
                    <h2 className="text-2xl font-bold mb-2">Bien reçu !</h2>
                    <p className="text-slate-500">Notre équipe vous répond sous 24h.</p>
                </div>
            )}
        </div>

        <div className="mt-12 text-center text-slate-500 text-sm">
            <p>Vous pouvez aussi nous écrire directement :</p>
            <a href="mailto:contact@kilolab.fr" className="text-teal-600 font-bold hover:underline">contact@kilolab.fr</a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
