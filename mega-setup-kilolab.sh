#!/bin/bash

echo "🚀 MEGA SETUP KILOLAB - Installation complète"
echo ""

# ============================================
# PARTIE 1 : CRÉER LES PAGES LÉGALES
# ============================================

echo "📄 1/3 - Création des pages légales..."

mkdir -p src/pages/legal

# CGU
cat > src/pages/legal/CGU.tsx << 'ENDCGU'
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CGU() {
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
            Conditions Générales d'Utilisation
          </h1>
          
          <p className="text-sm text-gray-500 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <div className="prose prose-slate max-w-none">
            <h2>Article 1 - Objet</h2>
            <p>
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation 
              de la plateforme Kilolab, accessible à l'adresse <strong>kilolab.fr</strong>.
            </p>
            <p className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600">
              <strong>⚠️ Important :</strong> Kilolab agit exclusivement en tant qu'intermédiaire technologique 
              entre les Utilisateurs et les Pressings partenaires. Kilolab ne réalise aucune prestation de nettoyage.
            </p>

            <h2>Article 2 - Définitions</h2>
            <ul>
              <li><strong>Plateforme :</strong> Site web et application Kilolab</li>
              <li><strong>Utilisateur :</strong> Toute personne utilisant la Plateforme</li>
              <li><strong>Partenaire / Pressing :</strong> Établissement inscrit sur la Plateforme</li>
              <li><strong>Service :</strong> Prestation de nettoyage réalisée par le Pressing</li>
              <li><strong>Commande :</strong> Demande de Service via la Plateforme</li>
            </ul>

            <h2>Article 3 - Acceptation des CGU</h2>
            <p>
              L'utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU.
            </p>

            <h2>Article 4 - Services proposés</h2>
            <h3>4.1 Rôle de Kilolab</h3>
            <p>Kilolab met à disposition une plateforme permettant de :</p>
            <ul>
              <li>Localiser des pressings partenaires</li>
              <li>Consulter leurs tarifs et services</li>
              <li>Réserver des créneaux de dépôt/retrait</li>
              <li>Effectuer des paiements en ligne sécurisés</li>
            </ul>

            <h3>4.2 Prestations réalisées par les Pressings</h3>
            <p className="font-semibold text-purple-900">
              Les prestations de nettoyage sont exclusivement réalisées par les Pressings partenaires. 
              Kilolab n'intervient pas dans l'exécution des Services.
            </p>

            <h2>Article 5 - Inscription</h2>
            <p>
              L'Utilisateur peut créer un compte en fournissant des informations exactes. 
              Il est responsable de la confidentialité de ses identifiants.
            </p>

            <h2>Article 6 - Paiements</h2>
            <p>
              En cas de paiement en ligne, <strong>Kilolab perçoit une commission de 5 à 15% 
              sur le montant HT de la transaction</strong> pour le service de mise en relation.
            </p>

            <h2>Article 7 - Responsabilités</h2>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600 my-4">
              <h3 className="text-red-900 font-bold">Limitation de responsabilité de Kilolab</h3>
              <p className="text-red-900">
                Kilolab décline toute responsabilité concernant :
              </p>
              <ul className="text-red-900">
                <li>La qualité des Services fournis par les Pressings</li>
                <li>Les dommages causés aux vêtements</li>
                <li>Les retards de livraison</li>
                <li>La perte ou le vol d'articles</li>
                <li>Les litiges entre Utilisateurs et Pressings</li>
              </ul>
              <p className="font-semibold text-red-900">
                En cas de litige, l'Utilisateur doit directement contacter le Pressing concerné.
              </p>
            </div>

            <h2>Article 8 - Propriété Intellectuelle</h2>
            <p>
              Tous les éléments de la Plateforme sont la propriété exclusive de Kilolab. 
              Toute reproduction est interdite sans autorisation.
            </p>

            <h2>Article 9 - Données Personnelles</h2>
            <p>
              Consultez notre <a href="/legal/privacy" className="text-purple-600 hover:underline font-semibold">
                Politique de confidentialité
              </a>.
            </p>

            <h2>Article 10 - Loi Applicable</h2>
            <p>
              Les présentes CGU sont soumises au droit français.
            </p>

            <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
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
    </div>
  );
}
ENDCGU

