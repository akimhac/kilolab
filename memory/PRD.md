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
- [x] Page Abonnement dédiée (/subscription) - Formulaire 4 étapes avec AddressAutocomplete
- [x] Bouton "Créer mon abonnement" redirige vers /subscription (ClientDashboard)
- [x] Algorithme d'assignation intelligent par distance (Haversine) dans AdminDashboard
- [x] Washers triés par proximité GPS (vert <5km, orange <15km, rouge >15km)
- [x] Textes commerciaux intégrés dans Landing.tsx et BecomeWasher.tsx
- [x] Purge du mot "voisins" de tout le codebase
- [x] FIX CRITIQUE: Suppression avatar_url de toutes les requêtes Supabase (OrderTracking, OrderTracker, LiveTracking, ClientDashboard)
- [x] Tests: iterations 21, 22, 23 - 100% pass

## Sprint 19 - Mega Bug Fix + Admin Enhanced (05/04/2026)
- [x] Fix avatar_url column error (ClientDashboard washer join)
- [x] Validation adresse France + Belgique
- [x] Remboursement Stripe automatique
- [x] Admin: modals enrichis, tableaux responsives
- [x] Tests: iteration_20.json - 100% pass

## Sprint 17-18 (01-03/04/2026)
- [x] Fix page blanche ClientDashboard, traductions FR/EN, preferences client, nettoyage RLS

## Sprint 1-16 (28/02-28/03/2026)
- [x] Landing, i18n, BecomeWasher, Heatmap, B2B, Admin, PWA, GPS, Auto-assignment, PhotoCapture, Rating, Invoice

## Bugs connus resolus
- [x] avatar_url inexistant dans la table washers causait des erreurs Supabase (Sprint 20)
- [x] Page blanche ClientDashboard - hooks React (Sprint 18)
- [x] RLS policies orders (Sprint 18)

## Backlog
- [ ] Traduction EN AdminDashboard (P2)
- [ ] SMS Twilio (P2)
- [ ] App mobile React Native (P3)
- [ ] Google API Key: revoquer dans Google Cloud Console (action utilisateur)

---
*Derniere MAJ: 05/04/2026 - Sprint 20*
