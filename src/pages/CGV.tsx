import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CGV() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Conditions Générales de Vente</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
          <p className="text-slate-400">Dernière mise à jour : 15 décembre 2024</p>
          
          <h2 className="text-2xl font-bold text-white mt-8">1. Objet</h2>
          <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre Kilolab et ses clients pour tout service de pressing au kilo.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8">2. Prix</h2>
          <p>Les prix sont affichés en euros TTC. Le tarif standard est de 3€/kg pour le service standard et 5€/kg pour le service express.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8">3. Paiement</h2>
          <p>Le paiement s'effectue en ligne par carte bancaire ou en magasin auprès du pressing partenaire.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8">4. Réclamations</h2>
          <p>Toute réclamation doit être adressée à contact@kilolab.fr dans les 48h suivant la récupération du linge.</p>
          
          <p className="text-slate-500 text-sm mt-12">Pour toute question : contact@kilolab.fr</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
