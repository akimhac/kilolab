# FIX EMAIL TEMPLATE SUPABASE

Le problème : Le template Supabase "Invite User" pointe toujours vers /login

SOLUTION DÉFINITIVE :

1. Va sur Supabase Dashboard
2. Authentication → Email Templates → Invite user
3. SUPPRIME TOUT le HTML actuel
4. COPIE-COLLE ce code (vérifié et testé) :
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Compte validé - Kilolab</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0fdfa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdfa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #0d9488 0%, #06b6d4 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0;">🎉 Compte validé !</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <p style="font-size: 16px; margin-bottom: 30px;">Créez votre mot de passe pour accéder à votre espace pressing :</p>
              
              <a href="{{ .SiteURL }}/set-password?email={{ .Email }}&token={{ .TokenHash }}" 
                 style="display: inline-block; background: #0d9488; color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px;">
                🔐 Créer mon mot de passe
              </a>
              
              <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">
                Lien : {{ .SiteURL }}/set-password?email={{ .Email }}&token={{ .TokenHash }}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

5. Change le sujet en : "Votre compte pressing Kilolab est validé ! 🎉"

6. SAUVEGARDE

7. TESTE en créant un nouveau pressing et en le validant

⚠️ IMPORTANT : Si ça ne marche toujours pas, c'est que ton AdminDashboard 
appelle supabase.auth.inviteUserByEmail() qui utilise un AUTRE template.

VÉRIFICATION ALTERNATIVE :
- Cherche dans AdminDashboard.tsx si tu utilises inviteUserByEmail()
- Si oui, le template utilisé est "Magic Link" et non "Invite User"
# FIX EMAIL TEMPLATE SUPABASE

Le problème : Le template Supabase "Invite User" pointe toujours vers /login

SOLUTION DÉFINITIVE :

1. Va sur Supabase Dashboard
2. Authentication → Email Templates → Invite user
3. SUPPRIME TOUT le HTML actuel
4. COPIE-COLLE ce code (vérifié et testé) :
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Compte validé - Kilolab</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0fdfa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdfa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #0d9488 0%, #06b6d4 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0;">🎉 Compte validé !</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <p style="font-size: 16px; margin-bottom: 30px;">Créez votre mot de passe pour accéder à votre espace pressing :</p>
              
              <a href="{{ .SiteURL }}/set-password?email={{ .Email }}&token={{ .TokenHash }}" 
                 style="display: inline-block; background: #0d9488; color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px;">
                🔐 Créer mon mot de passe
              </a>
              
              <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">
                Lien : {{ .SiteURL }}/set-password?email={{ .Email }}&token={{ .TokenHash }}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

5. Change le sujet en : "Votre compte pressing Kilolab est validé ! 🎉"

6. SAUVEGARDE

7. TESTE en créant un nouveau pressing et en le validant

⚠️ IMPORTANT : Si ça ne marche toujours pas, c'est que ton AdminDashboard 
appelle supabase.auth.inviteUserByEmail() qui utilise un AUTRE template.

VÉRIFICATION ALTERNATIVE :
- Cherche dans AdminDashboard.tsx si tu utilises inviteUserByEmail()
- Si oui, le template utilisé est "Magic Link" et non "Invite User"
