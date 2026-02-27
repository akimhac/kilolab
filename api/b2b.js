// Vercel Serverless Function - B2B Partners API
// API endpoints for Hotels, Airbnb hosts, Gyms to integrate Kilolab

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get API key from header
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: 'API key required',
      message: 'Please provide your API key in the X-API-Key header'
    });
  }

  // Validate API key and get partner info
  const { data: partner, error: partnerError } = await supabase
    .from('b2b_partners')
    .select('*')
    .eq('api_key', apiKey)
    .eq('is_active', true)
    .single();

  if (partnerError || !partner) {
    return res.status(401).json({ 
      error: 'Invalid API key',
      message: 'The provided API key is invalid or inactive'
    });
  }

  // Route based on path
  const { action } = req.query;

  try {
    switch (action) {
      case 'create-order':
        return await createOrder(req, res, partner);
      case 'get-order':
        return await getOrder(req, res, partner);
      case 'list-orders':
        return await listOrders(req, res, partner);
      case 'get-pricing':
        return await getPricing(req, res, partner);
      case 'get-coverage':
        return await getCoverage(req, res, partner);
      default:
        return res.status(400).json({ 
          error: 'Invalid action',
          available_actions: ['create-order', 'get-order', 'list-orders', 'get-pricing', 'get-coverage']
        });
    }
  } catch (error) {
    console.error('B2B API error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

// Create a new order on behalf of a guest
async function createOrder(req, res, partner) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST method required' });
  }

  const {
    guest_name,
    guest_email,
    guest_phone,
    pickup_address,
    delivery_address,
    weight_kg,
    formula = 'standard', // standard, express, express_2h
    notes,
    room_number,
    checkout_date,
    preferred_pickup_date,
    preferred_pickup_slot,
  } = req.body;

  // Validation
  if (!guest_name || !pickup_address || !weight_kg) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      required: ['guest_name', 'pickup_address', 'weight_kg']
    });
  }

  // Calculate price with partner discount
  const basePrice = formula === 'standard' ? 3 : formula === 'express' ? 5 : 8;
  const discount = partner.discount_percent || 0;
  const pricePerKg = basePrice * (1 - discount / 100);
  const totalPrice = weight_kg * pricePerKg;

  // Create order
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      partner_id: partner.id,
      guest_name,
      guest_email,
      guest_phone,
      pickup_address,
      delivery_address: delivery_address || pickup_address,
      weight: weight_kg,
      formula,
      total_price: totalPrice,
      status: 'pending',
      notes: notes ? `[B2B ${partner.company_name}] ${notes}` : `[B2B ${partner.company_name}]`,
      metadata: {
        b2b_partner: partner.company_name,
        room_number,
        checkout_date,
        partner_reference: `${partner.prefix || 'B2B'}-${Date.now()}`,
      },
      preferred_pickup_date,
      preferred_pickup_slot,
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to create order', details: error.message });
  }

  // Log API usage
  await supabase.from('b2b_api_logs').insert({
    partner_id: partner.id,
    action: 'create-order',
    order_id: order.id,
    request_body: req.body,
  });

  return res.status(201).json({
    success: true,
    order: {
      id: order.id,
      reference: order.metadata?.partner_reference,
      status: order.status,
      total_price: totalPrice,
      currency: 'EUR',
      estimated_delivery: formula === 'express_2h' ? '24h' : formula === 'express' ? '24h' : '48-72h',
    },
    message: 'Order created successfully'
  });
}

// Get order status
async function getOrder(req, res, partner) {
  const { order_id } = req.query;

  if (!order_id) {
    return res.status(400).json({ error: 'order_id required' });
  }

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', order_id)
    .eq('partner_id', partner.id)
    .single();

  if (error || !order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  return res.status(200).json({
    success: true,
    order: {
      id: order.id,
      reference: order.metadata?.partner_reference,
      status: order.status,
      guest_name: order.guest_name,
      weight_kg: order.weight,
      total_price: order.total_price,
      currency: 'EUR',
      created_at: order.created_at,
      picked_up_at: order.picked_up_at,
      completed_at: order.completed_at,
      washer_assigned: !!order.washer_id,
    }
  });
}

// List all orders for partner
async function listOrders(req, res, partner) {
  const { status, limit = 50, offset = 0, from_date, to_date } = req.query;

  let query = supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .eq('partner_id', partner.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq('status', status);
  }
  if (from_date) {
    query = query.gte('created_at', from_date);
  }
  if (to_date) {
    query = query.lte('created_at', to_date);
  }

  const { data: orders, count, error } = await query;

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }

  return res.status(200).json({
    success: true,
    orders: orders.map(o => ({
      id: o.id,
      reference: o.metadata?.partner_reference,
      status: o.status,
      guest_name: o.guest_name,
      weight_kg: o.weight,
      total_price: o.total_price,
      created_at: o.created_at,
    })),
    pagination: {
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    }
  });
}

// Get pricing information
async function getPricing(req, res, partner) {
  const discount = partner.discount_percent || 0;

  const pricing = {
    standard: {
      price_per_kg: 3 * (1 - discount / 100),
      delivery_time: '48-72h',
      description: 'Lavage, séchage et pliage standard'
    },
    express: {
      price_per_kg: 5 * (1 - discount / 100),
      delivery_time: '24h',
      description: 'Service prioritaire avec livraison J+1'
    },
    express_2h: {
      price_per_kg: 8 * (1 - discount / 100),
      delivery_time: '24h (collecte en 2h)',
      description: 'Collecte en 2h chrono, livraison J+1'
    }
  };

  return res.status(200).json({
    success: true,
    currency: 'EUR',
    partner_discount: `${discount}%`,
    pricing,
    minimum_weight_kg: 3,
    maximum_weight_kg: 50,
  });
}

// Get service coverage areas
async function getCoverage(req, res, partner) {
  // Get unique cities from approved washers
  const { data: washers } = await supabase
    .from('washers')
    .select('city, postal_code')
    .eq('status', 'approved');

  const cities = [...new Set(washers?.map(w => w.city).filter(Boolean) || [])];
  const postalCodes = [...new Set(washers?.map(w => w.postal_code).filter(Boolean) || [])];

  return res.status(200).json({
    success: true,
    coverage: {
      cities: cities.sort(),
      postal_codes: postalCodes.sort(),
      total_washers: washers?.length || 0,
    },
    note: 'Service available in listed areas. Contact support for expansion requests.'
  });
}
