import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PartnerTerms() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h1 className="text-3xl font-black mb-8">Conditions Générales de Partenariat</h1>
          
          <div className="prose prose-slate max-w-none space-y-6 text-sm text-slate-700">
            <section>
              <h2 className="text-xl font-bold text-slate-900">1. Objet</h2>
              <p>Le présent contrat régit le partenariat entre KiloLab (Apporteur d'affaires) et le Partenaire (Pressing) pour la gestion du linge au kilo.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">2. Commission</h2>
              <p>KiloLab perçoit une commission de <strong>20% (HT)</strong> sur chaque commande apportée au Partenaire via la plateforme. Cette commission est déduite automatiquement lors du paiement via Stripe Connect.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">3. Paiement</h2>
              <p>Le Partenaire reçoit ses versements (Chiffre d'affaires - Commission 20%) directement sur son compte bancaire via Stripe, selon une fréquence hebdomadaire ou quotidienne (configurable).</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">4. Responsabilités</h2>
              <p>Le Partenaire est seul responsable du traitement du linge (lavage, séchage, pliage). En cas de perte, détérioration ou vol au sein de l'établissement, l'assurance professionnelle du Partenaire sera sollicitée.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">5. Résiliation</h2>
              <p>Le partenariat est sans engagement de durée. Chaque partie peut y mettre fin à tout moment par simple email, sous réserve de traiter les commandes en cours.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
