export const sendWeightNotification = async (
  clientEmail: string,
  orderData: { weight: number; price: number; orderId: string; partnerName: string }
) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: white; margin: 0;">⚖️ Pesée effectuée !</h1>
      </div>
      
      <div style="padding: 30px; background: #f9fafb; margin-top: 20px; border-radius: 10px;">
        <p style="font-size: 16px; color: #374151;">Bonjour,</p>
        <p style="font-size: 16px; color: #374151;">
          Votre commande <strong>#${orderData.orderId.slice(0, 8)}</strong> a été pesée par <strong>${orderData.partnerName}</strong>.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
          <p style="margin: 5px 0; font-size: 18px;"><strong>Poids:</strong> ${orderData.weight} kg</p>
          <p style="margin: 5px 0; font-size: 24px; color: #8b5cf6;"><strong>Prix total:</strong> ${orderData.price.toFixed(2)} €</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://kilolab.fr/checkout?order_id=${orderData.orderId}" 
             style="display: inline-block; background: #8b5cf6; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            💳 Payer maintenant
          </a>
        </div>
      </div>
      
      <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px;">
        Merci de votre confiance !<br>
        L'équipe KiloLab
      </p>
    </body>
    </html>
  `;

  await fetch('/.netlify/functions/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: clientEmail, subject: '⚖️ Votre linge a été pesé', html }),
  });
};

export const sendReadyNotification = async (
  clientEmail: string,
  orderData: { orderId: string; partnerName: string; partnerAddress: string }
) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: white; margin: 0;">✅ Votre linge est prêt !</h1>
      </div>
      
      <div style="padding: 30px; background: #f9fafb; margin-top: 20px; border-radius: 10px;">
        <p style="font-size: 16px; color: #374151;">Bonjour,</p>
        <p style="font-size: 16px; color: #374151;">
          Bonne nouvelle ! Votre commande <strong>#${orderData.orderId.slice(0, 8)}</strong> est prête.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <p style="margin: 5px 0; font-size: 18px;"><strong>📍 À récupérer chez:</strong></p>
          <p style="margin: 5px 0; font-size: 16px; color: #374151;">${orderData.partnerName}</p>
          <p style="margin: 5px 0; font-size: 14px; color: #6b7280;">${orderData.partnerAddress}</p>
        </div>
      </div>
      
      <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px;">
        À très bientôt !<br>
        L'équipe KiloLab
      </p>
    </body>
    </html>
  `;

  await fetch('/.netlify/functions/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: clientEmail, subject: '🎉 Votre linge est prêt !', html }),
  });
};

export const sendNewOrderNotification = async (
  partnerEmail: string,
  orderData: { orderId: string; clientName: string; speed: string }
) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: white; margin: 0;">�� Nouvelle commande !</h1>
      </div>
      
      <div style="padding: 30px; background: #f9fafb; margin-top: 20px; border-radius: 10px;">
        <p style="font-size: 16px; color: #374151;">
          Vous avez une nouvelle commande <strong>#${orderData.orderId.slice(0, 8)}</strong>
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Client:</strong> ${orderData.clientName}</p>
          <p style="margin: 5px 0;"><strong>Formule:</strong> ${orderData.speed}</p>
          <p style="margin: 5px 0; color: #f59e0b;"><strong>⚖️ À peser</strong></p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://kilolab.fr/partner-dashboard" 
             style="display: inline-block; background: #10b981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Voir dans le dashboard
          </a>
        </div>
      </div>
    </body>
    </html>
  `;

  await fetch('/.netlify/functions/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: partnerEmail, subject: '📦 Nouvelle commande', html }),
  });
};
