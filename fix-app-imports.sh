#!/bin/bash

echo "🔧 NETTOYAGE DE App.tsx..."

# Supprimer tous les imports en double de PartnersMap
sed -i '/import PartnersMap/d' src/App.tsx

# Trouver la ligne après les imports de pages et ajouter l'import UNE SEULE FOIS
sed -i '/import.*pages.*ClientDashboard/a import PartnersMap from '"'"'./pages/PartnersMap'"'"';' src/App.tsx

echo "✅ Imports nettoyés"
echo ""
echo "🔄 Redémarre:"
echo "   npm run dev"

