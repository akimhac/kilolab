import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lymykkbhbehwbdpajduj.supabase.co';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  // Extraire le path après /api/
  const apiPath = event.path.replace('/.netlify/functions/supabase-proxy', '');
  const url = `${supabaseUrl}${apiPath}${event.rawQuery ? '?' + event.rawQuery : ''}`;
  
  console.log('🔄 Proxying to:', url);
  
  try {
    const response = await fetch(url, {
      method: event.httpMethod,
      headers: {
        'apikey': supabaseKey!,
        'Authorization': event.headers.authorization || `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: event.body || undefined,
    });
    
    const data = await response.text();
    
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: data,
    };
  } catch (error: any) {
    console.error('❌ Proxy error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
