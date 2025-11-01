# 🧪 CHECKLIST DE TEST KILOLAB

## 📱 **1. LANDING PAGE** (http://localhost:5173/)

### Design & Affichage
- [ ] Le banner promo jaune s'affiche en haut
- [ ] Le gradient violet/bleu est visible
- [ ] Les 3 boutons CTA sont visibles (Essayer / Se connecter / Voir carte)
- [ ] Les 3 formules (Premium 5€, Express 10€, Ultra 15€) s'affichent
- [ ] Le badge "POPULAIRE" est sur Express
- [ ] Les étoiles ⭐⭐⭐⭐⭐ sont visibles
- [ ] Les 4 étapes numérotées s'affichent
- [ ] Les 3 témoignages avec avatars sont là
- [ ] La section FAQ est présente
- [ ] Le footer est complet

### Interactions
- [ ] Hover sur les boutons change la couleur
- [ ] Hover sur les cartes formules fait un effet
- [ ] Les liens fonctionnent
- [ ] Le scroll est fluide

### Responsive
- [ ] Sur mobile (F12 → mode mobile)
  - [ ] Les 3 cartes formules sont empilées
  - [ ] Les boutons sont cliquables
  - [ ] Le texte est lisible

---

## 🔐 **2. INSCRIPTION** (http://localhost:5173/register)

### Affichage
- [ ] Formulaire d'inscription visible
- [ ] Champs : Nom, Email, Téléphone, Mot de passe, Type (Client/Partenaire)
- [ ] Bouton "S'inscrire" visible
- [ ] Lien "Déjà un compte ?" vers login

### Test Inscription Client
- [ ] Remplir le formulaire :
  - Nom : Test Client
  - Email : client@test.com
  - Téléphone : 0612345678
  - Mot de passe : Test1234
  - Type : Client
- [ ] Cliquer "S'inscrire"
- [ ] Message "Inscription réussie" s'affiche
- [ ] Redirection vers /login

### Test Inscription Partenaire
- [ ] Remplir avec :
  - Nom : Test Partenaire
  - Email : partner@test.com
  - Type : Partenaire
- [ ] L'inscription fonctionne

### Erreurs
- [ ] Email déjà utilisé → Message d'erreur
- [ ] Mot de passe < 6 caractères → Message d'erreur
- [ ] Champs vides → Validation HTML5

---

## 🔑 **3. CONNEXION** (http://localhost:5173/login)

### Affichage
- [ ] Formulaire login visible
- [ ] Champs : Email, Mot de passe
- [ ] Bouton "Se connecter"
- [ ] Lien "Pas de compte ?" vers register

### Test Login Client
- [ ] Email : client@test.com
- [ ] Mot de passe : Test1234
- [ ] Cliquer "Se connecter"
- [ ] Redirection vers /client-dashboard
- [ ] Pas d'erreur dans la console (F12)

### Test Login Partenaire
- [ ] Email : partner@test.com
- [ ] Mot de passe : (ton mot de passe)
- [ ] Redirection vers /partner-dashboard

### Erreurs
- [ ] Mauvais mot de passe → Message d'erreur
- [ ] Email inexistant → Message d'erreur

---

## 👤 **4. DASHBOARD CLIENT** (http://localhost:5173/client-dashboard)

### Affichage (connecté en tant que client)
- [ ] Titre "Mon Espace Client" visible
- [ ] Bouton "Nouvelle commande" visible
- [ ] Bouton "Déconnexion" visible
- [ ] 4 cartes stats (En attente, En cours, Terminées, Total)
- [ ] Section "Mes commandes"
- [ ] Si aucune commande : message + bouton "Créer ma première commande"

### Navigation
- [ ] Cliquer "Nouvelle commande" → va vers /new-order
- [ ] Cliquer "Déconnexion" → retour à /

### Stats
- [ ] Les chiffres correspondent (0/0/0/0 si nouveau compte)

---

## �� **5. DASHBOARD PARTENAIRE** (http://localhost:5173/partner-dashboard)

### Affichage (connecté en tant que partenaire)
- [ ] Titre "Espace Partenaire"
- [ ] Bouton "Déconnexion"
- [ ] 4 cartes stats (Total, À peser, En cours, Prêt)
- [ ] Section "Commandes"

### Fonctionnalités (si commande existe)
- [ ] Affichage de la commande
- [ ] Numéro de commande visible
- [ ] Statut visible
- [ ] Bouton "Enregistrer" pour peser
- [ ] Champ poids (kg)

---

## 📝 **6. NOUVELLE COMMANDE** (http://localhost:5173/new-order)

### Accès
- [ ] Accessible uniquement si connecté
- [ ] Sinon → redirection vers /login

### Affichage
- [ ] Titre "Nouvelle Commande"
- [ ] Formulaire visible
- [ ] Champs : Poids estimé, Formule, Point relais
- [ ] Bouton "Créer la commande"

### Test Création
- [ ] Choisir Premium
- [ ] Poids : 3 kg
- [ ] Choisir un point relais (si liste disponible)
- [ ] Cliquer "Créer la commande"
- [ ] Message de confirmation OU erreur claire

