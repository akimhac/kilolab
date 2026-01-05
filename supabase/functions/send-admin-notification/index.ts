import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

// 👇 On envoie sur ton Gmail pour être sûr que tu le vois tout de suite
const ADMIN_EMAIL = "akim.hachili@gmail.com" 

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()
    let subject = ""
    let htmlContent = ""

    // Cas 1 : Nouveau Message Contact
    if (type === 'NEW_MESSAGE') {
      subject = `📩 Nouveau message de ${data.email}`
      htmlContent = `
        <h2>Nouveau message reçu sur KiloLab !</h2>
        <p><strong>De :</strong> ${data.email} (${data.name || 'Anonyme'})</p>
        <p><strong>Sujet :</strong> ${data.subject}</p>
        <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #14b8a6; margin-top: 10px;">
          ${data.message.replace(/\n/g, '<br>')}
        </div>
        <br/>
        <a href="https://kilolab.fr/admin" style="background-color: #14b8a6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Répondre depuis le Dashboard</a>
      `
    } 
    // Cas 2 : Nouvelle Inscription
    else if (type === 'NEW_USER') {
      subject = `🚀 Nouvel inscrit : ${data.full_name || data.email}`
      htmlContent = `
        <h2>Un nouveau client vient de s'inscrire ! 🥳</h2>
        <ul>
          <li><strong>Email :</strong> ${data.email}</li>
          <li><strong>Nom :</strong> ${data.full_name || 'Non renseigné'}</li>
          <li><strong>Téléphone :</strong> ${data.phone || 'Non renseigné'}</li>
          <li><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</li>
        </ul>
      `
    }

    console.log(`Envoi notification à ${ADMIN_EMAIL}`)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'KiloLab Notif <noreply@kilolab.fr>', // ✅ Ton vrai domaine validé
        to: ADMIN_EMAIL,
        subject: subject,
        html: htmlContent,
      }),
    })

    const result = await res.json()
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Erreur:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
