#!/bin/bash

echo "🔧 Correction des imports en double dans App.tsx"

# Sauvegarder l'original
cp src/App.tsx src/App.tsx.backup

# Supprimer les lignes 8-10 (imports en double)
sed -i '8,10d' src/App.tsx

echo "✅ Imports en double supprimés"
echo ""
echo "Vérification:"
head -20 src/App.tsx

echo ""
echo "🚀 Testez maintenant:"
echo "   npm run dev"
