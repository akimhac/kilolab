# KiloLab - Product Requirements Document (PRD)

## Informations Projet

| Attribut | Valeur |
|----------|--------|
| **Nom** | KiloLab |
| **URL** | kilolab.fr |
| **Deploiement** | Vercel |
| **Version** | 3.4.0 |
| **Date MAJ** | 13 Janvier 2026 |

---

## TOUTES FONCTIONNALITÉS COMPLÈTES (20/20 ✅)

### Checklist Fonctionnalités

| # | Fonctionnalité | Status | Composant |
|---|----------------|--------|-----------|
| 1 | Tracking Meta Pixel + GA4 | ✅ | `useAnalytics.ts` |
| 2 | Social Proof Dynamique | ✅ | `SocialProof.tsx` |
| 3 | Système Parrainage | ✅ | `ReferralSystem.tsx` |
| 4 | Suivi Temps Réel | ✅ | `OrderTracker.tsx` |
| 5 | Chat In-App | ✅ | `Chat.tsx` |
| 6 | Abonnements Récurrents | ✅ | `Subscription.tsx` |
| 7 | Programme Fidélité | ✅ | `Loyalty.tsx` |
| 8 | Multi-Services | ✅ | `Services.tsx` |
| 9 | Express 2h | ✅ | NewOrder |
| 10 | Pressing/Sneakers | ✅ | `Services.tsx` |
| 11 | Dashboard Admin Analytics | ✅ | `AdminAnalytics.tsx` |
| 12 | API Partenaires B2B | ✅ | `/api/b2b.js` |
| 13 | Estimation IA Poids | ✅ | `WeightEstimator.tsx` |
| 14 | Heatmap Géographique | ✅ | `OrderHeatmap.tsx` |
| 15 | Notifications Push | ✅ | `NotificationSettings.tsx` |
| 16 | Tests E2E Playwright | ✅ | `tests/e2e/*.spec.ts` |
| 17 | Multi-langue FR/EN | ✅ | `i18n.ts`, `LanguageSelector.tsx` |
| 18 | Tracking GPS Live | ✅ | `LiveTracking.tsx` |
| 19 | Analytics Avancés | ✅ | `AdvancedAnalytics.tsx` |
| **20** | **Mode Sombre** | ✅ (v3.4) | `ThemeContext.tsx`, `ThemeToggle.tsx` |

---

## Nouvelle fonctionnalité v3.4: Mode Sombre

### Implémentation
- **Context**: `src/contexts/ThemeContext.tsx`
- **Toggle**: `src/components/ThemeToggle.tsx`
- **Config Tailwind**: `darkMode: 'class'`

### Features
- 3 modes: **Clair**, **Sombre**, **Automatique** (système)
- Persistance dans localStorage
- Transition fluide (300ms)
- Toggle dans la Navbar (icône soleil/lune)
- Onglet "Apparence" dans les Settings
- Classes dark: pour tous les composants clés

### Utilisation
```tsx
// Dans un composant
import { useTheme } from '../contexts/ThemeContext';

const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

// Classes Tailwind
<div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
```

---

## SQL Scripts

| Script | Description | Status |
|--------|-------------|--------|
| `KILOLAB_V3_FEATURES.sql` | Fidélité, abonnements | ✅ |
| `B2B_API_TABLES.sql` | Tables B2B | ✅ |
| `KILOLAB_V5_NOTIFICATIONS.sql` | FCM tokens | ✅ |
| `KILOLAB_V6_TRACKING_ANALYTICS.sql` | GPS live + analytics | ⏳ À exécuter |

**Note**: La colonne `client_id` est utilisée (pas `user_id`) dans la table `orders`.

---

## Stack Technique

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Realtime)
- **Serverless**: Vercel Functions
- **AI**: OpenAI GPT-4o Vision (Emergent LLM Key)
- **Maps**: Leaflet + OpenStreetMap
- **Push**: Firebase Cloud Messaging
- **i18n**: i18next + react-i18next
- **Tests**: Playwright
- **PWA**: vite-plugin-pwa
- **Dark Mode**: Tailwind CSS class strategy

---

## Architecture

```
/app/src
├── contexts/
│   └── ThemeContext.tsx      # Dark mode provider
├── components/
│   ├── ThemeToggle.tsx       # Toggle button (3 variantes)
│   ├── LanguageSelector.tsx  # FR/EN switcher
│   ├── LiveTracking.tsx      # GPS temps réel
│   └── AdvancedAnalytics.tsx # Funnel, Retention
├── locales/
│   ├── fr.json              # Traductions FR
│   └── en.json              # Traductions EN
└── i18n.ts                  # Config i18next
```

---

## Backlog Futur

- [ ] App Mobile React Native
- [ ] Navigation GPS pour Washers
- [ ] Prédiction de demande par zone (ML)
- [ ] Programme ambassadeur pour Washers

---

*Dernière mise à jour : 13/01/2026*
