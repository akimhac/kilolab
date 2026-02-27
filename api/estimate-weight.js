// Vercel Serverless Function - AI Weight Estimation
// Analyzes laundry bag photos to estimate weight using GPT-4o Vision

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image_base64, mime_type = 'image/jpeg' } = req.body;

    if (!image_base64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Use Emergent LLM Key for OpenAI
    const apiKey = process.env.EMERGENT_LLM_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Construct the vision API request
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en estimation de poids de linge. Analyse l'image du sac/tas de linge et estime le poids en kilogrammes.

RÈGLES D'ESTIMATION:
- Un sac poubelle 50L rempli = environ 5-7 kg
- Un sac IKEA grand = environ 8-12 kg
- Une machine à laver standard = 5-7 kg
- Un panier à linge standard = 3-5 kg
- Vêtements légers (t-shirts, sous-vêtements) = plus légers
- Jeans, serviettes, draps = plus lourds

RÉPONDS UNIQUEMENT en JSON avec ce format exact:
{
  "estimation_min": <nombre>,
  "estimation_max": <nombre>,
  "estimation_moyenne": <nombre>,
  "confiance": "<haute|moyenne|basse>",
  "description": "<courte description de ce que tu vois>",
  "conseils": "<conseil pour le client>"
}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyse cette image de linge et donne-moi une estimation du poids en kg. Réponds uniquement en JSON.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mime_type};base64,${image_base64}`,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      return res.status(500).json({ error: 'AI analysis failed', details: errorText });
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    // Parse JSON from AI response
    let estimation;
    try {
      // Extract JSON from response (might have markdown code blocks)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        estimation = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      // Fallback estimation
      estimation = {
        estimation_min: 5,
        estimation_max: 8,
        estimation_moyenne: 6.5,
        confiance: 'basse',
        description: 'Estimation approximative basée sur une image standard',
        conseils: 'Pour une estimation plus précise, prenez une photo claire du linge.'
      };
    }

    // Calculate price range
    const priceStandard = {
      min: (estimation.estimation_min * 3).toFixed(2),
      max: (estimation.estimation_max * 3).toFixed(2),
      avg: (estimation.estimation_moyenne * 3).toFixed(2),
    };
    
    const priceExpress = {
      min: (estimation.estimation_min * 5).toFixed(2),
      max: (estimation.estimation_max * 5).toFixed(2),
      avg: (estimation.estimation_moyenne * 5).toFixed(2),
    };

    return res.status(200).json({
      success: true,
      estimation,
      prix: {
        standard: priceStandard,
        express: priceExpress,
      },
      message: `Estimation: ${estimation.estimation_min}-${estimation.estimation_max} kg`
    });

  } catch (error) {
    console.error('Weight estimation error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
