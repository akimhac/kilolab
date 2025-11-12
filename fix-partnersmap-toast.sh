#!/bin/bash

echo "🔧 FIX PartnersMap.tsx - Suppression toast()"
echo "=============================================="

# Backup du fichier
cp src/pages/PartnersMap.tsx src/pages/PartnersMap.tsx.backup

# Supprimer les lignes avec toast
sed -i '/toast\./d' src/pages/PartnersMap.tsx
sed -i '/toast(/d' src/pages/PartnersMap.tsx

# Supprimer l'import toast si présent
sed -i '/from.*react-hot-toast/d' src/pages/PartnersMap.tsx
sed -i '/import.*toast/d' src/pages/PartnersMap.tsx

echo "✅ toast() supprimé de PartnersMap.tsx"

# Vérifier qu'il n'y a plus d'erreurs
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ BUILD RÉUSSI !"
  git add src/pages/PartnersMap.tsx
  git commit -m "fix: suppression toast() de PartnersMap.tsx"
  git push origin main
else
  echo ""
  echo "❌ Il reste des erreurs, restauration backup..."
  mv src/pages/PartnersMap.tsx.backup src/pages/PartnersMap.tsx
fi
