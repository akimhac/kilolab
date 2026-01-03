# 🧺 KiloLab - Plateforme de Pressing Nouvelle Génération.

KiloLab est une plateforme moderne de pressing en ligne connectant clients et blanchisseries partenaires. Dépôt, suivi en temps réel, emails automatiques, système d'avis, et programme de parrainage.

![KiloLab Banner](https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=1200&h=400&fit=crop)

## 📋 Table des matières

1. [Concept](#-concept)
2. [Nouveautés](#-nouveautés)
3. [Stack technique](#-stack-technique)
4. [Installation](#-installation)
5. [Configuration](#-configuration)
6. [Développement local](#-développement-local)
7. [Base de données](#-base-de-données)
8. [Fonctionnalités](#-fonctionnalités)
9. [Sécurité](#-sécurité)
10. [Déploiement](#-déploiement)
11. [Troubleshooting](#-troubleshooting)

---

## 🎯 Concept

### Pour les clients

**2 formules simples et transparentes :**
- **Standard (48-72h)** : 3,50€/kg - Service professionnel complet
- **Express (24h)** : 5€/kg - Besoin urgent ? Votre linge prêt en 24h

**Workflow :**
1. 🗺️ Trouver un pressing partenaire sur la carte (2600+ en France & Belgique)
2. 📦 Déposer le linge - Pesée au poids réel
3. 📧 Recevoir une confirmation par email
4. 📱 Suivre l'avancement en temps réel
5. 🎉 Récupérer le linge propre, séché et plié
6. ⭐ Laisser un avis
7. 🎁 Parrainer des amis (10€ par filleul)

### Pour les partenaires pressings

- ✅ Inscription gratuite au réseau
- 📊 Dashboard professionnel de gestion
- 📧 Notifications automatiques par email
- 🗺️ Visibilité sur la carte interactive
- 💰 Commission transparente
- ⭐ Système d'avis clients

---

## 🆕 Nouveautés

### ✨ Dernières mises à jour

- **Tarification simplifiée** : 2 forfaits au lieu de 3 (Standard 3,50€ & Express 5€)
- **Emails automatiques** : Confirmation commande, notification "prête", contact
- **Système d'avis** : Notes et commentaires sur chaque pressing
- **Programme parrainage** : 10€ offerts pour le parrain et le filleul
- **Dashboard amélioré** : Filtrage par statut, stats en temps réel
- **RLS Supabase** : Sécurité renforcée avec Row Level Security
- **Navigation complète** : Pages À propos, Contact, Blog, Pour qui

---

## 🛠️ Stack technique

### Frontend
- **React 18** + **TypeScript** - UI moderne et type-safe
- **Vite** - Build ultra-rapide
- **TailwindCSS** - Styling utility-first
- **Framer Motion** - Animations fluides
- **React Router v6** - Routing déclaratif
- **Leaflet + OSM** - Cartes interactives
- **Lucide React** - Icônes modernes

### Backend & Services
- **Supabase** - Auth, Database PostgreSQL, Storage
- **Resend** - Emails transactionnels (contact@kilolab.fr)
- **Stripe Connect** - Paiements sécurisés (à venir)
- **Netlify Functions** - API serverless

### Déploiement
- **Netlify** - Hébergement + CI/CD automatique
- **GitHub** - Versioning + Collaboration
- **Custom Domain** - kilolab.fr (OVH)

---

## 📦 Installation

### Prérequis
- Node.js 18+ et npm
- Compte Supabase (gratuit)
- Compte Resend (gratuit jusqu'à 3000 emails/mois)
- (Optionnel) Compte Netlify

### Cloner le projet
```bash
git clone https://github.com/akimhac/kilolab.git
cd kilolab
```

### Installer les dépendances
```bash
# Dépendances frontend
npm install

# Dépendances Netlify Functions (si nécessaire)
cd netlify/functions
npm install
cd ../..
```

---

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-publique
```

### Configuration Supabase

1. **Créer un projet** sur [supabase.com](https://supabase.com)
2. **Exécuter le SQL** disponible dans la section [Base de données](#-base-de-données)
3. **Récupérer les clés** : Settings > API > Project URL & anon public key

### Configuration Resend

1. **Créer un compte** sur [resend.com](https://resend.com)
2. **Vérifier le domaine** contact@kilolab.fr
3. **Générer une API key** (déjà configurée dans `src/services/emailService.ts`)

---

## 💻 Développement local

### Lancer le serveur de dev
```bash
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173)

### Build de production
```bash
npm run build
```

Les fichiers optimisés seront dans `/dist`

### Preview du build
```bash
npm run preview
```

---

## 🗄️ Base de données

### Schema Supabase

#### Tables principales

**`partners`** - Pressings partenaires
```sql
- id (uuid, primary key)
- name (text)
- address (text)
- city (text)
- postal_code (text)
- latitude (numeric)
- longitude (numeric)
- phone (text)
- email (text)
- opening_hours (text)
- created_at (timestamp)
```

**`orders`** - Commandes clients
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key → auth.users)
- partner_id (uuid, foreign key → partners)
- weight_kg (numeric)
- service_type (text) - 'standard' ou 'express'
- price_per_kg (numeric) - 3.5 ou 5
- total_amount (numeric)
- status (text) - 'pending', 'confirmed', 'in_progress', 'ready', 'completed', 'cancelled'
- pickup_date (timestamp)
- delivery_date (timestamp)
- notes (text)
- created_at (timestamp)
- updated_at (timestamp)
```

**`reviews`** - Avis clients
```sql
- id (uuid, primary key)
- order_id (uuid, foreign key → orders)
- user_id (uuid, foreign key → auth.users)
- partner_id (uuid, foreign key → partners)
- rating (integer 1-5)
- comment (text)
- response (text) - Réponse du pressing
- created_at (timestamp)
```

**`referrals`** - Programme de parrainage
```sql
- id (uuid, primary key)
- referrer_id (uuid, foreign key → auth.users)
- referred_id (uuid, foreign key → auth.users)
- referral_code (text, unique)
- reward_amount (numeric, default 10.00)
- status (text) - 'pending', 'validated', 'paid'
- created_at (timestamp)
```

### Script SQL complet

Exécutez ce SQL dans Supabase SQL Editor :
```sql
-- Voir le fichier SQL fourni précédemment
-- Ou exécutez directement depuis l'interface Supabase
```

---

## ✨ Fonctionnalités

### 🔐 Authentification
- Inscription / Connexion avec email
- Confirmation par email
- Reset password
- Sessions sécurisées JWT

### 📍 Carte interactive
- 2600+ pressings géolocalisés
- Filtrage par ville, code postal
- Affichage des notes moyennes
- Derniers avis visibles
- Calcul d'itinéraire

### 📦 Gestion des commandes

**Client :**
- Création commande avec 2 forfaits
- Suivi en temps réel (6 statuts)
- Annulation si statut "pending"
- Historique complet
- Notifications email automatiques

**Pressing partenaire :**
- Dashboard avec stats (CA, commandes, avis)
- Filtrage par statut
- Changement de statut en 1 clic
- Email automatique au client (statut "ready")

### ⭐ Système d'avis
- Notation de 1 à 5 étoiles
- Commentaire optionnel
- Affichage sur carte pressings
- Moyenne calculée en temps réel
- Possibilité de réponse pour le pressing

### 🎁 Programme de parrainage
- Code unique généré à l'inscription
- 10€ pour le parrain + 10€ pour le filleul
- Suivi des filleuls et gains
- Partage via lien ou code

### 📧 Emails automatiques (Resend)
- **Confirmation commande** : Envoyé au client + au pressing
- **Linge prêt** : Notification quand statut = "ready"
- **Contact** : Formulaire → contact@kilolab.fr

### 📄 Pages additionnelles
- Landing page complète avec carousel
- Pricing avec 2 forfaits + exemples
- À propos (storytelling Asie)
- Contact (formulaire fonctionnel)
- Pour qui (4 personas)
- Blog (3 articles exemple)
- CGU / Privacy / Mentions légales

---

## 🔒 Sécurité

### Row Level Security (RLS)

**Policies actives :**
```sql
-- Users voient uniquement leurs commandes
CREATE POLICY "users_view_own_orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Pressings voient uniquement leurs commandes
CREATE POLICY "partners_view_their_orders" ON orders
  FOR SELECT USING (
    partner_id IN (
      SELECT id FROM partners 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Les avis sont publics
CREATE POLICY "reviews_public_read" ON reviews
  FOR SELECT USING (true);
```

### Bonnes pratiques
- ✅ Validation côté client ET serveur
- ✅ Sanitization des inputs
- ✅ HTTPS obligatoire
- ✅ API keys en variables d'environnement
- ✅ Rate limiting sur emails
- ✅ CORS configuré

---

## 🚀 Déploiement

### Netlify (automatique via GitHub)

1. **Connecter le repo** sur [netlify.com](https://app.netlify.com)
2. **Build settings** :
   - Build command : `npm run build`
   - Publish directory : `dist`
3. **Environment variables** : Ajouter `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
4. **Custom domain** : kilolab.fr (DNS configuré sur OVH)

### Déploiement manuel
```bash
# Build
npm run build

# Deploy sur Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 🐛 Troubleshooting

### Problème : Map ne s'affiche pas
```bash
# Vérifier que Leaflet CSS est importé
import 'leaflet/dist/leaflet.css';
```

### Problème : Emails non reçus
- Vérifier que le domaine est vérifié sur Resend
- Checker les logs Resend dashboard
- Regarder les spams

### Problème : SQL errors
- S'assurer que les tables existent (exécuter le SQL complet)
- Vérifier les foreign keys
- Activer RLS sur toutes les tables

### Problème : Auth redirect loop
```typescript
// Vérifier la logique de redirection
const { data: { session } } = await supabase.auth.getSession();
if (!session) navigate('/login');
```

### Problème : Build Netlify échoue
- Vérifier les variables d'env
- S'assurer que `npm run build` fonctionne localement
- Regarder les logs Netlify

---

## 📊 Métriques & KPIs

### Objectifs à 3 mois
- 100 commandes
- 50 clients réguliers (>2 commandes)
- 30 pressings actifs
- Note moyenne > 4.5/5

### Analytics
- Google Analytics 4 configuré
- Événements trackés : signup, order_created, review_submitted
- Funnel de conversion analysé

---

## 🤝 Contribution

Ce projet est en développement actif. Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📝 Roadmap

### ✅ Phase 1 (Terminé)
- Landing page
- Auth complète
- Carte pressings
- Création commande
- Dashboards (client + pressing)
- Emails automatiques
- Système d'avis
- Programme parrainage

### 🔄 Phase 2 (En cours)
- Intégration Stripe Connect
- App mobile (React Native)
- Notifications push
- Chat en direct
- API publique

### 📅 Phase 3 (Futur)
- IA : estimation poids par photo
- Programme fidélité
- Abonnements
- Expansion internationale

---

## 📄 Licence

Propriétaire - © 2025 KiloLab. Tous droits réservés.

---

## 👨‍💻 Auteur & Contact

**KiloLab Team**
- 🌐 Site : [kilolab.fr](https://kilolab.fr)
- 📧 Email : [contact@kilolab.fr](mailto:contact@kilolab.fr)
- 💼 LinkedIn : [KiloLab](https://linkedin.com/company/kilolab)
- 🐦 Twitter : [@kilolab_fr](https://twitter.com/kilolab_fr)

---

## 🙏 Remerciements

- [Supabase](https://supabase.com) - Backend as a Service
- [Resend](https://resend.com) - Email delivery
- [Leaflet](https://leafletjs.com) - Open-source maps
- [Stripe](https://stripe.com) - Payment processing
- [Netlify](https://netlify.com) - Hosting & deployment

---

**⭐ Si ce projet vous plaît, n'hésitez pas à mettre une étoile sur GitHub !**
```
Made with ❤️ in Paris, France
```
