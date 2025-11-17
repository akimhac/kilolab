#!/bin/bash

echo "🖼️  Correction de l'image hero..."

# Ouvrir le fichier et remplacer l'URL de l'image
sed -i 's|https://images.pexels.com/photos/5591666/pexels-photo-5591666.jpeg|https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg|g' src/pages/LandingPage.tsx

echo "✅ Image remplacée par une image de pressing"
echo ""
echo "Alternatives d'images (pressing/laverie):"
echo "- https://images.pexels.com/photos/6196916/pexels-photo-6196916.jpeg"
echo "- https://images.pexels.com/photos/4239031/pexels-photo-4239031.jpeg"
echo "- https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg"
echo ""
echo "git add src/pages/LandingPage.tsx"
echo "git commit -m 'fix: replace food image with laundry image'"
echo "git push"
ENDOFFILE
