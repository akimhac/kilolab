# 💳 STRIPE CONNECT : Passer d'un modèle centralisé à décentralisé

## 🤔 Différence entre les deux modèles

### MODÈLE ACTUEL (Vous prenez les paiements)
```
Client → Paie sur Kilolab → Vous recevez 100% → Vous reversez 85-90% au pressing
```
**Avantages :**
- ✅ Simple à mettre en place
- ✅ Vous contrôlez tout
- ✅ Pas besoin que les pressings aient un compte Stripe

**Inconvénients :**
- ❌ Vous gérez TOUS les remboursements
- ❌ Vous êtes responsable en cas de litige
- ❌ Complexité comptable (gérer des milliers de virements)
- ❌ Les pressings doivent vous faire confiance

---

### STRIPE CONNECT (Pressings reçoivent directement)
```
Client → Paie le pressing directement → Pressing reçoit 85-90% → Vous recevez 10-15% de commission automatiquement
```

**Avantages :**
- ✅ Pressings reçoivent l'argent directement (confiance++)
- ✅ Vous ne gérez PAS les remboursements
- ✅ Pas de comptabilité complexe
- ✅ Scalable (des milliers de pressings sans problème)
- ✅ Conforme légalement

**Inconvénients :**
- ❌ Plus complexe techniquement
- ❌ Chaque pressing doit créer un compte Stripe Connect
- ❌ Onboarding plus long pour les pressings

---

## 🏗️ ARCHITECTURE STRIPE CONNECT

### Types de Stripe Connect

**1. Standard** (Recommandé pour Kilolab)
- Chaque pressing a son propre dashboard Stripe
- Vous prenez une commission (Application Fee)
- Le pressing gère ses remboursements

**2. Express** (Plus simple)
- Dashboard simplifié pour les pressings
- Vous gardez plus de contrôle

**3. Custom** (Complexe)
- Vous gérez tout pour les pressings
- Pas recommandé au début

---

## �� IMPLÉMENTATION TECHNIQUE

### Étape 1 : Configuration Stripe Connect
```bash
# Dans votre Dashboard Stripe
1. Aller dans Settings → Connect
2. Activer Stripe Connect
3. Choisir "Standard" ou "Express"
4. Configurer l'URL de redirection
```

### Étape 2 : Code Backend (Supabase Functions)
```typescript
// supabase/functions/create-connect-account/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  try {
    const { email, pressingName } = await req.json()

    // Créer un compte Connect pour le pressing
    const account = await stripe.accounts.create({
      type: 'standard', // ou 'express'
      country: 'FR',
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: {
        name: pressingName,
      },
    })

    // Créer un lien d'onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://kilolab.fr/partner-dashboard',
      return_url: 'https://kilolab.fr/partner-dashboard/success',
      type: 'account_onboarding',
    })

    return new Response(
      JSON.stringify({ url: accountLink.url }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

### Étape 3 : Paiement avec Application Fee
```typescript
// Lors du paiement client
const paymentIntent = await stripe.paymentIntents.create({
  amount: 3000, // 30€
  currency: 'eur',
  application_fee_amount: 450, // 4.50€ de commission (15%)
  transfer_data: {
    destination: pressingStripeAccountId, // ID du compte Connect du pressing
  },
})
```

### Étape 4 : Modifier la BDD
```sql
-- Ajouter une colonne pour stocker l'ID Stripe Connect
ALTER TABLE partners ADD COLUMN stripe_account_id VARCHAR;
ALTER TABLE partners ADD COLUMN stripe_onboarding_completed BOOLEAN DEFAULT false;
```

---

## 💰 REVENUS AVEC STRIPE CONNECT

### Calcul de commission

**Client paie 30€ pour une commande :**
```
Montant total : 30.00€
Commission Kilolab (15%) : 4.50€
Pressing reçoit : 25.50€
Frais Stripe (~2%) : 0.75€

Pressing net : 24.75€
Kilolab net : 3.75€
```

### Avantages fiscaux

- ✅ Pas besoin de facturer le pressing (Stripe le fait)
- ✅ Comptabilité simplifiée
- ✅ Rapports automatiques dans Stripe

---

## 📋 CHECKLIST MIGRATION VERS STRIPE CONNECT

### Phase 1 : Préparation (1 semaine)
- [ ] Activer Stripe Connect dans dashboard
- [ ] Créer Supabase Function pour onboarding
- [ ] Ajouter colonnes BDD (stripe_account_id)
- [ ] Page d'onboarding pressing

### Phase 2 : Tests (1 semaine)
- [ ] Créer 1-2 comptes Connect de test
- [ ] Tester le flux de paiement complet
- [ ] Tester les commissions
- [ ] Tester les remboursements

### Phase 3 : Migration (2-4 semaines)
- [ ] Contacter les pressings existants
- [ ] Les faire passer sur Connect
- [ ] Double flux (ancien + nouveau) temporaire
- [ ] Basculer 100% sur Connect

---

## ⚠️ POINTS D'ATTENTION

1. **Onboarding pressings**
   - Expliquer clairement le processus
   - Fournir un guide pas à pas
   - Support dédié

2. **KYC (Know Your Customer)**
   - Stripe demande des documents aux pressings
   - SIRET obligatoire
   - Peut prendre 24-48h

3. **Taux de change**
   - Si pressings belges → gérer EUR correctement

4. **Remboursements**
   - Les pressings gèrent leurs remboursements
   - Vous ne remboursez PAS votre commission

---

## 🎯 MA RECOMMANDATION

**Pour Kilolab :**

1. **MAINTENANT (Lancement)** : Gardez le modèle actuel
   - Plus simple pour démarrer
   - Moins de friction pour les pressings
   - Vous testez le marché

2. **APRÈS 50 COMMANDES/MOIS** : Migrez vers Stripe Connect
   - Vous aurez des pressings "ambassadeurs" pour tester
   - Scalabilité nécessaire
   - Crédibilité renforcée

3. **Modèle hybride possible :**
   - Nouveaux pressings → Stripe Connect obligatoire
   - Anciens pressings → Transition progressive

---

## 💻 BESOIN D'AIDE POUR IMPLÉMENTER ?

Je peux vous créer :
1. ✅ Les Supabase Functions complètes
2. ✅ Le flux d'onboarding pressing
3. ✅ La page de paiement avec Connect
4. ✅ Le dashboard pressing

**Dites-moi si vous voulez que je code tout ça !** 🚀
