import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-32">
        <h1 className="text-4xl font-extrabold mb-8 text-slate-900">Conditions Générales d'Utilisation (CGU) - Marketplace</h1>
        <p className="text-slate-500 mb-12">Dernière mise à jour : {new Date().toLocaleDateString()}</p>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 space-y-10 text-slate-700 leading-relaxed">
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="font-bold text-red-700">POINT IMPORTANT</p>
            <p className="text-sm text-red-600">
              Kilolab est une plateforme de mise en relation technique. Kilolab n'effectue aucune prestation de nettoyage. Le contrat de service est conclu directement et exclusivement entre le Client et le Partenaire Pressing.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 1 - Rôle de Kilolab</h2>
            <p>
              La société Kilolab SAS édite une plateforme numérique permettant la mise en relation entre des utilisateurs (ci-après "le Client") et des pressings indépendants (ci-après "le Partenaire").
            </p>
            <p className="mt-2 font-bold">
              Kilolab agit uniquement en qualité d'intermédiaire technique et n'est pas partie au contrat de prestation de service conclu entre le Client et le Partenaire.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 2 - Responsabilité du Service</h2>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2">2.1 Exonération totale de Kilolab</h3>
              <p className="text-sm mb-4">
                Kilolab ne saurait en aucun cas être tenue responsable de l'exécution de la prestation de nettoyage, qui relève de la responsabilité exclusive du Partenaire. Cela inclut, sans s'y limiter :
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                <li>La perte, le vol ou la détérioration du linge.</li>
                <li>Le non-respect des délais par le Partenaire.</li>
                <li>La qualité du repassage ou du nettoyage.</li>
                <li>Les dommages liés aux boutons, fermetures ou ornements.</li>
              </ul>

              <h3 className="font-bold text-slate-900 mt-4 mb-2">2.2 Litiges</h3>
              <p className="text-sm">
                Tout litige relatif à la prestation (vêtement abîmé, perdu, mal lavé) doit être réglé directement entre le Client et le Partenaire Pressing concerné. Kilolab décline toute responsabilité civile ou pénale quant aux dommages directs ou indirects subis.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 3 - Obligations du Client</h2>
            <p>
              Le Client s'engage à vérifier le contenu de ses poches et l'état de son linge avant dépôt. Il reconnaît que le Partenaire est un commerçant indépendant qui applique ses propres conditions générales de traitement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 4 - Paiement et Commission</h2>
            <p>
              Le paiement effectué sur la plateforme transite via un prestataire sécurisé. Kilolab perçoit une commission de mise en relation sur chaque transaction. La facture de la prestation de nettoyage est émise par le Partenaire, Kilolab n'émettant qu'un reçu récapitulatif.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Article 5 - Force Majeure</h2>
            <p>
              La responsabilité de Kilolab ne pourra être engagée en cas de dysfonctionnement du réseau internet, bug technique ou tout événement de force majeure empêchant l'accès à la plateforme.
            </p>
          </section>
          
          <div className="pt-8 border-t border-slate-200 text-sm text-slate-500">
             <p>Pour toute réclamation concernant l'Application (bug, compte bloqué), contactez : contact@kilolab.fr</p>
             <p className="font-bold mt-2">Pour toute réclamation concernant le Linge : Contactez directement le Pressing sélectionné.</p>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
