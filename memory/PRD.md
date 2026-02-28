# KiloLab - Product Requirements Document

## Vision
Le 1er service de laverie à domicile en France. Marketplace connectant les clients avec des "Washers" pour le lavage au kilo.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Storage)
- **Serverless**: Vercel Serverless Functions (`/api/`)
- **AI**: OpenAI GPT-4o via Emergent LLM Key
- **Paiements**: Stripe | **Emails**: Resend | **Push**: Firebase
- **i18n**: react-i18next (FR/EN) | **Maps**: React-Leaflet
- **Testing**: Playwright E2E

## Implémenté

### Sprint 5 - Connexion données réelles (28/02/2026)
- [x] **Compteur Live Washers** : Connecté à Supabase (washers créés aujourd'hui + pending)
- [x] **GPS Navigation** : Connecté aux vraies commandes Supabase avec fallback mock
- [x] **Heatmap Admin** : Déjà connectée aux commandes Supabase
- [x] Tests E2E : **21/21 pass** - Compteur + GPS + Traductions

### Sprint 4 - Traductions complètes + Vidéo (28/02/2026)
- [x] **FAQ traduite** : useTranslation hook avec 12 questions/réponses FR/EN
- [x] **Contact traduit** : Formulaire, cartes info (Email, Horaires, Zone) FR/EN
- [x] **Tarifs traduit** : Pricing cards, comparatif, FAQ tarifs FR/EN
- [x] **Vidéo HTML5** : Remplacé iframe YouTube par vidéo Coverr.co gratuite
- [x] Tests E2E : **19/19 pass** - Traductions FR/EN + navigation + vidéo

### Sprint 3 - Features avancées (28/02/2026)
- [x] **Compteur live** : "[X] Washers se sont inscrits aujourd'hui" sur BecomeWasher
- [x] **Vidéo embarquée** : Section sur la landing avec vidéo stock gratuite
- [x] **Heatmap** : Onglet dans Admin Dashboard avec carte Leaflet
- [x] **B2B / API** : Onglet Admin avec gestion partenaires, clés API, docs, stats
- [x] **Navigation GPS** : Page /washer-gps avec Google Maps/Apple Maps natif (gratuit)

### Sprint 2 - Refonte BecomeWasher (28/02/2026)
- [x] Hero immersif dark "Votre machine tourne. Votre compte aussi."
- [x] Simulateur de revenus interactif (10-100kg)
- [x] Témoignages Washers + CTA final gradient
- [x] Formulaire 3 étapes dark premium

### Sprint 1 - Bug Fix & Traductions (28/02/2026)
- [x] Traductions i18next sur 8 composants majeurs (~280 clés FR/EN)
- [x] Fix Logo "Kilolab" visible sur toutes les pages
- [x] Refonte Landing : Social Proof, Comparateur Coûts, CTA

### Features existantes
- [x] Chat, Parrainage, Admin Heatmap, Push Notifications, Dark Mode
- [x] Analytics avancés, Playwright setup

## Tests
- iteration_7.json: **100%** (21 tests) — Compteur Live + GPS + Sprint final
- iteration_6.json: 100% (19 tests) — Traductions + Vidéo
- iteration_5.json: 100% (17 tests) — BecomeWasher redesign

## Backlog

### P1
- [ ] B2B : CRUD partenaires avec vrais appels API
- [ ] Refonte visuelle Admin Dashboard (design moderne)

### P2
- [ ] App mobile React Native séparée
- [ ] Résoudre warnings React Router v7

---
*Dernière mise à jour: 28/02/2026*
