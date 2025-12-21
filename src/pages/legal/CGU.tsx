import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CGU() {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      <Navbar />
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto prose">
        <h1 className="text-3xl font-bold mb-8">Conditions Générales d'Utilisation</h1>
        <h2 className="text-xl font-bold mt-6 mb-4">1. Le Service</h2>
        <p>Kilolab met en relation des clients et des pressings partenaires. Le paiement s'effectue au poids réel pesé par le partenaire.</p>
        <h2 className="text-xl font-bold mt-6 mb-4">2. Responsabilité</h2>
        <p>Kilolab s'engage à sélectionner ses partenaires avec soin. En cas de litige, notre service client intervient comme médiateur.</p>
        <p className="text-slate-500 text-sm mt-8">Version Beta - 2025</p>
      </div>
      <Footer />
    </div>
  );
}
