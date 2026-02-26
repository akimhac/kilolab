# KiloLab - Product Requirements Document (PRD)

## 📋 Informations Projet

| Attribut | Valeur |
|----------|--------|
| **Nom** | KiloLab |
| **URL** | kilolab.fr |
| **Déploiement** | Vercel |
| **Version** | 2.1.0 |
| **Date MAJ** | 25 Février 2026 |

---

## 🎯 Vision Produit

**"L'Uber de la laverie"** - KiloLab est une marketplace C2C connectant les clients ayant besoin de faire laver leur linge avec des "Washers" (particuliers) disposant d'une machine à laver.

### Proposition de Valeur
- **Pour les clients** : Gain de temps, prix transparent au kilo (3€/kg), collecte et livraison incluses
- **Pour les Washers** : Revenu complémentaire jusqu'à 600€/mois, flexibilité totale
- **Pour les Partners** : Plateforme B2B pour les pressings existants

---

## 👥 Personas Utilisateurs

### 1. Client (User)
- **Profil** : Urbain 25-45 ans, actif, manque de temps
- **Besoins** : Service rapide, fiable, prix transparent
- **Parcours** : Landing → New Order → Paiement Stripe → Suivi commande

### 2. Washer (Prestataire)
- **Profil** : Cherche revenu complémentaire, équipé d'une machine à laver
- **Besoins** : Flexibilité, simplicité, paiements rapides
- **Parcours** : Landing Washer → Inscription → Validation admin → Dashboard missions

### 3. Partner (Pressing Pro)
- **Profil** : Pressing/laverie existante cherchant à augmenter son volume
- **Besoins** : Nouveau canal d'acquisition, gestion simplifiée
- **Parcours** : Partner Landing → Inscription → Stripe Connect → Dashboard Pro

### 4. Admin
- **Besoins** : Vue d'ensemble, validation washers/partners, gestion coupons

---

## 🏗️ Architecture Technique

### Stack
- **Frontend** : React 18 + TypeScript + Vite + TailwindCSS
- **Backend** : Supabase (Auth, Database, Edge Functions, Storage)
- **Paiements** : Stripe (Checkout, Connect pour marketplace)
- **Emails** : Resend API
- **Hébergement** : Vercel (Frontend + API Routes)
- **PWA** : vite-plugin-pwa, Service Worker, manifest.json

### Structure Dossiers
```
/app
├── api/                    # Vercel API routes (Stripe)
├── src/
│   ├── components/         # Composants réutilisables
│   ├── pages/              # Pages (Landing, NewOrder, Dashboards...)
│   ├── lib/                # Config (supabase, stripe, firebase)
│   ├── services/           # Services (email, notifications)
│   └── hooks/              # Custom hooks
├── public/                 # Assets statiques, PWA manifests
├── supabase/               # Edge Functions + SQL scripts
└── design_guidelines.json  # Guidelines UI/UX
```

---

## ✅ Fonctionnalités Implémentées

### Core (MVP)
- [x] Landing page avec vidéo hero et comparateur de prix
- [x] Système d'authentification (Supabase Auth)
- [x] Commande multi-étapes (formule, poids, localisation, date, paiement)
- [x] Paiement Stripe Checkout
- [x] Dashboard Client (suivi commandes)
- [x] Dashboard Washer (missions, revenus)
- [x] Dashboard Partner (gestion pressing)
- [x] Dashboard Admin (validation, stats)
- [x] Inscription Washer avec upload pièce d'identité
- [x] Inscription Partner avec Stripe Connect
- [x] Système de coupons/promos
- [x] Système de parrainage (10€/filleul)
- [x] PWA (installable, service worker)
- [x] SEO optimisé (meta tags, schema.org)

### Session 25 Février 2026 - OPTIMISATIONS COMPLÈTES
- [x] Nettoyage fichiers Netlify (migration Vercel complète)
- [x] Upgrade typographie (Plus Jakarta Sans + Inter)
- [x] Nouveau design Landing page style Uber/Airbnb
- [x] Navbar glassmorphism responsive
- [x] CSS utilities premium (glass, animations, cards)
- [x] Ajout meta PWA iOS (apple-mobile-web-app-*)
- [x] Fix modal popup (click-through, délai 15s, exclusion pages critiques)
- [x] Footer redesigné avec sections complètes
- [x] Design guidelines JSON documenté
- [x] **Scripts SQL RLS** (/app/supabase/RLS_POLICIES.sql)
- [x] **Scripts SQL Cleanup** (/app/supabase/CLEANUP_DEPRECATED.sql)
- [x] **PWA optimisée** (caching fonts, images, API)
- [x] **Build optimisé** (code splitting, chunks vendors)

---

## 📊 Score Final & Analyse

### Score Global : **8.5/10** ⬆️ (était 7.5/10)

| Aspect | Score | Détail |
|--------|-------|--------|
| UI/UX Design | 9/10 | Style Uber/Airbnb, fonts premium, animations fluides |
| Code Quality | 8/10 | TypeScript, composants modulaires, code splitting |
| Fonctionnalités | 8.5/10 | MVP complet, multi-rôles, parrainage |
| PWA | 8/10 | Installable, manifest complet, caching optimisé |
| Performance | 8/10 | Build optimisé, lazy loading, chunks vendors |
| Sécurité | 7/10 | Scripts RLS prêts (à exécuter sur Supabase) |
| Tests | 4/10 | Tests manuels OK, pas de tests automatisés |

---

## 🔴 Backlog Prioritaire

### P0 - Critique (Avant mise en prod)
- [ ] **EXÉCUTER** `/app/supabase/RLS_POLICIES.sql` sur Supabase
- [ ] Vérifier Stripe webhooks en production
- [ ] Configurer variables d'env sur Vercel

### P1 - Important
- [ ] Notifications push Firebase (config existante, activer)
- [ ] Chat en temps réel client/washer
- [ ] Tests E2E avec Playwright

### P2 - Nice to have
- [ ] Dark mode
- [ ] Multi-langue (EN)
- [ ] App native (React Native)

---

## 📦 Scripts SQL à Exécuter

### 1. RLS Policies (CRITIQUE)
```sql
-- Exécuter dans Supabase SQL Editor
-- Fichier: /app/supabase/RLS_POLICIES.sql
```

### 2. Nettoyage Tables Deprecated (OPTIONNEL)
```sql
-- Exécuter dans Supabase SQL Editor
-- Fichier: /app/supabase/CLEANUP_DEPRECATED.sql
```

### 3. Diagnostic (déjà fait)
```sql
-- Fichier: /app/SUPABASE_DIAGNOSTIC.sql
```

---

## 📅 Prochaines Actions

1. ✅ Design Uber/Airbnb implémenté
2. ✅ PWA optimisée
3. ✅ Scripts RLS créés
4. ⏳ **Déployer sur Vercel** (git push)
5. ⏳ **Exécuter RLS_POLICIES.sql** sur Supabase
6. ⏳ Tester en production

---

## 📝 Notes Techniques

### Clés API Configurées
- **Supabase** : `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
- **Stripe** : `VITE_STRIPE_PUBLISHABLE_KEY` (pk_test_...)
- **Resend** : `VITE_RESEND_API_KEY`
- **Firebase VAPID** : Configuré pour push notifications

### URLs Importantes
- **Live** : https://kilolab.fr
- **Supabase Dashboard** : https://supabase.com/dashboard/project/dhecegehcjelbxydeolg
- **Stripe Dashboard** : https://dashboard.stripe.com/test

---

*Dernière mise à jour : 25/02/2026 par Emergent Agent - Session Optimisations Complètes*
