# KiloLab - Product Requirements Document

## Vision
Le 1er service de laverie a domicile en France et Belgique.

## Architecture
- Frontend: React 18 + TypeScript + Vite + TailwindCSS
- Backend: Supabase (PostgreSQL, Auth, RLS, Storage)
- Serverless: Vercel Functions (/api/)
- Paiements: Stripe | Emails: Resend | Push: Firebase
- i18n: react-i18next (FR/EN) | Maps: React-Leaflet

## Sprint 20 - Abonnement + Smart Assignment + Commercial + Bugfix (05/04/2026)
- [x] Page Abonnement dédiée (/subscription) - Formulaire 4 étapes
- [x] Algorithme d'assignation intelligent par distance (Haversine) dans AdminDashboard
- [x] Textes commerciaux intégrés dans Landing.tsx et BecomeWasher.tsx
- [x] FIX: Suppression avatar_url de toutes les requêtes Supabase (4 fichiers)
- [x] FIX: Suppression column 'city' des requêtes orders (OrderTracking, washerAssignment, AdminDashboard, OrdersMap)
- [x] FIX: SmartDashboard - routing intelligent selon le rôle (washer→washer-dashboard, admin→admin, client→client)
- [x] FIX: Navbar role-aware (Mes missions pour washers, Mes commandes pour clients, fidélité masqué pour washers/admins)
- [x] Tests: iterations 21-24 - 100% pass

## Sprint 19 - Mega Bug Fix + Admin Enhanced (05/04/2026)
- [x] Validation adresse, Remboursement Stripe auto, Admin modals, Tableaux responsives
- [x] Tests: iteration_20.json - 100% pass

## Sprint 1-18 (28/02-03/04/2026)
- [x] Landing, i18n, BecomeWasher, Heatmap, B2B, Admin, PWA, GPS, Auto-assignment, PhotoCapture, Rating, Invoice
- [x] Fix page blanche ClientDashboard, traductions FR/EN, nettoyage RLS

## Bugs connus resolus
- [x] avatar_url inexistant dans la table washers (Sprint 20)
- [x] column orders.city inexistant (Sprint 20)
- [x] Washer redirigé vers ClientDashboard (Sprint 20 - SmartDashboard)
- [x] Menu hamburger identique pour tous les rôles (Sprint 20)

## Backlog
- [ ] Traduction EN AdminDashboard (P2)
- [ ] SMS Twilio (P2)
- [ ] App mobile React Native (P3)
- [ ] Google API Key: revoquer dans Google Cloud Console (action utilisateur)

---
*Derniere MAJ: 05/04/2026 - Sprint 20*
