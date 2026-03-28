# KiloLab - Product Requirements Document

## Vision
Le 1er service de laverie à domicile en France. Marketplace connectant les clients avec des "Washers" pour le lavage au kilo.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Storage) + FastAPI (preview)
- **Serverless**: Vercel Serverless Functions (`/api/`)
- **AI**: OpenAI GPT-4o via Emergent LLM Key
- **Paiements**: Stripe | **Emails**: Resend | **Push**: Firebase
- **i18n**: react-i18next (FR/EN) | **Maps**: React-Leaflet
- **Testing**: Playwright E2E

## Implémenté

### Sprint 10 - PWA & Installation Mobile (16/03/2026)
- [x] **PWA Install Banner** : Bandeau d'installation pour iOS et Android
- [x] **Nouvelles icônes PWA** : icon-192, icon-512, maskable icons, apple-touch-icon
- [x] **manifest.json amélioré** : Shortcuts, display_override, lang
- [x] **Page /trouver corrigée** : Meilleure gestion des erreurs RLS Supabase
- [x] **Notifications Push Toggle** : Bouton d'activation dans le dashboard client
- [x] **Dashboard Live** (`/admin/live`) : Monitoring temps réel des commandes et revenus
  - Stats en temps réel (commandes, CA, clients, washers)
  - Pipeline visuel des commandes
  - Dernières commandes et inscriptions
  - Auto-refresh toutes les 30 secondes
  - Alertes pour commandes en attente

### Sprint 11 - Bug Fixes & Auto-Assignment (27/03/2026)
- [x] **Fix Dashboard Client** : Utilisation de `maybeSingle()` pour éviter les erreurs sur tables vides
- [x] **Validation adresse améliorée** : Regex pour villes et codes postaux valides
- [x] **UI "Pas de Washer" modernisée** : Message positif "Bonne nouvelle ! Kilolab prend en charge votre zone"
- [x] **Webhook Stripe amélioré** : Emails de confirmation client + admin après paiement
- [x] **Auto-assignation Washers** : Algorithme intelligent basé sur localisation et disponibilité
- [x] **Service washerAssignment** : Scoring des washers par proximité géographique
- [x] **Suivi GPS temps réel** : Composant OrderTracking avec position du washer
  - Barre de progression des étapes
  - Infos washer avec appel direct
  - Carte de position animée
  - Mise à jour temps réel (Supabase Realtime)
  - Bouton "Suivre en temps réel" dans les commandes actives

### Sprint 12 - UX Client & Admin (28/03/2026)
- [x] **Menu hamburger enrichi** : Mes commandes, Points fidélité, Mon compte
- [x] **Page Profile** (`/profile`) : Modification nom, téléphone, adresse
- [x] **Minimum 1kg** : Au lieu de 3kg dans NewOrder
- [x] **Code promo mobile fix** : Layout responsive (vertical sur mobile)
- [x] **Admin assignation manuelle** : Dropdown pour assigner un washer aux commandes en attente
- [x] **Fix estimation IA photo** : Nettoyage du base64 et validation format

### Sprint 13 - Expérience Washer (28/03/2026)
- [x] **Carte des missions** : Vue carte interactive avec Leaflet pour voir les commandes proches
- [x] **Toggle carte/liste** : Bouton "Voir la carte" dans le dashboard washer
- [x] **Notifications email washers** : API `/api/notify-washers` pour alerter les washers des nouvelles commandes
- [x] **Préférence notifications** : Checkbox pour activer/désactiver les emails de nouvelles missions
- [x] **Intégration webhook** : Le webhook Stripe appelle notify-washers après paiement
- [x] **Calcul distance Haversine** : Algorithme pour trouver les washers dans le rayon d'action

### Sprint 15 - Améliorations "Top Level" (28/03/2026)
- [x] **Validation d'adresse stricte (API Gouv)** : Composant `AddressAutocomplete`
  - Intégration api-adresse.data.gouv.fr
  - Autocomplétion avec suggestions
  - Validation officielle des adresses françaises
  - Navigation clavier (flèches, Enter, Escape)
  - Stockage des coordonnées GPS pour le washer
