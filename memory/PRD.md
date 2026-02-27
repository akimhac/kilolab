# KiloLab - Product Requirements Document (PRD)

## Informations Projet

| Attribut | Valeur |
|----------|--------|
| **Nom** | KiloLab |
| **URL** | kilolab.fr |
| **Deploiement** | Vercel |
| **Version** | 2.4.0 |
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

### 3. Scripts RLS Supabase - PRETS
- [x] Script principal : `/app/supabase/RLS_POLICIES.sql`
- [x] Script complementaire : `/app/supabase/RLS_COMPLEMENT.sql`
  - Washers peuvent voir commandes disponibles
  - Washers peuvent s'auto-assigner
  - Admin acces complet toutes tables
  - Policies referral_codes

---

## Architecture Technique

```
/app
├── api/                  # Vercel Serverless Functions (Stripe)
├── public/               # Assets statiques, manifest.json, SW Firebase
├── src/
│   ├── components/       # Composants React reutilisables
│   │   └── animations/   # ScrollAnimations, LottieIcons
│   ├── pages/            # Pages principales
│   ├── lib/              # Supabase client, Firebase
│   └── services/         # API clients
├── supabase/             # Scripts SQL RLS
├── .env                  # Variables d'environnement
└── vite.config.ts        # Configuration Vite + PWA
```

### Stack Technique
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **Serverless**: Vercel Serverless Functions
- **PWA**: vite-plugin-pwa

### Integrations 3rd Party
- **Supabase** : BDD, Auth, Storage
- **Stripe** : Paiements
- **Resend** : Emails transactionnels
- **Firebase** : Push Notifications (PWA)

---

## Scripts SQL a Executer sur Supabase

**IMPORTANT : A executer dans l'ordre**

1. `/app/supabase/RLS_POLICIES.sql` (si pas deja fait)
2. `/app/supabase/RLS_COMPLEMENT.sql` (CRITIQUE pour le fonctionnement Washer/Admin)

---

## Taches Restantes

### P0 - Critique
- [ ] Verifier que les scripts RLS sont executes sur Supabase production

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