# Mentions légales
cat > src/pages/legal/MentionsLegales.tsx << 'ENDML'
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function MentionsLegales() {
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
            Mentions Légales
          </h1>

          <div className="prose prose-slate max-w-none">
            <h2>Éditeur du site</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-sm font-semibold text-yellow-800">
                ⚠️ À COMPLÉTER avec vos informations légales après création de la SASU
              </p>
            </div>
            <p>
              <strong>Raison sociale :</strong> [VOTRE SASU - À COMPLÉTER]<br />
              <strong>Forme juridique :</strong> SASU<br />
              <strong>Capital social :</strong> [MONTANT] euros<br />
              <strong>Siège social :</strong> [ADRESSE COMPLÈTE]<br />
              <strong>SIRET :</strong> [NUMÉRO SIRET]<br />
              <strong>RCS :</strong> [VILLE]<br />
              <strong>Email :</strong> contact@kilolab.fr<br />
              <strong>Directeur de publication :</strong> [VOTRE NOM]
            </p>

            <h2>Hébergement</h2>
            <p>
              <strong>Vercel Inc.</strong><br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789<br />
              États-Unis<br />
              Site : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-purple-600">vercel.com</a>
            </p>

            <h2>Propriété intellectuelle</h2>
            <p>
              L'ensemble du site Kilolab est la propriété exclusive de [VOTRE SASU] ou de ses partenaires.
            </p>

            <h2>Protection des données</h2>
            <p>
              Consultez notre <a href="/legal/privacy" className="text-purple-600 hover:underline font-semibold">
                Politique de confidentialité
              </a>.
            </p>

            <h2>Contact</h2>
            <p>
              <strong>Email :</strong> contact@kilolab.fr
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
ENDML

# Confidentialité
cat > src/pages/legal/Privacy.tsx << 'ENDPRIVACY'
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
ENDPRIVACY

echo "✅ Pages légales créées"

# ============================================
# PARTIE 2 : METTRE À JOUR APP.TSX
# ============================================

echo ""
echo "📝 2/3 - Mise à jour du router..."

# Vérifier si les routes existent déjà
if ! grep -q "legal/CGU" src/App.tsx; then
    # Ajouter les imports après les autres imports de pages
    sed -i "/import.*from.*pages/a import CGU from './pages/legal/CGU';\nimport MentionsLegales from './pages/legal/MentionsLegales';\nimport Privacy from './pages/legal/Privacy';" src/App.tsx
    
    # Ajouter les routes avant la fermeture de </Routes>
    sed -i "/<\/Routes>/i \        <Route path=\"/legal/cgu\" element={<CGU />} />\n        <Route path=\"/legal/mentions-legales\" element={<MentionsLegales />} />\n        <Route path=\"/legal/privacy\" element={<Privacy />} />" src/App.tsx
    
    echo "✅ Routes ajoutées à App.tsx"
else
    echo "✅ Routes déjà présentes"
fi

# ============================================
# PARTIE 3 : AMÉLIORER LA LANDING PAGE
# ============================================

echo ""
echo "🎨 3/3 - Amélioration de la landing page..."

# Changer l'image
sed -i 's|https://images.pexels.com/photos/5591666/pexels-photo-5591666.jpeg|https://images.pexels.com/photos/6196916/pexels-photo-6196916.jpeg|g' src/pages/LandingPage.tsx

echo "✅ Image changée"

# ============================================
# PARTIE 4 : STRIPE CONNECT DOCUMENTATION
# ============================================

cat > STRIPE_CONNECT_GUIDE.md << 'ENDSTRIPE'
# 💳 STRIPE CONNECT : Passer d'un modèle centralisé à décentralisé

## 🤔 Différence entre les deux modèles

### MODÈLE ACTUEL (Vous prenez les paiements)
```
Client → Paie sur Kilolab → Vous recevez 100% → Vous reversez 85-90% au pressing
```
**Avantages :**
- ✅ Simple à mettre en place
- ✅ Vous contrôlez tout
- ✅ Pas besoin que les pressings aient un compte Stripe

**Inconvénients :**
- ❌ Vous gérez TOUS les remboursements
- ❌ Vous êtes responsable en cas de litige
- ❌ Complexité comptable (gérer des milliers de virements)
- ❌ Les pressings doivent vous faire confiance

---

### STRIPE CONNECT (Pressings reçoivent directement)
```
Client → Paie le pressing directement → Pressing reçoit 85-90% → Vous recevez 10-15% de commission automatiquement
```

**Avantages :**
- ✅ Pressings reçoivent l'argent directement (confiance++)
- ✅ Vous ne gérez PAS les remboursements
- ✅ Pas de comptabilité complexe
- ✅ Scalable (des milliers de pressings sans problème)
- ✅ Conforme légalement

**Inconvénients :**
- ❌ Plus complexe techniquement
- ❌ Chaque pressing doit créer un compte Stripe Connect
- ❌ Onboarding plus long pour les pressings

---

## 🏗️ ARCHITECTURE STRIPE CONNECT

### Types de Stripe Connect

**1. Standard** (Recommandé pour Kilolab)
- Chaque pressing a son propre dashboard Stripe
- Vous prenez une commission (Application Fee)
- Le pressing gère ses remboursements

**2. Express** (Plus simple)
- Dashboard simplifié pour les pressings
- Vous gardez plus de contrôle

**3. Custom** (Complexe)
- Vous gérez tout pour les pressings
- Pas recommandé au début

---

## �� IMPLÉMENTATION TECHNIQUE

### Étape 1 : Configuration Stripe Connect
```bash
# Dans votre Dashboard Stripe
1. Aller dans Settings → Connect
2. Activer Stripe Connect
3. Choisir "Standard" ou "Express"
4. Configurer l'URL de redirection
```

### Étape 2 : Code Backend (Supabase Functions)
```typescript
// supabase/functions/create-connect-account/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  try {
    const { email, pressingName } = await req.json()

    // Créer un compte Connect pour le pressing
    const account = await stripe.accounts.create({
      type: 'standard', // ou 'express'
      country: 'FR',
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: {
        name: pressingName,
      },
    })

    // Créer un lien d'onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://kilolab.fr/partner-dashboard',
      return_url: 'https://kilolab.fr/partner-dashboard/success',
      type: 'account_onboarding',
    })

    return new Response(
      JSON.stringify({ url: accountLink.url }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

### Étape 3 : Paiement avec Application Fee
```typescript
// Lors du paiement client
const paymentIntent = await stripe.paymentIntents.create({
  amount: 3000, // 30€
  currency: 'eur',
  application_fee_amount: 450, // 4.50€ de commission (15%)
  transfer_data: {
    destination: pressingStripeAccountId, // ID du compte Connect du pressing
  },
})
```

### Étape 4 : Modifier la BDD
```sql
-- Ajouter une colonne pour stocker l'ID Stripe Connect
ALTER TABLE partners ADD COLUMN stripe_account_id VARCHAR;
ALTER TABLE partners ADD COLUMN stripe_onboarding_completed BOOLEAN DEFAULT false;
```

---

## 💰 REVENUS AVEC STRIPE CONNECT

### Calcul de commission

**Client paie 30€ pour une commande :**
```
Montant total : 30.00€
Commission Kilolab (15%) : 4.50€
Pressing reçoit : 25.50€
Frais Stripe (~2%) : 0.75€

Pressing net : 24.75€
Kilolab net : 3.75€
```

### Avantages fiscaux

- ✅ Pas besoin de facturer le pressing (Stripe le fait)
- ✅ Comptabilité simplifiée
- ✅ Rapports automatiques dans Stripe

---

## 📋 CHECKLIST MIGRATION VERS STRIPE CONNECT

### Phase 1 : Préparation (1 semaine)
- [ ] Activer Stripe Connect dans dashboard
- [ ] Créer Supabase Function pour onboarding
- [ ] Ajouter colonnes BDD (stripe_account_id)
- [ ] Page d'onboarding pressing

### Phase 2 : Tests (1 semaine)
- [ ] Créer 1-2 comptes Connect de test
- [ ] Tester le flux de paiement complet
- [ ] Tester les commissions
- [ ] Tester les remboursements

### Phase 3 : Migration (2-4 semaines)
- [ ] Contacter les pressings existants
- [ ] Les faire passer sur Connect
- [ ] Double flux (ancien + nouveau) temporaire
- [ ] Basculer 100% sur Connect

---

## ⚠️ POINTS D'ATTENTION

1. **Onboarding pressings**
   - Expliquer clairement le processus
   - Fournir un guide pas à pas
   - Support dédié

2. **KYC (Know Your Customer)**
   - Stripe demande des documents aux pressings
   - SIRET obligatoire
   - Peut prendre 24-48h

3. **Taux de change**
   - Si pressings belges → gérer EUR correctement

4. **Remboursements**
   - Les pressings gèrent leurs remboursements
   - Vous ne remboursez PAS votre commission

---

## 🎯 MA RECOMMANDATION

**Pour Kilolab :**

1. **MAINTENANT (Lancement)** : Gardez le modèle actuel
   - Plus simple pour démarrer
   - Moins de friction pour les pressings
   - Vous testez le marché

2. **APRÈS 50 COMMANDES/MOIS** : Migrez vers Stripe Connect
   - Vous aurez des pressings "ambassadeurs" pour tester
   - Scalabilité nécessaire
   - Crédibilité renforcée

3. **Modèle hybride possible :**
   - Nouveaux pressings → Stripe Connect obligatoire
   - Anciens pressings → Transition progressive

---

## 💻 BESOIN D'AIDE POUR IMPLÉMENTER ?

Je peux vous créer :
1. ✅ Les Supabase Functions complètes
2. ✅ Le flux d'onboarding pressing
3. ✅ La page de paiement avec Connect
4. ✅ Le dashboard pressing

**Dites-moi si vous voulez que je code tout ça !** 🚀
ENDSTRIPE

echo ""
echo "✅ TOUT EST FAIT !"
echo ""
echo "📋 Récapitulatif:"
echo "   ✅ Pages légales créées (CGU, Mentions, Confidentialité)"
echo "   ✅ Routes ajoutées dans App.tsx"
echo "   ✅ Image de pressing changée"
echo "   ✅ Guide Stripe Connect créé"
echo ""
echo "📄 Fichiers créés:"
echo "   - src/pages/legal/CGU.tsx"
echo "   - src/pages/legal/MentionsLegales.tsx"
echo "   - src/pages/legal/Privacy.tsx"
echo "   - STRIPE_CONNECT_GUIDE.md"
echo ""
echo "📖 Lisez le guide Stripe Connect:"
echo "   cat STRIPE_CONNECT_GUIDE.md"
echo ""
echo "🚀 Déployez maintenant:"
echo "   git add ."
echo "   git commit -m 'feat: add legal pages + improve landing'"
echo "   git push"
echo ""
echo "🎉 Votre site sera prêt dans 2 minutes sur kilolab.fr !"
