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
- **Testing**: Playwright E2E (18 tests)

## Implémenté

### Sprint 1 - Bug Fix & Traductions (28/02/2026)
- [x] Traductions i18next sur 8 composants majeurs (~280 clés FR/EN)
- [x] Fix Logo "Kilolab" visible sur toutes les pages
- [x] Refonte Landing : Social Proof, Comparateur Coûts, CTA
- [x] Connexion des fonctionnalités (Settings, Analytics, onglets)

### Sprint 2 - Refonte BecomeWasher (28/02/2026)
- [x] Hero immersif dark "Votre machine tourne. Votre compte aussi."
- [x] Simulateur de revenus interactif (10-100kg)
- [x] Témoignages Washers + CTA final gradient
- [x] Formulaire 3 étapes dark premium
- [x] Accents français correctement affichés

### Sprint 3 - Features avancées (28/02/2026)
- [x] **Compteur live** : "[X] Washers se sont inscrits aujourd'hui" sur BecomeWasher
- [x] **Vidéo embarquée** : Section YouTube sur la landing (placeholder, à remplacer)
- [x] **Heatmap** : Onglet dans Admin Dashboard avec stats par ville
- [x] **B2B / API** : Onglet Admin avec gestion partenaires, clés API, docs, stats
- [x] **Navigation GPS** : Page /washer-gps avec carte, ordres, actions, file d'attente
- [x] **Tests E2E Playwright** : 18 tests couvrant landing, BecomeWasher, login, FAQ, contact, tarifs, GPS, mobile responsive — **100% pass**
- [x] Traductions importées sur FAQ, Contact, Tarifs (hook ready)

### Features existantes
- [x] Chat, Parrainage, Admin Heatmap, Push Notifications, Dark Mode
- [x] Analytics avancés, Playwright setup

## Tests
- iteration_4.json: 100% (17 tests) — Landing/Nav/Footer/Settings/Login
- iteration_5.json: 100% (17 tests) — BecomeWasher redesign + régression
- E2E Playwright: **18/18 pass** — Landing, BecomeWasher, Login, FAQ, Contact, Tarifs, GPS, Mobile

## Backlog

### P0
- [ ] Clé Google API exposée dans Git (à discuter)
- [ ] Remplacer vidéo placeholder YouTube par vidéo marketing Kilolab

### P1
- [ ] Connecter Heatmap à PostGIS / données réelles
- [ ] GPS : intégrer Google Maps SDK pour vraie navigation
- [ ] B2B : CRUD partenaires avec vrais appels API

### P2
- [ ] Refonte visuelle Admin Dashboard (chiffres, graphiques)
- [ ] App mobile React Native

---
*Dernière mise à jour: 28/02/2026*
