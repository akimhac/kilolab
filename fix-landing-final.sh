#!/bin/bash

echo "🔧 Corrections finales Landing Page"
echo ""

# ============================================
# 1. CHANGER L'IMAGE (nourriture → pressing)
# ============================================

echo "🖼️  Remplacement de l'image..."

# Créer un fichier de remplacement
cat > temp_image_fix.txt << 'IMGFIX'
DANS src/pages/LandingPage.tsx

LIGNE ~103-108, remplacez:

                <img
                  src="https://images.pexels.com/photos/5591666/pexels-photo-5591666.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Pressing moderne"
                  className="w-full h-[500px] object-cover"
                />

PAR:

                <img
                  src="https://images.pexels.com/photos/6196916/pexels-photo-6196916.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Pressing moderne - Vêtements propres"
                  className="w-full h-[500px] object-cover"
                />
IMGFIX

cat temp_image_fix.txt
rm temp_image_fix.txt

echo ""
echo "✅ Instructions affichées ci-dessus"
echo ""

# ============================================
# 2. CRÉER UN COMPOSANT NAVBAR RÉUTILISABLE
# ============================================

echo "📝 Création d'une navbar améliorée..."

mkdir -p src/components

cat > src/components/Navbar.tsx << 'NAVBARFILE'
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="text-3xl font-black cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Kilolab
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className={`font-medium transition ${
                isActive('/') 
                  ? 'text-purple-600' 
                  : 'text-slate-700 hover:text-purple-600'
              }`}
            >
              Comment ça marche
            </button>
            <button
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className={`font-medium transition ${
                isActive('/') 
                  ? 'text-purple-600' 
                  : 'text-slate-700 hover:text-purple-600'
              }`}
            >
              Avis
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-5 py-2.5 text-slate-700 hover:text-purple-600 transition font-medium"
            >
              <LogIn className="w-4 h-4" />
              Connexion
            </button>
            <button
              onClick={() => navigate('/partners-map')}
              className="px-6 py-2.5 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Trouver un pressing
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <button
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-purple-50 rounded-lg"
            >
              Comment ça marche
            </button>
            <button
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-purple-50 rounded-lg"
            >
              Avis
            </button>
            <button
              onClick={() => {
                navigate('/login');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-purple-50 rounded-lg"
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Connexion
            </button>
            <button
              onClick={() => {
                navigate('/partners-map');
                setMobileMenuOpen(false);
              }}
              className="block w-full px-6 py-3 rounded-full font-semibold text-white text-center"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Trouver un pressing
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
NAVBARFILE

echo "✅ Navbar créée dans src/components/Navbar.tsx"
echo ""
echo "📝 Pour l'utiliser dans LandingPage.tsx:"
echo ""
echo "1. Ajoutez en haut des imports:"
echo "   import Navbar from '../components/Navbar';"
echo ""
echo "2. Remplacez la section <nav>...</nav> (lignes 22-56) par:"
echo "   <Navbar />"
echo ""
echo "3. Supprimez le vieux code nav (gardez seulement <Navbar />)"
echo ""

# ============================================
# 3. INSTRUCTIONS FINALES
# ============================================

cat > INSTRUCTIONS_FINALES.md << 'INSTRUCTIONS'
# 🎯 CORRECTIONS FINALES À APPLIQUER

## 1️⃣ Changer l'image (PRIORITAIRE)

**Fichier:** `src/pages/LandingPage.tsx`

**Ligne ~103-108**, remplacez l'URL de l'image:
```tsx
// ❌ AVANT (image de nourriture)
src="https://images.pexels.com/photos/5591666/pexels-photo-5591666.jpeg?auto=compress&cs=tinysrgb&w=800"

// ✅ APRÈS (image de pressing)
src="https://images.pexels.com/photos/6196916/pexels-photo-6196916.jpeg?auto=compress&cs=tinysrgb&w=800"
```

OU mieux encore, cette image de pressing professionnel:
```tsx
src="https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg?auto=compress&cs=tinysrgb&w=800"
```

---

## 2️⃣ Utiliser la nouvelle Navbar (OPTIONNEL)

**Si vous voulez améliorer la navigation:**

1. La navbar est déjà créée dans `src/components/Navbar.tsx`

2. Dans `src/pages/LandingPage.tsx`, **en haut** ajoutez:
```tsx
import Navbar from '../components/Navbar';
```

3. **Remplacez** tout le bloc `<nav>...</nav>` (lignes ~22-56) par:
```tsx
<Navbar />
```

**Avantages de la nouvelle Navbar:**
- ✅ Menu mobile hamburger
- ✅ Défilement smooth vers sections
- ✅ Active state sur les liens
- ✅ Plus propre et réutilisable

---

## 3️⃣ Vérifier les liens du footer

Dans le footer de `LandingPage.tsx`, vérifiez que ces boutons sont bien présents:
```tsx
<button onClick={() => navigate('/legal/cgu')}>CGU</button>
<button onClick={() => navigate('/legal/privacy')}>Confidentialité</button>
<button onClick={() => navigate('/legal/mentions-legales')}>Mentions légales</button>
```

✅ **Déjà fait d'après votre screenshot !**

---

## 4️⃣ Committez et déployez
```bash
git add .
git commit -m "fix: replace food image with laundry image + improve navbar"
git push
```

Attendez 2 minutes et testez sur **https://kilolab.fr** 🚀

---

## ✅ CHECKLIST FINALE

- [ ] Image changée (nourriture → pressing)
- [ ] Navbar améliorée (optionnel)
- [ ] Pages légales accessibles dans footer (✅ déjà fait)
- [ ] Site commité et déployé
- [ ] Tests sur mobile + desktop

---

## 🎨 AUTRES IMAGES DE PRESSING DISPONIBLES

Si l'image ne vous plaît pas, voici d'autres options (Pexels, libres de droits):
```
https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg
https://images.pexels.com/photos/6196916/pexels-photo-6196916.jpeg
https://images.pexels.com/photos/4239031/pexels-photo-4239031.jpeg
https://images.pexels.com/photos/4210374/pexels-photo-4210374.jpeg
```

Testez-les et choisissez celle qui vous plaît le plus !
INSTRUCTIONS

cat INSTRUCTIONS_FINALES.md

echo ""
echo "✅ SCRIPT TERMINÉ !"
echo ""
echo "📄 Fichier créé: INSTRUCTIONS_FINALES.md"
echo ""
echo "🎯 PROCHAINES ACTIONS:"
echo "1. Lisez INSTRUCTIONS_FINALES.md"
echo "2. Changez l'image dans LandingPage.tsx"
echo "3. (Optionnel) Utilisez la nouvelle Navbar"
echo "4. git add . && git commit -m 'fix: final landing improvements' && git push"
ENDOFFILE
