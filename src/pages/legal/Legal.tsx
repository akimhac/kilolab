import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Legal() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Mentions Légales</h1>

        {/* Bandeau en cours */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-amber-200 font-medium">Page en cours de finalisation</p>
            <p className="text-amber-300/70 text-sm">Les informations complètes seront disponibles prochainement.</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
          <section>
            <h2 className="text-2xl font-bold text-white">Éditeur du site</h2>
            <p>
              <strong>Kilolab SAS</strong><br />
              Capital social : 10 000€<br />
              SIRET : En cours d'immatriculation<br />
              Siège social : En cours de définition<br />
              Email : <a href="mailto:contact@kilolab.fr" className="text-teal-400 hover:underline">contact@kilolab.fr</a><br />
              Directeur de la publication : En cours
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
              L'ensemble du contenu du site (textes, images, logos, marque Kilolab) est protégé par le droit d'auteur et le droit des marques.
              Toute reproduction, même partielle, est interdite sans autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Données personnelles</h2>
            <p>
              Kilolab collecte et traite des données personnelles dans le cadre de son service.
              Pour en savoir plus sur le traitement de vos données, consultez notre{" "}
              <Link to="/privacy" className="text-teal-400 hover:underline">Politique de confidentialité</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">Contact</h2>
            <p>
              Pour toute question relative aux mentions légales ou au fonctionnement du site,
              vous pouvez nous contacter via notre{" "}
              <Link to="/contact" className="text-teal-400 hover:underline">formulaire de contact</Link>
              {" "}ou par email à <a href="mailto:contact@kilolab.fr" className="text-teal-400 hover:underline">contact@kilolab.fr</a>.
            </p>
          </section>

          <p className="text-slate-500 text-sm mt-10 pt-6 border-t border-slate-800">
            Dernière mise à jour : Février 2026
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}