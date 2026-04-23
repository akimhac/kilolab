import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-32">
        <h1 className="text-4xl font-extrabold mb-2 text-slate-900">Politique de Confidentialité</h1>
        <p className="text-slate-500 mb-8">Protection de vos données personnelles (RGPD) — Version 2.0, Février 2026</p>
        
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">1. Responsable du traitement</h2>
            <p>
              Les données sont collectées et traitées par <strong>Kilolab SAS</strong> (société en cours d'immatriculation), 
              agissant en qualité de responsable de traitement au sens du Règlement (UE) 2016/679 (RGPD).
            </p>
            <p className="mt-2">
              Contact DPO : <a href="mailto:privacy@kilolab.fr" className="text-teal-600 font-bold underline">privacy@kilolab.fr</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">2. Données collectées</h2>
            <p className="font-semibold">Pour les Clients :</p>
            <ul className="list-disc pl-5 mb-4">
              <li>Identité et coordonnées (Nom, Prénom, Email, Téléphone).</li>
              <li>Adresse de collecte et de livraison (Géolocalisation nécessaire au service).</li>
              <li>Données de transaction (Historique des commandes, Montants).</li>
              <li>Données de connexion (Adresse IP, navigateur, appareil).</li>
            </ul>
            <p className="font-semibold">Pour les Washers :</p>
            <ul className="list-disc pl-5">
              <li>Pièce d'identité (Vérification KYC via Stripe).</li>
              <li>Coordonnées bancaires (IBAN pour les virements Stripe Connect).</li>
              <li>Données de performance (Notes, Avis, Temps de réponse, Taux d'acceptation).</li>
              <li>Géolocalisation en temps réel (uniquement pendant les missions actives).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">3. Base légale du traitement</h2>
            <p>Vos données sont traitées sur les bases légales suivantes :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Exécution du contrat</strong> (Art. 6.1.b RGPD) : mise en relation, traitement des commandes, paiements.</li>
              <li><strong>Intérêt légitime</strong> (Art. 6.1.f RGPD) : prévention de la fraude, amélioration du service, sécurité.</li>
              <li><strong>Obligation légale</strong> (Art. 6.1.c RGPD) : facturation, obligations fiscales et comptables.</li>
              <li><strong>Consentement</strong> (Art. 6.1.a RGPD) : communications marketing, cookies analytiques.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">4. Finalité du traitement</h2>
            <p>Vos données sont utilisées exclusivement pour :</p>
            <ul className="list-disc pl-5">
              <li>Assurer la mise en relation et l'exécution de la prestation de lavage.</li>
              <li>Gérer les paiements, la facturation et les remboursements.</li>
              <li>Assurer la sécurité du service et la détection/prévention de la fraude.</li>
              <li>Vous envoyer des notifications de suivi (Email, push).</li>
              <li>Améliorer nos services via des analyses statistiques anonymisées.</li>
              <li>Respecter nos obligations légales et réglementaires.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">5. Durée de conservation</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold">Type de donnée</th>
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold">Durée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-slate-200 px-4 py-2">Données de compte</td><td className="border border-slate-200 px-4 py-2">Durée du compte + 3 ans après suppression</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2">Données de transaction</td><td className="border border-slate-200 px-4 py-2">5 ans (obligation comptable)</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2">Données de géolocalisation</td><td className="border border-slate-200 px-4 py-2">Supprimées à la fin de chaque mission</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2">Données KYC Washer</td><td className="border border-slate-200 px-4 py-2">5 ans après fin de la relation contractuelle</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2">Logs de connexion</td><td className="border border-slate-200 px-4 py-2">12 mois</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2">Cookies analytiques</td><td className="border border-slate-200 px-4 py-2">13 mois maximum</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">6. Partage des données</h2>
            <p>
              Les données strictement nécessaires (Prénom, Adresse, Téléphone) sont transmises au Washer 
              uniquement après validation de la commande pour permettre la collecte. 
            </p>
            <p className="mt-2 font-semibold">Kilolab ne vend jamais vos données à des tiers publicitaires.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">7. Sous-traitants et Transferts hors UE</h2>
            <p className="mb-3">Nous faisons appel aux sous-traitants suivants, tous conformes au RGPD :</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold">Prestataire</th>
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold">Usage</th>
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold">Localisation</th>
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold">Garanties</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-slate-200 px-4 py-2">Supabase</td><td className="border border-slate-200 px-4 py-2">Base de données, Auth</td><td className="border border-slate-200 px-4 py-2">UE (Francfort)</td><td className="border border-slate-200 px-4 py-2">SOC 2 Type II</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2">Stripe</td><td className="border border-slate-200 px-4 py-2">Paiements</td><td className="border border-slate-200 px-4 py-2">Irlande (UE)</td><td className="border border-slate-200 px-4 py-2">PCI DSS Level 1</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2">Vercel</td><td className="border border-slate-200 px-4 py-2">Hébergement</td><td className="border border-slate-200 px-4 py-2">USA/UE</td><td className="border border-slate-200 px-4 py-2">Clauses contractuelles types (SCCs)</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2">Resend</td><td className="border border-slate-200 px-4 py-2">Emails transactionnels</td><td className="border border-slate-200 px-4 py-2">USA</td><td className="border border-slate-200 px-4 py-2">Clauses contractuelles types (SCCs)</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2">Sentry</td><td className="border border-slate-200 px-4 py-2">Monitoring d'erreurs</td><td className="border border-slate-200 px-4 py-2">USA</td><td className="border border-slate-200 px-4 py-2">Clauses contractuelles types (SCCs)</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Les transferts hors UE sont encadrés par des Clauses Contractuelles Types (SCCs) conformément à la décision de la Commission européenne.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">8. Vos droits (RGPD)</h2>
            <p className="mb-3">
              Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Droit d'accès</strong> : obtenir la confirmation et la copie de vos données personnelles.</li>
              <li><strong>Droit de rectification</strong> : corriger des données inexactes ou incomplètes.</li>
              <li><strong>Droit de suppression</strong> : demander l'effacement de vos données (sous réserve des obligations légales).</li>
              <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré et lisible par machine.</li>
              <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données pour motif légitime, ou à la prospection commerciale.</li>
              <li><strong>Droit à la limitation</strong> : demander la suspension du traitement dans certains cas.</li>
              <li><strong>Droit de retrait du consentement</strong> : retirer votre consentement à tout moment sans affecter la licéité du traitement antérieur.</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, contactez notre DPO : <a href="mailto:privacy@kilolab.fr" className="text-teal-600 font-bold underline">privacy@kilolab.fr</a>
            </p>
            <p className="mt-2">
              Nous nous engageons à répondre dans un délai d'<strong>un mois</strong> maximum.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">9. Réclamation auprès de la CNIL</h2>
            <p>
              Si vous estimez que le traitement de vos données ne respecte pas la réglementation, vous avez le droit d'introduire 
              une réclamation auprès de la <strong>Commission Nationale de l'Informatique et des Libertés (CNIL)</strong> :
            </p>
            <p className="mt-2">
              <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline font-medium">www.cnil.fr/fr/plaintes</a>
              <br />
              CNIL — 3 Place de Fontenoy, TSA 80715, 75334 PARIS CEDEX 07
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">10. Cookies</h2>
            <p>
              Pour en savoir plus sur notre utilisation des cookies, consultez notre{' '}
              <Link to="/cookies" className="text-teal-600 underline font-medium">Politique de Gestion des Cookies</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">11. Sécurité</h2>
            <p>
              Nous mettons en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos données :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Chiffrement de bout en bout (HTTPS/TLS) pour toutes les communications.</li>
              <li>Données bancaires gérées exclusivement par Stripe (certifié PCI DSS Level 1).</li>
              <li>Authentification sécurisée via Supabase Auth avec hachage des mots de passe.</li>
              <li>Row Level Security (RLS) sur toutes les tables de la base de données.</li>
              <li>Rate limiting et protection contre les attaques par force brute.</li>
              <li>Monitoring continu via Sentry pour détecter toute anomalie.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">12. Violation de données</h2>
            <p>
              En cas de violation de données susceptible d'engendrer un risque élevé pour vos droits et libertés, 
              Kilolab s'engage à vous en informer dans les <strong>72 heures</strong> suivant la découverte de l'incident, 
              conformément à l'article 34 du RGPD, et à notifier la CNIL dans les meilleurs délais.
            </p>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
}
