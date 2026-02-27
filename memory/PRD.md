# KiloLab - Product Requirements Document (PRD)

## Informations Projet

| Attribut | Valeur |
|----------|--------|
| **Nom** | KiloLab |
| **URL** | kilolab.fr |
| **Deploiement** | Vercel |
| **Version** | 3.1.0 |
| **Date MAJ** | 13 Janvier 2026 |

---

## MEGA UPDATE v3.1 - TOUTES FONCTIONNALITÉS COMPLÈTES

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
| 12 | API Partenaires B2B | ✅ DONE | `/api/b2b.js` + `/app/supabase/B2B_API_TABLES.sql` |
| 13 | Estimation IA Poids | ✅ DONE | `/api/estimate-weight.js` + `WeightEstimator.tsx` |

---

## Intégrations Réalisées (v3.1)

### ClientDashboard - Nouveau
- ✅ Onglet Parrainage avec `ReferralSystem` complet
- ✅ Chat In-App intégré (bulle flottante pour commandes actives)
- ✅ 4 onglets: Commandes / Fidélité / Abonnement / Parrainage

### NewOrder
- ✅ Estimation IA du poids par photo (modal `WeightEstimator`)
- ✅ 3 formules: Standard (3€) / Express (5€) / Express 2h (8€)

### API B2B
- ✅ `/api/b2b.js` avec endpoints:
  - `create-order`: Créer commande pour un partenaire
  - `get-order`: Consulter statut
  - `list-orders`: Lister toutes les commandes
  - `get-pricing`: Tarifs avec remise partenaire
  - `get-coverage`: Zones couvertes

### API Estimation IA
- ✅ `/api/estimate-weight.js` avec GPT-4o Vision
- ✅ Utilise Emergent LLM Key (clé universelle)

---

## SQL Scripts À Exécuter

| Script | Description | Status |
|--------|-------------|--------|
| `KILOLAB_V3_FEATURES.sql` | Fidélité, abonnements, tracking | ✅ Exécuté |
| `B2B_API_TABLES.sql` | Tables B2B partenaires | ⏳ À exécuter |

---

## Stack Technique

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Realtime)
- **Serverless**: Vercel Functions (AI, B2B)
- **AI**: OpenAI GPT-4o Vision via Emergent LLM Key
- **PWA**: vite-plugin-pwa

---

## Tâches Restantes

### À Faire par l'utilisateur
1. ⏳ Exécuter `/app/supabase/B2B_API_TABLES.sql` sur Supabase
2. ⏳ Tester l'API B2B avec un partenaire de test
3. ⏳ Tester l'estimation IA (déjà intégré dans NewOrder)

### Backlog Futur
- [ ] Heatmap géographique (Leaflet/OpenStreetMap - gratuit)
- [ ] App Mobile Native (React Native)
- [ ] Tests E2E avec Playwright
- [ ] Notifications Push Firebase (en cours)

---

## Routes

| Route | Composant | Protection |
|-------|-----------|------------|
| `/admin/analytics` | AdminAnalytics | ProtectedAdminRoute |
| `/dashboard` | ClientDashboard | PrivateRoute |
| `/new-order` | NewOrder | - |

---

*Dernière mise à jour : 13/01/2026*
