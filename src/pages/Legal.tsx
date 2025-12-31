import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-32">
        <h1 className="text-4xl font-extrabold mb-8">Mentions légales</h1>

        <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mb-2">1. Éditeur du site</h2>
            <p>
              Le site <strong>Kilolab.fr</strong> est édité par la société <strong>KILOLAB</strong>,
              Société par Actions Simplifiée (SAS) en cours d’immatriculation au Registre du Commerce et des Sociétés (RCS).
            </p>
            <p className="mt-2">
              <strong>Siège social :</strong> [Adresse de domiciliation], France<br />
              <strong>Email :</strong> contact@kilolab.fr<br />
              <strong>Directeur de la publication :</strong> Akim H.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Les informations ci-dessus seront mises à jour dès l’obtention du numéro RCS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">2. Hébergement</h2>
            <p>
              Le site est hébergé par la société Vercel Inc.,  
              340 S Lemon Ave #4133, Walnut, CA 91789, USA.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">3. Propriété intellectuelle</h2>
            <p>
              L’ensemble du contenu du site (textes, design, code, logos) est protégé par le droit d’auteur.
              Toute reproduction sans autorisation est interdite.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}