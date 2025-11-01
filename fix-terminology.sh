#!/bin/bash

echo "🔄 Changement terminologie Point Relais → Laverie Partenaire..."

# LandingPage
sed -i 's/Points relais partout en France/Laveries partenaires partout en France/g' src/pages/LandingPage.tsx
sed -i 's/Points relais/Laveries partenaires/g' src/pages/LandingPage.tsx
sed -i 's/Point relais/Laverie partenaire/g' src/pages/LandingPage.tsx
sed -i 's/point relais/laverie partenaire/g' src/pages/LandingPage.tsx
sed -i 's/points relais/laveries partenaires/g' src/pages/LandingPage.tsx

# NewOrder
sed -i 's/Points relais près de vous/Laveries partenaires près de vous/g' src/pages/NewOrder.tsx
sed -i 's/Point relais sélectionné/Laverie partenaire sélectionnée/g' src/pages/NewOrder.tsx
sed -i 's/point relais/laverie partenaire/g' src/pages/NewOrder.tsx

# PartnersMap
sed -i 's/Nos Points Relais/Nos Laveries Partenaires/g' src/pages/PartnersMap.tsx
sed -i 's/point relais/laverie partenaire/g' src/pages/PartnersMap.tsx
sed -i 's/ point/ laverie/g' src/pages/PartnersMap.tsx

echo "✅ Terminologie changée"
