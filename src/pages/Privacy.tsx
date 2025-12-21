import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-32">
        <h1 className="text-4xl font-extrabold mb-8 text-slate-900">Politique de Confidentialité</h1>
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 space-y-8 text-slate-700">
          <p>
            Chez Kilolab, la protection de vos données est une priorité. Cette politique détaille comment nous traitons vos informations personnelles.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900">1. Données collectées</h2>
          <p>Nous collectons les informations suivantes : Nom, Prénom, Email, Numéro de téléphone, Adresse de collecte, Historique de commandes.</p>

          <h2 className="text-xl font-bold text-slate-900">2. Utilisation des données</h2>
          <p>Vos données servent uniquement à :</p>
          <ul className="list-disc pl-5">
            <li>Exécuter le service de pressing.</li>
            <li>Vous envoyer des notifications de suivi (SMS/Email).</li>
            <li>Améliorer nos services.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900">3. Partage des données</h2>
          <p>Vos données ne sont jamais vendues. Elles peuvent être partagées avec nos partenaires pressings uniquement pour l'exécution de la commande.</p>

          <h2 className="text-xl font-bold text-slate-900">4. Vos droits (RGPD)</h2>
          <p>Vous pouvez demander la suppression ou la modification de vos données à tout moment en écrivant à contact@kilolab.fr.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
