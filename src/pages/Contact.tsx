import { useState, useRef, useEffect, ReactNode } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, MessageSquare, Send, CheckCircle, Loader2, Tag, Phone, MapPin, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { analytics } from "../lib/analytics";
import { Helmet } from 'react-helmet-async';

// Animation component
function AnimateOnScroll({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translateY(20px)',
        transition: `opacity 0.5s ease-out ${delay}ms, transform 0.5s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Insert dans contact_messages
      const { error } = await supabase
        .from("contact_messages")
        .insert({ 
          email: formData.email, 
          subject: formData.subject, 
          message: formData.message
          // read: false est la valeur par défaut en DB
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Analytics (ne bloque pas en cas d'erreur)
      try {
        analytics.contactFormSubmitted(formData.subject); 
      } catch (err) {
        console.warn("Analytics error (ignored):", err);
      }

      // Success
      setSent(true);
      toast.success("✅ Message envoyé à l'équipe Kilolab !");
      setFormData({ email: '', subject: '', message: '' });

    } catch (error: any) {
      console.error('Contact form error:', error);
      
      if (error.message?.includes("permission")) {
        toast.error("❌ Erreur de permissions");
      } else {
        toast.error("❌ Erreur : " + (error.message || "Erreur inconnue"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact - Kilolab | Service Client</title>
        <meta name="description" content="Contactez l'équipe Kilolab pour toute question sur votre commande, un partenariat ou une suggestion. Réponse sous 24h." />
        <link rel="canonical" href="https://kilolab.fr/contact" />
      </Helmet>

      <div className="bg-slate-50 min-h-screen font-sans text-slate-900 flex flex-col">
        <Navbar />
        
        {/* Hero */}
        <header className="pt-32 pb-12 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <AnimateOnScroll>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contactez-nous</h1>
              <p className="text-xl text-slate-400">Notre équipe vous répond sous 24h</p>
            </AnimateOnScroll>
          </div>
        </header>

        {/* Contact Cards */}
        <section className="-mt-8 px-4 mb-12">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-4">
            <AnimateOnScroll delay={0}>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center hover:-translate-y-1 transition">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-teal-600" size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Email</h3>
                <a href="mailto:contact@kilolab.fr" className="text-teal-600 hover:underline text-sm">
                  contact@kilolab.fr
                </a>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100}>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center hover:-translate-y-1 transition">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-blue-600" size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Horaires</h3>
                <p className="text-slate-600 text-sm">Lun-Ven : 9h-18h</p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center hover:-translate-y-1 transition">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-purple-600" size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Zone</h3>
                <p className="text-slate-600 text-sm">France métropolitaine</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
        
        <div className="flex-grow pb-20 px-4 max-w-2xl mx-auto w-full">
          <AnimateOnScroll delay={300}>
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="font-bold text-slate-700 block mb-2">Votre Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                  <input 
                    required 
                    type="email" 
                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium transition"
                    placeholder="client@kilolab.fr"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-2">Sujet</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                  <input 
                    required 
                    type="text" 
                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium transition"
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
                    required 
                    rows={5}
                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium transition resize-none"
                    placeholder="Une question sur une commande ? Un partenariat ?"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>
              </div>
              
              <button 
                disabled={loading} 
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-black transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? <Loader2 className="animate-spin"/> : <>Envoyer <Send size={18}/></>}
              </button>
            </form>
          ) : (
            <div className="text-center py-12 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600"/>
              </div>
              <h2 className="text-3xl font-black mb-3 text-slate-900">Message envoyé !</h2>
              <p className="text-slate-500 mb-8">Notre équipe a bien reçu votre demande et vous répondra sous 24h.</p>
              <button 
                onClick={() => setSent(false)}
                className="text-teal-600 font-bold hover:text-teal-700 underline"
              >
                Envoyer un autre message
              </button>
            </div>
          )}
          </div>
          </AnimateOnScroll>
        </div>
        
        <Footer />
      </div>
    </>
  );
}
