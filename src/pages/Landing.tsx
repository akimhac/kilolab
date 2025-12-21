import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import PriceComparator from '../components/PriceComparator';
import Footer from '../components/Footer';
// import CookieConsent from '../components/CookieConsent';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      <Hero />
      <TrustBar />
      <HowItWorks />
      
      {/* ON REACTIVE LE RESTE */}
      <Features />
      <PriceComparator />
      <Footer />
    </div>
  );
}
