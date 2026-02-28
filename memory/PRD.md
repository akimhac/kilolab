# KiloLab - Product Requirements Document

## Vision
Le 1er service de laverie à domicile en France. Marketplace connectant les clients avec des "Washers" pour le lavage au kilo.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Storage)
- **Serverless**: Vercel Serverless Functions (`/api/`)
- **AI**: OpenAI GPT-4o via Emergent LLM Key (estimation poids)
- **Paiements**: Stripe
- **Emails**: Resend
- **Push Notifications**: Firebase
- **i18n**: react-i18next (FR/EN)
- **Maps**: React-Leaflet (admin heatmap)

## Structure des fichiers
```
/app
├── api/                  # Vercel Serverless Functions
├── src/
│   ├── components/
│   │   ├── admin/        # AdvancedAnalytics, OrderHeatmap
│   │   ├── animations/   # ScrollAnimations, LottieIcons
│   │   ├── features/     # Chat, ReferralSystem
│   │   ├── ui/           # Shadcn components
│   │   ├── Navbar.tsx    # Translated navbar with language selector
│   │   ├── Footer.tsx    # Translated footer
│   │   ├── HowItWorks.tsx # Translated with mobile-responsive title
│   │   ├── SocialProof.tsx # Trust badges, stats
│   │   ├── LanguageSelector.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── NotificationSettings.tsx
│   ├── contexts/         # AuthContext, ThemeContext
│   ├── locales/          # fr.json, en.json translation files
│   ├── pages/
│   │   ├── Landing.tsx   # Full landing with translations
│   │   ├── Login.tsx     # Translated login/signup
│   │   ├── Settings.tsx  # Translated settings with tabs
│   │   ├── ClientDashboard.tsx # Translated tab labels
│   │   ├── AdminDashboard.tsx  # With Analytics quick-access link
│   │   ├── AdminAnalytics.tsx
│   │   ├── Tarifs.tsx
│   │   ├── FAQ.tsx
│   │   ├── Contact.tsx
│   │   ├── BecomeWasher.tsx
│   │   └── ...
│   ├── services/         # PushNotificationService
│   ├── i18n.ts           # i18next config
│   └── App.tsx           # Routes
├── supabase/             # SQL migration scripts
└── tests/                # Playwright E2E tests (setup only)
```

## Ce qui a été implémenté

### Sprint Bug Fix & UI/UX (28/02/2026)
- [x] **Traductions i18next**: Appliquées sur Navbar, Footer, HowItWorks, Landing, Settings, Login, ClientDashboard
- [x] **Fichiers de traduction FR/EN**: Complets avec toutes les clés nécessaires
- [x] **Fix Logo**: Logo "Kilolab" entièrement visible sur toutes les pages
- [x] **Fix HowItWorks mobile**: Titre "Comment ça marche ?" visible sur mobile
- [x] **Refonte Landing Page**: 
  - Nouvelle section Social Proof avec stats et garanties
  - Nouveau Comparateur de Coûts interactif (slider poids)
  - Section Notre Histoire avec images
  - CTA final avec gradient
- [x] **Connexion des fonctionnalités**: 
  - Lien Settings dans le Navbar (utilisateur connecté)
  - Lien Analytics dans le Admin Dashboard
  - Onglets traduits dans ClientDashboard (Commandes, Fidélité, Abonnement, Parrainage)
- [x] **Sélecteur de langue**: Visible dans le Navbar et les Settings
- [x] **Mode sombre**: Toggle visible dans le Navbar

### Fonctionnalités précédemment implémentées
- [x] Chat (composant)
- [x] Système de parrainage
- [x] Admin Heatmap (Leaflet)
- [x] Push Notifications (Firebase setup)
- [x] Dark Mode
- [x] Analytics avancés (Funnel, Retention, Cohorts)
- [x] GPS tracking Washer (composant)
- [x] Configuration Playwright

## Tests
- Test agent frontend: 98% -> 100% après fix logo BecomeWasher
- Fichier rapport: `/app/test_reports/iteration_4.json`

## Backlog Prioritisé

### P0 - Critiques
- [ ] Appliquer traductions aux pages restantes (BecomeWasher, FAQ, Contact, Tarifs)
- [ ] Clé Google API exposée dans l'historique Git (risque sécurité)

### P1 - Important
- [ ] Écrire tests E2E Playwright pour les flux clés
- [ ] Page admin B2B (gestion partenaires, clés API)
- [ ] Connecter Heatmap aux vraies données de commandes
- [ ] Refonte Admin Dashboard (design modernisé)

### P2 - Souhaitable
- [ ] Contenu vidéo sur la landing page
- [ ] Popup Instagram - ajouter délai ou trigger différent
- [ ] React Router v7 future flags (v7_startTransition, v7_relativeSplatPath)

### P3 - Futur
- [ ] App mobile React Native
- [ ] Navigation GPS pour Washers

---

*Dernière mise à jour: 28/02/2026*
