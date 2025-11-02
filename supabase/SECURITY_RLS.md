# 🔒 Row Level Security (RLS) Policies

## Introduction

Les **Row Level Security (RLS) policies** de PostgreSQL permettent de restreindre l'accès aux données au niveau des lignes, en fonction du contexte utilisateur.

⚠️ **État actuel** : RLS désactivé pour les tests
🎯 **Objectif** : Activer RLS avant le déploiement en production

---

## 📋 Tables et policies requises

### 1. Table `user_profiles`

**Objectif** : Chaque utilisateur peut lire et modifier uniquement son propre profil.

```sql
-- Activer RLS sur la table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy SELECT : Un utilisateur peut lire son propre profil
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy UPDATE : Un utilisateur peut modifier son propre profil
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy INSERT : Création automatique via trigger (pas de policy nécessaire)
-- Les profils sont créés par le trigger handle_new_user()

-- Policy DELETE : Interdire la suppression (cascade depuis auth.users)
-- Pas de policy DELETE nécessaire
```

---

### 2. Table `orders`

**Objectif** :
- Les **clients** peuvent voir et gérer leurs propres commandes
- Les **partenaires** peuvent voir les commandes assignées à leur établissement

```sql
-- Activer RLS sur la table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy SELECT pour clients : Voir ses propres commandes
CREATE POLICY "Clients can view own orders"
  ON orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role = 'client'
        AND user_profiles.id = orders.client_id
    )
  );

-- Policy SELECT pour partenaires : Voir les commandes de leur établissement
CREATE POLICY "Partners can view their orders"
  ON orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      JOIN partners ON partners.owner_id = user_profiles.id
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role = 'partner'
        AND partners.id = orders.partner_id
    )
  );

-- Policy INSERT : Seuls les clients peuvent créer des commandes
CREATE POLICY "Clients can create orders"
  ON orders
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role = 'client'
        AND user_profiles.id = client_id
    )
  );

-- Policy UPDATE : Les clients peuvent annuler, les partenaires peuvent mettre à jour le statut
CREATE POLICY "Clients can cancel own orders"
  ON orders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role = 'client'
        AND user_profiles.id = orders.client_id
    )
  )
  WITH CHECK (
    status IN ('pending', 'cancelled')
  );

CREATE POLICY "Partners can update order status"
  ON orders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      JOIN partners ON partners.owner_id = user_profiles.id
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role = 'partner'
        AND partners.id = orders.partner_id
    )
  )
  WITH CHECK (
    status IN ('pending', 'processing', 'washing', 'drying', 'ironing', 'ready', 'completed')
  );

-- Policy DELETE : Interdire la suppression (archive uniquement)
-- Pas de policy DELETE
```

---

### 3. Table `partners`

**Objectif** :
- Lecture publique (pour afficher la carte des partenaires)
- Les partenaires peuvent modifier leur propre fiche

```sql
-- Activer RLS sur la table
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Policy SELECT : Lecture publique des partenaires actifs
CREATE POLICY "Public can view active partners"
  ON partners
  FOR SELECT
  USING (is_active = true);

-- Policy SELECT : Les partenaires voient leur propre fiche même si inactive
CREATE POLICY "Partners can view own listing"
  ON partners
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role = 'partner'
        AND user_profiles.id = partners.owner_id
    )
  );

-- Policy UPDATE : Les partenaires peuvent modifier leur fiche
CREATE POLICY "Partners can update own listing"
  ON partners
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role = 'partner'
        AND user_profiles.id = partners.owner_id
    )
  );

-- Policy INSERT : Réservé aux admins ou inscription partenaire
-- À définir selon votre workflow d'inscription partenaire
```

---

### 4. Table `order_photos` (si photos de linge)

**Objectif** : Restreindre l'accès aux photos selon les rôles.

```sql
-- Activer RLS sur la table
ALTER TABLE order_photos ENABLE ROW LEVEL SECURITY;

-- Policy SELECT : Le client et le partenaire concernés peuvent voir les photos
CREATE POLICY "Order parties can view photos"
  ON order_photos
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      JOIN user_profiles ON user_profiles.id = orders.client_id
      WHERE orders.id = order_photos.order_id
        AND user_profiles.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM orders
      JOIN partners ON partners.id = orders.partner_id
      JOIN user_profiles ON user_profiles.id = partners.owner_id
      WHERE orders.id = order_photos.order_id
        AND user_profiles.user_id = auth.uid()
    )
  );

-- Policy INSERT : Le client peut uploader des photos pour sa commande
CREATE POLICY "Clients can upload photos for own orders"
  ON order_photos
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      JOIN user_profiles ON user_profiles.id = orders.client_id
      WHERE orders.id = order_photos.order_id
        AND user_profiles.user_id = auth.uid()
    )
  );

-- Policy DELETE : Le client peut supprimer ses photos
CREATE POLICY "Clients can delete own order photos"
  ON order_photos
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM orders
      JOIN user_profiles ON user_profiles.id = orders.client_id
      WHERE orders.id = order_photos.order_id
        AND user_profiles.user_id = auth.uid()
    )
  );
```

