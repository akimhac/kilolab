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

### Sprint 4 - Traductions complètes + Vidéo (28/02/2026)
- [x] **FAQ traduite** : useTranslation hook avec 12 questions/réponses FR/EN
- [x] **Contact traduit** : Formulaire, cartes info (Email, Horaires, Zone) FR/EN
- [x] **Tarifs traduit** : Pricing cards, comparatif, FAQ tarifs FR/EN
- [x] **Vidéo HTML5** : Remplacé iframe YouTube par vidéo Coverr.co gratuite
- [x] **Heatmap connectée** : Composant OrderHeatmap.tsx intégré dans Admin Dashboard
- [x] Tests E2E : **19/19 pass** - Traductions FR/EN + navigation + vidéo

### Sprint 3 - Features avancées (28/02/2026)
- [x] **Compteur live** : "[X] Washers se sont inscrits aujourd'hui" sur BecomeWasher
- [x] **Vidéo embarquée** : Section sur la landing ✅ REMPLACÉ par vidéo stock gratuite
- [x] **Heatmap** : Onglet dans Admin Dashboard avec stats par ville
- [x] **B2B / API** : Onglet Admin avec gestion partenaires, clés API, docs, stats
- [x] **Navigation GPS** : Page /washer-gps avec carte, ordres, actions, file d'attente
- [x] **Tests E2E Playwright** : 18 tests couvrant landing, BecomeWasher, login, FAQ, contact, tarifs, GPS, mobile responsive

### Sprint 2 - Refonte BecomeWasher (28/02/2026)
- [x] Hero immersif dark "Votre machine tourne. Votre compte aussi."
- [x] Simulateur de revenus interactif (10-100kg)
- [x] Témoignages Washers + CTA final gradient
- [x] Formulaire 3 étapes dark premium
- [x] Accents français correctement affichés

### Sprint 1 - Bug Fix & Traductions (28/02/2026)
- [x] Traductions i18next sur 8 composants majeurs (~280 clés FR/EN)
- [x] Fix Logo "Kilolab" visible sur toutes les pages
- [x] Refonte Landing : Social Proof, Comparateur Coûts, CTA
- [x] Connexion des fonctionnalités (Settings, Analytics, onglets)

### Features existantes
- [x] Chat, Parrainage, Admin Heatmap, Push Notifications, Dark Mode
- [x] Analytics avancés, Playwright setup

## Tests
- iteration_6.json: **100%** (19 tests) — FAQ/Contact/Tarifs traductions + Vidéo + Navigation
- iteration_5.json: 100% (17 tests) — BecomeWasher redesign + régression
- iteration_4.json: 100% (17 tests) — Landing/Nav/Footer/Settings/Login
- E2E Playwright: **18/18 pass** — Landing, BecomeWasher, Login, FAQ, Contact, Tarifs, GPS, Mobile

## Backlog

### P0
- [ ] ⚠️ Clé Google API exposée dans Git (SÉCURITÉ CRITIQUE - à révoquer)

### P1
- [ ] Connecter Heatmap à PostGIS / données réelles
- [ ] GPS : intégrer vraie navigation turn-by-turn (Leaflet routing gratuit)
- [ ] B2B : CRUD partenaires avec vrais appels API
- [ ] Compteur Washers Live : endpoint backend temps réel

### P2
- [ ] Refonte visuelle Admin Dashboard (chiffres, graphiques modernes)
- [ ] App mobile React Native séparée
- [ ] Résoudre warnings React Router v7

---
*Dernière mise à jour: 28/02/2026*
