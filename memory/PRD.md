# KiloLab - Product Requirements Document

## Vision
Le 1er service de laverie a domicile en France. Marketplace connectant les clients avec des "Washers" pour le lavage au kilo.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Storage)
- **Serverless**: Vercel Serverless Functions (`/api/`)
- **Paiements**: Stripe | **Emails**: Resend | **Push**: Firebase
- **i18n**: react-i18next (FR/EN) | **Maps**: React-Leaflet

## Implemente

### Sprint 17 - Bug Fix + Admin Rights + Traductions (01/04/2026)
- [x] Fix page blanche ClientDashboard (useState duplique)
- [x] Amelioration requete commandes (join Supabase + fallback)
- [x] Washer : commandes "paid" visibles dans les missions disponibles
- [x] Admin : Assignation elargie (tous statuts, pas seulement "pending")
- [x] Admin : Changement de statut via grille de boutons (pending -> completed)
- [x] Admin : Reassignation washer + retrait washer
- [x] Admin : Notification email au washer quand assigne (/api/send-email type washer_assigned)
- [x] Traductions FR/EN : ClientDashboard (greeting, stats, tabs, rating, empty states)
- [x] Traductions FR/EN : WasherDashboard (greeting, stats, tabs, missions, earnings)
- [x] Traductions FR/EN : orderStatus (tous les statuts avec descriptions)
- [x] SQL : FIX_RLS_ADMIN_RIGHTS.sql (RLS fix + admin full rights)
- [x] Tests : iteration_18.json - 100% pass (pages publiques, i18n, mobile)

### Sprint 16 (28/03/2026)
- [x] Suppression IA estimation, PhotoCapture, menu hamburger, commandes annulees

### Sprint 15 (28/03/2026)
- [x] AddressAutocomplete, WeightAdjustment, InvoiceGenerator, Rating, Historique gains

### Sprint 14 (28/03/2026)
- [x] AccountSettings, Protection anti-fraude, Disponibilite Washer

### Sprint 13 (28/03/2026)
- [x] Carte missions, Notifications email washers

### Sprint 10-12 (16-28/03/2026)
- [x] PWA, Auto-assignment, GPS tracking, Admin Dashboard Live

### Sprint 1-9 (28/02-09/03/2026)
- [x] Landing, i18n, BecomeWasher, Heatmap, B2B, Admin Dark Theme, Email Alerts

## Flux de commande
1. Client cree commande -> status = "pending"
2. Client paie (Stripe) -> status = "paid"
3. Washer voit la commande disponible (pending/confirmed/paid)
4. Washer accepte -> status = "assigned"
5. Admin peut assigner manuellement + notification email au washer
6. picked_up -> washing -> ready -> completed

## Actions Admin
- Assigner/Reassigner/Retirer un washer
- Changer le statut de n'importe quelle commande
- Annuler une commande avec message au client
- Approuver/Rejeter les washers
- Gerer coupons, B2B, clients, messages

## En Attente (Action Utilisateur)
- [ ] Executer FIX_RLS_ADMIN_RIGHTS.sql dans Supabase SQL Editor
- [ ] Tester le flux complet : Client commande -> Washer voit -> Admin assigne
- [ ] Revoquer cle Google API exposee

## Backlog
- [ ] Traduction complete EN du AdminDashboard (P2)
- [ ] SMS Twilio (reporte, emails prioritaires)
- [ ] App mobile React Native (P3)

---
*Derniere mise a jour: 01/04/2026 - Sprint 17*