---

## 🚀 Activation des policies

### Script d'activation complet

Exécutez ce script dans le **SQL Editor** de Supabase :

```sql
-- =====================================================
-- Activation RLS pour KiloLab
-- =====================================================

-- 1. user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients can view own orders" ON orders;
CREATE POLICY "Clients can view own orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role = 'client'
        AND user_profiles.id = orders.client_id
    )
  );

DROP POLICY IF EXISTS "Partners can view their orders" ON orders;
CREATE POLICY "Partners can view their orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      JOIN partners ON partners.owner_id = user_profiles.id
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role = 'partner'
        AND partners.id = orders.partner_id
    )
  );

DROP POLICY IF EXISTS "Clients can create orders" ON orders;
CREATE POLICY "Clients can create orders"
  ON orders FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role = 'client'
        AND user_profiles.id = client_id
    )
  );

DROP POLICY IF EXISTS "Clients can cancel own orders" ON orders;
CREATE POLICY "Clients can cancel own orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role = 'client'
        AND user_profiles.id = orders.client_id
    )
  );

DROP POLICY IF EXISTS "Partners can update order status" ON orders;
CREATE POLICY "Partners can update order status"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      JOIN partners ON partners.owner_id = user_profiles.id
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role = 'partner'
        AND partners.id = orders.partner_id
    )
  );

-- 3. partners
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active partners" ON partners;
CREATE POLICY "Public can view active partners"
  ON partners FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Partners can view own listing" ON partners;
CREATE POLICY "Partners can view own listing"
  ON partners FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role = 'partner'
        AND user_profiles.id = partners.owner_id
    )
  );

DROP POLICY IF EXISTS "Partners can update own listing" ON partners;
CREATE POLICY "Partners can update own listing"
  ON partners FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role = 'partner'
        AND user_profiles.id = partners.owner_id
    )
  );

-- =====================================================
-- Vérification
-- =====================================================

-- Vérifier que RLS est activé
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('user_profiles', 'orders', 'partners');

-- Lister toutes les policies
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## 🧪 Tests des policies

### Test 1 : Profil utilisateur

```sql
-- En tant que client (user_id = xxx)
SELECT * FROM user_profiles WHERE user_id = auth.uid();
-- ✅ Devrait retourner 1 ligne

SELECT * FROM user_profiles WHERE user_id != auth.uid();
-- ✅ Devrait retourner 0 ligne (accès interdit)
```

### Test 2 : Commandes

```sql
-- En tant que client
SELECT * FROM orders WHERE client_id = (SELECT id FROM user_profiles WHERE user_id = auth.uid());
-- ✅ Devrait retourner uniquement ses commandes

-- En tant que partenaire
SELECT * FROM orders WHERE partner_id = (
  SELECT partners.id FROM partners
  JOIN user_profiles ON user_profiles.id = partners.owner_id
  WHERE user_profiles.user_id = auth.uid()
);
-- ✅ Devrait retourner uniquement les commandes de son établissement
```

---

## ⚠️ Notes importantes

1. **Service Role Key** : Le webhook Stripe utilise la `service_role_key` qui bypass RLS
2. **Triggers** : Les triggers s'exécutent avec les privilèges du propriétaire (pas affectés par RLS)
3. **Performance** : Les policies complexes peuvent ralentir les requêtes (ajouter des index si besoin)
4. **Tests** : Testez toujours en mode "authenticated" avant d'activer RLS en production

---

## 🔐 Variables d'environnement requises

Pour le webhook Stripe, ajoutez dans Netlify :

```bash
SUPABASE_SERVICE_ROLE_KEY=<votre_service_role_key>
```

Cette clé se trouve dans : Supabase Dashboard > Settings > API > `service_role` (secret)

---

## 📚 Ressources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Policies](https://www.postgresql.org/docs/current/sql-createpolicy.html)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
