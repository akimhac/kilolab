import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Legal() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-8">Mentions Légales</h1>
        
        <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-8 text-slate-600">
            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2">1. Éditeur du site</h2>
                <p>Le site Kilolab.fr est édité par la société KILOLAB, Société par Actions Simplifiée (SAS) au capital de 1 000 euros.</p>
                <p><strong>Siège social :</strong> [Ton Adresse], France</p>
                <p><strong>Immatriculation :</strong> RCS [Ville] B 123 456 789</p>
                <p><strong>N° TVA Intracommunautaire :</strong> FR 12 123456789</p>
                <p><strong>Directeur de la publication :</strong> Akim Hac</p>
                <p><strong>Contact :</strong> contact@kilolab.fr</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2">2. Hébergement</h2>
                <p>Le site est hébergé par Vercel Inc., situé au 340 S Lemon Ave #4133 Walnut, CA 91789, USA.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2">3. Propriété Intellectuelle</h2>
                <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
            </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
