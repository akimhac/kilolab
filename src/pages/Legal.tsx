import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, Cookie } from 'lucide-react';

export default function Legal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname.includes('privacy') ? 'privacy' : 'cgu');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" /> Retour
          </button>
          <Link to="/" className="text-xl font-bold text-teal-600">Kilolab</Link>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Informations légales</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('cgu')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'cgu' ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" /> CGU
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'privacy' ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-4 h-4" /> Confidentialité
          </button>
          <button
            onClick={() => setActiveTab('cookies')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'cookies' ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Cookie className="w-4 h-4" /> Cookies
          </button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {activeTab === 'cgu' && (
            <div className="prose prose-slate max-w-none">
              <h2>Conditions Générales d'Utilisation</h2>
              <p><strong>Dernière mise à jour :</strong> Décembre 2024</p>
              
              <h3>1. Objet</h3>
              <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du service Kilolab, plateforme de mise en relation entre clients et pressings partenaires.</p>
              
              <h3>2. Description du service</h3>
              <p>Kilolab propose un service de pressing au kilo permettant aux utilisateurs de déposer leur linge dans des points relais partenaires. Le linge est pesé, lavé, séché et plié selon les tarifs affichés.</p>
              
              <h3>3. Inscription</h3>
              <p>L'utilisation du service nécessite la création d'un compte. L'utilisateur s'engage à fournir des informations exactes et à les maintenir à jour.</p>
              
              <h3>4. Tarification</h3>
              <p>Les tarifs sont calculés au kilogramme. Le prix affiché est de 3€/kg pour le service standard. Des options express sont disponibles à des tarifs différents.</p>
              
              <h3>5. Responsabilité</h3>
              <p>Kilolab agit en tant qu'intermédiaire entre les clients et les pressings partenaires. La responsabilité du traitement du linge incombe au pressing partenaire.</p>
              
              <h3>6. Réclamations</h3>
              <p>Toute réclamation doit être formulée dans les 48h suivant la récupération du linge. Contact : contact@kilolab.fr</p>
              
              <h3>7. Modification des CGU</h3>
              <p>Kilolab se réserve le droit de modifier les présentes CGU. Les utilisateurs seront informés de toute modification substantielle.</p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="prose prose-slate max-w-none">
              <h2>Politique de Confidentialité</h2>
              <p><strong>Dernière mise à jour :</strong> Décembre 2024</p>
              
              <h3>1. Collecte des données</h3>
              <p>Nous collectons les données suivantes : nom, prénom, email, adresse, numéro de téléphone, historique des commandes.</p>
              
              <h3>2. Utilisation des données</h3>
              <p>Vos données sont utilisées pour :</p>
              <ul>
                <li>Gérer votre compte et vos commandes</li>
                <li>Vous contacter concernant vos commandes</li>
                <li>Améliorer nos services</li>
                <li>Vous envoyer des communications marketing (avec votre consentement)</li>
              </ul>
              
              <h3>3. Partage des données</h3>
              <p>Vos données sont partagées uniquement avec les pressings partenaires pour le traitement de vos commandes. Nous ne vendons jamais vos données à des tiers.</p>
              
              <h3>4. Sécurité</h3>
              <p>Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données contre tout accès non autorisé.</p>
              
              <h3>5. Vos droits</h3>
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul>
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement</li>
                <li>Droit à la portabilité</li>
              </ul>
              <p>Pour exercer ces droits : contact@kilolab.fr</p>
              
              <h3>6. Contact DPO</h3>
              <p>Pour toute question relative à la protection de vos données : contact@kilolab.fr</p>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="prose prose-slate max-w-none">
              <h2>Politique des Cookies</h2>
              <p><strong>Dernière mise à jour :</strong> Décembre 2024</p>
              
              <h3>1. Qu'est-ce qu'un cookie ?</h3>
              <p>Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d'un site web.</p>
              
              <h3>2. Cookies utilisés</h3>
              <p><strong>Cookies essentiels :</strong></p>
              <ul>
                <li>Authentification et session utilisateur</li>
                <li>Préférences de navigation</li>
                <li>Sécurité</li>
              </ul>
              
              <p><strong>Cookies analytiques :</strong></p>
              <ul>
                <li>Mesure d'audience (anonymisée)</li>
                <li>Amélioration de l'expérience utilisateur</li>
              </ul>
              
              <h3>3. Gestion des cookies</h3>
              <p>Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.</p>
              
              <h3>4. Durée de conservation</h3>
              <p>Les cookies de session sont supprimés à la fermeture du navigateur. Les cookies persistants ont une durée maximale de 13 mois.</p>
            </div>
          )}
        </div>

        {/* Mentions légales */}
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Mentions légales</h2>
          <div className="text-slate-600 space-y-2">
            <p><strong>Éditeur :</strong> Kilolab</p>
            <p><strong>Email :</strong> contact@kilolab.fr</p>
            <p><strong>Hébergeur :</strong> Netlify, Inc. - 44 Montgomery Street, Suite 300, San Francisco, CA 94104</p>
          </div>
        </div>
      </div>
    </div>
  );
}
