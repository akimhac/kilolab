import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CGU() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Conditions Générales d'Utilisation</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
          <p className="text-slate-400">Dernière mise à jour : 15 décembre 2024</p>
          
          <h2 className="text-2xl font-bold text-white mt-8">1. Acceptation des CGU</h2>
          <p>En utilisant la plateforme Kilolab, vous acceptez les présentes Conditions Générales d'Utilisation.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8">2. Création de compte</h2>
          <p>L'inscription sur Kilolab nécessite la création d'un compte avec une adresse email valide.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8">3. Utilisation du service</h2>
          <p>Vous vous engagez à utiliser le service conformément aux lois en vigueur et dans le respect des partenaires pressings.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8">4. Responsabilités</h2>
          <p>Kilolab agit en tant qu'intermédiaire entre les clients et les pressings partenaires. La qualité du service est assurée par les artisans partenaires.</p>
          
          <p className="text-slate-500 text-sm mt-12">Pour toute question : contact@kilolab.fr</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
