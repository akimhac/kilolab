# KiloLab - Product Requirements Document

## Vision
Le 1er service de laverie a domicile en France et Belgique.

## Architecture
- Frontend: React 18 + TypeScript + Vite + TailwindCSS
- Backend: Supabase (PostgreSQL, Auth, RLS, Storage) - Plan gratuit
- Serverless: Vercel Functions (/api/)
- Paiements: Stripe | Emails: Resend | Notifications: Polling 15s + Browser API
- i18n: react-i18next (FR/EN) | Maps: React-Leaflet

## Sprint 22 - Bugfix Carte + Validation Commande (06/04/2026)
- [x] Fix OrdersMap.tsx crash "r is not a function" : refactored Leaflet icon init, L.divIcon() lazy creation, ErrorBoundary autour de la carte
- [x] Fix updateMissionStatus : meilleurs messages d'erreur, detection RLS (42501), verification 0 rows updated, logging
- [x] Envoi script SQL RLS par email a l'admin (via API Resend)
- [ ] ACTION UTILISATEUR : Executer FIX_WASHER_UPDATE_RLS.sql dans Supabase SQL Editor (email envoye)
- [ ] ACTION UTILISATEUR : Cliquer "Save to GitHub" pour deployer sur Vercel

## Sprint 21 - Notifications + Emails + Bugfix (06/04/2026)
- [x] Erreur "mise a jour" washer: messages detailles + script RLS (FIX_WASHER_UPDATE_RLS.sql)
- [x] Emails client a chaque etape: washer accepte, collecte, lavage, pret, termine, livre
- [x] Emails client quand washer accepte une mission (avec nom du washer)
- [x] Notifications in-app par polling 15s (useOrderPolling.ts) - sans Supabase Realtime/Pro
- [x] Toast + notification navigateur quand statut change (client) ou nouvelle mission (washer)
- [x] Badge "nouvelles missions" anime sur l'onglet Disponibles (washer)
- [x] Demande permission notification au chargement (client + washer)
- [x] Fallback iOS: Service Worker showNotification si new Notification() echoue
- [x] Tests: iteration_27.json - 100% pass

## Sprint 20 - Abonnement + Smart Assignment + Dual Role (05-06/04/2026)
- [x] Page Abonnement dediee (/subscription) - Formulaire 4 etapes
- [x] Algorithme d'assignation intelligent par distance (Haversine)
- [x] Textes commerciaux integres dans Landing + BecomeWasher
- [x] Toggle Espace Washer/Client dans Navbar
- [x] FIX: firebase.ts lazy init + WasherDashboard sans firebase
- [x] FIX: avatar_url + orders.city supprimes des requetes
- [x] SmartDashboard + ErrorBoundary

## Emails envoyes automatiquement
- Nouvelle commande -> Admin (type: admin_new_order)
- Nouvel utilisateur -> Admin (type: admin_new_user)
- Washer assigne par admin -> Washer (type: washer_assigned)
- Washer accepte mission -> Client (email direct)
- Changement statut (collecte/lavage/pret/termine/livre) -> Client (email direct)
- Annulation admin -> Client + Remboursement Stripe auto

## Notifications in-app (polling)
- Client: detecte changement statut commandes toutes les 15s -> toast + notification navigateur
- Washer: detecte nouvelles missions disponibles toutes les 15s -> toast + notification + badge

## Action utilisateur requise
- [ ] Executer FIX_WASHER_UPDATE_RLS.sql dans Supabase SQL Editor (email envoye le 06/04/2026)
- [ ] Cliquer "Save to GitHub" pour deployer les fixes carte + validation

## Backlog
- [ ] Traduction EN AdminDashboard (P2)
- [ ] SMS Twilio (P2)
- [ ] App mobile React Native (P3)
- [ ] Cle Google API exposee dans Git history (P2 - action utilisateur requise)

---
*Derniere MAJ: 06/04/2026 - Sprint 22*
