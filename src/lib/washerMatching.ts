import { supabase } from './supabase';

interface Order {
  id: string;
  pickup_address: string;
  pickup_lat?: number;
  pickup_lng?: number;
}

interface Washer {
  id: string;
  first_name: string;
  city: string;
  postal_code: string;
  lat?: number;
  lng?: number;
  is_available: boolean;
}

// Calcul distance entre 2 points (Haversine)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function findBestWasher(order: Order): Promise<Washer | null> {
  // 1. Récupérer tous les washers disponibles
  const { data: washers, error } = await supabase
    .from('washers')
    .select('*')
    .eq('status', 'approved')
    .eq('is_available', true);

  if (error || !washers || washers.length === 0) {
    console.error('Aucun washer disponible');
    return null;
  }

  // 2. Calculer la distance pour chaque washer
  const washersWithDistance = washers.map(washer => ({
    ...washer,
    distance: calculateDistance(
      order.pickup_lat || 0,
      order.pickup_lng || 0,
      washer.lat || 0,
      washer.lng || 0
    )
  }));

  // 3. Trier par distance (le plus proche en premier)
  washersWithDistance.sort((a, b) => a.distance - b.distance);

  // 4. Prendre le plus proche (< 1km)
  const bestWasher = washersWithDistance.find(w => w.distance < 1);

  return bestWasher || null;
}

export async function assignOrderToWasher(orderId: string, washerId: string) {
  // 1. Assigner la commande
  const { error: orderError } = await supabase
    .from('orders')
    .update({ 
      washer_id: washerId,
      status: 'assigned',
      assigned_at: new Date().toISOString()
    })
    .eq('id', orderId);

  if (orderError) {
    console.error('Erreur assignation commande:', orderError);
    return false;
  }

  // 2. Envoyer notification push au washer (TODO: intégrer Firebase Cloud Messaging)
  await sendPushNotification(washerId, {
    title: '🧺 Nouvelle commande disponible !',
    body: 'Une commande près de chez toi. Accepte-la avant qu\'elle soit prise !',
    data: { orderId }
  });

  // 3. Créer un timeout de 5min
  setTimeout(async () => {
    // Vérifier si la commande a été acceptée
    const { data: order } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .single();

    if (order && order.status === 'assigned') {
      // Pas acceptée → réassigner à un autre washer
      console.log('Commande non acceptée, réassignation...');
      await reassignOrder(orderId);
    }
  }, 5 * 60 * 1000); // 5 minutes

  return true;
}

async function sendPushNotification(washerId: string, notification: any) {
  // TODO: Intégrer FCM (Firebase Cloud Messaging)
  console.log('📲 Notification envoyée à', washerId, notification);
}

async function reassignOrder(orderId: string) {
  // Récupérer la commande
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (!order) return;

  // Trouver un nouveau washer
  const newWasher = await findBestWasher(order);
  
  if (newWasher) {
    await assignOrderToWasher(orderId, newWasher.id);
  } else {
    console.error('Aucun washer disponible pour réassignation');
    // Notifier l'admin
  }
}
