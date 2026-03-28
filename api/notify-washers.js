// Vercel Serverless Function - Notify washers of new orders in their zone
const { Resend } = require('resend');
const { createClient } = require('@supabase/supabase-js');

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Calculate distance between two points (Haversine)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { order_id, max_distance_km = 50 } = req.body;

    if (!order_id) {
      return res.status(400).json({ error: 'order_id required' });
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, pickup_address, city, postal_code, lat, lng, weight, formula, total_price, pickup_date')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get all approved and available washers with email notifications enabled
    const { data: washers, error: washersError } = await supabase
      .from('washers')
      .select('id, full_name, email, city, postal_code, lat, lng, max_distance_km, email_notifications')
      .eq('status', 'approved')
      .eq('is_available', true);

    if (washersError || !washers || washers.length === 0) {
      return res.status(200).json({ message: 'No available washers', notified: 0 });
    }

    const orderPostal = order.postal_code || '';
    const orderCity = (order.city || '').toLowerCase();
    const notifiedWashers = [];

    for (const washer of washers) {
      // Skip if washer has disabled email notifications
      if (washer.email_notifications === false) continue;
      if (!washer.email) continue;

      let isInZone = false;
      const washerMaxDist = washer.max_distance_km || max_distance_km;

      // Check by GPS coordinates
      if (order.lat && order.lng && washer.lat && washer.lng) {
        const distance = calculateDistance(order.lat, order.lng, washer.lat, washer.lng);
        if (distance <= washerMaxDist) {
          isInZone = true;
        }
      }
      
      // Check by postal code (same department = first 2 digits)
      if (!isInZone && orderPostal && washer.postal_code) {
        const orderDept = orderPostal.substring(0, 2);
        const washerDept = washer.postal_code.substring(0, 2);
        if (orderDept === washerDept) {
          isInZone = true;
        }
      }

      // Check by city
      if (!isInZone && orderCity && washer.city) {
        if (washer.city.toLowerCase().includes(orderCity)) {
          isInZone = true;
        }
      }

      if (isInZone) {
        // Send email notification
        try {
          await resend.emails.send({
            from: 'Kilolab <noreply@kilolab.fr>',
            to: washer.email,
            subject: `🧺 Nouvelle commande près de chez vous !`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #14b8a6; margin: 0;">Kilolab</h1>
                  <p style="color: #64748b; margin: 5px 0;">Nouvelle mission disponible !</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #14b8a6, #06b6d4); padding: 30px; border-radius: 16px; text-align: center; margin-bottom: 30px;">
                  <h2 style="color: white; margin: 0 0 10px 0;">Bonjour ${washer.full_name} ! 👋</h2>
                  <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 18px;">
                    Une nouvelle commande vous attend
                  </p>
                </div>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                  <h3 style="margin: 0 0 15px 0; color: #1e293b;">Détails de la mission</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #e2e8f0;">Zone</td>
                      <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #1e293b; border-bottom: 1px solid #e2e8f0;">
                        ${order.city || order.postal_code || 'Non précisée'}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #e2e8f0;">Poids</td>
                      <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #1e293b; border-bottom: 1px solid #e2e8f0;">
                        ${order.weight} kg
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #e2e8f0;">Formule</td>
                      <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #1e293b; border-bottom: 1px solid #e2e8f0;">
                        ${order.formula === 'express' ? 'Express ⚡' : order.formula === 'eco' ? 'Éco 🌿' : 'Standard'}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #64748b;">Votre gain</td>
                      <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #14b8a6; font-size: 1.25em;">
                        ${(parseFloat(order.total_price) * 0.6).toFixed(2)} €
                      </td>
                    </tr>
                  </table>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://kilolab.fr/washer-dashboard" 
                     style="display: inline-block; background: linear-gradient(135deg, #14b8a6, #06b6d4); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">
                    🚀 Accepter cette mission
                  </a>
                </div>
                
                <div style="background: #fef3c7; padding: 15px 20px; border-radius: 12px; margin-bottom: 20px;">
                  <p style="margin: 0; color: #92400e; font-size: 14px;">
                    ⏰ <strong>Agissez vite !</strong> Les missions sont attribuées au premier washer qui accepte.
                  </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                  <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                    Vous recevez cet email car vous êtes washer chez Kilolab.<br>
                    <a href="https://kilolab.fr/washer-dashboard?settings=notifications" style="color: #14b8a6;">
                      Gérer mes notifications
                    </a>
                  </p>
                </div>
              </div>
            `
          });
          
          notifiedWashers.push({ id: washer.id, email: washer.email });
        } catch (emailError) {
          console.error(`Failed to email ${washer.email}:`, emailError);
        }
      }
    }

    return res.status(200).json({
      success: true,
      notified: notifiedWashers.length,
      washers: notifiedWashers.map(w => w.id)
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
};
