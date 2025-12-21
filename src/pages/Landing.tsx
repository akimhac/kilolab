import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import HowItWorks from '../components/HowItWorks';
// import Features from '../components/Features';
// import PriceComparator from '../components/PriceComparator';
// import Footer from '../components/Footer';
// import CookieConsent from '../components/CookieConsent';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      <Hero />
      <TrustBar />
      
      {/* ON TESTE CELUI-LÀ MAINTENANT */}
      <HowItWorks />

      <main className="py-16 text-center">
        <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl max-w-xl mx-auto bg-slate-50">
          <p className="text-slate-500">
            Si tu vois les étapes 1-2-3 au-dessus ☝️, on avance !
            <br/>(Il restera Features et Footer)
          </p>
        </div>
      </main>
    </div>
  );
}
