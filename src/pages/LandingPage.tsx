import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Clock, Check, X as XIcon, Menu, X, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [partnerCount, setPartnerCount] = useState(0);
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase.from('partners').select('*', { count: 'exact', head: true }).eq('is_active', true);
      setPartnerCount(count || 0);
    };
    fetchCount();
  }, []);

  return (
    <div className="bg-slate-950 font-sans text-slate-100 selection:bg-teal-500 selection:text-white overflow-x-hidden">
      
      {/* NAVIGATION */}
      <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-tr from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center text-slate-900 font-bold text-xl shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform">K</div>
              <span className="text-xl font-bold tracking-tight text-white">Kilolab</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/pricing" className="text-sm font-medium text-slate-400 hover:text-white transition">Comparateur</Link>
              <Link to="/how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition">Fonctionnement</Link>
              <span className="h-4 w-px bg-white/10"></span>
              <Link to="/become-partner" className="text-sm font-bold text-teal-400 hover:text-teal-300 transition flex items-center gap-1">
                Espace Pro <span className="bg-teal-500/20 text-teal-400 text-[10px] px-2 py-0.5 rounded-full">{partnerCount > 0 ? partnerCount : '1800+'}</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-white hover:text-teal-400 transition">Connexion</Link>
              <button onClick={() => navigate('/partners-map')} className="bg-white text-slate-950 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-teal-50 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Trouver un pressing
              </button>
            </div>
            
            <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-white/10 p-6 space-y-4">
            <Link to="/pricing" className="block text-white font-medium">Tarifs</Link>
            <Link to="/how-it-works" className="block text-white font-medium">Comment ça marche</Link>
            <Link to="/become-partner" className="block text-teal-400 font-medium">Devenir Partenaire</Link>
            <Link to="/login" className="block text-white font-medium">Connexion</Link>
            <button onClick={() => navigate('/partners-map')} className="w-full py-3 bg-teal-500 text-white rounded-xl font-bold">
              Trouver un pressing
            </button>
          </div>
        )}
      </nav>

      {/* HERO IMMERSIF */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=1920&q=80" alt="Background" className="w-full h-full object-cover scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950" />
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-teal-300 text-sm font-bold mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              Le nouveau standard du pressing
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-8 leading-[1.1]">
              Votre temps est précieux.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-400">Pas votre lessive.</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Confiez-nous votre linge <span className="text-white font-bold">au kilo</span>. Nous le lavons, séchons et plions pour vous. Moins cher qu'un café par jour.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <button onClick={() => navigate('/partners-map')} className="group px-8 py-4 bg-teal-500 text-white rounded-full font-bold text-lg hover:bg-teal-400 transition shadow-[0_10px_40px_-10px_rgba(20,184,166,0.6)] flex items-center justify-center gap-3">
                Me libérer de la corvée <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/pricing')} className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/10 transition">
                Voir les tarifs (3€/kg)
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm font-medium text-slate-400 flex-wrap">
              <div className="flex items-center gap-2"><Check className="text-teal-400" size={16}/> Assurance incluse</div>
              <div className="flex items-center gap-2"><Check className="text-teal-400" size={16}/> Prêt en 24h chrono</div>
              <div className="flex items-center gap-2"><Check className="text-teal-400" size={16}/> Satisfait ou relavé</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* COMPARATEUR */}
      <section className="py-32 bg-white text-slate-900 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">Arrêtez de brûler votre argent.</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">Le modèle traditionnel "à la pièce" est obsolète. Passez au modèle "au poids".</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-200 opacity-60 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500"><XIcon /></div>
                <h3 className="text-2xl font-bold text-slate-400">Pressing Traditionnel</h3>
              </div>
              <div className="space-y-6 text-lg font-medium text-slate-500">
                <div className="flex justify-between border-b border-slate-200 pb-4"><span>3 Chemises</span><span>24.00€</span></div>
                <div className="flex justify-between border-b border-slate-200 pb-4"><span>2 Pantalons</span><span>20.00€</span></div>
                <div className="flex justify-between border-b border-slate-200 pb-4"><span>1 Manteau</span><span>25.00€</span></div>
                <div className="pt-4 text-right text-red-400 text-3xl font-bold">Total: 69.00€</div>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} className="p-10 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px] -mr-16 -mt-16"></div>
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white"><Check strokeWidth={3} /></div>
                <h3 className="text-2xl font-bold">La Méthode Kilolab</h3>
              </div>
              <div className="space-y-6 text-lg font-medium relative z-10">
                <div className="flex justify-between border-b border-white/10 pb-4"><span>3 Chemises (0.6kg)</span><span className="text-teal-400">1.80€</span></div>
                <div className="flex justify-between border-b border-white/10 pb-4"><span>2 Pantalons (1kg)</span><span className="text-teal-400">3.00€</span></div>
                <div className="flex justify-between border-b border-white/10 pb-4"><span>1 Manteau (1.5kg)</span><span className="text-teal-400">4.50€</span></div>
                <div className="pt-6 mt-4 bg-white/5 rounded-2xl p-6 text-center border border-white/10">
                  <p className="text-sm text-slate-400 mb-2">Total Kilolab</p>
                  <p className="text-5xl font-extrabold text-white mb-2">9.30€</p>
                  <p className="text-teal-400 font-bold bg-teal-500/10 inline-block px-3 py-1 rounded-full text-sm">Vous économisez 59.70€</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BENTO GRID */}
      <section className="py-32 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-16 text-center">L'expérience pressing, réinventée.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6"><Clock size={28}/></div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">J+1 Garanti.</h3>
              <p className="text-slate-500">Déposez aujourd'hui. Récupérez demain. Aussi simple que ça.</p>
            </div>

            <div className="md:col-span-2 bg-slate-900 text-white rounded-[2.5rem] p-10 relative overflow-hidden">
              <div className="relative z-10 max-w-md">
                <h3 className="text-3xl font-bold mb-4">Ne triez plus rien.</h3>
                <p className="text-slate-400 text-lg mb-8">Mettez tout en vrac dans le sac Kilolab. Nous trions les couleurs et les matières pour vous.</p>
                <button onClick={() => navigate('/how-it-works')} className="bg-teal-500 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-teal-400 transition">
                  Voir comment ça marche
                </button>
              </div>
            </div>

            <div className="md:col-span-3 bg-teal-50 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-12 border border-teal-100">
              <div className="flex-1">
                <div className="inline-block bg-teal-200/50 text-teal-800 px-3 py-1 rounded-full text-xs font-bold mb-4">Éco-Responsable</div>
                <h3 className="text-3xl font-bold text-teal-900 mb-4">Moins d'eau, moins de produits.</h3>
                <p className="text-teal-800/70 text-lg">Nos machines industrielles optimisent la consommation d'eau et utilisent des détergents biodégradables.</p>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="text-9xl font-black text-teal-200/50 select-none">-40%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RÉSEAU */}
      <section className="relative py-32 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }} className="w-24 h-24 bg-teal-500 mx-auto rounded-3xl flex items-center justify-center text-white mb-8 shadow-[0_0_50px_rgba(20,184,166,0.4)]">
            <MapPin size={40} />
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight">
            Nous sommes partout.<br/><span className="text-slate-500">Vraiment partout.</span>
          </h2>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-6">
              <div className="text-left">
                <p className="text-sm text-slate-400 uppercase font-bold tracking-wider">Réseau actuel</p>
                <p className="text-4xl font-bold text-white">{partnerCount > 0 ? partnerCount.toLocaleString() : '1,800+'}</p>
                <p className="text-xs text-teal-400">Points de collecte</p>
              </div>
              <div className="h-12 w-px bg-white/10"></div>
              <div className="text-right">
                <p className="text-sm text-slate-400 uppercase font-bold tracking-wider">Couverture</p>
                <p className="text-4xl font-bold text-white">92%</p>
                <p className="text-xs text-teal-400">Des villes &gt; 10k hab.</p>
              </div>
            </div>
            
            <div className="text-left">
              <h3 className="text-white font-bold text-lg mb-2">Vous gérez un pressing ?</h3>
              <p className="text-slate-400 text-sm mb-6">Rejoignez le réseau Kilolab sans frais d'entrée.</p>
              <button onClick={() => navigate('/become-partner')} className="w-full py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-teal-500 hover:text-white transition-colors flex items-center justify-center gap-2 group">
                Devenir partenaire <ArrowRight className="group-hover:translate-x-1 transition-transform"/>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
          <div>
            <Link to="/" className="text-2xl font-bold text-white mb-6 block">Kilolab.</Link>
            <p className="mb-6">La première plateforme de pressing au kilo en France.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Service</h4>
            <ul className="space-y-4">
              <li><Link to="/partners-map" className="hover:text-teal-400 transition">Trouver un pressing</Link></li>
              <li><Link to="/pricing" className="hover:text-teal-400 transition">Tarifs</Link></li>
              <li><Link to="/how-it-works" className="hover:text-teal-400 transition">Comment ça marche</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Société</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="hover:text-teal-400 transition">À propos</Link></li>
              <li><Link to="/contact" className="hover:text-teal-400 transition">Contact</Link></li>
              <li><Link to="/become-partner" className="text-teal-400 font-bold">Devenir Partenaire</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Légal</h4>
            <ul className="space-y-4">
              <li><Link to="/legal" className="hover:text-teal-400 transition">CGU</Link></li>
              <li><Link to="/privacy" className="hover:text-teal-400 transition">Confidentialité</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 text-center">
          <p>© 2025 Kilolab. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
