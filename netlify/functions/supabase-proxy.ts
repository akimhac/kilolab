import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
      },
      body: '',
    };
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lymykkbhbehwbdpajduj.supabase.co';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing Supabase key' }),
    };
  }

  // Extraire le path API
  const apiPath = event.path.replace('/.netlify/functions/supabase-proxy', '');
  const queryString = event.rawQuery ? `?${event.rawQuery}` : '';
  const targetUrl = `${supabaseUrl}${apiPath}${queryString}`;

  console.log('🔄 Proxying:', event.httpMethod, targetUrl);

  try {
    // Préparer les headers
    const headers: Record<string, string> = {
      'apikey': supabaseKey,
      'Content-Type': 'application/json',
    };

    // Copier l'authorization header si présent
    if (event.headers.authorization) {
      headers['Authorization'] = event.headers.authorization;
    } else {
      headers['Authorization'] = `Bearer ${supabaseKey}`;
    }

    // Faire la requête vers Supabase
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers,
      body: event.body || undefined,
    });

    const responseText = await response.text();

    console.log('✅ Response:', response.status);

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: responseText,
    };
  } catch (error: any) {
    console.error('❌ Proxy error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: error.message,
        details: error.toString(),
      }),
    };
  }
};
