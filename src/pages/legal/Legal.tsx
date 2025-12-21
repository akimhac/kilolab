import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Legal() {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      <Navbar />
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto prose">
        <h1 className="text-3xl font-bold mb-8">Mentions Légales</h1>
        <p><strong>Éditeur du site :</strong> Kilolab SAS (en cours de formation)</p>
        <p><strong>Siège social :</strong> 10 Rue de la Paix, 75000 Paris</p>
        <p><strong>Contact :</strong> contact@kilolab.fr</p>
        <p><strong>Hébergement :</strong> Vercel Inc.</p>
        <p className="text-slate-500 text-sm mt-8">Ces mentions sont données à titre indicatif pour le lancement.</p>
      </div>
      <Footer />
    </div>
  );
}
