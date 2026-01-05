import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = "akim.hachili@gmail.com" // Ton email perso pour les tests

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
        <h2>Nouveau message reçu !</h2>
        <p><strong>De :</strong> ${data.email} (${data.name || 'Anonyme'})</p>
        <p><strong>Sujet :</strong> ${data.subject}</p>
        <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #14b8a6;">
          ${data.message.replace(/\n/g, '<br>')}
        </div>
      `
    } 
    // Cas 2 : Nouvelle Inscription CLIENT
    else if (type === 'NEW_USER') {
      subject = `🚀 Nouvel inscrit : ${data.full_name || data.email}`
      htmlContent = `
        <h2>Un nouveau client vient de s'inscrire ! 🥳</h2>
        <p><strong>Email :</strong> ${data.email}</p>
        <p><strong>Nom :</strong> ${data.full_name || 'Non renseigné'}</p>
      `
    }
    // Cas 3 : Nouvelle Candidature PARTENAIRE (Nouveau !)
    else if (type === 'NEW_PARTNER') {
      subject = `👔 Nouvelle demande Partenaire : ${data.company_name}`
      htmlContent = `
        <h2>Nouvelle candidature de pressing ! 🧺</h2>
        <ul>
          <li><strong>Société :</strong> ${data.company_name}</li>
          <li><strong>Gérant :</strong> ${data.contact_name}</li>
          <li><strong>Email :</strong> ${data.email}</li>
          <li><strong>Téléphone :</strong> ${data.phone}</li>
          <li><strong>Ville :</strong> ${data.city || 'Non renseignée'}</li>
        </ul>
        <p>Connecte-toi à ton Admin pour valider son Kbis.</p>
      `
    }

    console.log(`Envoi notification (${type}) à ${ADMIN_EMAIL}`)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'KiloLab Bot <noreply@kilolab.fr>',
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
