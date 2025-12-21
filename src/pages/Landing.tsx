import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import PriceComparator from '../components/PriceComparator';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';

export default function Landing() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
      <SEOHead />
      <Navbar />
      
      {/* VOS COMPOSANTS D'ORIGINE (NE BOUGENT PAS) */}
      <Hero />
      <TrustBar />
      <PriceComparator />
      {/* <HowItWorks /> */}

      {/* --- SECTION BALI AMÉLIORÉE (AVEC IMAGES) --- */}
      <section className="bg-white py-24 px-4 border-t border-slate-100 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">

           {/* BLOC IMAGES (A GAUCHE) */}
           <div className="flex-1 relative hidden md:block">
               <div className="grid grid-cols-2 gap-4 relative z-10">
                   <img 
                       src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop" 
                       alt="Bali Inspiration" 
                       className="rounded-3xl shadow-xl object-cover h-72 w-full mb-12 transform -rotate-3 hover:rotate-0 transition duration-500"
                   />
                   <img 
                       src="https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?q=80&w=800&auto=format&fit=crop" 
                       alt="Linge Propre Kilolab" 
                       className="rounded-3xl shadow-xl object-cover h-72 w-full mt-12 transform rotate-3 hover:rotate-0 transition duration-500"
                   />
               </div>
               {/* Décoration d'arrière-plan */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-teal-50 to-indigo-50 rounded-full blur-3xl opacity-50 -z-10"></div>
           </div>

           {/* BLOC TEXTE (A DROITE) */}
           <div className="flex-1 text-center md:text-left">
               <span className="text-teal-600 font-bold uppercase tracking-wider text-sm inline-block mb-4 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Notre Histoire</span>
               <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
                   De la douceur de Bali <br/>à l'exigence de Paris.
               </h2>
               <p className="text-slate-600 leading-relaxed text-lg mb-6">
                   Là-bas, le pressing au poids est la norme : simple, direct, sans artifices. 
                   Nous avons eu le coup de foudre pour cette transparence radicale.
               </p>
               <p className="text-slate-600 leading-relaxed text-lg font-medium bg-white p-6 rounded-2xl border border-slate-100 shadow-sm inline-block">
                   Kilolab importe ce concept en France. Fini le casse-tête des tarifs à la pièce.
                   <br/><span className="text-teal-600 font-bold text-xl">Juste le poids du linge propre.</span>
               </p>
           </div>

        </div>
      </section>
      {/* ------------------------------------------ */}

      <Footer />
    </div>
  );
}
