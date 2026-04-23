# KiloLab - Product Requirements Document

## Vision
Le 1er service de laverie a domicile en France et Belgique.

## Architecture
- Frontend: React 18 + TypeScript + Vite + TailwindCSS
- Backend: Supabase (PostgreSQL, Auth, RLS, Storage)
- Serverless: Vercel Functions (/api/) avec rate limiting
- Paiements: Stripe + Connect | Emails: Resend | Notifications: Polling 15s + Browser API
- Maps: Leaflet vanilla (iOS Safari compatible)
- CDN: Vercel Edge + cache headers (1 an assets, 1 jour images)

## Sprint 24 - MEGA UPDATE (19/04/2026) - COMPLETE

### Securite
- [x] RLS sur ~35 tables (MEGA_FIX_ALL.sql)
- [x] Rate limiting send-email (10/min) + stripe-refund (5/min)
- [x] Validation serveur montants Stripe
- [x] Headers securite Vercel (nosniff, X-Frame, XSS)
- [x] Audit logs remboursements

### Experience Client
- [x] Re-commander 1 clic (ReorderButton + pre-remplissage NewOrder)
- [x] Suivi temps reel washer sur carte (LiveTracking, polling 10s)
- [x] Prompt avis Google apres 5 etoiles
- [x] Chat in-app client <-> washer (deja existant cote client, AJOUTE cote washer)

### Experience Washer
- [x] Dashboard gains jour/semaine/mois (WasherEarnings)
- [x] Badges gamification auto (1/10/50/100 missions)
- [x] Onboarding guide 4 etapes (WasherOnboarding)
- [x] Calendrier disponibilites + jours off (WasherCalendar)
- [x] Optimisation tournee par proximite (RouteOptimizer, Haversine clustering)
- [x] Chat in-app washer -> client (ChatBubble)

### Securite Financiere
- [x] Detection fraude auto (annulations, validations suspectes)
- [x] Onglet Fraude admin
- [x] Onglet Finance admin (revenus, payouts, commissions, mensuel)
- [x] Audit logs remboursements

### Technique
- [x] CDN cache headers Vercel (1 an JS/CSS, 1 jour images)
- [x] Headers securite API

### Tests : 3 iterations 100%
- [x] Iteration 28 : 22/22 pass
- [x] Iteration 29 : 20/20 pass
- [x] Iteration 30 : 22/22 pass

### Action utilisateur
- [ ] Executer MEGA_FIX_ALL.sql dans Supabase SQL Editor
- [ ] Cliquer "Save to GitHub" pour deployer

## Backlog
- [ ] Programme parrainage actif avec lien partageable (P2) - base ReferralSystem existe deja
- [ ] SMS Twilio (P2) - necessite API key
- [ ] App mobile React Native (P3)

---
*Derniere MAJ: 19/04/2026 - Sprint 24 COMPLETE*
