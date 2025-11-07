# 🚀 Guide de Déploiement KiloLab

## 1️⃣ Netlify

### Créer compte et connecter GitHub
1. Aller sur [netlify.com](https://netlify.com)
2. Sign up avec GitHub
3. "Add new site" → "Import from Git"
4. Sélectionner le repo `kilolab`
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Deploy

### Variables d'environnement
Dans Netlify Dashboard → Site settings → Environment variables:
```
RESEND_API_KEY=re_SKazngYD_PMonzk1UaoAec4qHBJU1CQZG
VITE_SUPABASE_URL=https://lymykkbhbehwbdpajduj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
STRIPE_SECRET_KEY=sk_test_xxx (à ajouter)
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx (à ajouter)
```

## 2️⃣ Stripe

1. Créer compte sur [stripe.com](https://stripe.com)
2. Mode Test → Developers → API Keys
3. Copier `pk_test_...` et `sk_test_...`
4. Ajouter dans Netlify

## 3️⃣ DNS OVH → Netlify

1. Netlify Dashboard → Domain settings
2. Add custom domain: `kilolab.fr`
3. Netlify donne des DNS records
4. OVH → DNS Zone:
   - Type A: `@` → IP Netlify
   - Type CNAME: `www` → `votre-site.netlify.app`
5. Attendre propagation (1-24h)

## 4️⃣ Resend - Domaine personnalisé

1. [resend.com](https://resend.com) → Domains
2. Add domain: `kilolab.fr`
3. Ajouter DNS records dans OVH:
   - SPF: TXT record
   - DKIM: TXT record
4. Verify domain
5. Remplacer dans code:
```typescript
   from: 'KiloLab <noreply@kilolab.fr>'
```

## 5️⃣ Supabase SQL

Exécuter dans SQL Editor:
1. `pressings-france-real.sql`
2. `supabase-referral-system.sql`
3. `supabase-time-slots.sql`
4. `supabase-storage-setup.sql` (si pas déjà fait)

## 6️⃣ Tests

- ✅ Inscription client
- ✅ Créer commande
- ✅ Pesée partenaire
- ✅ Email reçu
- ✅ Paiement Stripe
- ✅ Workflow complet

## 7️⃣ Go Live!

- Passer Stripe en mode Live
- Activer analytics PostHog
- Monitorer les premiers clients

---

**Support:** contact@kilolab.fr
