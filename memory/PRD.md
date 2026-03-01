# KiloLab - Product Requirements Document

## Vision
Le 1er service de laverie à domicile en France. Marketplace connectant les clients avec des "Washers" pour le lavage au kilo.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Storage) + FastAPI (preview)
- **Serverless**: Vercel Serverless Functions (`/api/`)
- **AI**: OpenAI GPT-4o via Emergent LLM Key
- **Paiements**: Stripe | **Emails**: Resend | **Push**: Firebase
- **i18n**: react-i18next (FR/EN) | **Maps**: React-Leaflet
- **Testing**: Playwright E2E

## Implémenté

### Sprint 8 - Alertes Admin & Annulation Commandes (01/03/2026)
- [x] **Alertes Email Admin** : Notifications automatiques pour nouvelles inscriptions et commandes
- [x] **Annulation de Commande** : Modal dans Admin Dashboard avec message personnalisé au client
- [x] **API /api/send-email** : Endpoint Resend pour alertes admin et emails clients
- [x] **Fix Signup CGU** : Checkbox CGU/CGV/RGPD correctement placée
- [x] Tests API : Envoi emails ✅ (admin_new_order + admin_new_user)

### Sprint 7 - CRUD B2B + React Router v7 (28/02/2026)
- [x] **CRUD B2B Complet** : create, update, delete, toggleStatus, regenerateApiKey
- [x] **Supabase Table** : b2b_partners avec api_key, plan, status, api_calls, monthly_revenue
- [x] **Modales B2B** : Create partner modal + Edit partner modal (dark theme)
- [x] **React Router v7 Future Flags** : v7_startTransition + v7_relativeSplatPath
- [x] **Warnings Résolus** : Aucun warning React Router dans la console
- [x] Tests E2E : **24/24 pass** - CRUD B2B + No warnings

### Sprint 6 - Refonte Admin Dashboard Dark Theme (28/02/2026)
- [x] **Admin Dashboard Dark Theme** : Glass-morphism, gradients, stats cards modernes
- [x] **Toutes les Tables** : Partners, Washers, Clients, Orders, Messages, Logs, Coupons
- [x] Tests E2E : **28/28 pass**

### Sprint 5 - Connexion données réelles (28/02/2026)
- [x] **Compteur Live Washers** : Supabase (washers du jour + pending)
- [x] **GPS Navigation** : Supabase orders avec fallback mock
- [x] **Heatmap Admin** : Supabase orders avec Leaflet

### Sprint 4 - Traductions + Vidéo (28/02/2026)
- [x] **FAQ/Contact/Tarifs traduits** : i18next FR/EN complet
- [x] **Vidéo HTML5** : Stock gratuite Coverr.co

### Sprint 3 - Features avancées (28/02/2026)
- [x] **Heatmap** : Leaflet dans Admin Dashboard
- [x] **B2B / API Tab** : Gestion partenaires avec CRUD complet
- [x] **Navigation GPS** : Google Maps/Apple Maps natif

### Sprint 2 - Refonte BecomeWasher (28/02/2026)
- [x] Hero immersif dark + Simulateur revenus + Témoignages

### Sprint 1 - Bug Fix & Traductions (28/02/2026)
- [x] Traductions i18next + Fix Logo + Refonte Landing

## Tests
- API send-email: ✅ Testé avec curl (admin_new_order + admin_new_user)
- iteration_9.json: **100%** (24 tests) — CRUD B2B + React Router v7
- iteration_8.json: 100% (28 tests) — Admin Dashboard dark theme
- iteration_7.json: 100% (21 tests) — Compteur Live + GPS

## Configuration Email
- **Resend API Key**: Configurée dans backend/.env et Vercel
- **Admin Email**: akim.hachili@gmail.com (stockée server-side uniquement)
- **From Address**: noreply@kilolab.fr

## Backlog Complété ✅
- ~~Alertes email nouvelles inscriptions/commandes~~ → DONE
- ~~Annulation commande avec message client~~ → DONE
- ~~CRUD B2B partenaires avec vrais appels API~~ → DONE
- ~~Warnings React Router v7~~ → DONE

## Futur (P3)
- [ ] App mobile React Native séparée

---
*Dernière mise à jour: 01/03/2026 - Sprint 8 terminé*
