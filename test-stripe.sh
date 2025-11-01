#!/bin/bash

echo "🔍 Test configuration Stripe..."
echo ""

# Vérifier les clés
if grep -q "VITE_STRIPE_PUBLIC_KEY=" .env.local 2>/dev/null; then
    echo "✅ VITE_STRIPE_PUBLIC_KEY trouvée dans .env.local"
else
    echo "❌ VITE_STRIPE_PUBLIC_KEY manquante"
    echo "Ajoute dans .env.local:"
    echo "VITE_STRIPE_PUBLIC_KEY=pk_test_..."
fi

if grep -q "STRIPE_SECRET_KEY=" .env.local 2>/dev/null; then
    echo "✅ STRIPE_SECRET_KEY trouvée dans .env.local"
else
    echo "❌ STRIPE_SECRET_KEY manquante"
    echo "Ajoute dans .env.local:"
    echo "STRIPE_SECRET_KEY=sk_test_..."
fi

echo ""
echo "📋 Pour obtenir tes clés Stripe:"
echo "1. Va sur: https://dashboard.stripe.com/test/apikeys"
echo "2. Copie la 'Publishable key' (pk_test_...)"
echo "3. Copie la 'Secret key' (sk_test_...)"
echo "4. Ajoute-les dans .env.local"

echo ""
echo "🧪 Test simulation paiement..."
echo "Le paiement actuel est en mode SIMULATION"
echo "Pour activer Stripe réel, configure les clés ci-dessus"
