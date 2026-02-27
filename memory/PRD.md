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

## Description

KiloLab est une marketplace de laverie qui connecte des clients avec des "Washers" (personnes qui lavent le linge a domicile) et des pressings partenaires. Le modele est similaire a Uber mais pour le lavage de linge au kilo.

---

## MEGA UPDATE v3.0 - Session 27/12/2025

### 1. Tracking & Analytics - COMPLETE
- [x] Hook `useAnalytics.ts` centralise pour Meta Pixel + GA4
- [x] Events: signup, login, order_started, order_completed, payment, referral_shared, subscription_started
- [x] Meta Pixel ID: 1573268523913279

### 2. Social Proof Dynamique - COMPLETE
- [x] `SocialProof.tsx` avec composants:
  - `LiveStats`: Compteurs animes (commandes/semaine, clients, note, villes)
  - `LiveReviews`: Avis clients en temps reel (rotation auto)
  - `WasherVerifiedBadge`: Badge washer verifie avec photo
  - `TrustBadges`: Badges confiance (SSL, verifies, garantie, suivi)
- [x] Integre dans Landing.tsx

### 3. Systeme de Parrainage - COMPLETE
- [x] `ReferralSystem.tsx` avec:
  - Niveaux: Bronze, Silver, Gold, Platinum
  - Recompenses SANS ARGENT: badges, express gratuit, priorite
  - Partage WhatsApp/SMS/Email one-click
  - Widget compact pour dashboards
  - Progression visuelle vers niveau suivant

### 4. Suivi Commande Temps Reel - COMPLETE
- [x] `OrderTracker.tsx` avec:
  - Timeline live avec timestamps
  - Photos avant/apres (optionnel)
  - ETA livraison
  - Infos washer (photo, note, tel)
  - Mini tracker pour dashboard
  - Supabase realtime subscriptions

### 5. Chat In-App Client <-> Washer - COMPLETE
- [x] `Chat.tsx` avec:
  - Messages instantanes (Supabase realtime)
  - Indicateurs lu/non-lu (double check)
  - Photos/fichiers attaches
  - Templates messages rapides
  - Notifications push
  - Bulle flottante

### 6. Abonnements Recurrents - COMPLETE
- [x] `Subscription.tsx` avec:
  - Plans: Hebdo (-15%), Bi-mensuel (-10%), Mensuel (-5%)
  - Configuration multi-etapes
  - Pause/Reprise facile
  - Gestion abonnement modal
  - Calcul prix automatique

### 7. Programme Fidelite - COMPLETE
- [x] `Loyalty.tsx` avec:
  - Points: 10pts/EUR (jusqu'a 30pts en Platinum)
  - Niveaux: Bronze, Silver, Gold, Platinum
  - Recompenses echangeables
  - Carte fidelite visuelle
  - Explainer "Comment ca marche"

### 8. Multi-Services - COMPLETE
- [x] `Services.tsx` avec:
  - Lavage Standard (3EUR/kg, 48h)
  - Lavage Express (5EUR/kg, 24h)
  - Express 2h (8EUR/kg, collecte 2h) - NOUVEAU
  - Pressing (5EUR/piece, 72h)
  - Repassage seul (2EUR/piece, 48h)
  - Nettoyage Sneakers (15EUR/paire, 5j) - NOUVEAU
  - Selecteur de service avec cards
  - Modal details service

### 9. Animations & UI - COMPLETE
- [x] Skeleton loading (ClientDashboard, WasherDashboard)
- [x] RippleButton avec effet ripple
- [x] Animations Tailwind: ripple, shimmer, pulseSoft
- [x] CountUp pour stats animees
- [x] FadeInOnScroll pour sections

---

## Fichiers Crees

```
/app/src/
├── hooks/
│   └── useAnalytics.ts          # Tracking Meta Pixel + GA4
├── components/
│   ├── SocialProof.tsx          # Stats live, reviews, badges
│   ├── ReferralSystem.tsx       # Parrainage multi-niveaux
│   ├── OrderTracker.tsx         # Suivi temps reel
│   ├── Chat.tsx                 # Messagerie instantanee
│   ├── Subscription.tsx         # Abonnements recurrents
│   ├── Loyalty.tsx              # Programme fidelite
│   ├── Services.tsx             # Multi-services
│   └── animations/
│       └── Skeleton.tsx         # Loading skeletons
└── ...
```

---

## Tables Supabase Requises (a creer si inexistantes)

```sql
-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  plan TEXT NOT NULL, -- weekly, biweekly, monthly
  status TEXT DEFAULT 'active', -- active, paused, cancelled
  weight_kg INTEGER,
  formula TEXT, -- standard, express
  pickup_address TEXT,
  preferred_day TEXT,
  preferred_slot TEXT,
  next_pickup TIMESTAMP,
  price_per_order DECIMAL,
  discount_percent INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reward Redemptions
CREATE TABLE IF NOT EXISTS reward_redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  reward_id TEXT,
  reward_name TEXT,
  points_used INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add loyalty_points to user_profiles if not exists
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0;
```

---

## Architecture Technique

### Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, RLS, Realtime)
- **Serverless**: Vercel Serverless Functions
- **PWA**: vite-plugin-pwa

### Integrations 3rd Party
- **Supabase** : BDD, Auth, Storage, Realtime
- **Stripe** : Paiements
- **Resend** : Emails transactionnels
- **Firebase** : Push Notifications (PWA)
- **Meta Pixel** : Tracking conversions
- **Google Analytics 4** : Analytics (via GTM)

---

## Taches Restantes

### P0 - A faire
- [ ] Creer tables Supabase (subscriptions, reward_redemptions)
- [ ] Ajouter fonction RPC `deduct_loyalty_points`
- [ ] Integrer OrderTracker dans ClientDashboard
- [ ] Integrer Chat dans page commande

### P1 - Important  
- [ ] Dashboard Admin Avance (analytics, heatmap)
- [ ] Estimation IA du poids (photo -> kg)
- [ ] API Partenaires B2B

### P2 - Future
- [ ] App Mobile Native (React Native)
- [ ] Tests E2E Playwright

---

*Derniere mise a jour : 27/12/2025*
