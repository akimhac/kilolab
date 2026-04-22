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

## Sprint 24 - MEGA UPDATE Securite + Experience + Finance (19/04/2026)

### Securite (Partie 1)
- [x] RLS active sur ~35 tables (MEGA_FIX_ALL.sql)
- [x] Admin bypass policies sur toutes les tables
- [x] Fix policy SELECT/UPDATE orders pour washers
- [x] Rate limiting API send-email (10/min/IP)
- [x] Rate limiting API stripe-refund (5/min/IP)
- [x] Validation serveur montants Stripe refund
- [x] Headers securite Vercel (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- [x] Audit logs sur remboursements Stripe

### Experience Client (Partie 2)
- [x] Bouton "Re-commander" sur commandes terminees (ReorderButton.tsx)
- [x] Pre-remplissage auto du formulaire commande depuis historique
- [x] Suivi en temps reel washer sur carte (LiveTracking.tsx) - polling 10s
- [x] Prompt avis Google apres note 5 etoiles (GoogleReviewPrompt.tsx)

### Experience Washer (Partie 3)
- [x] Dashboard gains jour/semaine/mois/total (WasherEarnings.tsx)
- [x] Badges gamification auto (1/10/50/100 missions) + trigger SQL
- [x] Onboarding guide 4 etapes (WasherOnboarding.tsx) : profil, Stripe, zone, notifs
- [x] Calendrier disponibilites semaine + jours off (WasherCalendar.tsx)

### Securite Financiere (Partie 4)
- [x] Detection fraude auto : annulations excessives (>5/30j), validations suspectes (>8/1h)
- [x] Table fraud_alerts + trigger SQL
- [x] Onglet Fraude dans Admin Dashboard (FraudAlertsTab)
- [x] Onglet Finance dans Admin Dashboard (FinanceTab) : revenus, payouts, commissions, mensuel
- [x] Audit logs remboursements avec IP, montant, raison

### Technique P2 (Partie 5)
- [x] CDN cache headers Vercel (1 an JS/CSS/fonts, 1 jour images)
- [x] Headers securite API (nosniff, DENY frame, XSS protection)

### Tests
- [x] Iteration 28 : 22/22 (100%) - tests initiaux
- [x] Iteration 29 : 20/20 (100%) - apres mega update
- [ ] ACTION UTILISATEUR : Executer MEGA_FIX_ALL.sql dans Supabase

## Sprint 22-23 (precedents)
- [x] Carte vanilla Leaflet (fix iOS)
- [x] Notifications Uber (T+5/10/20 min)
- [x] Blocage Stripe Connect
- [x] Fix triggers total_amount
- [x] Banniere PWA desactivee

## Backlog
- [ ] SMS Twilio (P2)
- [ ] Chat in-app client-washer (P2)
- [ ] Programme parrainage actif avec lien partageable (P2)
- [ ] Optimisation tournee washer (P2)
- [ ] App mobile React Native (P3)

---
*Derniere MAJ: 19/04/2026 - Sprint 24*
