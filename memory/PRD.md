# KiloLab - Product Requirements Document (PRD)

## 📋 Informations Projet

| Attribut | Valeur |
|----------|--------|
| **Nom** | KiloLab |
| **URL** | kilolab.fr |
| **Déploiement** | Vercel |
| **Version** | 2.0.1 |
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
- **PWA** : vite-plugin-pwa, Service Worker

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
├── supabase/               # Edge Functions
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
- [x] PWA (installable, service worker)
- [x] SEO optimisé (meta tags, schema.org)

### Session 25 Février 2026
- [x] Nettoyage fichiers Netlify (migration Vercel complète)
- [x] Upgrade typographie (Plus Jakarta Sans + Inter)
- [x] Nouveau design Landing page style Uber/Airbnb
- [x] Navbar glassmorphism responsive
- [x] CSS utilities premium (glass, animations, cards)
- [x] Ajout meta PWA iOS (apple-mobile-web-app-*)
- [x] Fix modal popup (click-through)
- [x] Design guidelines JSON documenté

---

## 📊 Score Actuel & Analyse

### Score Global : **8/10** ⬆️ (était 7.5/10)

| Aspect | Score | Détail |
|--------|-------|--------|
| UI/UX Design | 8.5/10 | Style Uber/Airbnb, fonts premium, animations |
| Code Quality | 8/10 | TypeScript, composants modulaires |
| Fonctionnalités | 8/10 | MVP complet, multi-rôles |
| PWA | 7.5/10 | Installable, manifest, iOS support ajouté |
| Performance | 7/10 | Build optimisé, lazy loading |
| Sécurité | 6/10 | RLS à renforcer sur certaines tables |
| Tests | 4/10 | Pas de tests automatisés |

---

## 🔴 Backlog Prioritaire

### P0 - Critique (Avant mise en prod)
- [ ] Activer RLS sur toutes les tables Supabase
- [ ] Revoir policies bloquantes
- [ ] Configurer Stripe webhooks en production
- [ ] Variables d'env sécurisées (pas de clés exposées côté client)

### P1 - Important
- [ ] Notifications push Firebase (partiellement configuré)
- [ ] Chat en temps réel client/washer
- [ ] Améliorer offline mode PWA
- [ ] Ajouter tests E2E (Playwright)

### P2 - Nice to have
- [ ] Dark mode
- [ ] Multi-langue (EN)
- [ ] App native (React Native)
- [ ] Intégration Google Maps pour géolocalisation

---

## 📅 Prochaines Actions

1. **Exécuter le script SQL diagnostic** sur Supabase pour vérifier état des tables/RLS
2. **Déployer sur Vercel** les modifications de design
3. **Configurer Stripe webhook** en production
4. **Renforcer RLS** sans bloquer les actions légitimes

---

## 📝 Notes Techniques

### Clés API (Test)
- **Supabase** : `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
- **Stripe** : `VITE_STRIPE_PUBLISHABLE_KEY` (pk_test_...)
- **Resend** : `VITE_RESEND_API_KEY`
- **Firebase VAPID** : Configuré pour push notifications

### URLs Importantes
- **Live** : https://kilolab.fr
- **Supabase Dashboard** : https://supabase.com/dashboard/project/dhecegehcjelbxydeolg
- **Stripe Dashboard** : https://dashboard.stripe.com

---

*Dernière mise à jour : 25/02/2026 par Emergent Agent*
