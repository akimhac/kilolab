# KiloLab - Product Requirements Document (PRD)

## Informations Projet

| Attribut | Valeur |
|----------|--------|
| **Nom** | KiloLab |
| **URL** | kilolab.fr |
| **Deploiement** | Vercel |
| **Version** | 3.0.0 |
| **Date MAJ** | 27 Decembre 2025 |

---

## MEGA UPDATE v3.0 - TOUTES FONCTIONNALITÉS COMPLÈTES

### Checklist Fonctionnalités

| # | Fonctionnalité | Status | Composant |
|---|----------------|--------|-----------|
| 1 | Tracking Meta Pixel + GA4 | ✅ DONE | `useAnalytics.ts` |
| 2 | Social Proof Dynamique | ✅ DONE | `SocialProof.tsx` → Landing |
| 3 | Système Parrainage | ✅ DONE | `ReferralSystem.tsx` |
| 4 | Suivi Temps Réel | ✅ DONE | `OrderTracker.tsx` |
| 5 | Chat In-App | ✅ DONE | `Chat.tsx` |
| 6 | Abonnements Récurrents | ✅ DONE | `Subscription.tsx` → ClientDashboard |
| 7 | Programme Fidélité | ✅ DONE | `Loyalty.tsx` → ClientDashboard |
| 8 | Multi-Services | ✅ DONE | `Services.tsx` → NewOrder |
| 9 | Express 2h | ✅ DONE | Intégré dans NewOrder |
| 10 | Pressing/Sneakers | ✅ DONE | Dans `Services.tsx` |
| 11 | Dashboard Admin Analytics | ✅ DONE | `AdminAnalytics.tsx` |
| 12 | API Partenaires B2B | ❌ BACKLOG | Nécessite Vercel Functions |
| 13 | Estimation IA Poids | ❌ BACKLOG | Nécessite Vision AI |

---

## Intégrations Réalisées

### ClientDashboard
- ✅ Onglets: Commandes / Fidélité / Abonnement
- ✅ Points fidélité dans les stats
- ✅ LoyaltyCard avec niveaux
- ✅ SubscriptionCard ou promo abonnement

### NewOrder
- ✅ 3 formules: Standard (3€) / Express (5€) / Express 2h (8€)
- ✅ Badge "NOUVEAU" sur Express 2h
- ✅ Badge "POPULAIRE" sur Express

### Landing Page
- ✅ LiveStats avec compteurs animés
- ✅ LiveReviews avec rotation auto
- ✅ TrustBadges (SSL, vérifiés, garantie)

### Admin
- ✅ Route `/admin/analytics` avec Dashboard complet
- ✅ KPIs: Commandes, CA, Clients, Note moyenne
- ✅ Graphique commandes par jour
- ✅ Distribution des statuts
- ✅ Top villes
- ✅ Top Washers

---

## Fichiers Créés

```
/app/src/
├── hooks/
│   └── useAnalytics.ts
├── components/
│   ├── SocialProof.tsx
│   ├── ReferralSystem.tsx
│   ├── OrderTracker.tsx
│   ├── Chat.tsx
│   ├── Subscription.tsx
│   ├── Loyalty.tsx
│   ├── Services.tsx
│   └── animations/
│       └── Skeleton.tsx
├── pages/
│   └── AdminAnalytics.tsx
└── ...
```

---

## SQL À EXÉCUTER

**Fichier unique :** `/app/supabase/KILOLAB_V3_FEATURES.sql`

Contient:
- Table `subscriptions` (abonnements)
- Table `reward_redemptions` (récompenses échangées)
- Colonnes `loyalty_points`, `loyalty_level` sur `user_profiles`
- Colonnes de tracking sur `orders` (timestamps, photos, ETA)
- Colonne `order_id` sur `messages` (chat par commande)
- Fonctions RPC: `add_loyalty_points`, `deduct_loyalty_points`
- Trigger `on_order_completed` (ajout auto des points)

---

## Stack Technique

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Realtime)
- **Date**: date-fns v4
- **PWA**: vite-plugin-pwa
- **Tracking**: Meta Pixel, Google Analytics 4 (GTM)

---

## Tâches Restantes

### À Faire par l'utilisateur
1. ✅ Exécuter `/app/supabase/KILOLAB_V3_FEATURES.sql` sur Supabase
2. ✅ Déployer sur Vercel
3. ✅ Tester les nouvelles fonctionnalités

### Backlog Futur
- [ ] Estimation IA du poids (Vision AI)
- [ ] API Partenaires B2B (Vercel Functions)
- [ ] App Mobile Native (React Native)
- [ ] Heatmap géographique (Mapbox)

---

## Routes Ajoutées

| Route | Composant | Protection |
|-------|-----------|------------|
| `/admin/analytics` | AdminAnalytics | ProtectedAdminRoute |

---

## Niveaux Fidélité

| Niveau | Points requis | Multiplicateur | Avantages |
|--------|---------------|----------------|-----------|
| Bronze | 0 | x1 | 10 pts/€ |
| Silver | 500 | x1.5 | 15 pts/€, -5% |
| Gold | 2000 | x2 | 20 pts/€, -10%, 1 Express/mois |
| Platinum | 5000 | x3 | 30 pts/€, -15%, Express illimité |

---

## Niveaux Parrainage

| Niveau | Filleuls requis | Récompenses |
|--------|-----------------|-------------|
| Bronze | 0 | Badge Bronze |
| Silver | 3 | Badge, 1 Express gratuit |
| Gold | 10 | Badge, 3 Express, Priorité |
| Platinum | 25 | Badge, Express illimité, VIP |

---

*Dernière mise à jour : 27/12/2025*
