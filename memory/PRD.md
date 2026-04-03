# KiloLab - Product Requirements Document

## Vision
Le 1er service de laverie a domicile en France. Marketplace connectant clients et Washers.

## Architecture
- Frontend: React 18 + TypeScript + Vite + TailwindCSS
- Backend: Supabase (PostgreSQL, Auth, RLS, Storage)
- Serverless: Vercel Functions (/api/)
- Paiements: Stripe | Emails: Resend | Push: Firebase
- i18n: react-i18next (FR/EN) | Maps: React-Leaflet

## Sprint 18 - Admin UX + Stripe Refund + Preferences (03/04/2026)
- [x] Admin Dashboard responsive mobile (cartes au lieu de tableaux)
- [x] Remboursement Stripe automatique a l'annulation admin (/api/stripe-refund.js)
- [x] Section commandes annulees/remboursees amelioree (visible, distinction annule/rembourse)
- [x] Bouton "Re-commander" rapide (pre-remplissage NewOrder via URL params)
- [x] Tests: iteration_19.json - 100% pass

## Sprint 17 (01/04/2026)
- [x] Fix page blanche ClientDashboard
- [x] Washer voit commandes "paid"
- [x] Admin droits complets (assigner/reassigner/retirer/changer statut)
- [x] Notification email washer a l'assignation admin
- [x] Traductions FR/EN (ClientDashboard + WasherDashboard + orderStatus)
- [x] Nettoyage RLS (6 policies propres)
- [x] Tests: iteration_18.json - 100% pass

## Sprint 16 (28/03/2026)
- [x] Suppression IA estimation, PhotoCapture, menu hamburger, commandes annulees

## Sprint 15 (28/03/2026)
- [x] AddressAutocomplete, WeightAdjustment, InvoiceGenerator, Rating, Historique gains

## Sprint 1-14
- [x] Landing, i18n, BecomeWasher, Heatmap, B2B, Admin, PWA, GPS, Auto-assignment

## Flux de commande
1. Client commande -> pending
2. Client paie (Stripe) -> paid
3. Washer voit (pending/confirmed/paid) et accepte -> assigned
4. Admin peut assigner manuellement + email au washer
5. picked_up -> washing -> ready -> completed
6. Admin annule -> remboursement Stripe auto -> email client

## Actions Admin
- Assigner/Reassigner/Retirer un washer (tous statuts)
- Changer le statut
- Annuler + remboursement Stripe automatique
- Approuver/Rejeter/Bloquer washers
- Gerer coupons, B2B, clients, messages
- Vue responsive mobile (cartes)

## RLS Supabase (6 policies propres)
1. admins_full_access_orders (ALL)
2. clients_view_own_orders (SELECT)
3. clients_create_orders (INSERT)
4. washers_view_available_orders (SELECT)
5. washers_view_own_orders (SELECT)
6. washers_update_orders (UPDATE)

## Backlog
- [ ] Traduction EN AdminDashboard (P2)
- [ ] SMS Twilio (P2)
- [ ] App mobile React Native (P3)

---
*Derniere MAJ: 03/04/2026 - Sprint 18*
