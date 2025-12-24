import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CGU() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-8">Conditions Générales d'Utilisation</h1>
        
        <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-8 text-slate-600">
            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2">1. Objet</h2>
                <p>Les présentes CGU ont pour objet de définir les modalités de mise à disposition des services du site Kilolab.fr. Tout accès et/ou utilisation du site suppose l'acceptation et le respect de l'ensemble des termes des présentes conditions.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2">2. Description du Service</h2>
                <p>Kilolab est une plateforme de mise en relation entre des particuliers souhaitant faire laver leur linge et des pressings partenaires. Kilolab agit en tant qu'apporteur d'affaires et garant de la qualité de service.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2">3. Responsabilités</h2>
                <p>Bien que Kilolab sélectionne ses partenaires avec rigueur, la responsabilité du traitement du linge incombe au prestataire final (le pressing). Kilolab s'engage toutefois à assister le client en cas de litige.</p>
            </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
