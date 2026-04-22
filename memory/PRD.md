# KiloLab - Product Requirements Document

## Vision
Le 1er service de laverie a domicile en France et Belgique.

## Architecture
- Frontend: React 18 + TypeScript + Vite + TailwindCSS
- Backend: Supabase (PostgreSQL, Auth, RLS, Storage)
- Serverless: Vercel Functions (/api/)
- Paiements: Stripe | Emails: Resend | Notifications: Polling 15s + Browser API
- Maps: Leaflet vanilla (iOS Safari compatible)

## Sprint 23 - Securite RLS + Tests complets (19/04/2026)
- [x] Script RLS complet pour ~30 tables (FIX_SECURITY_COMPLETE.sql)
- [x] Admin bypass policies sur toutes les tables
- [x] Fix policy SELECT orders pour washers (washer_id = washers.id)
- [x] Tests frontend complets : 22/22 passes (iteration_28)
- [ ] ACTION UTILISATEUR : Executer FIX_SECURITY_COMPLETE.sql dans Supabase

## Sprint 22 - Carte + Notifications Uber + Stripe Guard (06/04/2026)
- [x] Banniere PWA desactivee
- [x] OrdersMap reecrit en Leaflet vanilla (fix iOS Safari)
- [x] Notifications Uber escaladantes (T+5/10/20 min)
- [x] Blocage completion si Stripe Connect non configure
- [x] Fix trigger_insurance_contribution (total_amount)
- [x] Fix RLS washers_update_orders
- [x] Triggers fidelite + B2B recrees proprement

## Circuit complet
### Client:
1. Inscription > Commande (adresse, poids, formule, creneau)
2. Paiement Stripe > argent sur compte KiloLab
3. Admin assigne washer OU washer accepte
4. Notifications email a chaque etape
5. Suivi en temps reel > Commande livree > Note washer

### Washer:
1. Inscription > Validation admin
2. Configure Stripe Connect (IBAN) - OBLIGATOIRE avant validation
3. Notifications: nouvelle mission + rappels 5/10/20 min
4. Accepte > Collecte > Lavage > Termine > Livre
5. Recoit 60% via virement Stripe

### Admin:
1. Nouvelles commandes/inscriptions (email)
2. Assigne washers (algo Haversine)
3. Annulation + remboursement auto Stripe

## Backlog
- [ ] SMS Twilio (P2)
- [ ] App mobile React Native (P3)

---
*Derniere MAJ: 19/04/2026 - Sprint 23*
