import Navbar from '../components/Navbar';
// Les composants sont masqués pour l'instant :
// import Hero from '../components/Hero';
// import TrustBar from '../components/TrustBar';
// import HowItWorks from '../components/HowItWorks';
// import Features from '../components/Features';
// import PriceComparator from '../components/PriceComparator';
// import Footer from '../components/Footer';
// import CookieConsent from '../components/CookieConsent';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* On teste seulement la Navbar */}
      <Navbar />
      
      <main className="pt-32 px-4 text-center">
        <div className="p-8 border-4 border-teal-500 rounded-xl max-w-2xl mx-auto">
          <h1 className="text-4xl font-black mb-4">MODE DIAGNOSTIC</h1>
          <p className="text-xl text-slate-600">
            Si tu vois ce texte, c'est une EXCELLENTE nouvelle.
            <br />
            Cela signifie que le "cœur" du site fonctionne.
            <br />
            Le bug se cache dans une des sections masquées.
          </p>
        </div>
      </main>
    </div>
  );
}
