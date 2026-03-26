// Auto-assign orders to nearby washers
// This service handles automatic washer assignment based on location and availability

import { supabase } from '../lib/supabase';

type Order = {
  id: string;
  pickup_address: string;
  city?: string;
  postal_code?: string;
  lat?: number;
  lng?: number;
  washer_id?: string;
  status: string;
};

type Washer = {
  id: string;
  full_name: string;
  city: string;
  postal_code: string;
  lat?: number;
  lng?: number;
  is_available: boolean;
  current_orders_count?: number;
};

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find best washer for an order
export async function findBestWasherForOrder(order: Order): Promise<Washer | null> {
  try {
    // Get all available approved washers
    const { data: washers, error } = await supabase
      .from('washers')
      .select('id, full_name, city, postal_code, lat, lng, is_available')
      .eq('status', 'approved')
      .eq('is_available', true);

    if (error || !washers || washers.length === 0) {
      return null;
    }

    // Get current order counts for each washer
    const { data: orderCounts } = await supabase
      .from('orders')
      .select('washer_id')
      .in('status', ['pending', 'assigned', 'picked_up', 'washing'])
      .not('washer_id', 'is', null);

    const washerOrderCounts: Record<string, number> = {};
    orderCounts?.forEach(o => {
      washerOrderCounts[o.washer_id] = (washerOrderCounts[o.washer_id] || 0) + 1;
    });

    // Score each washer
    const scoredWashers = washers.map((washer: Washer) => {
      let score = 100;

      // 1. Location match (highest priority)
      const orderPostal = order.postal_code || '';
      const washerPostal = washer.postal_code || '';
      
      // Exact postal code match
      if (orderPostal && washerPostal === orderPostal) {
        score += 50;
      }
      // Same department (first 2 digits)
      else if (orderPostal.substring(0, 2) === washerPostal.substring(0, 2)) {
        score += 30;
      }
      // Same region (first digit)
      else if (orderPostal.substring(0, 1) === washerPostal.substring(0, 1)) {
        score += 10;
      }

      // 2. City match
      const orderCity = (order.city || '').toLowerCase();
      const washerCity = (washer.city || '').toLowerCase();
      if (orderCity && washerCity.includes(orderCity)) {
        score += 20;
      }

      // 3. GPS distance (if available)
      if (order.lat && order.lng && washer.lat && washer.lng) {
        const distance = calculateDistance(order.lat, order.lng, washer.lat, washer.lng);
        if (distance < 5) score += 40;
        else if (distance < 10) score += 25;
        else if (distance < 20) score += 10;
        else if (distance > 50) score -= 20;
      }

      // 4. Workload balance (fewer orders = higher score)
      const currentOrders = washerOrderCounts[washer.id] || 0;
      score -= currentOrders * 5;

      return { ...washer, score, currentOrders };
    });

    // Sort by score (highest first)
    scoredWashers.sort((a, b) => b.score - a.score);

    // Return best washer if score is acceptable
    const bestWasher = scoredWashers[0];
    if (bestWasher && bestWasher.score > 50) {
      return bestWasher;
    }

    return null;
  } catch (error) {
    console.error('Error finding washer:', error);
    return null;
  }
}

// Auto-assign pending orders
export async function autoAssignPendingOrders(): Promise<{ assigned: number; failed: number }> {
  let assigned = 0;
  let failed = 0;

  try {
    // Get all pending orders without a washer
    const { data: pendingOrders, error } = await supabase
      .from('orders')
      .select('id, pickup_address, city, postal_code, lat, lng, washer_id, status')
      .eq('status', 'pending')
      .is('washer_id', null)
      .order('created_at', { ascending: true });

    if (error || !pendingOrders) {
      return { assigned, failed };
    }

    for (const order of pendingOrders) {
      const bestWasher = await findBestWasherForOrder(order);
      
      if (bestWasher) {
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            washer_id: bestWasher.id,
            status: 'assigned'
          })
          .eq('id', order.id);

        if (!updateError) {
          assigned++;
          
          // TODO: Send notification to washer
          // await sendWasherNotification(bestWasher.id, order.id);
        } else {
          failed++;
        }
      } else {
        failed++;
      }
    }
  } catch (error) {
    console.error('Error in auto-assign:', error);
  }

  return { assigned, failed };
}

// Extract postal code and city from address string
export function extractLocationFromAddress(address: string): { city: string; postalCode: string } {
  const postalMatch = address.match(/\b(\d{5})\b/);
  const postalCode = postalMatch ? postalMatch[1] : '';
  
  // Try to extract city after postal code
  const cityMatch = address.match(/\d{5}\s+([A-Za-zÀ-ÿ\s-]+)/);
  const city = cityMatch ? cityMatch[1].trim() : '';
  
  return { city, postalCode };
}
