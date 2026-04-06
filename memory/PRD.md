# KiloLab - Product Requirements Document

## Vision
Le 1er service de laverie a domicile en France et Belgique.

## Architecture
- Frontend: React 18 + TypeScript + Vite + TailwindCSS
- Backend: Supabase (PostgreSQL, Auth, RLS, Storage) - Plan gratuit
- Serverless: Vercel Functions (/api/)
- Paiements: Stripe | Emails: Resend | Notifications: Polling 15s + Browser API
- Maps: Leaflet vanilla (sans react-leaflet - iOS Safari compatible)

## Sprint 22.2 - Carte + Notifications Uber + Stripe Guard (06/04/2026)
- [x] Desactive banniere PWA "Installez Kilolab" (app native pas prete)
- [x] Reecrit OrdersMap.tsx en Leaflet vanilla (fix crash iOS Safari "r is not a function")
- [x] Notifications escaladantes style Uber (T+5min, T+10min, T+20min)
- [x] Blocage "Marquer comme terminee" si Stripe Connect non configure
- [x] Identifie et supprime trigger_insurance_contribution (total_amount bug)

## Sprint 22 - Bugfix Triggers + RLS (06/04/2026)
- [x] Fix trigger defectueux total_amount (trigger_insurance_contribution)
- [x] Fix RLS washers_update_orders
- [x] Envoi SQL par email a l'admin
- [x] Amelioration messages d'erreur updateMissionStatus

## Sprint 21 - Notifications + Emails + Bugfix (06/04/2026)
- [x] Emails client a chaque etape
- [x] Notifications in-app par polling 15s (useOrderPolling.ts)
- [x] Toast + notification navigateur
- [x] Fallback iOS: Service Worker showNotification

## Sprint 20 - Abonnement + Smart Assignment + Dual Role (05-06/04/2026)
- [x] Page Abonnement dediee (/subscription)
- [x] Algorithme d'assignation intelligent par distance (Haversine)
- [x] Toggle Espace Washer/Client dans Navbar
- [x] SmartDashboard + ErrorBoundary

## Circuit complet
### Client:
1. Inscription > Commande (adresse, poids, formule, creneau)
2. Paiement Stripe > argent sur compte KiloLab
3. Admin assigne washer OU washer accepte
4. Notifications email a chaque etape
5. Suivi en temps reel > Commande livree
6. Note le washer

### Washer:
1. Inscription > Validation admin
2. Configure Stripe Connect (IBAN) - OBLIGATOIRE avant validation commande
3. Notifications: nouvelle mission + rappels Uber (5/10/20 min)
4. Accepte > Collecte > Lavage > Termine > Livre
5. Recoit 60% via virement Stripe

### Admin:
1. Nouvelles commandes/inscriptions (email)
2. Assigne washers (algo Haversine)
3. Annulation + remboursement auto Stripe

## Triggers DB a recreer
- [ ] set_order_qr (BEFORE INSERT) - genere QR code pour nouvelles commandes
- [ ] trigger_order_completed (BEFORE UPDATE) - points fidelite
- [ ] trigger_update_b2b_stats (AFTER UPDATE) - stats B2B

## Backlog
- [ ] Recreer triggers DB avec bonnes colonnes (P1)
- [ ] SMS Twilio (P2)
- [ ] Refactoring AdminDashboard.tsx >3300 lignes (P2)
- [ ] Cle Google API exposee dans Git history (P2)
- [ ] App mobile React Native (P3)

---
*Derniere MAJ: 06/04/2026 - Sprint 22.2*
