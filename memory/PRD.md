# KiloLab - Product Requirements Document

## Vision
Le 1er service de laverie à domicile en France. Marketplace connectant les clients avec des "Washers" pour le lavage au kilo.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Storage)
- **Serverless**: Vercel Serverless Functions (`/api/`)
- **AI**: OpenAI GPT-4o via Emergent LLM Key
- **Paiements**: Stripe
- **Emails**: Resend
- **Push Notifications**: Firebase
- **i18n**: react-i18next (FR/EN)
- **Maps**: React-Leaflet (admin heatmap)

## Ce qui a été implémenté

### Sprint Bug Fix & UI/UX (28/02/2026)
- [x] **Traductions i18next**: Appliquées sur Navbar, Footer, HowItWorks, Landing, Settings, Login, ClientDashboard, Signup
- [x] **Fichiers de traduction FR/EN**: ~280 clés chacun couvrant toutes les sections
- [x] **Fix Logo**: "Kilolab" entièrement visible sur toutes les pages
- [x] **Fix HowItWorks mobile**: Titre responsive
- [x] **Refonte Landing Page**: Social Proof, Comparateur de Coûts interactif, Notre Histoire, CTA
- [x] **Connexion des fonctionnalités**: Settings, Analytics, onglets Dashboard traduits

### Refonte BecomeWasher (28/02/2026)
- [x] **Hero immersif** : Background photo, gradient overlay, typo massive "Votre machine tourne. Votre compte aussi."
- [x] **Badges stats** : 0€ / 24h / 7j7 en glassmorphism
- [x] **Section avantages** : 3 cards (Revenus, Chez soi, Sécurisé) avec icônes colorées
- [x] **4 étapes** : Timeline alternée avec cards sombres
- [x] **Simulateur de revenus** : Slider 10-100kg, revenus mois/semaine/an en temps réel
- [x] **Témoignages** : 3 profils Washers avec revenus et étoiles
- [x] **CTA final** : Gradient teal avec glow effect
- [x] **Formulaire 3 étapes** : Infos, Identité, Charte - design sombre premium
- [x] **Accents français** : Tous les accents (é, è, à, ê) correctement affichés

### Fonctionnalités existantes
- [x] Chat, Parrainage, Admin Heatmap, Push Notifications, Dark Mode
- [x] Analytics avancés, GPS tracking, Playwright setup

## Tests
- iteration_4.json: 100% frontend (17 tests landing/nav/footer/settings/login)
- iteration_5.json: 100% frontend (17 tests BecomeWasher redesign + regression)

## Backlog Prioritisé

### P0 - Critiques
- [ ] Traductions pages restantes (FAQ, Contact, Tarifs, Admin)
- [ ] Clé Google API exposée dans Git

### P1 - Important  
- [ ] Tests E2E Playwright
- [ ] Page admin B2B
- [ ] Heatmap données réelles
- [ ] Refonte Admin Dashboard

### P2 - Souhaitable
- [ ] Contenu vidéo landing page
- [ ] React Router v7 future flags

### P3 - Futur
- [ ] App mobile React Native
- [ ] Navigation GPS Washers

---
*Dernière mise à jour: 28/02/2026*
