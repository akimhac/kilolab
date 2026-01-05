import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
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
    const emailsToSend = []

    // 1. Préparation de l'email pour l'ADMIN (Toi)
    let adminSubject = ""
    let adminHtml = ""

    if (type === 'NEW_MESSAGE') {
      adminSubject = `📩 Nouveau message de ${data.email}`
      adminHtml = `<p>De: ${data.email}</p><p>${data.message}</p>`
    } else if (type === 'NEW_USER') {
      adminSubject = `🚀 Nouvel inscrit : ${data.email}`
      adminHtml = `<p>Nouvel utilisateur inscrit.</p>`
    } else if (type === 'NEW_PARTNER') {
      adminSubject = `👔 Nouvelle demande Partenaire : ${data.company_name}`
      adminHtml = `
        <h2>Candidature Pressing</h2>
        <p><strong>Société :</strong> ${data.company_name}</p>
        <p><strong>Contact :</strong> ${data.contact_name}</p>
        <p><strong>Email :</strong> ${data.email}</p>
        <p><strong>Tel :</strong> ${data.phone}</p>
        <a href="https://kilolab.fr/admin">Aller valider le dossier</a>
      `
    }

    // Ajout email Admin à la liste d'envoi
    emailsToSend.push({
      from: 'KiloLab Bot <noreply@kilolab.fr>',
      to: ADMIN_EMAIL,
      subject: adminSubject,
      html: adminHtml,
    })

    // 2. Préparation de l'email pour le PARTENAIRE (Confirmation)
    if (type === 'NEW_PARTNER' && data.email) {
      emailsToSend.push({
        from: 'KiloLab Partenaires <noreply@kilolab.fr>',
        to: data.email, // Envoi au pressing
        subject: 'Confirmation de réception de votre candidature KiloLab',
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h1 style="color: #14b8a6;">Bonjour ${data.contact_name},</h1>
            <p>Nous avons bien reçu votre demande pour rejoindre le réseau <strong>KiloLab</strong> en tant que partenaire exclusif.</p>
            <p>Votre dossier est en cours d'étude par notre équipe "Réseau".</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <strong>📅 Délai de traitement :</strong> 5 jours ouvrés maximum.<br>
              <strong>📄 Statut :</strong> En attente de validation Kbis.
            </div>

            <p>Si votre candidature est retenue, vous recevrez un second email contenant vos accès à l'application <strong>KiloLab Pro</strong>.</p>
            <p>À très vite,<br>L'équipe KiloLab.</p>
          </div>
        `,
      })
    }

    // 3. Envoi de TOUS les emails
    console.log(`Envoi de ${emailsToSend.length} emails...`)

    const results = await Promise.all(emailsToSend.map(email => 
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify(email),
      }).then(res => res.json())
    ))

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
