# KiloLab - Product Requirements Document

## Vision
Le 1er service de laverie à domicile en France. Marketplace connectant les clients avec des "Washers" pour le lavage au kilo.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Storage) + FastAPI (preview)
- **Serverless**: Vercel Serverless Functions (`/api/`)
- **Paiements**: Stripe | **Emails**: Resend | **Push**: Firebase
- **i18n**: react-i18next (FR/EN) | **Maps**: React-Leaflet
- **Testing**: Playwright E2E

## Implémenté

### Sprint 17 - Bug Fix Critical (01/04/2026)
- [x] **Fix page blanche ClientDashboard** : Suppression du `useState` dupliqué (hook après return conditionnel)
- [x] **Amélioration requête commandes** : Join Supabase avec fallback (washer info + requête simple)
- [x] **Nettoyage code debug** : Suppression console.log et bandeau debug temporaire
- [x] **Script diagnostic SQL** : `DIAGNOSTIC_CLIENT_ORDERS.sql` pour vérifier RLS

### Sprint 16 - UX/UI Améliorations & Corrections (28/03/2026)
- [x] **Suppression de l'IA d'estimation** : Remplacé par système de photos simple
- [x] **Amélioration du menu hamburger mobile** : Nouveau design
- [x] **Onglet suppression compte corrigé** : Bouton "Contacter le support" ajouté
- [x] **Champs noirs corrigés** : Inputs avec `bg-white` et placeholders visibles
- [x] **Message "API Gouvernement" enlevé** : Validation d'adresse discrète
- [x] **Commandes annulées visibles** : ClientDashboard + WasherDashboard

### Sprint 15 - Améliorations "Top Level" (28/03/2026)
- [x] **Validation d'adresse stricte (API Gouv)** : Composant `AddressAutocomplete`
- [x] **Ajustement du poids par le Washer** : Composant `WeightAdjustment`
- [x] **Génération de factures PDF** : Composant `InvoiceGenerator`
- [x] **Système de notation Client → Washer** : Amélioration `submitRating`
- [x] **Historique des gains amélioré** : Onglet "Historique" WasherDashboard

### Sprint 14 - Sécurité & Disponibilité Washer (28/03/2026)
- [x] **Page AccountSettings** : Gestion complète du compte
- [x] **Protection anti-fraude**
- [x] **Système de disponibilité Washer**

### Sprint 13 - Expérience Washer (28/03/2026)
- [x] **Carte des missions** : Vue carte interactive avec Leaflet
- [x] **Notifications email washers** : API `/api/notify-washers`

### Sprint 12 - UX Client & Admin (28/03/2026)
- [x] Menu hamburger enrichi, Page Profile, Minimum 1kg, Code promo mobile fix

### Sprint 11 - Bug Fixes & Auto-Assignment (27/03/2026)
- [x] Fix Dashboard Client, Validation adresse, Auto-assignation Washers, Suivi GPS

### Sprint 10 - PWA & Installation Mobile (16/03/2026)
- [x] PWA Install Banner, Dashboard Live Admin

### Sprints 1-9 (28/02/2026 - 09/03/2026)
- [x] Landing page, Traductions i18n, BecomeWasher, Heatmap, B2B CRUD, Admin Dashboard, Alertes Email, Annulation Commande, PWA, Washer Waitlist, Mentions Légales

## Tests
- Sprint 17: Build successful, pages publiques OK, mobile OK
- iteration_17.json: 100% — 5 features "Top Level" (28/03/2026)
- API send-email: Testé avec curl

## Issues Connues
- **P0**: Commandes client potentiellement bloquées par RLS Supabase (script diagnostic fourni)
- **P2**: Clé Google API exposée dans l'historique Git (action utilisateur requise)

## En Attente (Action Utilisateur)
- [ ] **Tester ClientDashboard** après déploiement (Save to GitHub)
- [ ] **Exécuter DIAGNOSTIC_CLIENT_ORDERS.sql** dans Supabase SQL Editor si les commandes ne s'affichent pas
- [ ] **Révoquer clé Google API** dans Google Cloud Console

## Backlog
- [ ] SMS Twilio (reporté - emails prioritaires)
- [ ] App mobile React Native (P3)

---
*Dernière mise à jour: 01/04/2026 - Sprint 17 (Bug Fix Critical)*
