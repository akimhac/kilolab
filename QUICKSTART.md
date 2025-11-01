# ⚡ KiloLab - Quick Start Guide

Guide de démarrage rapide pour développer et tester KiloLab en 5 minutes.

---

## 🎯 Prérequis

- Node.js 18+ installé
- Compte Supabase configuré (voir ci-dessous)
- Comptes de test déjà créés

---

## 🚀 Démarrage rapide (local)

### 1. Installer les dépendances

```bash
# Frontend
npm install

# Netlify Functions
cd netlify/functions && npm install && cd ../..
```

### 2. Vérifier les variables d'environnement

Fichier `.env` déjà présent avec :

```bash
VITE_SUPABASE_URL=https://dhecegehcjelbxydeolg.supabase.co
VITE_SUPABASE_ANON_KEY=<déjà configuré>
VITE_STRIPE_PUBLISHABLE_KEY=<déjà configuré>
```

### 3. Lancer l'application

```bash
npm run dev -- --host 0.0.0.0
```

Application disponible sur : **http://localhost:5173**

---

## 🔧 Configuration Supabase (première fois)

### Étape 1 : Normaliser user_profiles

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez le projet : `dhecegehcjelbxydeolg`
3. Menu `SQL Editor` > `New query`
4. Copiez-collez le contenu de :

```
supabase/migrations/001_normalize_user_profiles.sql
```

5. Cliquez sur `RUN`
6. Vérifiez le message : `✅ Tous les profils ont un user_id valide`

### Étape 2 : Réinitialiser les mots de passe de test

1. Menu `Authentication` > `Users`

2. Pour **akim.hachili@gmail.com** (client) :
   - Cliquez sur les 3 points `...`
   - `Reset Password` > `Manual`
   - Nouveau mot de passe : `Password123!`
   - Confirmez

3. Pour **partenaire@test.com** (partenaire) :
   - Répétez les mêmes étapes
   - Mot de passe : `Password123!`

---

## ✅ Test de connexion

### Test 1 : Client

1. Ouvrez http://localhost:5173/login
2. Connectez-vous :
   - Email : `akim.hachili@gmail.com`
   - Password : `Password123!`
3. ✅ Vous devriez être redirigé vers `/dashboard` (ClientDashboard)

### Test 2 : Partenaire

1. Déconnectez-vous
2. Reconnectez-vous avec :
   - Email : `partenaire@test.com`
   - Password : `Password123!`
3. ✅ Vous devriez voir le PartnerDashboard

---

## 💳 Test paiement Stripe (local)

### Option 1 : Tester avec Netlify Dev

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Lancer avec les fonctions serverless
netlify dev
```

Puis :

1. Connectez-vous en tant que client
2. Créez une nouvelle commande : `/new-order`
3. Remplissez le formulaire
4. Cliquez sur `Payer avec Stripe`
5. Carte de test : `4242 4242 4242 4242`
6. Expiration : `12/25`
7. CVC : `123`
8. ✅ Paiement réussi → redirection `/payment-success`

### Option 2 : Mock (sans Stripe)

Si vous ne voulez pas configurer Stripe immédiatement :

1. Commentez temporairement le code Stripe dans `NewOrder.tsx` (lignes 68-93)
2. Créez la commande sans paiement (statut `pending`)
3. Testez le reste de l'application

---

## 📂 Structure du projet

```
kilolab/
├── src/
│   ├── pages/
│   │   ├── LandingPage.tsx       # Landing publique
│   │   ├── Login.tsx             # Page de connexion (FIXÉE ✅)
│   │   ├── ClientDashboard.tsx   # Dashboard client
│   │   ├── PartnerDashboard.tsx  # Dashboard partenaire
│   │   ├── NewOrder.tsx          # Créer commande + Stripe
│   │   └── ...
│   ├── hooks/
│   │   ├── useAuth.ts            # Hook auth (rôle client/partner)
│   │   └── useOrders.ts          # CRUD commandes
│   ├── lib/
│   │   ├── supabase.ts           # Client Supabase
│   │   └── stripe.ts             # Client Stripe (frontend)
│   └── App.tsx                   # Routes React Router
├── netlify/
│   └── functions/
│       ├── create-checkout-session.ts  # API Stripe Checkout
│       └── stripe-webhook.ts           # Webhook paiement
├── supabase/
│   ├── migrations/
│   │   └── 001_normalize_user_profiles.sql
│   ├── RESET_PASSWORDS.md
│   └── SECURITY_RLS.md
├── netlify.toml                  # Config déploiement
└── README.md                     # Documentation complète
```

---

## 🐛 Troubleshooting

### Erreur : "Invalid login credentials"

**Cause** : Mots de passe non configurés dans Supabase Auth

**Solution** :
```bash
# Suivre les instructions
cat supabase/RESET_PASSWORDS.md
```

### Erreur : "Missing Supabase environment variables"

**Cause** : Variables d'environnement manquantes

**Solution** :
```bash
# Vérifier .env
cat .env

# S'assurer que les 3 variables sont présentes
```

### Les partenaires ne s'affichent pas

**Vérification** :

```sql
-- Exécuter dans Supabase > SQL Editor
SELECT COUNT(*) FROM partners WHERE is_active = true;
-- Devrait retourner 85
```

Si 0, la table est vide. Vous devez importer les 85 partenaires depuis les données existantes.

### Le paiement Stripe ne fonctionne pas

**En développement local** :

1. Utilisez `netlify dev` au lieu de `npm run dev`
2. Ou mockez le paiement temporairement

---

## 📋 Checklist avant de commencer

- [x] Node.js 18+ installé
- [x] Dépendances installées (`npm install`)
- [ ] Migration SQL exécutée (user_profiles normalisé)
- [ ] Mots de passe de test réinitialisés
- [ ] Application lancée (`npm run dev`)
- [ ] Test connexion client OK
- [ ] Test connexion partenaire OK

---

## 🚀 Étapes suivantes

1. **Tester toutes les routes** :
   - Landing page : `/`
   - Carte partenaires : `/partners`
   - Nouvelle commande : `/new-order`
   - Détail commande : `/order/:id`

2. **Configurer Stripe** :
   - Créer compte Stripe test
   - Configurer webhook
   - Tester paiement bout-en-bout

3. **Activer RLS** (avant prod) :
   - Lire `supabase/SECURITY_RLS.md`
   - Exécuter les policies SQL

4. **Déployer sur Netlify** :
   - Suivre `README.md` section Déploiement
   - Configurer variables d'environnement
   - Configurer domaine OVH

---

## 📞 Besoin d'aide ?

- **Documentation complète** : `README.md`
- **Reset mots de passe** : `supabase/RESET_PASSWORDS.md`
- **RLS Policies** : `supabase/SECURITY_RLS.md`
- **Email** : akim.hachili@gmail.com

---

**Bon développement ! 🧺✨**