- [x] **Ajustement du poids par le Washer** : Composant `WeightAdjustment`
  - Modal accessible depuis MissionModal sur missions "assigned"
  - Slider de 1 à 30kg avec boutons d'ajustement rapide
  - Raison obligatoire pour écarts > 2kg
  - Notification automatique au client avec nouveau prix
  - Recalcul du prix total
- [x] **Génération de factures PDF** : Composant `InvoiceGenerator`
  - Bouton "Facture" sur commandes complétées (ClientDashboard)
  - HTML imprimable dans nouvelle fenêtre
  - Numéro de facture, TVA 20%, format professionnel français
  - Informations client et détail du service
- [x] **Système de notation Client → Washer** : Amélioration `submitRating`
  - Mise à jour automatique de `washers.avg_rating` et `washers.total_ratings`
  - Bonus +50 points fidélité pour chaque avis
  - Affichage des étoiles sur profil washer
- [x] **Historique des gains amélioré** : Onglet "Historique" WasherDashboard
  - Résumé des gains (semaine, mois, total, moyenne)
  - Ventilation mensuelle avec regroupement automatique
  - Liste détaillée des missions avec ID et adresse

### Sprint 14 - Sécurité & Disponibilité Washer (28/03/2026)
- [x] **Page AccountSettings** (`/account-settings`) : Gestion complète du compte
  - Onglet Profil : Modification infos personnelles
  - Onglet Notifications : Préférences email/push
  - Onglet Sécurité : Reset mot de passe, déconnexion globale
  - Onglet Supprimer : Suppression compte avec protections anti-fraude
- [x] **Protection anti-fraude** :
  - Blocage si commandes actives
  - Blocage si paiements en attente (washers)
  - Délai de 30 jours après dernier paiement
  - Confirmation par saisie "SUPPRIMER"
  - Anonymisation des données (conformité RGPD)
- [x] **Système de disponibilité Washer** :
  - Toggle disponible/indisponible
  - Mode vacances avec dates
  - Horaires de travail par jour
  - Absences planifiées avec motif

### Sprint 8 - Alertes Admin & Annulation Commandes (01/03/2026)
- [x] **Alertes Email Admin** : Notifications automatiques pour nouvelles inscriptions et commandes
- [x] **Annulation de Commande** : Modal dans Admin Dashboard avec message personnalisé au client
- [x] **API /api/send-email** : Endpoint Resend pour alertes admin et emails clients
- [x] **Fix Signup CGU** : Checkbox CGU/CGV/RGPD correctement placée
- [x] Tests API : Envoi emails ✅ (admin_new_order + admin_new_user)

### Sprint 8.1 - Refonte UX Landing & Tarifs (01/03/2026)
- [x] **Nouvelle vidéo** : Vidéo Pexels HD de qualité professionnelle
- [x] **Suppression texte** : "Vidéo de démonstration..." supprimé
- [x] **Nouvelle section Bénéfices** : Design startup moderne remplaçant le comparateur
  - Cartes "Fini les corvées", "Plus de temps libre", "L'esprit tranquille"
  - Section "Idéal pour vous si..." avec CTA
- [x] **Page Tarifs** : Même refonte bénéfices, plus de comparateur prix

### Sprint 9 - Tests Pré-lancement & Fonctionnalités (09/03/2026)
- [x] **Page Washer Waitlist** : Espace pré-lancement pour les washers en attente
  - Formation en 5 modules avec progression
  - Système de parrainage clients (5€/filleul)
  - Stats de zone (clients inscrits, seuil activation)
  - Badge "Certifié Washer" après formation complète
