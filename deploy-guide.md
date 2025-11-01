# 🚀 GUIDE DE DÉPLOIEMENT KILOLAB

## ✅ OPTION 1 : NETLIFY (RECOMMANDÉ - GRATUIT)

### Étape 1 : Build local
npm run build

### Étape 2 : Créer compte Netlify
1. Va sur https://netlify.com
2. Inscris-toi (gratuit)
3. Connecte ton GitHub

### Étape 3 : Nouveau site
1. "Add new site" → "Import an existing project"
2. Connecte ton repo GitHub
3. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Étape 4 : Variables d'environnement
Dans Netlify → Site settings → Environment variables, ajoute:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- (Optionnel: VITE_STRIPE_PUBLIC_KEY, RESEND_API_KEY)

### Étape 5 : Deploy
Clique "Deploy site" → Ton site sera en ligne en 2 minutes !

---

## ✅ OPTION 2 : OVH VPS

### Étape 1 : Commander VPS
1. Va sur https://www.ovhcloud.com/fr/vps/
2. Choisis VPS Starter (2-3€/mois)

### Étape 2 : SSH dans le VPS
ssh root@TON_IP

### Étape 3 : Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs nginx

### Étape 4 : Cloner ton projet
git clone https://github.com/TON_REPO/kilolab.git
cd kilolab
npm install
npm run build

### Étape 5 : Configurer Nginx
cat > /etc/nginx/sites-available/kilolab << 'NGINX'
server {
    listen 80;
    server_name TON_DOMAINE.com;
    
    root /root/kilolab/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX

ln -s /etc/nginx/sites-available/kilolab /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

### Étape 6 : SSL (Optionnel)
apt install certbot python3-certbot-nginx
certbot --nginx -d TON_DOMAINE.com

---

## 📋 CHECKLIST FINALE

- [ ] npm run build fonctionne sans erreur
- [ ] Variables d'environnement configurées
- [ ] Tables Supabase créées
- [ ] Partenaires insérés dans la BDD
- [ ] Compte Stripe créé (optionnel)
- [ ] Site déployé et accessible

---

## 🎉 TON APP EST MAINTENANT EN LIGNE !
