import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Trash2 } from 'lucide-react';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à l'accueil
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Politique de Confidentialité
          </h1>
          
          <p className="text-sm text-gray-500 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <div className="prose prose-slate max-w-none">
            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-8 rounded-lg">
              <p className="font-semibold text-purple-900">
                Kilolab respecte votre vie privée et s'engage à protéger vos données personnelles 
                conformément au RGPD.
              </p>
            </div>

            <h2>1. Responsable du traitement</h2>
            <p>
              <strong>[VOTRE SASU]</strong><br />
              Email : contact@kilolab.fr
            </p>

            <h2>2. Données collectées</h2>
            <ul>
              <li>Compte : nom, prénom, email, téléphone, adresse</li>
              <li>Commandes : historique, préférences, montants</li>
              <li>Paiements : traités par Stripe (crypté)</li>
              <li>Navigation : IP, cookies, pages visitées</li>
            </ul>

            <div className="bg-green-50 p-4 rounded-lg my-4">
              <h3 className="text-green-900 font-bold">Ce que nous NE collectons PAS</h3>
              <ul className="text-green-900">
                <li>❌ Données bancaires en clair</li>
                <li>❌ Données sensibles (santé, opinions)</li>
                <li>❌ Données de mineurs de moins de 15 ans</li>
              </ul>
            </div>

            <h2>3. Vos droits (RGPD)</h2>
            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="border border-purple-200 rounded-lg p-4 hover:border-purple-500 transition">
                <Eye className="w-8 h-8 text-purple-600 mb-2" />
                <h4 className="font-bold">Droit d'accès</h4>
                <p className="text-sm text-gray-600">Consulter vos données</p>
              </div>
              <div className="border border-purple-200 rounded-lg p-4 hover:border-purple-500 transition">
                <Shield className="w-8 h-8 text-purple-600 mb-2" />
                <h4 className="font-bold">Droit de rectification</h4>
                <p className="text-sm text-gray-600">Corriger vos données</p>
              </div>
              <div className="border border-purple-200 rounded-lg p-4 hover:border-purple-500 transition">
                <Trash2 className="w-8 h-8 text-purple-600 mb-2" />
                <h4 className="font-bold">Droit à l'effacement</h4>
                <p className="text-sm text-gray-600">Supprimer vos données</p>
              </div>
              <div className="border border-purple-200 rounded-lg p-4 hover:border-purple-500 transition">
                <Lock className="w-8 h-8 text-purple-600 mb-2" />
                <h4 className="font-bold">Droit d'opposition</h4>
                <p className="text-sm text-gray-600">Refuser un traitement</p>
              </div>
            </div>

            <p>
              Pour exercer vos droits : <strong>contact@kilolab.fr</strong>
              <br />
              Réponse sous 1 mois maximum.
            </p>

            <h2>4. Sécurité</h2>
            <ul>
              <li>🔒 Chiffrement HTTPS (SSL/TLS)</li>
              <li>🔒 Mots de passe hashés (bcrypt)</li>
              <li>🔒 Accès restreint aux données</li>
              <li>🔒 Sauvegardes régulières</li>
            </ul>

            <h2>5. Réclamation CNIL</h2>
            <p>
              Si vos droits ne sont pas respectés, contactez la CNIL :
            </p>
            <p>
              <strong>CNIL</strong><br />
              3 Place de Fontenoy - TSA 80715<br />
              75334 PARIS CEDEX 07<br />
              Site : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-purple-600">cnil.fr</a>
            </p>

            <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <h3 className="font-bold text-lg mb-2">Contact</h3>
              <p className="text-sm">
                Pour toute question sur vos données :<br />
                <strong>Email :</strong> contact@kilolab.fr<br />
                <strong>Objet :</strong> "RGPD - Demande"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
