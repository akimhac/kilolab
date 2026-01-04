import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = "admin@kilolab.fr" // Ton email ici

serve(async (req) => {
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
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 3px solid #ccc;">
          ${data.message}
        </blockquote>
        <a href="https://ton-site-admin.vercel.app">Répondre depuis le Dashboard</a>
      `
    } 
    // Cas 2 : Nouvelle Inscription
    else if (type === 'NEW_USER') {
      subject = `🚀 Nouvel utilisateur inscrit !`
      htmlContent = `
        <h2>Bienvenue à un nouveau client !</h2>
        <p><strong>Email :</strong> ${data.email}</p>
        <p><strong>Nom :</strong> ${data.full_name || 'Non renseigné'}</p>
        <p><strong>Date :</strong> ${new Date().toLocaleString()}</p>
      `
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'KiloLab Notif <noreply@kilolab.fr>',
        to: ADMIN_EMAIL,
        subject: subject,
        html: htmlContent,
      }),
    })

    return new Response(JSON.stringify(await res.json()), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
