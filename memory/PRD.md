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

### Sprint 6 - Refonte Admin Dashboard Dark Theme (28/02/2026)
- [x] **Admin Dashboard Dark Theme** : Background slate-900, glass-morphism cards (bg-white/5 backdrop-blur)
- [x] **Stats Cards Modernisées** : Gradients teal/cyan, emerald/blue/violet/orange accents
- [x] **Navigation Tabs Pills** : Design moderne avec pills rounded, gradients actifs
- [x] **Tables Dark Theme** : Toutes les tables (Partners, Washers, Clients, Orders, Messages, Logs, Coupons)
- [x] **Modales Dark Theme** : Partner Modal et Washer Modal avec bg-slate-800
- [x] **B2B Tab Modernisé** : API Keys section violet gradient, partners list dark
- [x] Tests E2E : **28/28 pass** - Admin login dark + toutes les features

### Sprint 5 - Connexion données réelles (28/02/2026)
- [x] **Compteur Live Washers** : Connecté à Supabase (washers créés aujourd'hui + pending)
- [x] **GPS Navigation** : Connecté aux vraies commandes Supabase avec fallback mock
- [x] **Heatmap Admin** : Connectée aux commandes Supabase avec Leaflet

### Sprint 4 - Traductions complètes + Vidéo (28/02/2026)
- [x] **FAQ/Contact/Tarifs traduits** : i18next FR/EN complet
- [x] **Vidéo HTML5** : Stock gratuite Coverr.co sur landing

### Sprint 3 - Features avancées (28/02/2026)
- [x] **Heatmap** : Onglet Admin Dashboard avec carte Leaflet
- [x] **B2B / API** : Onglet Admin avec gestion partenaires, clés API
- [x] **Navigation GPS** : Page /washer-gps avec Google Maps/Apple Maps natif

### Sprint 2 - Refonte BecomeWasher (28/02/2026)
- [x] Hero immersif dark + Simulateur revenus + Témoignages

### Sprint 1 - Bug Fix & Traductions (28/02/2026)
- [x] Traductions i18next + Fix Logo + Refonte Landing

## Tests
- iteration_8.json: **100%** (28 tests) — Admin Dashboard dark theme + Features
- iteration_7.json: 100% (21 tests) — Compteur Live + GPS
- iteration_6.json: 100% (19 tests) — Traductions + Vidéo

## Backlog

### P1
- [ ] B2B : CRUD partenaires avec vrais appels API (actuellement mock data)

### P2
- [ ] App mobile React Native séparée
- [ ] Résoudre warnings React Router v7

---
*Dernière mise à jour: 28/02/2026*
