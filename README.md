# 🧺 KiloLab - Plateforme de Pressing Nouvelle Génération

**KiloLab** est une plateforme moderne de pressing en ligne connectant clients et blanchisseries partenaires. Dépôt, suivi en temps réel, paiement sécurisé Stripe, et récupération simplifiée.

---

## 📋 Table des matières

1. [Concept](#concept)
2. [Stack technique](#stack-technique)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Développement local](#développement-local)
6. [Déploiement](#déploiement)
7. [Base de données](#base-de-données)
8. [Stripe Checkout](#stripe-checkout)
9. [Sécurité RLS](#sécurité-rls)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Concept

### Pour les clients

3 formules de service :

- **Standard** (72-96h) : 5€/kg - Recommandé
- **Express** (24h) : 10€/kg - Rapide
- **Ultra Express** (6h) : 15€/kg - Urgent

Workflow :
1. Déposer le linge chez un partenaire proche
2. Payer en ligne (Stripe)
3. Suivre l'avancement en temps réel
4. Récupérer le linge propre et repassé

### Pour les partenaires

- Inscription gratuite au réseau
- Interface simple de gestion des commandes
- Géolocalisation automatique des clients
- Paiement garanti

---

## 🛠️ Stack technique

### Frontend
- **React 19** + **TypeScript**
- **Vite** (build tool)
- **TailwindCSS** (styling)
- **Framer Motion** (animations)
- **React Router** (routing)
- **Leaflet** (cartes OSM)
- **Lucide React** (icônes)

### Backend
- **Supabase** (Auth + Database PostgreSQL + Storage)
- **Stripe** (paiement en ligne)
- **Netlify Functions** (serverless API)

### Déploiement
- **Netlify** (hébergement + CI/CD)
- **OVH** (domaine custom)

---

## 📦 Installation

### Prérequis

- Node.js 18+ et npm
- Compte Supabase (gratuit)
- Compte Stripe (mode test gratuit)
- (Optionnel) Compte Netlify

### Cloner le projet

```bash
git clone https://github.com/votre-username/kilolab.git
cd kilolab
```

### Installer les dépendances

```bash
# Dépendances frontend
npm install

# Dépendances Netlify Functions
cd netlify/functions
npm install
cd ../..
```

---

## ⚙️ Configuration

### 1. Variables d'environnement

Créez un fichier `.env` à la racine :

```bash
# Supabase
VITE_SUPABASE_URL=https://dhecegehcjelbxydeolg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (mode test)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51RF...
```

### 2. Variables Netlify (backend)

Ajoutez ces variables dans **Netlify Dashboard > Site Settings > Environment Variables** :

```bash
# Supabase (backend)
VITE_SUPABASE_URL=https://dhecegehcjelbxydeolg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<votre_service_role_key>  # Pour webhook Stripe

# Stripe (backend)
STRIPE_SECRET_KEY=sk_test_51RF...
STRIPE_WEBHOOK_SECRET=whsec_...  # Après configuration webhook
```

### 3. Configuration Supabase

#### a) Créer les tables

Allez dans **Supabase Dashboard > SQL Editor** et exécutez :

```bash
supabase/migrations/001_normalize_user_profiles.sql
```

#### b) Réinitialiser les mots de passe de test

Suivez les instructions dans :

```bash
supabase/RESET_PASSWORDS.md
```

Comptes de test :
- **Client** : `akim.hachili@gmail.com` / `Password123!`
- **Partenaire** : `partenaire@test.com` / `Password123!`

#### c) Activer RLS (Production uniquement)

⚠️ **Laissez RLS désactivé en dev**

Avant le déploiement, activez les policies :

```bash
supabase/SECURITY_RLS.md
```

---

## 💻 Développement local

### Lancer le dev server

```bash
npm run dev -- --host 0.0.0.0
```

Application disponible sur : http://localhost:5173

### Tester avec Netlify Dev (fonctions serverless)

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Lancer le dev server avec functions
netlify dev
```

### Structure des routes

- `/` - Landing page publique
- `/login` - Connexion
- `/signup` - Inscription
- `/partners` - Carte des partenaires
- `/dashboard` - Dashboard (client ou partenaire selon rôle)
- `/new-order` - Nouvelle commande (client)
- `/order/:id` - Détail commande (client)
- `/payment-success` - Confirmation paiement
- `/payment-cancelled` - Paiement annulé

---

## 🚀 Déploiement

### Option 1 : Netlify (Recommandé)

#### Via Git (auto-deploy)

1. **Pusher sur GitHub**

```bash
git add .
git commit -m "Production ready"
git push origin main
```

2. **Connecter à Netlify**

- Allez sur https://app.netlify.com
- `Add new site` > `Import an existing project`
- Sélectionnez votre repo GitHub
- Build settings :
  - **Build command** : `npm run build`
  - **Publish directory** : `dist`
  - **Functions directory** : `netlify/functions`

3. **Ajouter les variables d'environnement**

Dans `Site settings > Environment variables`, ajoutez :

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_WEBHOOK_SECRET (après config webhook)
```

4. **Déployer**

- Cliquez sur `Deploy site`
- Netlify va build et déployer automatiquement
- URL de prod : `https://votre-site.netlify.app`

#### Via CLI

```bash
# Build
npm run build

# Déployer
netlify deploy --prod
```

### Option 2 : Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel --prod
```

### Domaine custom (OVH)

1. **Acheter un domaine sur OVH** (ex: kilolab.fr)

2. **Configurer DNS dans OVH**

- Type `A` : `@` → IP Netlify (ex: 75.2.60.5)
- Type `CNAME` : `www` → `votre-site.netlify.app`

3. **Configurer dans Netlify**

- `Domain management` > `Add custom domain`
- Entrez `kilolab.fr`
- Netlify provisionne automatiquement SSL (Let's Encrypt)

---

## 🗄️ Base de données

### Tables principales

#### `user_profiles`

Profils utilisateurs (clients et partenaires)

```sql
id          uuid PRIMARY KEY
user_id     uuid REFERENCES auth.users (UNIQUE)
email       text NOT NULL
role        text CHECK (role IN ('client', 'partner'))
created_at  timestamp
```

#### `partners`

Établissements partenaires (blanchisseries)

```sql
id           uuid PRIMARY KEY
owner_id     uuid REFERENCES user_profiles
name         text NOT NULL
address      text
city         text
postal_code  text
latitude     float
longitude    float
is_active    boolean DEFAULT true
created_at   timestamp
```

#### `orders`

Commandes de pressing

```sql
id                 uuid PRIMARY KEY
client_id          uuid REFERENCES user_profiles
partner_id         uuid REFERENCES partners
service_type       text ('standard' | 'express' | 'ultra')
weight             float
total_price        float
status             text ('pending' | 'paid' | 'processing' | 'ready' | 'completed' | 'cancelled')
stripe_session_id  text
notes              text
created_at         timestamp
updated_at         timestamp
```

### Migrations

Toutes les migrations SQL sont dans :

```
supabase/migrations/
```

Pour appliquer :

1. Allez dans **Supabase > SQL Editor**
2. Collez le contenu du fichier
3. Exécutez

---

## 💳 Stripe Checkout

### Configuration

#### 1. Obtenir les clés API

- Allez sur https://dashboard.stripe.com/test/apikeys
- Copiez :
  - **Publishable key** (pk_test_...) → `VITE_STRIPE_PUBLISHABLE_KEY`
  - **Secret key** (sk_test_...) → `STRIPE_SECRET_KEY`

#### 2. Configurer le webhook

Pour que Stripe notifie KiloLab après un paiement :

1. Allez dans **Stripe Dashboard > Developers > Webhooks**
2. Cliquez sur `Add endpoint`
3. **Endpoint URL** : `https://votre-site.netlify.app/api/stripe-webhook`
4. **Events to send** :
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
5. Copiez le **Signing secret** (whsec_...) → `STRIPE_WEBHOOK_SECRET`

#### 3. Tester le paiement

Cartes de test Stripe :

- **Succès** : `4242 4242 4242 4242`
- **Échec** : `4000 0000 0000 0002`
- **3D Secure** : `4000 0025 0000 3155`

Date d'expiration : Toute date future (ex: 12/25)
CVC : 3 chiffres au hasard (ex: 123)

### Workflow de paiement

1. Client crée une commande (`/new-order`)
2. Frontend appelle `/api/create-checkout-session`
3. Netlify Function crée une session Stripe
4. Client est redirigé vers Stripe Checkout
5. Après paiement :
   - **Succès** → Stripe appelle `/api/stripe-webhook`
   - Webhook met à jour `orders.status = 'paid'`
   - Client redirigé vers `/payment-success`
6. Si annulation → `/payment-cancelled`

---

## 🔒 Sécurité RLS

### État actuel

⚠️ **RLS désactivé** pour faciliter les tests en développement.

### Activation (production)

Avant de déployer en production, activez les Row Level Security policies :

```bash
# Lire la doc
cat supabase/SECURITY_RLS.md

# Exécuter le script SQL
# Supabase > SQL Editor > Coller le script d'activation
```

### Résumé des policies

- **user_profiles** : Chacun voit/modifie son propre profil
- **orders** :
  - Clients voient leurs commandes
  - Partenaires voient les commandes de leur établissement
- **partners** : Lecture publique (pour carte), modification par propriétaire

---

## 🧪 Troubleshooting

### Erreur : "Invalid login credentials"

**Cause** : Mot de passe non configuré dans Supabase Auth

**Solution** :

```bash
# Lire les instructions
cat supabase/RESET_PASSWORDS.md

# Réinitialiser via Supabase Dashboard > Auth > Users
```

### Erreur : "Missing Supabase environment variables"

**Cause** : Fichier `.env` manquant ou mal configuré

**Solution** :

```bash
# Vérifier .env
cat .env

# Copier depuis .env.example si nécessaire
cp .env.example .env
```

### Stripe : "No such checkout session"

**Cause** : Webhook non configuré ou mauvaise clé

**Solution** :

1. Vérifier `STRIPE_WEBHOOK_SECRET` dans Netlify
2. Tester le webhook avec Stripe CLI :

```bash
stripe listen --forward-to http://localhost:8888/api/stripe-webhook
```

### Commandes bloquées après paiement

**Cause** : Webhook Stripe n'a pas pu mettre à jour la DB

**Solution** :

1. Vérifier `SUPABASE_SERVICE_ROLE_KEY` dans Netlify
2. Consulter les logs :
   - Netlify : `Site > Functions > stripe-webhook > Logs`
   - Stripe : `Dashboard > Developers > Webhooks > Logs`

### RLS bloque les requêtes

**Cause** : Policies trop restrictives ou mal configurées

**Solution** :

```sql
-- Désactiver temporairement RLS pour debug
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Vérifier les policies actives
SELECT * FROM pg_policies WHERE tablename = 'orders';
```

---

## 📚 Documentation supplémentaire

- **Migrations SQL** : `supabase/migrations/`
- **Reset mots de passe** : `supabase/RESET_PASSWORDS.md`
- **Policies RLS** : `supabase/SECURITY_RLS.md`
- **Configuration Netlify** : `netlify.toml`

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

---

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE)

---

## 👨‍💻 Auteur

**Akim Hachili**
📧 akim.hachili@gmail.com

---

## ✅ Checklist déploiement

Avant de mettre en production :

- [ ] Variables d'environnement configurées (Netlify)
- [ ] Migration SQL exécutée (user_profiles normalisé)
- [ ] Mots de passe admin réinitialisés
- [ ] Stripe webhook configuré
- [ ] RLS activé (policies appliquées)
- [ ] Domaine custom configuré (DNS OVH)
- [ ] SSL activé (Let's Encrypt via Netlify)
- [ ] Tests de paiement réussis
- [ ] Test client : créer commande → payer → vérifier statut
- [ ] Test partenaire : voir commandes assignées
- [ ] Meta tags SEO configurés (title, description, OG)
- [ ] Favicon et PWA manifest
- [ ] Google Analytics / Plausible (optionnel)

---

## 🚀 Roadmap

- [x] Landing page design
- [x] Authentification Supabase
- [x] Dashboard client
- [x] Dashboard partenaire
- [x] Création de commandes
- [x] Paiement Stripe
- [x] RLS policies
- [ ] Notifications SMS (Twilio)
- [ ] Upload photos du linge
- [ ] Système de codes promo
- [ ] Programme de fidélité
- [ ] API mobile (React Native)
- [ ] Backoffice admin

---

**Merci d'utiliser KiloLab ! 🧺✨**
