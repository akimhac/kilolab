# KiloLab - Product Requirements Document (PRD)

## Informations Projet

| Attribut | Valeur |
|----------|--------|
| **Nom** | KiloLab |
| **URL** | kilolab.fr |
| **Deploiement** | Vercel |
| **Version** | 2.6.0 |
| **Date MAJ** | 27 Decembre 2025 |

---

## Description

KiloLab est une marketplace de laverie qui connecte des clients avec des "Washers" (personnes qui lavent le linge a domicile) et des pressings partenaires. Le modele est similaire a Uber mais pour le lavage de linge au kilo.

### Roles Utilisateurs
- **Client** : Commande du lavage de linge
- **Washer** : Particulier qui lave le linge des clients
- **Partner** : Pressing professionnel partenaire
- **Admin** : Gestion de la plateforme

---

## Travail Complete (Session 27/12/2025)

### 1. Firebase Push Notifications - COMPLETE
- [x] Cle VAPID configuree dans `.env`
- [x] Service Worker Firebase cree (`/app/public/firebase-messaging-sw.js`)
- [x] Configuration complete pour notifications background
- [x] Gestion du clic sur notification

### 2. Animations UI/UX - COMPLETE
- [x] ClientDashboard : Animations CountUp pour stats, FadeInOnScroll pour sections
- [x] WasherDashboard : Stats animees avec CountUp, hover effects ameliores
- [x] BecomeWasher : Cards benefices avec stagger animation, simulateur anime
- [x] NewOrder : Import FadeInOnScroll prepare

### 3. Skeleton Loading Animations - COMPLETE
- [x] Composant Skeleton generique cree (`/app/src/components/animations/Skeleton.tsx`)
- [x] ClientDashboardSkeleton : Stats, order cards, history rows
- [x] WasherDashboardSkeleton : Dark theme, stats cards, mission cards
- [x] Animations shimmer pour effet premium

### 4. Micro-interactions Boutons - COMPLETE
- [x] RippleButton component (`/app/src/components/ui/RippleButton.tsx`)
- [x] Animations ripple, shimmer, pulseSoft dans tailwind.config.js
- [x] Classes btn-primary, btn-secondary, btn-ghost avec scale effects
- [x] Cards avec hover lift et scale effects

### 5. Scripts RLS Supabase - EXECUTES ET VERIFIES
- [x] Script final execute par l'utilisateur avec toutes les policies
- [x] Verification via CSV : 95% confidence - toutes tables critiques couvertes
- [x] Policies admin, client, washer, partner fonctionnelles

### 6. Nettoyage Code - COMPLETE
- [x] Section debug supprimee de NewOrder.tsx
- [x] Console.log de debug supprimes

---

## Tests Effectues (27/12/2025)

### Resultats : 95% succes
- [x] Landing page : video, CTAs, comparateur prix
- [x] Tarifs : cards Standard/Express, badge Popular
- [x] FAQ : 4 categories, accordeon fonctionnel
- [x] Contact : formulaire complet
- [x] BecomeWasher : simulateur revenus, formulaire inscription
- [x] Login : toggle Connexion/Inscription
- [x] NewOrder : flow multi-etapes complet
- [x] Navigation mobile : menu hamburger responsive
- [x] Skeleton loading : implemente correctement
- [x] Animations scroll : fonctionnelles

### Issue mineure identifiee
- Supabase retourne 401 pour fetch washers (config env) - fallback "Reseau Kilolab" fonctionne

---

## Architecture Technique

```
/app
├── api/                  # Vercel Serverless Functions (Stripe)
├── public/               # Assets statiques, manifest.json, SW Firebase
├── src/
│   ├── components/       
│   │   ├── animations/   # ScrollAnimations, Skeleton
│   │   └── ui/           # RippleButton, autres composants
│   ├── pages/            # Pages principales
│   ├── lib/              # Supabase client, Firebase
│   └── services/         # API clients
├── supabase/             # Scripts SQL RLS
├── .env                  # Variables d'environnement
├── tailwind.config.js    # Config avec animations custom
└── vite.config.ts        # Configuration Vite + PWA
```

### Stack Technique
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **Serverless**: Vercel Serverless Functions
- **PWA**: vite-plugin-pwa

---

## Taches Restantes

### P0 - Critique
- [x] Scripts RLS executes et verifies

### P1 - Important  
- [ ] Implementer Meta Pixel pour tracking marketing
- [ ] Systeme Ambassadeur Washer (parrainage washers)

### P2 - Ameliorations
- [ ] Tests E2E avec Playwright
- [ ] Ameliorer capacites offline PWA

---

## Notes de Deploiement

Le projet est concu pour Vercel :
- Build : `yarn build`
- Les variables `.env` doivent etre configurees dans Vercel Dashboard
- Le service worker Firebase est dans `/public/firebase-messaging-sw.js`

---

*Derniere mise a jour : 27/12/2025*
