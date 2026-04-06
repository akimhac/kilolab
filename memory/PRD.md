# KiloLab - Product Requirements Document

## Vision
Le 1er service de laverie a domicile en France et Belgique.

## Architecture
- Frontend: React 18 + TypeScript + Vite + TailwindCSS
- Backend: Supabase (PostgreSQL, Auth, RLS, Storage)
- Serverless: Vercel Functions (/api/)
- Paiements: Stripe | Emails: Resend | Push: Firebase (lazy init)
- i18n: react-i18next (FR/EN) | Maps: React-Leaflet

## Sprint 20 - Features + Bugfix Majeur (05-06/04/2026)
- [x] Page Abonnement dédiée (/subscription) - Formulaire 4 étapes
- [x] Algorithme d'assignation intelligent par distance (Haversine) dans AdminDashboard
- [x] Textes commerciaux intégrés dans Landing.tsx et BecomeWasher.tsx
- [x] Toggle Espace Washer/Client dans Navbar (desktop + mobile)
- [x] FIX CRITIQUE: firebase.ts réécrit avec lazy init + isSupported() (corrige page blanche iOS Safari)
- [x] ErrorBoundary global ajouté (plus jamais de page blanche silencieuse)
- [x] FIX: Suppression avatar_url de toutes les requêtes Supabase
- [x] FIX: Suppression column 'city' des requêtes orders
- [x] FIX: SmartDashboard - routing intelligent selon le rôle
- [x] Tests: iterations 21-26 - 100% pass

## Bugs connus resolus
- [x] Page blanche WasherDashboard iOS Safari: firebase.ts getMessaging() crash (Sprint 20)
- [x] avatar_url inexistant dans washers (Sprint 20)
- [x] column orders.city inexistant (Sprint 20)
- [x] Washer redirigé vers ClientDashboard (Sprint 20 - SmartDashboard)

## Backlog
- [ ] Traduction EN AdminDashboard (P2)
- [ ] SMS Twilio (P2)
- [ ] App mobile React Native (P3)

---
*Derniere MAJ: 06/04/2026 - Sprint 20*