---

## 🗺️ **7. CARTE DES PARTENAIRES** (http://localhost:5173/partners-map)

### Affichage
- [ ] Carte Leaflet s'affiche
- [ ] Marqueurs rouges visibles
- [ ] Popup au clic sur marqueur
- [ ] Liste des partenaires sous la carte
- [ ] Nombre de partenaires affiché (ex: "75 points relais")
- [ ] Bouton "← Retour" fonctionne

### Fonctionnalités
- [ ] Zoom/Dézoom sur la carte
- [ ] Drag & drop pour se déplacer
- [ ] Cliquer sur un marqueur → Popup avec nom/adresse
- [ ] Barre de recherche par ville
- [ ] Filtrer par ville fonctionne

### Géolocalisation
- [ ] Demande la permission de localisation
- [ ] Si accepté → marqueur bleu "Vous êtes ici"
- [ ] Si refusé → centre sur la France

### Partenaires
- [ ] Au moins 1 partenaire visible
- [ ] Si 0 partenaire → message "Aucun partenaire"

---

## 🚨 **8. ERREURS & EDGE CASES**

### Authentification
- [ ] Accéder à /client-dashboard sans login → redirection /login
- [ ] Accéder à /new-order sans login → redirection /login
- [ ] Après déconnexion, retour sur pages protégées → redirection

### Routes invalides
- [ ] http://localhost:5173/page-inexistante → Erreur 404 OU redirection /

### Console (F12)
- [ ] Aucune erreur rouge dans la console
- [ ] Aucun warning critique

---

## 📊 **9. BASE DE DONNÉES SUPABASE**

### Vérifier tables
- [ ] Ouvrir Supabase → Table Editor
- [ ] Table `user_profiles` existe
- [ ] Table `orders` existe
- [ ] Table `partners` existe
- [ ] Table `order_photos` existe (si créée)

### Vérifier données
- [ ] Table `partners` contient au moins 1 pressing
- [ ] Table `user_profiles` contient tes comptes test
- [ ] Après création commande → nouvelle ligne dans `orders`

### Bucket Storage
- [ ] Bucket `order-photos` existe (si configuré)
- [ ] Policies configurées (public read)

---

## 🌐 **10. PERFORMANCE**

### Vitesse
- [ ] Landing page charge en < 3 secondes
- [ ] Carte charge en < 5 secondes
- [ ] Pas de lag au scroll
- [ ] Images chargent rapidement

### Network (F12 → Network)
- [ ] Aucune requête en erreur (rouge)
- [ ] Taille totale < 5 MB

---

## 📱 **11. RESPONSIVE (Mobile)**

### Test Mobile (F12 → Device Toolbar)
- [ ] iPhone SE (375px)
  - [ ] Landing page lisible
  - [ ] Boutons cliquables
  - [ ] Formulaires utilisables
- [ ] iPad (768px)
  - [ ] Layout adapté
  - [ ] Cartes bien disposées

---

## ✅ **12. FONCTIONNALITÉS AVANCÉES**

### Photos (si implémenté)
- [ ] Upload de photo fonctionne
- [ ] Preview s'affiche
- [ ] Image sauvegardée dans Supabase

### Emails (si implémenté)
- [ ] Email de confirmation reçu après inscription
- [ ] Email après création commande

### Stripe (si implémenté)
- [ ] Bouton "Payer" visible
- [ ] Redirection vers Stripe Checkout
- [ ] Retour après paiement

---

## 🎯 **RÉSUMÉ - QUICK CHECK**

✅ **CRITIQUE (à tester absolument) :**
- [ ] Landing page s'affiche
- [ ] Inscription fonctionne
- [ ] Login fonctionne
- [ ] Dashboard client accessible
- [ ] Carte s'affiche avec partenaires
- [ ] Déconnexion fonctionne

⚠️ **IMPORTANT (à tester si le temps) :**
- [ ] Création commande
- [ ] Dashboard partenaire
- [ ] Responsive mobile
- [ ] Aucune erreur console

💡 **NICE TO HAVE (bonus) :**
- [ ] Upload photos
- [ ] Emails
- [ ] Paiement Stripe

---

## 📋 **COMMENT TESTER**

1. **Ouvre 2 fenêtres incognito** (pour tester client + partenaire en parallèle)
2. **Coche chaque case** en testant
3. **Note les bugs** dans un fichier bugs.txt
4. **Fais des screenshots** si problème visuel

---

## 🐛 **SI TU TROUVES UN BUG**

Note dans ce format :
```
BUG #1 - Carte ne s'affiche pas
- Page : /partners-map
- Action : Ouvrir la page
- Erreur console : "Cannot read property 'lat' of undefined"
- Screenshot : [lien]
```

---

## 🎉 **TEST RÉUSSI SI :**

✅ Landing + Login + Register fonctionnent  
✅ Dashboard client accessible  
✅ Carte affiche au moins 1 partenaire  
✅ Aucune erreur rouge dans la console  
✅ Site responsive mobile  

**Si tout ça marche → TON SITE EST PRÊT POUR LA PRODUCTION ! 🚀**

