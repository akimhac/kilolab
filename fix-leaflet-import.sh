#!/bin/bash

# Trouver tous les fichiers qui importent leaflet depuis unpkg
find src -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  # Remplacer l'import CDN par l'import local
  sed -i 's|import "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"|import "leaflet/dist/leaflet.css"|g' "$file"
done

echo "✅ Imports Leaflet mis à jour"
