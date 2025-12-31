import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CGU() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-32">
        <h1 className="text-4xl font-extrabold mb-8">Conditions Générales d’Utilisation</h1>

        <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-8 text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold">1. Objet</h2>
            <p>
              Les présentes CGU ont pour objet de définir les conditions d’utilisation de la plateforme Kilolab,
              permettant la mise en relation entre des clients et des pressings partenaires.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">2. Rôle de Kilolab</h2>
            <p className="font-semibold">
              Kilolab agit exclusivement en qualité d’intermédiaire technique et commercial.
            </p>
            <p className="mt-2">
              Kilolab n’est pas partie au contrat de prestation de nettoyage conclu entre le Client
              et le Partenaire Pressing. La prestation est réalisée sous la seule responsabilité du Partenaire.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">3. Responsabilités</h2>
            <p>
              Kilolab ne saurait être tenue responsable des dommages liés à l’exécution de la prestation
              (perte, détérioration, retard). Kilolab s’engage toutefois à assister le Client en cas de litige.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}