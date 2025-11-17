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
