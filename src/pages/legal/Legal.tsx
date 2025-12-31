import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Legal() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Mentions Légales</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
          <section>
            <h2 className="text-2xl font-bold text-white">Éditeur du site</h2>
            <p>
              <strong>Kilolab SAS</strong><br />
              Capital social : 10 000€<br />
              SIRET : XXX XXX XXX XXXXX<br />
              Siège social : [Adresse à compléter]<br />
              Email : contact@kilolab.fr<br />
              Directeur de la publication : [Nom à compléter]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Hébergement</h2>
            <p>
              <strong>Vercel Inc.</strong><br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789<br />
              États-Unis
            </p>

            <p className="mt-4">
              <strong>Supabase Inc.</strong> (Base de données)<br />
              970 Toa Payoh North, #07-04<br />
              Singapore 318992
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Propriété intellectuelle</h2>
            <p>
              L’ensemble du contenu du site (textes, images, logos) est protégé par le droit d’auteur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Données personnelles</h2>
            <p>
              Pour en savoir plus sur le traitement des données, consultez la Politique de confidentialité.
            </p>
          </section>

          <p className="text-slate-400 text-sm mt-10">
            Pour toute question : contact@kilolab.fr
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}