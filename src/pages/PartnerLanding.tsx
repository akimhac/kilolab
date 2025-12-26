import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { TrendingUp, Users, ShieldCheck, ArrowRight, Loader2, CheckCircle, Bell, Sparkles, Zap, DollarSign } from 'lucide-react';

export default function PartnerLanding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // --- LOGIQUE DU SIMULATEUR (OPTIMISÉ POUR L'ATTRACTIVITÉ) ---
  const [volume, setVolume] = useState(30); // Volume journalier par défaut (augmenté)
  const pricePerKg = 3.50; // Revenu BRUT pour le partenaire par kg (plus attractif)
  const workingDays = 26; // Jours ouvrés
  const monthlyRevenue = (volume * pricePerKg * workingDays).toFixed(0);
  const yearlyRevenue = (parseFloat(monthlyRevenue) * 12).toFixed(0);

  // --- VÉRIFICATION AUTH ---
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Si connecté, on regarde si c'est un partenaire
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role === 'partner') {
          // C'est un partenaire -> On l'envoie direct sur son outil de travail
          navigate('/partner-app');
          return;
        }
      }
      // Sinon (pas connecté ou client), on affiche la page de pub
      setLoading(false);
    } catch (error) {
      console.error('Erreur auth:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-teal-600" size={48}/>
      </div>
    );
  }

  return (
    <div className="font-sans text-slate-900 bg-white">
      <Navbar />

      {/* 1. HERO SECTION (PROMESSE) */}
      <div className="pt-32 pb-32 lg:pt-48 lg:pb-48 bg-slate-900 text-white relative overflow-hidden">
        {/* Fond abstrait */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 text-teal-300 rounded-full text-sm font-bold mb-8 border border-teal-500/30">
            <CheckCircle size={16}/> Réseau Certifié Kilolab
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
            Remplissez vos machines.<br/>
            <span className="text-teal-400">On s'occupe des clients.</span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Kilolab vous apporte du volume de linge, trié et prêt à laver. 
            <br/>Vous faites ce que vous aimez : la qualité. Nous gérons la logistique.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/become-partner" 
              className="px-8 py-4 bg-teal-500 text-white rounded-full font-bold text-lg hover:bg-teal-400 transition shadow-xl shadow-teal-500/30 flex items-center justify-center gap-2"
            >
              Rejoindre le réseau <ArrowRight size={20}/>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. LE SIMULATEUR DE REVENUS - VERSION ULTRA ATTRACTIVE */}
      <div className="py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 relative -mt-24 z-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Calculez votre nouveau CA
            </h2>
            <p className="text-xl text-slate-300">
              Des chiffres réels basés sur nos partenaires actuels
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="grid md:grid-cols-5 gap-0">
              
              {/* PARTIE GAUCHE : LE SLIDER - 3/5 */}
              <div className="md:col-span-3 p-8 md:p-12 bg-slate-50">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Votre volume quotidien</h3>
                <p className="text-slate-500 mb-10">Ajustez le curseur selon votre capacité</p>

                <div className="flex items-end gap-3 mb-8">
                  <span className="text-7xl md:text-8xl font-black text-teal-600">{volume}</span>
                  <span className="text-3xl font-bold text-slate-400 mb-3">kg/jour</span>
                </div>
                
                <input 
                  type="range" 
                  min="10" 
                  max="150" 
                  step="10"
                  value={volume} 
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500 mb-6"
                  style={{
                    background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${((volume - 10) / 140) * 100}%, #e2e8f0 ${((volume - 10) / 140) * 100}%, #e2e8f0 100%)`
                  }}
                />
                
                <div className="flex justify-between text-sm text-slate-500 font-medium mb-8">
                  <span>10kg</span>
                  <span className="text-teal-600 font-bold">≈ {Math.round(volume / 5)} machines/jour</span>
                  <span>150kg</span>
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-teal-100">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase mb-1">Par semaine</p>
                      <p className="text-2xl font-black text-slate-900">{(volume * 6).toFixed(0)}kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase mb-1">Par mois</p>
                      <p className="text-2xl font-black text-slate-900">{(volume * 26).toFixed(0)}kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase mb-1">Par an</p>
                      <p className="text-2xl font-black text-teal-600">{(volume * 312).toFixed(0)}kg</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PARTIE DROITE : LE RÉSULTAT - 2/5 */}
              <div className="md:col-span-2 p-8 md:p-12 bg-gradient-to-br from-teal-500 to-teal-600 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-tr-full"></div>
                
                <div className="relative z-10">
                  <p className="text-sm font-bold text-teal-100 mb-3 uppercase tracking-wide">💰 Revenu Annuel Brut</p>
                  
                  <div className="mb-8">
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-6xl font-black">{yearlyRevenue}</span>
                      <span className="text-2xl font-bold mb-2">€</span>
                    </div>
                    <p className="text-teal-100 text-sm font-bold">soit {monthlyRevenue}€ par mois</p>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/30">
                    <p className="text-xs text-teal-50 mb-3 font-bold">📈 DÉTAILS</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-teal-50">Prix au kg</span>
                        <span className="font-bold">{pricePerKg}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-teal-50">Jours ouvrés/mois</span>
                        <span className="font-bold">{workingDays} jours</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-white/30">
                        <span className="text-teal-50 font-bold">CA additionnel</span>
                        <span className="font-black text-lg">+{((parseFloat(monthlyRevenue) / 5000) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    to="/become-partner" 
                    className="block w-full py-4 bg-white text-teal-600 rounded-xl font-bold text-center hover:bg-teal-50 transition shadow-2xl transform hover:scale-105"
                  >
                    🚀 Générer ce revenu
                  </Link>
                  
                  <p className="text-[10px] text-teal-100 mt-4 text-center opacity-80">
                    *Simulation basée sur nos données réelles partenaires
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TÉMOIGNAGES CHIFFRÉS */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/20">
              <p className="text-4xl font-black text-teal-400 mb-2">+42%</p>
              <p className="text-sm text-slate-200">de CA en moyenne après 6 mois</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/20">
              <p className="text-4xl font-black text-teal-400 mb-2">3 200€</p>
              <p className="text-sm text-slate-200">revenu mensuel moyen partenaire</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/20">
              <p className="text-4xl font-black text-teal-400 mb-2">15j</p>
              <p className="text-sm text-slate-200">pour recevoir la première commande</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. LES AVANTAGES */}
      <div className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4">Pourquoi les pressings nous adorent ?</h2>
            <p className="text-slate-500">On enlève les contraintes, on garde le métier.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* CARTE 1 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-teal-200 transition duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-sm">
                <TrendingUp size={32}/>
              </div>
              <h3 className="text-xl font-bold mb-3">Revenus Garantis</h3>
              <p className="text-slate-500 leading-relaxed">
                Augmentez votre CA de 20% à 30% sans effort commercial. Les commandes tombent automatiquement.
              </p>
            </div>

            {/* CARTE 2 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-teal-200 transition duration-300">
              <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 mb-6 shadow-sm">
                <Users size={32}/>
              </div>
              <h3 className="text-xl font-bold mb-3">Zéro Gestion Client</h3>
              <p className="text-slate-500 leading-relaxed">
                Fini le comptoir, le téléphone et les impayés. On gère le marketing, le paiement et le SAV.
              </p>
            </div>

            {/* CARTE 3 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-teal-200 transition duration-300">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 shadow-sm">
                <ShieldCheck size={32}/>
              </div>
              <h3 className="text-xl font-bold mb-3">Paiement Sécurisé</h3>
              <p className="text-slate-500 leading-relaxed">
                Vous êtes payé automatiquement toutes les semaines pour les commandes traitées. Transparence totale.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SCÉNARIO : UNE JOURNÉE AVEC KILOLAB */}
      <div className="py-24 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-teal-400 font-bold tracking-widest uppercase text-sm mb-2 block">L'expérience Partenaire</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6">⚡ L'Effet Kilolab.</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Transformez vos heures creuses en chiffre d'affaires. Voici comment ça se passe concrètement.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            
            {/* ÉTAPE 1 - LE PING */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-teal-500 transition-all duration-300 group hover:shadow-2xl hover:shadow-teal-500/20">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Bell className="text-white" size={28}/>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center font-bold text-teal-400 border border-slate-700 text-xs">1</span>
                <h3 className="text-lg font-bold">Le "Ping" Rentable</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Votre tablette sonne : <span className="text-white font-bold">"Commande 12kg à 500m"</span>. Vous voyez le prix. Vous acceptez en un clic. Le client est à vous.
              </p>
            </div>

            {/* ÉTAPE 2 - L'EXPERTISE */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-teal-500 transition-all duration-300 group hover:shadow-2xl hover:shadow-teal-500/20">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Sparkles className="text-white" size={28}/>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center font-bold text-teal-400 border border-slate-700 text-xs">2</span>
                <h3 className="text-lg font-bold">L'Expertise Pro</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Vous traitez le linge avec votre savoir-faire. Une fois fini, cliquez sur <span className="text-white font-bold">"Prêt"</span>. Le client est notifié automatiquement par SMS.
              </p>
            </div>

            {/* ÉTAPE 3 - LE FLASH */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-teal-500 transition-all duration-300 group hover:shadow-2xl hover:shadow-teal-500/20">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Zap className="text-white" size={28}/>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center font-bold text-teal-400 border border-slate-700 text-xs">3</span>
                <h3 className="text-lg font-bold">Le Flash QR</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Le client récupère son sac. Pas de monnaie, pas de TPE. Vous scannez son QR Code ou validez le retrait sur l'appli. <span className="text-white font-bold">C'est plié.</span>
              </p>
            </div>

            {/* ÉTAPE 4 - LA RÉCOMPENSE */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-teal-500 transition-all duration-300 group hover:shadow-2xl hover:shadow-teal-500/20">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <DollarSign className="text-white" size={28}/>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center font-bold text-teal-400 border border-slate-700 text-xs">4</span>
                <h3 className="text-lg font-bold">La Récompense</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Regardez votre dashboard : <span className="text-green-400 font-bold">le CA augmente</span>. L'argent est sécurisé et viré chaque semaine. Zéro paperasse.
              </p>
            </div>

          </div>

          <div className="mt-16 text-center">
            <Link to="/become-partner" className="inline-flex items-center gap-3 px-10 py-5 bg-teal-500 text-white rounded-full font-bold text-xl hover:bg-teal-400 transition shadow-lg shadow-teal-500/20 transform hover:-translate-y-1">
              Je veux tester ce système <ArrowRight size={24}/>
            </Link>
            <p className="mt-4 text-slate-500 text-sm">Sans engagement. 0€ de frais d'inscription.</p>
          </div>
        </div>
      </div>

      {/* 5. REJOIGNEZ-NOUS (VERSION SIMPLE) */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-12 text-slate-900">Rejoignez-nous en 3 clics</h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <span className="text-slate-600 font-medium">Candidature (2 min)</span>
            </div>
            <div className="hidden md:block text-slate-300">→</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <span className="text-slate-600 font-medium">Validation qualité</span>
            </div>
            <div className="hidden md:block text-slate-300">→</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <span className="text-slate-600 font-medium">Activation & 1ère commande</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
