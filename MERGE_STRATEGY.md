# 🔀 Stratégie de Merge - KiloLab

## Situation actuelle

Deux branches parallèles ont été développées :

1. **Branch `main`** (via PR #1)
   - Amélioration UX : cartes Airbnb pour partenaires
   - Fix useAuth : ajout signOut/signUp + merge user data
   - Fix Login : export nommé + redirect `/dashboard`

2. **Branch `claude/restore-landing-fix-auth-011CUhsvdj1XHgTyqaE1CPNs`**
   - Fix Login : redirect `/dashboard`
   - Stripe Checkout complet (Netlify Functions)
   - Documentation complète (README, QUICKSTART, SQL, RLS)
   - Configuration déploiement (netlify.toml)

---

## 📋 Plan de merge (recommandé)

### Étape 1 : Créer une nouvelle branche de merge propre

```bash
# Depuis main
git checkout main
git pull origin main

# Créer nouvelle branche
git checkout -b feature/complete-integration
```

### Étape 2 : Merger ma branche avec résolution de conflits

```bash
git merge claude/restore-landing-fix-auth-011CUhsvdj1XHgTyqaE1CPNs
```

### Étape 3 : Résoudre les conflits manuellement

#### A) **Login.tsx** - GARDER export nommé de main

```typescript
// ✅ GARDER (de main)
export function Login() {
  // ...
  navigate('/dashboard'); // ✅ Les deux branches ont le bon redirect
}
```

#### B) **useAuth.ts** - GARDER la version améliorée de main

La version de main est meilleure (signOut/signUp + merge).

```typescript
// ✅ GARDER la version complète de main avec signOut/signUp
```

#### C) **README.md** - GARDER ma documentation complète

```bash
# Ma version est beaucoup plus complète
git checkout claude/restore-landing-fix-auth-011CUhsvdj1XHgTyqaE1CPNs -- README.md
```

#### D) **NewOrder.tsx** - GARDER ma version (Stripe)

```bash
git checkout claude/restore-landing-fix-auth-011CUhsvdj1XHgTyqaE1CPNs -- src/pages/NewOrder.tsx
```

#### E) **PartnersMap.tsx** - GARDER version de main (cartes Airbnb)

```bash
# Version de main est meilleure (design)
git checkout main -- src/pages/PartnersMap.tsx
```

### Étape 4 : Ajouter TOUS mes fichiers manquants

```bash
# Mes fichiers n'existent pas sur main, donc pas de conflit
git checkout claude/restore-landing-fix-auth-011CUhsvdj1XHgTyqaE1CPNs -- QUICKSTART.md
git checkout claude/restore-landing-fix-auth-011CUhsvdj1XHgTyqaE1CPNs -- netlify.toml
git checkout claude/restore-landing-fix-auth-011CUhsvdj1XHgTyqaE1CPNs -- netlify/
git checkout claude/restore-landing-fix-auth-011CUhsvdj1XHgTyqaE1CPNs -- supabase/
```

### Étape 5 : Fixer Login.tsx pour export nommé

Si l'import dans App.tsx est cassé :

```typescript
// src/App.tsx
import { Login } from './pages/Login'; // ✅ Import nommé
```

---

## 🎯 Résultat final attendu

### Fichiers de MAIN (conservés)
- ✅ `useAuth.ts` avec signOut/signUp
- ✅ `PartnersMap.tsx` avec cartes Airbnb
- ✅ `Login.tsx` avec export nommé

### Fichiers de MA BRANCHE (conservés)
- ✅ `README.md` (documentation complète)
- ✅ `QUICKSTART.md`
- ✅ `NewOrder.tsx` (Stripe Netlify)
- ✅ `netlify.toml`
- ✅ `netlify/functions/*`
- ✅ `supabase/*`

### Meilleur des deux mondes
- ✅ UX améliorée (cartes partenaires)
- ✅ Auth robuste (signOut/signUp)
- ✅ Stripe fonctionnel
- ✅ Documentation complète
- ✅ Déploiement prêt

---

## 🚀 Exécution

Veux-tu que j'exécute cette stratégie maintenant ?

Options :
1. **Auto-merge** : Je fais tout automatiquement
2. **Guided merge** : Je te guide étape par étape
3. **Custom** : Tu me dis comment tu veux procéder

---

## ⚠️ IMPORTANT

Avant de merger, assure-toi que :
- [ ] Aucun autre développeur ne travaille en parallèle
- [ ] Tu as sauvegardé ton travail actuel
- [ ] Les tests passent sur les deux branches

---

**Note** : Cette stratégie préserve le meilleur des deux branches sans perdre aucune fonctionnalité.
