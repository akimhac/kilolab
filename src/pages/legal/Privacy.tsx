import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Trash2 } from 'lucide-react';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-bold mb-8">Politique de Confidentialité</h1>
          
          <p className="text-sm text-gray-500 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-8">
            <p className="font-semibold">
              Kilolab respecte votre vie privée et s'engage à protéger vos données personnelles 
              conformément au RGPD (Règlement Général sur la Protection des Données).
            </p>
          </div>

          <h2>1. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données est :<br />
            <strong>[VOTRE SASU]</strong><br />
            Siège social : [ADRESSE]<br />
            Email : contact@kilolab.fr
          </p>

          <h2>2. Données collectées</h2>
          <h3>2.1 Données que nous collectons</h3>
          <ul>
            <li><strong>Compte utilisateur :</strong> nom, prénom, email, téléphone, adresse</li>
            <li><strong>Commandes :</strong> historique, préférences, montants</li>
            <li><strong>Paiements :</strong> informations traitées par Stripe (carte bancaire cryptée)</li>
            <li><strong>Navigation :</strong> adresse IP, cookies, pages visitées</li>
          </ul>

          <h3>2.2 Données que nous NE collectons PAS</h3>
          <ul>
            <li>❌ Données bancaires en clair (gérées par Stripe)</li>
            <li>❌ Données sensibles (santé, opinions politiques, etc.)</li>
            <li>❌ Données de mineurs de moins de 15 ans</li>
          </ul>

          <h2>3. Finalités du traitement</h2>
          <p>Vos données sont utilisées pour :</p>
          <ul>
            <li>✅ Créer et gérer votre compte</li>
            <li>✅ Traiter vos commandes</li>
            <li>✅ Vous envoyer des confirmations par email/SMS</li>
            <li>✅ Améliorer nos services</li>
            <li>✅ Respecter nos obligations légales</li>
            <li>❌ PAS de prospection commerciale sans consentement</li>
          </ul>

          <h2>4. Base légale du traitement</h2>
          <ul>
            <li><strong>Exécution du contrat :</strong> Pour traiter vos commandes</li>
            <li><strong>Obligation légale :</strong> Conservation des factures (10 ans)</li>
            <li><strong>Consentement :</strong> Newsletter (opt-in uniquement)</li>
            <li><strong>Intérêt légitime :</strong> Amélioration du service</li>
          </ul>

          <h2>5. Destinataires des données</h2>
          <p>Vos données peuvent être partagées avec :</p>
          <ul>
            <li><strong>Pressings partenaires :</strong> Pour l'exécution de votre commande</li>
            <li><strong>Stripe :</strong> Pour les paiements (certifié PCI-DSS)</li>
            <li><strong>Supabase :</strong> Hébergement base de données (UE)</li>
            <li><strong>Vercel :</strong> Hébergement site web</li>
          </ul>
          <p>
            <strong>Nous ne vendons jamais vos données à des tiers.</strong>
          </p>

          <h2>6. Durée de conservation</h2>
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2">Données</th>
                <th className="border p-2">Durée</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Compte actif</td>
                <td className="border p-2">Tant que le compte existe</td>
              </tr>
              <tr>
                <td className="border p-2">Compte inactif</td>
                <td className="border p-2">3 ans après dernière connexion</td>
              </tr>
              <tr>
                <td className="border p-2">Factures</td>
                <td className="border p-2">10 ans (obligation légale)</td>
              </tr>
              <tr>
                <td className="border p-2">Logs de connexion</td>
                <td className="border p-2">1 an</td>
              </tr>
            </tbody>
          </table>

          <h2>7. Vos droits (RGPD)</h2>
          <p>Vous disposez des droits suivants :</p>
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="border rounded-lg p-4">
              <Eye className="w-8 h-8 text-purple-600 mb-2" />
              <h4 className="font-bold">Droit d'accès</h4>
              <p className="text-sm">Consulter vos données</p>
            </div>
            <div className="border rounded-lg p-4">
              <Shield className="w-8 h-8 text-purple-600 mb-2" />
              <h4 className="font-bold">Droit de rectification</h4>
              <p className="text-sm">Corriger vos données</p>
            </div>
            <div className="border rounded-lg p-4">
              <Trash2 className="w-8 h-8 text-purple-600 mb-2" />
              <h4 className="font-bold">Droit à l'effacement</h4>
              <p className="text-sm">Supprimer vos données</p>
            </div>
            <div className="border rounded-lg p-4">
              <Lock className="w-8 h-8 text-purple-600 mb-2" />
              <h4 className="font-bold">Droit d'opposition</h4>
              <p className="text-sm">Refuser un traitement</p>
            </div>
          </div>

          <p>
            Pour exercer vos droits, envoyez un email à : <strong>contact@kilolab.fr</strong>
            <br />
            Nous répondrons sous 1 mois maximum.
          </p>

          <h2>8. Sécurité des données</h2>
          <p>Nous mettons en œuvre les mesures suivantes :</p>
          <ul>
            <li>🔒 Chiffrement HTTPS (SSL/TLS)</li>
            <li>🔒 Mots de passe hashés (bcrypt)</li>
            <li>🔒 Accès restreint aux données</li>
            <li>🔒 Sauvegardes régulières</li>
            <li>🔒 Conformité RGPD de nos sous-traitants</li>
          </ul>

          <h2>9. Cookies</h2>
          <p>Le site utilise les cookies suivants :</p>
          <ul>
            <li><strong>Cookies essentiels :</strong> Authentification, panier (obligatoires)</li>
            <li><strong>Cookies analytiques :</strong> Google Analytics (avec consentement)</li>
          </ul>
          <p>
            Vous pouvez désactiver les cookies dans votre navigateur, mais certaines fonctionnalités 
            peuvent être limitées.
          </p>

          <h2>10. Transferts hors UE</h2>
          <p>
            Certains services (Vercel, Stripe) peuvent transférer vos données hors UE. 
            Ces transferts sont encadrés par des clauses contractuelles types approuvées par la Commission européenne.
          </p>

          <h2>11. Réclamation</h2>
          <p>
            Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation 
            auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) :
          </p>
          <p>
            <strong>CNIL</strong><br />
            3 Place de Fontenoy<br />
            TSA 80715<br />
            75334 PARIS CEDEX 07<br />
            Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-purple-600">cnil.fr</a>
          </p>

          <h2>12. Modification de la politique</h2>
          <p>
            Cette politique peut être modifiée à tout moment. La version en vigueur est toujours 
            accessible sur cette page.
          </p>

          <div className="mt-12 p-6 bg-purple-50 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Contact DPO (Délégué à la Protection des Données)</h3>
            <p className="text-sm">
              Pour toute question sur vos données personnelles :<br />
              <strong>Email :</strong> contact@kilolab.fr<br />
              <strong>Objet :</strong> "RGPD - Demande de [votre demande]"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
