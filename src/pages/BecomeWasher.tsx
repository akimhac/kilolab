import { Helmet } from 'react-helmet-async';
import { useMemo, useState, useEffect, useRef, type FormEvent, type ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Loader2, Upload, Check, Sparkles, TrendingUp, ShieldCheck, ArrowRight,
  Home, DollarSign, Users, Clock, Star, MapPin, Zap, ChevronRight, Play,
} from 'lucide-react';
import toast from 'react-hot-toast';

type Coords = { lat: number; lng: number };

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const isPostalCodeValid = (cp: string) => /^[0-9]{5}$/.test(cp.trim());
const isPhoneProbablyValid = (p: string) => p.trim().replace(/\s+/g, '').length >= 8;

/* ── Animate on scroll ───────── */
function AnimateOnScroll({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.12 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(40px)', transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms` }}>{children}</div>;
}

/* ── Animated counter ───────── */
function Counter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      o.disconnect();
      let start = 0;
      const step = Math.ceil(end / 40);
      const id = setInterval(() => { start = Math.min(start + step, end); setVal(start); if (start >= end) clearInterval(id); }, 30);
    }, { threshold: 0.3 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [end]);
  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

export default function BecomeWasher() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [volume, setVolume] = useState(25);
  const revenue = useMemo(() => (volume * 2.8 * 4).toFixed(0), [volume]);
  const HERO_POSTER = 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?q=80&w=2400&auto=format&fit=crop';

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', city: '', postalCode: '', address: '', idCardUrl: '',
    has_machine: false, has_scale: false, use_hypoallergenic: false,
    legal_capacity: false, accept_terms: false, data_consent: false,
  });

  const uploadIdCard = async (file: File) => {
    try {
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) { toast.error('Fichier trop lourd (max 10MB).'); return; }
      const fileExt = (file.name.split('.').pop() || 'bin').toLowerCase();
      const safeId = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
      const filePath = `id-cards/${Date.now()}-${safeId}.${fileExt}`;
      const { error } = await supabase.storage.from('documents').upload(filePath, file, { cacheControl: '3600', upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from('documents').getPublicUrl(filePath);
      setFormData((prev) => ({ ...prev, idCardUrl: data.publicUrl }));
      toast.success("Piece d'identite recue !");
    } catch (error: any) { toast.error('Erreur upload: ' + (error?.message ?? 'inconnue')); }
  };

  const geocodeAddress = async (address: string, city: string, postalCode: string): Promise<Coords | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('geocode-address', { body: { address: address.trim(), city: city.trim(), postalCode: postalCode.trim() } });
      if (error || !data?.lat || !data?.lng) return null;
      return { lat: data.lat, lng: data.lng };
    } catch { return null; }
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const { data } = await supabase.from('washers').select('email').eq('email', normalizeEmail(email)).maybeSingle();
      return !!data;
    } catch { return false; }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      if (!formData.fullName.trim()) return toast.error('Nom complet requis.');
      const email = normalizeEmail(formData.email);
      if (!email) return toast.error('Email requis.');
      if (!isPhoneProbablyValid(formData.phone)) return toast.error('Telephone invalide.');
      if (!formData.city.trim()) return toast.error('Ville requise.');
      if (!isPostalCodeValid(formData.postalCode)) return toast.error('Code postal invalide.');
      if (!formData.address.trim()) return toast.error('Adresse complete requise.');
      if (!formData.idCardUrl) return toast.error("Merci d'uploader votre piece d'identite.");
      if (!formData.has_machine || !formData.has_scale || !formData.use_hypoallergenic) return toast.error('Validez les engagements qualite');
      if (!formData.legal_capacity || !formData.accept_terms || !formData.data_consent) return toast.error('Acceptez les conditions legales');
      if (await checkEmailExists(email)) return toast.error('Cet email est deja inscrit.');
      toast.loading("Geolocalisation...", { id: 'geo' });
      const coords = await geocodeAddress(formData.address, formData.city, formData.postalCode);
      toast.dismiss('geo');
      if (!coords) return toast.error("Impossible de geolocaliser l'adresse.");
      const { error } = await supabase.from('washers').insert({
        full_name: formData.fullName.trim(), email, phone: formData.phone.trim(), city: formData.city.trim(),
        postal_code: formData.postalCode.trim(), address: formData.address.trim(), lat: coords.lat, lng: coords.lng,
        id_card_url: formData.idCardUrl, status: 'pending', has_machine: formData.has_machine,
        has_scale: formData.has_scale, use_hypoallergenic: formData.use_hypoallergenic, is_available: true,
      });
      if (error) { if ((error as any).code === '23505') toast.error('Email deja utilise.'); else toast.error('Erreur : ' + error.message); return; }
      setStep(4);
      toast.success('Candidature envoyee !');
    } catch (error: any) { toast.error('Erreur : ' + (error?.message ?? 'inconnue')); } finally { setLoading(false); }
  };

  const canGoStep2 = () => formData.fullName.trim() && normalizeEmail(formData.email) && isPhoneProbablyValid(formData.phone) && formData.city.trim() && isPostalCodeValid(formData.postalCode) && formData.address.trim();

  return (
    <>
      <Helmet>
        <title>Devenir Washer - Gagnez jusqu'à 600€/mois | Kilolab France</title>
        <meta name="description" content="Rejoignez le réseau Kilolab France et générez un revenu complémentaire en lavant du linge depuis chez vous." />
        <link rel="canonical" href="https://kilolab.fr/become-washer" />
      </Helmet>

      <div className="min-h-screen bg-[#0a0f1a] text-white">
        <Navbar />

        {step === 0 && (
          <>
            {/* ═══════════ HERO FULL-SCREEN ═══════════ */}
            <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
              <img src={HERO_POSTER} alt="" className="absolute inset-0 w-full h-full object-cover scale-105" loading="eager" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a]/90 via-[#0a0f1a]/70 to-[#0a0f1a]" />

              {/* Animated grid pattern */}
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
                backgroundSize: '60px 60px'
              }} />

              <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-sm font-semibold mb-8 backdrop-blur-sm animate-fade-in">
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span></span>
                  500+ Washers actifs en France
                </div>

                <h1 data-testid="washer-hero-title" className="text-4xl sm:text-5xl md:text-7xl font-black leading-[0.95] tracking-tight mb-8 animate-slide-up">
                  <span className="block text-white">Votre machine tourne.</span>
                  <span className="block mt-2 bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">Votre compte aussi.</span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-light animate-slide-up" style={{ animationDelay: '100ms' }}>
                  Transformez votre machine à laver en source de revenus.<br className="hidden sm:block" />
                  Jusqu'à <strong className="text-white font-semibold">600&euro;/mois</strong>, depuis chez vous, à votre rythme.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{ animationDelay: '200ms' }}>
                  <button data-testid="cta-inscription" onClick={() => setStep(1)}
                    className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-[#0a0f1a] rounded-2xl font-bold text-lg transition-all duration-300 shadow-[0_0_60px_rgba(20,184,166,0.25)] hover:shadow-[0_0_80px_rgba(20,184,166,0.4)] hover:scale-[1.03] active:scale-[0.97]">
                    Commencer l'inscription
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </button>
                  <a href="#simulateur"
                    onClick={(e) => { e.preventDefault(); document.getElementById('simulateur')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-5 border border-white/20 text-white rounded-2xl font-semibold text-lg hover:bg-white/5 transition-all">
                    <Play size={18} className="fill-current" /> Simuler mes revenus
                  </a>
                </div>

                {/* Live stats */}
                <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '400ms' }}>
                  {[
                    { value: '0\u20AC', label: "Frais d'inscription" },
                    { value: '24h', label: 'Activation' },
                    { value: '7j/7', label: 'Virements' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                      <p className="text-2xl sm:text-3xl font-black text-teal-400">{s.value}</p>
                      <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/25 rounded-full flex justify-center pt-2">
                  <div className="w-1.5 h-3 bg-white/40 rounded-full animate-pulse" />
                </div>
              </div>
            </section>

            {/* ═══════════ SOCIAL PROOF BAR ═══════════ */}
            <section className="relative bg-gradient-to-r from-teal-600 to-cyan-600 py-5 overflow-hidden">
              <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-white text-sm font-semibold">
                <span className="flex items-center gap-2"><Star size={16} className="text-yellow-300 fill-yellow-300" /> 4.9/5 note moyenne</span>
                <span className="flex items-center gap-2"><MapPin size={16} /> 45+ villes en France</span>
                <span className="flex items-center gap-2"><Users size={16} /> 500+ Washers actifs</span>
                <span className="flex items-center gap-2"><Zap size={16} /> Paye chaque semaine</span>
              </div>
            </section>

            {/* ═══════════ WHY BECOME A WASHER ═══════════ */}
            <section className="py-24 bg-[#0a0f1a] relative overflow-hidden">
              <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px]" />
              <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />

              <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
                <AnimateOnScroll className="text-center mb-16">
                  <span className="inline-block px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-full text-xs font-bold tracking-widest uppercase mb-6">Pourquoi nous rejoindre</span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                    Tout ce qu'il faut<br /><span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">pour réussir</span>
                  </h2>
                </AnimateOnScroll>

                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { icon: <DollarSign size={28} />, title: "Revenus complémentaires", desc: "Générez jusqu'à 600\u20AC/mois. Fixez vos tarifs et augmentez votre volume à votre rythme.", gradient: 'from-teal-500 to-emerald-500', glow: 'shadow-teal-500/20' },
                    { icon: <Home size={28} />, title: "Travaillez de chez vous", desc: "Zéro déplacement, zéro bureau. Votre salon devient votre espace de travail. Acceptez uniquement les missions qui vous conviennent.", gradient: 'from-violet-500 to-purple-500', glow: 'shadow-violet-500/20' },
                    { icon: <ShieldCheck size={28} />, title: "Plateforme sécurisée", desc: "Paiements garantis, assurance incluse, support 7j/7. Concentrez-vous sur le lavage, on gère le reste.", gradient: 'from-orange-500 to-red-500', glow: 'shadow-orange-500/20' },
                  ].map((item, idx) => (
                    <AnimateOnScroll key={idx} delay={idx * 120}>
                      <div className={`group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-3xl p-8 hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-2 hover:${item.glow} hover:shadow-2xl`}>
                        <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {item.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                        <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </AnimateOnScroll>
                  ))}
                </div>
              </div>
            </section>

            {/* ═══════════ HOW IT WORKS ═══════════ */}
            <section className="py-24 bg-[#0d1424] relative overflow-hidden">
              <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <AnimateOnScroll className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                    4 étapes pour <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">commencer</span>
                  </h2>
                </AnimateOnScroll>

                <div className="relative">
                  {/* Connection line */}
                  <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/0 via-teal-500/30 to-teal-500/0" />

                  {[
                    { n: '01', title: 'Inscrivez-vous', desc: 'Formulaire en 3 minutes. Aucun frais.', icon: <Sparkles size={24} />, color: 'teal' },
                    { n: '02', title: 'Validation express', desc: 'Notre équipe vérifie votre profil sous 24h.', icon: <Clock size={24} />, color: 'violet' },
                    { n: '03', title: 'Recevez des missions', desc: 'Acceptez les commandes près de chez vous.', icon: <MapPin size={24} />, color: 'cyan' },
                    { n: '04', title: 'Soyez payé', desc: 'Virement automatique chaque semaine.', icon: <DollarSign size={24} />, color: 'emerald' },
                  ].map((s, idx) => (
                    <AnimateOnScroll key={idx} delay={idx * 100}>
                      <div className={`flex items-center gap-6 md:gap-10 mb-8 last:mb-0 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                        <div className="flex-1">
                          <div className={`bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 md:p-8 hover:bg-white/[0.07] transition-all group`}>
                            <div className="flex items-center gap-4 mb-3">
                              <div className={`w-12 h-12 rounded-xl bg-${s.color}-500/20 flex items-center justify-center text-${s.color}-400 group-hover:scale-110 transition-transform`}>
                                {s.icon}
                              </div>
                              <span className={`text-xs font-black tracking-widest uppercase text-${s.color}-400`}>Etape {s.n}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                            <p className="text-slate-400">{s.desc}</p>
                          </div>
                        </div>
                        <div className="hidden md:flex w-14 h-14 flex-shrink-0 items-center justify-center">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-${s.color}-500 to-${s.color}-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-${s.color}-500/30`}>
                            {s.n}
                          </div>
                        </div>
                        <div className="hidden md:block flex-1" />
                      </div>
                    </AnimateOnScroll>
                  ))}
                </div>
              </div>
            </section>

            {/* ═══════════ EARNINGS SIMULATOR ═══════════ */}
            <section id="simulateur" className="py-24 bg-[#0a0f1a] relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[150px]" />
              <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
                <AnimateOnScroll className="text-center mb-12">
                  <span className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold tracking-widest uppercase mb-6">Simulateur</span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">Combien pouvez-vous <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">gagner ?</span></h2>
                  <p className="text-slate-400 max-w-xl mx-auto">Déplacez le curseur pour estimer vos revenus mensuels en fonction du volume de linge traité.</p>
                </AnimateOnScroll>

                <AnimateOnScroll delay={150}>
                  <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.1] rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full blur-[80px]" />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-slate-300 font-medium">Volume hebdomadaire</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-black text-white">{volume}</span>
                          <span className="text-slate-500 text-lg">kg/sem</span>
                        </div>
                      </div>

                      <input type="range" min="10" max="100" step="5" value={volume} data-testid="simulator-slider"
                        onChange={(e) => setVolume(parseInt(e.target.value, 10))}
                        className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer mb-8 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-400 [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(20,184,166,0.5)] [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none" />

                      <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-white/[0.06] rounded-2xl p-5 text-center border border-white/[0.08]">
                          <p className="text-3xl sm:text-4xl font-black text-teal-400">{revenue}eur</p>
                          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">/ mois</p>
                        </div>
                        <div className="bg-white/[0.06] rounded-2xl p-5 text-center border border-white/[0.08]">
                          <p className="text-3xl sm:text-4xl font-black text-white">{(parseFloat(revenue) / 4).toFixed(0)}eur</p>
                          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">/ semaine</p>
                        </div>
                        <div className="bg-white/[0.06] rounded-2xl p-5 text-center border border-white/[0.08]">
                          <p className="text-3xl sm:text-4xl font-black text-emerald-400">{(parseFloat(revenue) * 12).toFixed(0)}eur</p>
                          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">/ an</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-2xl p-5">
                        <div className="flex items-center gap-3 text-teal-300">
                          <Zap size={20} className="flex-shrink-0" />
                          <p className="text-sm">Calcul basé sur <strong>2.80€/kg</strong> de commission moyenne. Les top Washers gagnent jusqu'à <strong>1200€/mois</strong>.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              </div>
            </section>

            {/* ═══════════ TESTIMONIALS ═══════════ */}
            <section className="py-24 bg-[#0d1424]">
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <AnimateOnScroll className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl font-black text-white">Ils ont rejoint <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Kilolab</span></h2>
                </AnimateOnScroll>

                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { name: 'Marie L.', city: 'Lille', quote: "Je gagne 450€/mois en complément de mon mi-temps. C'est flexible et ça me permet de rester à la maison avec mes enfants.", stars: 5, revenue: '450€/mois' },
                    { name: 'Karim B.', city: 'Nantes', quote: "Étudiant, je fais 3-4 machines par jour entre les cours. L'app est simple et les paiements tombent chaque semaine.", stars: 5, revenue: '320€/mois' },
                    { name: 'Sophie R.', city: 'Bordeaux', quote: "Retraitée, je cherchais une activité. Kilolab m'a permis de rencontrer des voisins et de gagner un complément de retraite.", stars: 5, revenue: '280€/mois' },
                  ].map((t, idx) => (
                    <AnimateOnScroll key={idx} delay={idx * 100}>
                      <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8 hover:bg-white/[0.07] transition-all">
                        <div className="flex gap-1 mb-4">
                          {Array.from({ length: t.stars }).map((_, i) => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />)}
                        </div>
                        <p className="text-slate-300 leading-relaxed mb-6 italic">"{t.quote}"</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-bold">{t.name}</p>
                            <p className="text-slate-500 text-sm">{t.city}</p>
                          </div>
                          <div className="bg-teal-500/15 border border-teal-500/30 text-teal-400 px-3 py-1 rounded-full text-xs font-bold">{t.revenue}</div>
                        </div>
                      </div>
                    </AnimateOnScroll>
                  ))}
                </div>
              </div>
            </section>

            {/* ═══════════ FINAL CTA ═══════════ */}
            <section className="py-24 bg-[#0a0f1a] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 via-transparent to-transparent" />
              <div className="max-w-3xl mx-auto px-4 text-center relative">
                <AnimateOnScroll>
                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                    Pret a transformer votre<br /><span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">machine en revenus ?</span>
                  </h2>
                  <p className="text-xl text-slate-400 mb-10">Inscription gratuite. Aucun engagement. Premiers revenus sous 48h.</p>
                  <button data-testid="cta-final" onClick={() => setStep(1)}
                    className="group inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl font-bold text-xl transition-all duration-300 shadow-[0_0_60px_rgba(20,184,166,0.3)] hover:shadow-[0_0_100px_rgba(20,184,166,0.5)] hover:scale-[1.03] active:scale-[0.97]">
                    Devenir Washer maintenant
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" size={24} />
                  </button>
                </AnimateOnScroll>
              </div>
            </section>

            <Footer />
          </>
        )}

        {/* ═══════════ FORM STEPS ═══════════ */}
        {step > 0 && step < 4 && (
          <div className="pt-28 pb-20 px-4 max-w-4xl mx-auto">
            {/* Progress */}
            <div className="flex gap-2 mb-10 max-w-md mx-auto">
              {[1, 2, 3].map((num) => (
                <div key={num} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= num ? 'bg-gradient-to-r from-teal-500 to-cyan-500' : 'bg-white/10'}`} />
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* STEP 1 */}
              {step === 1 && (
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8 md:p-12 backdrop-blur-sm animate-fade-in">
                  <h2 className="text-2xl font-bold text-white mb-2">Vos informations</h2>
                  <p className="text-slate-400 mb-8">Completez votre profil en quelques minutes.</p>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Nom complet *</label>
                      <input required type="text" placeholder="Thomas Dupont" value={formData.fullName}
                        onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                        className="w-full p-4 bg-white/[0.06] border border-white/[0.12] rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Email *</label>
                        <input required type="email" placeholder="thomas@email.com" value={formData.email}
                          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                          className="w-full p-4 bg-white/[0.06] border border-white/[0.12] rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Telephone *</label>
                        <input required type="tel" placeholder="06 12 34 56 78" value={formData.phone}
                          onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                          className="w-full p-4 bg-white/[0.06] border border-white/[0.12] rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Ville *</label>
                        <input required type="text" placeholder="Lille" value={formData.city}
                          onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                          className="w-full p-4 bg-white/[0.06] border border-white/[0.12] rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Code postal *</label>
                        <input required type="text" inputMode="numeric" placeholder="59000" value={formData.postalCode}
                          onChange={(e) => setFormData((p) => ({ ...p, postalCode: e.target.value }))}
                          className="w-full p-4 bg-white/[0.06] border border-white/[0.12] rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Adresse complete *</label>
                      <input required type="text" placeholder="12 rue de la Republique" value={formData.address}
                        onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                        className="w-full p-4 bg-white/[0.06] border border-white/[0.12] rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition" />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button type="button" onClick={() => setStep(0)} className="px-6 py-4 border border-white/20 text-slate-300 font-semibold rounded-xl hover:bg-white/5 transition">Retour</button>
                    <button type="button" onClick={() => { if (!canGoStep2()) { toast.error('Remplissez tous les champs.'); return; } setStep(2); }}
                      className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all">Suivant</button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8 md:p-12 backdrop-blur-sm animate-fade-in">
                  <h2 className="text-2xl font-bold text-white mb-2">Verification d'identite</h2>
                  <p className="text-slate-400 mb-8">Obligatoire pour la securite de la communaute.</p>
                  <div className="mb-8 border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-teal-500/50 hover:bg-teal-500/5 transition-all cursor-pointer relative group">
                    {!formData.idCardUrl ? (
                      <>
                        <Upload className="mx-auto mb-4 text-slate-500 group-hover:text-teal-400 transition" size={48} />
                        <p className="font-bold text-white text-lg mb-2">CNI ou Passeport</p>
                        <p className="text-sm text-slate-500">JPG, PNG ou PDF - Max 10MB</p>
                        <input type="file" accept="image/*,application/pdf" className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => e.target.files?.[0] && uploadIdCard(e.target.files[0])} />
                      </>
                    ) : (
                      <div className="text-teal-400 font-bold flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center"><Check size={32} /></div>
                        <p className="text-xl">Document recu</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(1)} className="px-6 py-4 border border-white/20 text-slate-300 font-semibold rounded-xl hover:bg-white/5 transition">Retour</button>
                    <button type="button" onClick={() => setStep(3)} disabled={!formData.idCardUrl}
                      className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl disabled:opacity-30 hover:shadow-lg hover:shadow-teal-500/25 transition-all">Suivant</button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="grid lg:grid-cols-2 gap-8 animate-fade-in">
                  <div className="lg:sticky lg:top-28 h-fit">
                    <div className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-3xl p-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[60px]" />
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative"><TrendingUp /> Potentiel de gains</h3>
                      <div className="mb-6 relative">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-teal-100 text-sm">Volume estime</span>
                          <span className="text-2xl font-black text-white">{volume}kg<span className="text-sm text-teal-200 font-normal">/sem</span></span>
                        </div>
                        <input type="range" min="10" max="100" step="5" value={volume} onChange={(e) => setVolume(parseInt(e.target.value, 10))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white" />
                      </div>
                      <div className="bg-white/15 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-center">
                        <p className="text-teal-100 text-xs uppercase tracking-widest mb-1">Revenus mensuels</p>
                        <p className="text-5xl font-black text-white mb-1">{revenue}eur</p>
                        <p className="text-teal-200 text-sm">Paye chaque semaine</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-6">Charte Qualite & Legal</h2>
                    <div className="space-y-4 mb-8">
                      <div className="p-5 bg-white/[0.04] rounded-xl border border-white/[0.08]">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2"><Sparkles size={18} className="text-teal-400" /> Materiel requis</h4>
                        {[
                          { key: 'has_machine', label: 'Machine a laver propre et entretenue' },
                          { key: 'has_scale', label: "J'acheterai un peson digital (~10eur)" },
                          { key: 'use_hypoallergenic', label: 'Lessive hypoallergenique uniquement' },
                        ].map((item) => (
                          <label key={item.key} className="flex items-start gap-3 mb-3 cursor-pointer group">
                            <input type="checkbox" className="mt-1 w-5 h-5 accent-teal-500 cursor-pointer"
                              checked={(formData as any)[item.key]} onChange={(e) => setFormData((p) => ({ ...p, [item.key]: e.target.checked }))} />
                            <span className="text-sm text-slate-400 group-hover:text-white transition">{item.label}</span>
                          </label>
                        ))}
                      </div>

                      <div className="p-5 bg-orange-500/10 rounded-xl border border-orange-500/20">
                        <h4 className="font-bold text-orange-300 mb-4 flex items-center gap-2"><ShieldCheck size={18} /> Mentions legales</h4>
                        {[
                          { key: 'legal_capacity', label: "Je suis majeur(e) et apte a exercer une activite independante" },
                          { key: 'accept_terms', label: 'J\'accepte les CGU/CGV et le statut d\'independant' },
                          { key: 'data_consent', label: 'J\'accepte le traitement de mes donnees (RGPD)' },
                        ].map((item) => (
                          <label key={item.key} className="flex items-start gap-3 mb-3 cursor-pointer group">
                            <input type="checkbox" className="mt-1 w-5 h-5 accent-orange-500 cursor-pointer"
                              checked={(formData as any)[item.key]} onChange={(e) => setFormData((p) => ({ ...p, [item.key]: e.target.checked }))} />
                            <span className="text-sm text-orange-200/80 group-hover:text-orange-200 transition">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setStep(2)} className="px-6 py-4 border border-white/20 text-slate-300 font-semibold rounded-xl hover:bg-white/5 transition">Retour</button>
                      <button type="submit" disabled={loading}
                        className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl disabled:opacity-30 hover:shadow-lg hover:shadow-teal-500/25 transition-all flex items-center justify-center gap-2">
                        {loading ? <><Loader2 className="animate-spin" size={20} /> Envoi...</> : 'Valider ma candidature'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* STEP 4 SUCCESS */}
        {step === 4 && (
          <div className="pt-28 pb-20 px-4 max-w-2xl mx-auto">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-12 text-center backdrop-blur-sm animate-fade-in">
              <div className="w-24 h-24 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={48} />
              </div>
              <h2 className="text-3xl font-black text-white mb-4">Candidature recue !</h2>
              <p className="text-lg text-slate-400 mb-8">Notre equipe vous contactera sous <strong className="text-white">24h</strong>.</p>
              <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-6 mb-8 text-left">
                <p className="text-sm font-bold text-teal-300 mb-3">Preparez votre materiel :</p>
                <ul className="text-sm text-teal-200/70 space-y-2">
                  <li className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> Peson digital (~10eur)</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> Lessive hypoallergenique</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> Machine a laver propre</li>
                </ul>
              </div>
              <button onClick={() => navigate('/')} className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition">Retour a l'accueil</button>
            </div>
          </div>
        )}

        {step > 0 && <Footer />}
      </div>
    </>
  );
}
