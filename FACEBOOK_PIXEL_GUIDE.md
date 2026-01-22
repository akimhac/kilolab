# Guide Facebook Pixel - Kilolab

## ✅ Installation terminée

2 fichiers créés :
1. `src/lib/facebookPixel.ts` - Helper de tracking
2. `FACEBOOK_PIXEL_GUIDE.md` - Ce guide

## 🚀 Utilisation

### Dans PaymentSuccess.tsx

```typescript
import { trackPurchase } from '../lib/facebookPixel';

useEffect(() => {
  const orderId = 'ORDER_123';
  const amount = 17.50;
  const weight = 5;
  trackPurchase(orderId, amount, weight);
}, []);
```

### Dans BecomePartner.tsx

```typescript
import { trackPartnerSignup } from '../lib/facebookPixel';

const handleSubmit = async (data) => {
  const { error } = await supabase.from('partners').insert(data);
  if (!error) {
    trackPartnerSignup(data.name);
  }
};
```

### Dans Signup.tsx

```typescript
import { trackClientSignup } from '../lib/facebookPixel';

const handleSignup = async () => {
  const { error } = await supabase.auth.signUp(...);
  if (!error) {
    trackClientSignup();
  }
};
```

## ✅ Vérification

Ouvre Chrome DevTools → Console → Tape: `fbq`

Tu devrais voir: `function fbq() { ... }`

## 📊 Fonctions disponibles

- `trackPurchase(orderId, amount, weight)` - Achat
- `trackPartnerSignup(name)` - Inscription pressing
- `trackInitiateCheckout(weight, formula, price)` - Début commande
- `trackClientSignup()` - Inscription client
- `trackContact()` - Formulaire contact
