import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Privacy() {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      <Navbar />
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto prose">
        <h1 className="text-3xl font-bold mb-8">Politique de Confidentialité</h1>
        <p>Vos données (email, adresse, téléphone) sont utilisées uniquement pour le traitement de vos commandes.</p>
        <p>Elles ne sont jamais revendues à des tiers.</p>
        <p>Vous disposez d'un droit d'accès et de suppression sur simple demande à contact@kilolab.fr.</p>
      </div>
      <Footer />
    </div>
  );
}
