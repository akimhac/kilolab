# KiloLab - Product Requirements Document (PRD)

## Informations Projet

| Attribut | Valeur |
|----------|--------|
| **Nom** | KiloLab |
| **URL** | kilolab.fr |
| **Deploiement** | Vercel |
| **Version** | 3.2.0 |
| **Date MAJ** | 13 Janvier 2026 |

---

## MEGA UPDATE v3.2 - TOUTES FONCTIONNALITÉS COMPLÈTES

### Checklist Fonctionnalités

| # | Fonctionnalité | Status | Composant |
|---|----------------|--------|-----------|
| 1 | Tracking Meta Pixel + GA4 | ✅ DONE | `useAnalytics.ts` |
| 2 | Social Proof Dynamique | ✅ DONE | `SocialProof.tsx` → Landing |
| 3 | Système Parrainage | ✅ DONE | `ReferralSystem.tsx` → ClientDashboard (onglet) |
| 4 | Suivi Temps Réel | ✅ DONE | `OrderTracker.tsx` |
| 5 | Chat In-App | ✅ DONE | `Chat.tsx` → ClientDashboard (intégré) |
| 6 | Abonnements Récurrents | ✅ DONE | `Subscription.tsx` → ClientDashboard |
| 7 | Programme Fidélité | ✅ DONE | `Loyalty.tsx` → ClientDashboard |
| 8 | Multi-Services | ✅ DONE | `Services.tsx` → NewOrder |
| 9 | Express 2h | ✅ DONE | Intégré dans NewOrder |
| 10 | Pressing/Sneakers | ✅ DONE | Dans `Services.tsx` |
| 11 | Dashboard Admin Analytics | ✅ DONE | `AdminAnalytics.tsx` |
| 12 | API Partenaires B2B | ✅ DONE | `/api/b2b.js` + SQL |
| 13 | Estimation IA Poids | ✅ DONE | `/api/estimate-weight.js` + `WeightEstimator.tsx` |
| 14 | **Heatmap Géographique** | ✅ DONE (v3.2) | `OrderHeatmap.tsx` → AdminAnalytics |
| 15 | **Notifications Push** | ✅ DONE (v3.2) | `pushNotifications.tsx` + `NotificationSettings.tsx` |
| 16 | **Tests E2E Playwright** | ✅ DONE (v3.2) | `/tests/e2e/*.spec.ts` |

---

## Nouvelles fonctionnalités v3.2

### 1. Heatmap Géographique (Leaflet/OpenStreetMap)
- **Composant**: `src/components/OrderHeatmap.tsx`
- **Intégration**: `AdminAnalytics.tsx` (lazy loaded)
- **Features**:
  - Carte interactive avec clusters par ville
  - Code couleur par intensité (vert → rouge)
  - Popup avec stats (commandes, CA)
  - Top 5 villes en footer
  - Géocodage des villes françaises intégré
  - 100% gratuit (OpenStreetMap)

### 2. Notifications Push Firebase
- **Service**: `src/services/pushNotifications.tsx`
- **UI**: `src/components/NotificationSettings.tsx`
- **Service Worker**: `public/firebase-messaging-sw.js`
- **Features**:
  - Permission request
  - FCM token management
  - Foreground/Background notifications
  - Deep linking on click
  - Intégré dans `/settings`
- **SQL**: `supabase/KILOLAB_V5_NOTIFICATIONS.sql`

### 3. Tests E2E Playwright
- **Config**: `playwright.config.ts`
- **Tests**: `tests/e2e/`
  - `landing.spec.ts` - Page d'accueil
  - `auth.spec.ts` - Authentification
  - `order.spec.ts` - Flux commande
  - `navigation.spec.ts` - Routing
  - `accessibility.spec.ts` - A11y + Performance
- **Scripts npm**:
  - `yarn test:e2e` - Run tous les tests
  - `yarn test:e2e:ui` - Mode UI interactif
  - `yarn test:e2e:headed` - Mode visible
  - `yarn test:e2e:report` - Voir le rapport

---

## SQL Scripts À Exécuter

| Script | Description | Status |
|--------|-------------|--------|
| `KILOLAB_V3_FEATURES.sql` | Fidélité, abonnements, tracking | ✅ Exécuté |
| `B2B_API_TABLES.sql` | Tables B2B partenaires | ⏳ À exécuter |
| `KILOLAB_V5_NOTIFICATIONS.sql` | FCM tokens, notifications | ⏳ À exécuter |

---

## Stack Technique

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Realtime)
- **Serverless**: Vercel Functions (AI, B2B)
- **AI**: OpenAI GPT-4o Vision via Emergent LLM Key
- **Maps**: Leaflet + OpenStreetMap (gratuit)
- **Push**: Firebase Cloud Messaging
- **Tests**: Playwright
- **PWA**: vite-plugin-pwa

---

## Page Settings améliorée

La page `/settings` a été entièrement refaite avec 3 onglets:
1. **Profil** - Infos personnelles, téléphone, adresse
2. **Notifications** - Push notifications + préférences email
3. **Sécurité** - Mot de passe, déconnexion, suppression compte

---

## Architecture des tests E2E

```
/app
├── playwright.config.ts    # Configuration Playwright
├── tests/
│   └── e2e/
│       ├── landing.spec.ts     # Tests landing page
│       ├── auth.spec.ts        # Tests authentification
│       ├── order.spec.ts       # Tests flux commande
│       ├── navigation.spec.ts  # Tests navigation/routing
│       └── accessibility.spec.ts # Tests a11y/perf
└── test-reports/
    └── playwright/             # Rapports HTML
```

---

## Backlog Futur

- [ ] App Mobile Native (React Native)
- [ ] Analytics avancés (funnel, retention)
- [ ] A/B Testing
- [ ] Multi-langue (EN)

---

*Dernière mise à jour : 13/01/2026*
