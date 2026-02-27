# KiloLab - Product Requirements Document (PRD)

## Informations Projet

| Attribut | Valeur |
|----------|--------|
| **Nom** | KiloLab |
| **URL** | kilolab.fr |
| **Deploiement** | Vercel |
| **Version** | 3.3.0 |
| **Date MAJ** | 13 Janvier 2026 |

---

## MEGA UPDATE v3.3 - TOUTES FONCTIONNALITÉS COMPLÈTES

### Checklist Fonctionnalités (16/16 ✅)

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
| 9 | Express 2h | ✅ | Intégré dans NewOrder |
| 10 | Pressing/Sneakers | ✅ | Dans `Services.tsx` |
| 11 | Dashboard Admin Analytics | ✅ | `AdminAnalytics.tsx` |
| 12 | API Partenaires B2B | ✅ | `/api/b2b.js` |
| 13 | Estimation IA Poids | ✅ | `WeightEstimator.tsx` |
| 14 | Heatmap Géographique | ✅ | `OrderHeatmap.tsx` |
| 15 | Notifications Push | ✅ | `NotificationSettings.tsx` |
| 16 | Tests E2E Playwright | ✅ | `tests/e2e/*.spec.ts` |
| **17** | **Multi-langue FR/EN** | ✅ (v3.3) | `i18n.ts`, `LanguageSelector.tsx` |
| **18** | **Tracking GPS Live** | ✅ (v3.3) | `LiveTracking.tsx` |
| **19** | **Analytics Avancés** | ✅ (v3.3) | `AdvancedAnalytics.tsx` |

---

## Nouvelles fonctionnalités v3.3

### 1. Multi-langue (i18next)
- **Config**: `src/i18n.ts`
- **Traductions**: `src/locales/fr.json`, `src/locales/en.json`
- **UI**: `src/components/LanguageSelector.tsx` → Navbar
- **Features**:
  - Détection automatique de la langue du navigateur
  - Persistance dans localStorage
  - 3 variantes: dropdown, buttons, minimal
  - Toutes les chaînes traduites (nav, auth, dashboard, etc.)

### 2. Tracking GPS Washers (temps réel)
- **Composant**: `src/components/LiveTracking.tsx`
- **Features**:
  - Carte Leaflet avec position live du Washer
  - Mise à jour en temps réel via Supabase Realtime
  - Calcul automatique de l'ETA
  - Ligne de route en pointillés
  - Boutons Appeler / Message
  - Version mini pour le dashboard
- **SQL**: `supabase/KILOLAB_V6_TRACKING_ANALYTICS.sql`

### 3. Analytics Avancés
- **Composant**: `src/components/AdvancedAnalytics.tsx`
- **Features**:
  - **Funnel Analysis**: Visiteurs → Inscriptions → Commandes → Livraisons
  - **Retention Cohort**: Grille de rétention par semaine
  - **KPIs avancés**: LTV, Panier moyen, Taux de repeat, Cmd/client
  - Sélecteur de période (7j, 30j, 90j)
- **Intégration**: Lazy loaded dans AdminAnalytics

---

## SQL Scripts À Exécuter

| Script | Description | Status |
|--------|-------------|--------|
| `KILOLAB_V3_FEATURES.sql` | Fidélité, abonnements | ✅ |
| `B2B_API_TABLES.sql` | Tables B2B | ✅ |
| `KILOLAB_V5_NOTIFICATIONS.sql` | FCM tokens | ✅ |
| `KILOLAB_V6_TRACKING_ANALYTICS.sql` | GPS live + analytics | ⏳ À exécuter |

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

---

## Architecture des fichiers

```
/app/src
├── i18n.ts                    # Config i18next
├── locales/
│   ├── fr.json               # Traductions FR
│   └── en.json               # Traductions EN
├── components/
│   ├── LanguageSelector.tsx  # Sélecteur de langue
│   ├── LiveTracking.tsx      # Tracking GPS temps réel
│   ├── AdvancedAnalytics.tsx # Funnel, Retention, KPIs
│   └── ...
└── ...
```

---

## Utilisation du tracking GPS

Pour activer le tracking live d'un Washer:
1. Le Washer doit partager sa position (géolocalisation navigateur)
2. Le composant `LiveWasherTracking` s'abonne au channel Realtime
3. L'ETA est calculée automatiquement

```tsx
<LiveWasherTracking
  orderId="..."
  washerId="..."
  pickupLat={48.8566}
  pickupLng={2.3522}
  onChat={() => openChat()}
/>
```

---

## Backlog Futur

- [ ] App Mobile Native (React Native)
- [ ] Tableau de bord Washer avec navigation GPS
- [ ] Prédiction de demande par zone (ML)
- [ ] Programme ambassadeur pour Washers

---

*Dernière mise à jour : 13/01/2026*
