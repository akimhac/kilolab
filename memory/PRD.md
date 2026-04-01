# KiloLab - Product Requirements Document

## Vision
Le 1er service de laverie à domicile en France. Marketplace connectant les clients avec des "Washers" pour le lavage au kilo.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Storage) + FastAPI (preview)
- **Serverless**: Vercel Serverless Functions (`/api/`)
- **Paiements**: Stripe | **Emails**: Resend | **Push**: Firebase
- **i18n**: react-i18next (FR/EN) | **Maps**: React-Leaflet

## Implémenté

### Sprint 17 - Bug Fix Critical + Admin Rights (01/04/2026)
- [x] **Fix page blanche ClientDashboard** : Suppression du `useState` dupliqué
- [x] **Amélioration requête commandes** : Join Supabase avec fallback (washer info + requête simple)
- [x] **Nettoyage code debug** : Suppression console.log et bandeau debug temporaire
- [x] **Washer : commandes "paid" visibles** : Ajout du statut "paid" dans la requête des commandes disponibles
- [x] **Admin : Assignation élargie** : Peut assigner un washer sur TOUT statut (pas seulement "pending")
- [x] **Admin : Changement de statut** : Grille de boutons pour changer le statut d'une commande (pending → completed)
- [x] **Admin : Réassignation washer** : Peut changer le washer assigné ou le retirer
- [x] **Admin : Retrait washer** : Peut retirer un washer d'une commande et la remettre en "paid"
- [x] **SQL : FIX_RLS_ADMIN_RIGHTS.sql** : Script complet pour fixer les politiques RLS + droits admin totaux
- [x] **SQL : RLS washers** : Ajout "paid" dans washers_view_available_orders

### Sprint 16 - UX/UI Améliorations & Corrections (28/03/2026)
- [x] Suppression IA d'estimation, PhotoCapture, menu hamburger, commandes annulées

### Sprint 15 - Améliorations "Top Level" (28/03/2026)
- [x] AddressAutocomplete, WeightAdjustment, InvoiceGenerator, Rating, Historique gains

### Sprint 14 - Sécurité & Disponibilité Washer (28/03/2026)
- [x] AccountSettings, Protection anti-fraude, Disponibilité Washer

### Sprint 13 - Expérience Washer (28/03/2026)
- [x] Carte missions, Notifications email washers

### Sprint 10-12 - PWA, Bug Fixes, UX Client (16-28/03/2026)
- [x] PWA, Auto-assignment, GPS tracking, Admin Dashboard Live

### Sprint 1-9 (28/02 - 09/03/2026)
- [x] Landing, i18n, BecomeWasher, Heatmap, B2B, Admin Dark Theme, Email Alerts

## Flux de commande
1. Client crée commande → status = "pending"
2. Client paie (Stripe) → status = "paid"
3. Washer voit la commande disponible (pending/confirmed/paid)
4. Washer accepte → status = "assigned"
5. Admin peut assigner manuellement à tout moment
6. picked_up → washing → ready → completed

## Actions Admin disponibles
- Assigner/Réassigner un washer
- Retirer un washer d'une commande
- Changer le statut de n'importe quelle commande
- Annuler une commande avec message au client
- Approuver/Rejeter les washers
- Gérer coupons, B2B, clients, messages

## En Attente (Action Utilisateur)
- [ ] **Exécuter FIX_RLS_ADMIN_RIGHTS.sql** dans Supabase SQL Editor
- [ ] Tester le flux complet : Client commande → Washer voit → Admin assigne
- [ ] Révoquer clé Google API exposée

## Issues connues mineures
- Changement de langue (EN) : le switch fonctionne mais la plupart des textes dashboard sont hardcodés en FR
- Chunk size warnings au build (optimisation future)

## Backlog
- [ ] Traduction complète EN des dashboards (P2)
- [ ] SMS Twilio (reporté, emails prioritaires)
- [ ] App mobile React Native (P3)

---
*Dernière mise à jour: 01/04/2026 - Sprint 17*
