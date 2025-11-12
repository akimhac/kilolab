#!/bin/bash

echo "🧹 NETTOYAGE PROFOND"
echo "==================="

# Supprimer TOUS les fichiers de debug
rm -f *.sh
rm -f *.sql
rm -f *.md.backup
rm -f .env.local
rm -f .env.example

# Supprimer dossiers temporaires
rm -rf .backups 2>/dev/null
rm -rf node_modules/.vite
rm -rf dist

# Rebuild propre
npm install
npm run build

# Status
git status

echo ""
echo "✅ Nettoyage terminé"
echo "📋 Vérifie git status ci-dessus"
