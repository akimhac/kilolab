import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Cookies() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Politique de Gestion des Cookies</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
          <p className="text-slate-400">Dernière mise à jour : 15 décembre 2024</p>
          
          <h2 className="text-2xl font-bold text-white mt-8">1. Qu'est-ce qu'un cookie ?</h2>
          <p>Un cookie est un petit fichier texte stocké sur votre appareil lors de votre visite sur notre site.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8">2. Cookies utilisés</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cookies essentiels</strong> : Nécessaires au fonctionnement du site (authentification)</li>
            <li><strong>Cookies analytiques</strong> : Pour améliorer nos services (avec votre consentement)</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-white mt-8">3. Gestion de vos préférences</h2>
          <p>Vous pouvez à tout moment modifier vos préférences de cookies via les paramètres de votre navigateur.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8">4. Cookies tiers</h2>
          <p>Nous n'utilisons pas de cookies publicitaires tiers sur notre plateforme.</p>
          
          <p className="text-slate-500 text-sm mt-12">Pour toute question : contact@kilolab.fr</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}