#!/bin/bash

echo "🔄 Changement Repassage → Séchage + Pliage..."

# LandingPage
sed -i 's/Lavage + Séchage + Repassage + Emballage/Lavage + Séchage + Pliage + Emballage/g' src/pages/LandingPage.tsx
sed -i 's/Séchage et repassage/Séchage et pliage/g' src/pages/LandingPage.tsx
sed -i 's/repassage/pliage/g' src/pages/LandingPage.tsx
sed -i 's/repassé/plié et séché/g' src/pages/LandingPage.tsx

echo "✅ Textes mis à jour"
