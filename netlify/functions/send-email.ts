import { Handler } from '@netlify/functions';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { to, subject, html } = JSON.parse(event.body || '{}');

    await resend.emails.send({
      from: 'KiloLab <noreply@kilolab.fr>',
      to,
      subject,
      html,
    });

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (error: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
