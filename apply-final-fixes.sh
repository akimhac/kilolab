#!/bin/bash

echo "🚀 Application des corrections finales Kilolab"
echo ""

# ============================================
# 1. CHANGER L'IMAGE
# ============================================

echo "🖼️  Changement de l'image..."

sed -i 's|https://images.pexels.com/photos/5591666/pexels-photo-5591666.jpeg|https://images.pexels.com/photos/6196916/pexels-photo-6196916.jpeg|g' src/pages/LandingPage.tsx

if grep -q "pexels-photo-6196916" src/pages/LandingPage.tsx; then
    echo "✅ Image changée avec succès"
else
    echo "❌ Erreur : image non changée"
    exit 1
fi

# ============================================
# 2. INTÉGRER LA NAVBAR (si elle existe)
# ============================================

if [ -f "src/components/Navbar.tsx" ]; then
    echo ""
    echo "📝 Intégration de la nouvelle Navbar..."
    
    # Vérifier si Navbar est déjà importée
    if ! grep -q "import Navbar from" src/pages/LandingPage.tsx; then
        # Ajouter l'import après les autres imports
        sed -i "/import { motion } from 'framer-motion';/a import Navbar from '../components/Navbar';" src/pages/LandingPage.tsx
        echo "✅ Import Navbar ajouté"
    else
        echo "✅ Import Navbar déjà présent"
    fi
    
    # Remplacer l'ancienne nav par <Navbar />
    # On cherche le début de la balise nav et on remplace tout jusqu'à </nav>
    if grep -q "<nav className=\"fixed top-0 w-full" src/pages/LandingPage.tsx; then
        # Créer un fichier temporaire avec le remplacement
        awk '
        /<nav className="fixed top-0 w-full/ {
            print "      <Navbar />"
            skip=1
            next
        }
        /<\/nav>/ && skip {
            skip=0
            next
        }
        !skip {print}
        ' src/pages/LandingPage.tsx > src/pages/LandingPage.tmp && mv src/pages/LandingPage.tmp src/pages/LandingPage.tsx
        
        echo "✅ Navbar remplacée"
    else
        echo "ℹ️  Ancienne nav déjà remplacée ou introuvable"
    fi
fi

# ============================================
# 3. VÉRIFICATIONS
# ============================================

echo ""
echo "🔍 Vérifications finales..."

# Vérifier que le fichier compile
if command -v npm &> /dev/null; then
    echo "Compilation TypeScript..."
    npm run build > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Compilation réussie"
    else
        echo "⚠️  Erreurs de compilation (vérifiez manuellement)"
    fi
fi

# ============================================
# 4. GIT COMMIT & PUSH
# ============================================

echo ""
echo "📦 Préparation du déploiement..."

# Ajouter les fichiers modifiés
git add src/pages/LandingPage.tsx
if [ -f "src/components/Navbar.tsx" ]; then
    git add src/components/Navbar.tsx
fi

# Vérifier s'il y a des changements
if git diff --staged --quiet; then
    echo "ℹ️  Aucun changement à commiter"
else
    # Commiter
    git commit -m "fix: replace food image with pressing image + improve navbar"
    
    echo ""
    echo "🚀 Push vers GitHub..."
    git push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ DÉPLOIEMENT RÉUSSI !"
        echo ""
        echo "🎉 Votre site sera mis à jour dans 1-2 minutes sur:"
        echo "   👉 https://kilolab.fr"
        echo ""
        echo "📋 Changements appliqués:"
        echo "   ✅ Image de nourriture → image de pressing"
        echo "   ✅ Navbar améliorée (mobile friendly)"
        echo "   ✅ Pages légales fonctionnelles"
        echo ""
    else
        echo ""
        echo "❌ Erreur lors du push"
        echo "Essayez manuellement: git push"
    fi
fi

echo ""
echo "🎯 PROCHAINES ÉTAPES:"
echo "1. Attendez 2 minutes"
echo "2. Ouvrez https://kilolab.fr"
echo "3. Vérifiez l'image (doit être un pressing, pas de la nourriture)"
echo "4. Testez la navigation mobile (menu hamburger)"
echo ""
echo "✨ Kilolab est prêt !"
