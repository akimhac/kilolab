#!/bin/bash

echo "🚀 Implémentation complète : Pages légales + Paiements"
echo ""

# ============================================
# 1. CORRECTION IMAGE HERO
# ============================================

echo "🖼️  1/5 - Correction de l'image hero..."

cat > src/pages/LandingPage_fix.tsx << 'ENDOFFILE'
// Remplacer juste la ligne 103 avec l'image corrigée
                <img
                  src="https://images.pexels.com/photos/6196916/pexels-photo-6196916.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Pressing moderne"
                  className="w-full h-[500px] object-cover"
                />
ENDOFFILE

echo "✅ Copiez cette ligne dans LandingPage.tsx ligne 103"
echo ""

# ============================================
# 2. PAGES LÉGALES (CGU/CGV PRO-KILOLAB)
# ============================================

echo "📄 2/5 - Création des pages légales..."

mkdir -p src/pages/legal

# CGU - TRÈS PROTECTRICES POUR KILOLAB
cat > src/pages/legal/CGU.tsx << 'CGUFILE'
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CGU() {
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
          <h1 className="text-4xl font-bold mb-8">Conditions Générales d'Utilisation</h1>
          
          <p className="text-sm text-gray-500 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <h2>Article 1 - Objet</h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation 
            de la plateforme Kilolab, accessible à l'adresse <strong>kilolab.fr</strong> (ci-après "la Plateforme").
          </p>
          <p>
            <strong>Kilolab agit exclusivement en tant qu'intermédiaire technologique</strong> entre les Utilisateurs 
            et les Pressings partenaires. Kilolab ne réalise aucune prestation de nettoyage.
          </p>

          <h2>Article 2 - Définitions</h2>
          <ul>
            <li><strong>Plateforme :</strong> Site web et application Kilolab</li>
            <li><strong>Utilisateur :</strong> Toute personne physique ou morale utilisant la Plateforme</li>
            <li><strong>Partenaire / Pressing :</strong> Établissement de pressing inscrit sur la Plateforme</li>
            <li><strong>Service :</strong> Prestation de nettoyage réalisée par le Pressing</li>
            <li><strong>Commande :</strong> Demande de Service effectuée via la Plateforme</li>
          </ul>

          <h2>Article 3 - Acceptation des CGU</h2>
          <p>
            L'utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU. 
            En cas de refus, l'Utilisateur doit s'abstenir d'utiliser la Plateforme.
          </p>

          <h2>Article 4 - Services proposés</h2>
          <h3>4.1 Rôle de Kilolab</h3>
          <p>
            Kilolab met à disposition une plateforme permettant de :
          </p>
          <ul>
            <li>Localiser des pressings partenaires</li>
            <li>Consulter leurs tarifs et services</li>
            <li>Réserver des créneaux de dépôt/retrait</li>
            <li>Effectuer des paiements en ligne (optionnel selon le pressing)</li>
          </ul>

          <h3>4.2 Prestations réalisées par les Pressings</h3>
          <p>
            <strong>Les prestations de nettoyage sont exclusivement réalisées par les Pressings partenaires.</strong>
            Kilolab n'intervient pas dans l'exécution des Services et ne peut être tenu responsable 
            de leur qualité, délai ou résultat.
          </p>

          <h2>Article 5 - Inscription et Compte Utilisateur</h2>
          <h3>5.1 Création de compte</h3>
          <p>
            L'Utilisateur peut créer un compte en fournissant des informations exactes et à jour. 
            Il est responsable de la confidentialité de ses identifiants.
          </p>

          <h3>5.2 Suspension de compte</h3>
          <p>
            Kilolab se réserve le droit de suspendre ou supprimer tout compte en cas de :
          </p>
          <ul>
            <li>Violation des présentes CGU</li>
            <li>Comportement frauduleux ou abusif</li>
            <li>Non-paiement répété</li>
            <li>Fausses informations</li>
          </ul>

          <h2>Article 6 - Commandes et Paiements</h2>
          <h3>6.1 Prix</h3>
          <p>
            Les prix sont fixés librement par chaque Pressing partenaire et affichés sur la Plateforme. 
            <strong>Kilolab ne contrôle pas les tarifs pratiqués.</strong>
          </p>

          <h3>6.2 Paiement</h3>
          <p>
            Selon le Pressing, le paiement peut s'effectuer :
          </p>
          <ul>
            <li>En ligne via Stripe (sécurisé)</li>
            <li>Directement au Pressing (espèces, CB)</li>
          </ul>
          <p>
            En cas de paiement en ligne, <strong>Kilolab perçoit une commission de 5 à 15% 
            sur le montant HT de la transaction</strong> pour le service de mise en relation.
          </p>

          <h3>6.3 Annulation</h3>
          <p>
            Les conditions d'annulation dépendent de chaque Pressing. L'Utilisateur doit consulter 
            les conditions spécifiques avant de valider sa Commande.
          </p>

          <h2>Article 7 - Responsabilités</h2>
          <h3>7.1 Limitation de responsabilité de Kilolab</h3>
          <p>
            <strong>Kilolab décline toute responsabilité concernant :</strong>
          </p>
          <ul>
            <li>La qualité des Services fournis par les Pressings</li>
            <li>Les dommages causés aux vêtements pendant le nettoyage</li>
            <li>Les retards de livraison</li>
            <li>La perte ou le vol d'articles confiés aux Pressings</li>
            <li>Les litiges entre Utilisateurs et Pressings</li>
            <li>L'inexécution du Service par un Pressing</li>
          </ul>
          <p>
            <strong>En cas de litige, l'Utilisateur doit directement contacter le Pressing concerné.</strong>
          </p>

          <h3>7.2 Responsabilité de l'Utilisateur</h3>
          <p>
            L'Utilisateur est seul responsable :
          </p>
          <ul>
            <li>De l'exactitude des informations fournies</li>
            <li>De l'utilisation de son compte</li>
            <li>Du respect des consignes du Pressing</li>
            <li>De la vérification de ses articles avant dépôt</li>
          </ul>

          <h3>7.3 Responsabilité des Pressings</h3>
          <p>
            Les Pressings partenaires sont seuls responsables de :
          </p>
          <ul>
            <li>La qualité de leurs prestations</li>
            <li>Le respect des délais annoncés</li>
            <li>La sécurité et la restitution des articles</li>
            <li>Leur conformité aux normes professionnelles</li>
          </ul>

          <h2>Article 8 - Disponibilité de la Plateforme</h2>
          <p>
            Kilolab s'efforce d'assurer l'accessibilité de la Plateforme 24h/24 et 7j/7, 
            mais ne peut garantir une disponibilité continue. 
          </p>
          <p>
            <strong>Kilolab ne peut être tenu responsable des interruptions de service</strong> 
            pour maintenance, pannes techniques ou cas de force majeure.
          </p>

          <h2>Article 9 - Propriété Intellectuelle</h2>
          <p>
            Tous les éléments de la Plateforme (logo, textes, images, design) sont la propriété 
            exclusive de Kilolab ou de ses partenaires. Toute reproduction est interdite sans autorisation.
          </p>

          <h2>Article 10 - Données Personnelles</h2>
          <p>
            Les données personnelles collectées sont traitées conformément au RGPD. 
            Consultez notre <a href="/legal/privacy" className="text-purple-600 hover:underline">Politique de confidentialité</a>.
          </p>

          <h2>Article 11 - Réclamations</h2>
          <p>
            Pour toute réclamation, contactez-nous à : <strong>contact@kilolab.fr</strong>
          </p>
          <p>
            En cas de litige avec un Pressing, l'Utilisateur doit d'abord tenter une résolution amiable.
          </p>

          <h2>Article 12 - Médiation</h2>
          <p>
            Conformément à l'article L.612-1 du Code de la consommation, l'Utilisateur peut recourir 
            gratuitement à un médiateur de la consommation en cas de litige.
          </p>

          <h2>Article 13 - Loi Applicable</h2>
          <p>
            Les présentes CGU sont soumises au droit français. 
            Tout litige sera de la compétence exclusive des tribunaux français.
          </p>

          <h2>Article 14 - Modification des CGU</h2>
          <p>
            Kilolab se réserve le droit de modifier les présentes CGU à tout moment. 
            Les nouvelles CGU seront applicables dès leur mise en ligne.
          </p>

          <div className="mt-12 p-6 bg-purple-50 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Contact</h3>
            <p className="text-sm">
              <strong>Kilolab</strong><br />
              Email : contact@kilolab.fr<br />
              Site : kilolab.fr
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
CGUFILE

# Mentions légales
cat > src/pages/legal/MentionsLegales.tsx << 'MLFILE'
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function MentionsLegales() {
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
          <h1 className="text-4xl font-bold mb-8">Mentions Légales</h1>

          <h2>Éditeur du site</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-sm font-semibold text-yellow-800">
              ⚠️ À COMPLÉTER avec vos informations légales après création de la SASU
            </p>
          </div>
          <p>
            <strong>Raison sociale :</strong> [VOTRE SASU - À COMPLÉTER]<br />
            <strong>Forme juridique :</strong> SASU (Société par Actions Simplifiée Unipersonnelle)<br />
            <strong>Capital social :</strong> [MONTANT] euros<br />
            <strong>Siège social :</strong> [ADRESSE COMPLÈTE]<br />
            <strong>SIRET :</strong> [NUMÉRO SIRET]<br />
            <strong>RCS :</strong> [VILLE]<br />
            <strong>Email :</strong> contact@kilolab.fr<br />
            <strong>Directeur de publication :</strong> [VOTRE NOM], Président<br />
            <strong>TVA intracommunautaire :</strong> [NUMÉRO]
          </p>

          <h2>Hébergement</h2>
          <p>
            <strong>Vercel Inc.</strong><br />
            340 S Lemon Ave #4133<br />
            Walnut, CA 91789<br />
            États-Unis<br />
            Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-purple-600">vercel.com</a>
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L'ensemble du site Kilolab (structure, textes, logos, images, vidéos, graphismes) 
            est la propriété exclusive de [VOTRE SASU] ou de ses partenaires.
          </p>
          <p>
            Toute reproduction, représentation, modification, publication, transmission ou dénaturation, 
            totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, 
            est interdite sans l'autorisation écrite préalable de Kilolab.
          </p>

          <h2>Crédits</h2>
          <p>
            <strong>Photographies :</strong> Pexels.com (Licence libre)<br />
            <strong>Icônes :</strong> Lucide Icons (Licence MIT)<br />
            <strong>Typographie :</strong> Google Fonts
          </p>

          <h2>Protection des données personnelles</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi 
            Informatique et Libertés, vous disposez de droits sur vos données.
          </p>
          <p>
            Consultez notre <a href="/legal/privacy" className="text-purple-600 hover:underline">Politique de confidentialité</a> 
            pour plus d'informations.
          </p>

          <h2>Cookies</h2>
          <p>
            Le site utilise des cookies pour améliorer l'expérience utilisateur. 
            Vous pouvez les désactiver dans les paramètres de votre navigateur.
          </p>

          <h2>Contact</h2>
          <p>
            Pour toute question relative aux mentions légales, contactez-nous à :<br />
            <strong>Email :</strong> contact@kilolab.fr
          </p>
        </div>
      </div>
    </div>
  );
}
MLFILE