- [x] **Mentions Légales complètes** : Editeur, hébergement, propriété intellectuelle, RGPD
- [x] **Page /trouver corrigée** : Fallback mock data si RLS bloque
- [x] **Annulation commande** : Corrigé (trigger Supabase à modifier côté DB)
- [x] **Bandeau inscription obligatoire** : Sur /new-order pour non-connectés
- [x] **Kit Instagram** : 12 visuels + 20 photos libres de droit + légendes complètes

### Sprint 7 - CRUD B2B + React Router v7 (28/02/2026)
- [x] **CRUD B2B Complet** : create, update, delete, toggleStatus, regenerateApiKey
- [x] **Supabase Table** : b2b_partners avec api_key, plan, status, api_calls, monthly_revenue
- [x] **Modales B2B** : Create partner modal + Edit partner modal (dark theme)
- [x] **React Router v7 Future Flags** : v7_startTransition + v7_relativeSplatPath
- [x] **Warnings Résolus** : Aucun warning React Router dans la console
- [x] Tests E2E : **24/24 pass** - CRUD B2B + No warnings

### Sprint 6 - Refonte Admin Dashboard Dark Theme (28/02/2026)
- [x] **Admin Dashboard Dark Theme** : Glass-morphism, gradients, stats cards modernes
- [x] **Toutes les Tables** : Partners, Washers, Clients, Orders, Messages, Logs, Coupons
- [x] Tests E2E : **28/28 pass**

### Sprint 5 - Connexion données réelles (28/02/2026)
- [x] **Compteur Live Washers** : Supabase (washers du jour + pending)
- [x] **GPS Navigation** : Supabase orders avec fallback mock
- [x] **Heatmap Admin** : Supabase orders avec Leaflet

### Sprint 4 - Traductions + Vidéo (28/02/2026)
- [x] **FAQ/Contact/Tarifs traduits** : i18next FR/EN complet
- [x] **Vidéo HTML5** : Stock gratuite Coverr.co

### Sprint 3 - Features avancées (28/02/2026)
- [x] **Heatmap** : Leaflet dans Admin Dashboard
- [x] **B2B / API Tab** : Gestion partenaires avec CRUD complet
- [x] **Navigation GPS** : Google Maps/Apple Maps natif

### Sprint 2 - Refonte BecomeWasher (28/02/2026)
- [x] Hero immersif dark + Simulateur revenus + Témoignages

### Sprint 1 - Bug Fix & Traductions (28/02/2026)
- [x] Traductions i18next + Fix Logo + Refonte Landing

## Tests
- iteration_17.json: **100%** — 5 features "Top Level" vérifiées (28/03/2026)
- API send-email: ✅ Testé avec curl (admin_new_order + admin_new_user)
- iteration_12.json: **100%** — Test pré-lancement complet (16/03/2026)
- iteration_9.json: **100%** (24 tests) — CRUD B2B + React Router v7
- iteration_8.json: 100% (28 tests) — Admin Dashboard dark theme
- iteration_7.json: 100% (21 tests) — Compteur Live + GPS

## Configuration Email
- **Resend API Key**: Configurée dans backend/.env et Vercel
- **Admin Email**: akim.hachili@gmail.com (stockée server-side uniquement)
- **From Address**: noreply@kilolab.fr

## Backlog Complété ✅
- ~~Alertes email nouvelles inscriptions/commandes~~ → DONE
- ~~Annulation commande avec message client~~ → DONE
- ~~CRUD B2B partenaires avec vrais appels API~~ → DONE
- ~~Warnings React Router v7~~ → DONE
- ~~PWA Install Banner iOS/Android~~ → DONE (16/03/2026)

## En Attente (Action Utilisateur)
- [ ] **STRIPE_SECRET_KEY** : Ajouter dans Vercel > Environment Variables
- [ ] **RLS Supabase** : Autoriser SELECT public sur table `washers`

## Futur (P3)
- [ ] App mobile React Native séparée

---
*Dernière mise à jour: 28/03/2026 - Sprint 15 terminé (5 améliorations "Top Level")*