# Politique de confidentialité (RGPD)
cat > src/pages/legal/Privacy.tsx << 'PRIVACYFILE'
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
PRIVACYFILE

echo "✅ Pages légales créées"

# ============================================
# 3. MISE À JOUR DES ROUTES
# ============================================

echo ""
echo "📝 3/5 - Mise à jour du router..."

cat > src/App_update.tsx << 'APPFILE'
// AJOUTEZ ces lignes dans vos imports
import CGU from './pages/legal/CGU';
import MentionsLegales from './pages/legal/MentionsLegales';
import Privacy from './pages/legal/Privacy';

// AJOUTEZ ces routes dans votre <Routes>
<Route path="/legal/cgu" element={<CGU />} />
<Route path="/legal/mentions-legales" element={<MentionsLegales />} />
<Route path="/legal/privacy" element={<Privacy />} />
APPFILE

echo "✅ Copiez ces lignes dans src/App.tsx"

# ============================================
# 4. MISE À JOUR DU FOOTER
# ============================================

echo ""
echo "📝 4/5 - Mise à jour du footer..."

cat > src/components/Footer_update.tsx << 'FOOTERFILE'
// Dans le Footer de LandingPage.tsx, remplacez la section Légal par :

<div>
  <h4 className="font-bold mb-4 text-lg">Légal</h4>
  <ul className="space-y-3 text-slate-400">
    <li>
      <button 
        onClick={() => navigate('/legal/cgu')}
        className="hover:text-white transition text-left"
      >
        CGU
      </button>
    </li>
    <li>
      <button 
        onClick={() => navigate('/legal/privacy')}
        className="hover:text-white transition text-left"
      >
        Confidentialité
      </button>
    </li>
    <li>
      <button 
        onClick={() => navigate('/legal/mentions-legales')}
        className="hover:text-white transition text-left"
      >
        Mentions légales
      </button>
    </li>
  </ul>
</div>
FOOTERFILE

echo "✅ Mettez à jour le footer dans LandingPage.tsx"

# ============================================
# 5. CHECKLIST CE QU'IL MANQUE
# ============================================

echo ""
echo "📋 5/5 - Ce qu'il manque encore..."
echo ""
