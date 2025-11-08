import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Order } from '../types/database';

export function useOrders(userId: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          partner:partners(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: {
    partner_id: string;
    service_type: 'standard' | 'express' | 'ultra';
    weight: number;
    notes?: string;
  }) => {
    if (!userId) throw new Error('User not authenticated');

    const prices = {
      standard: 5,
      express: 10,
      ultra: 15,
    };

    const total_price = orderData.weight * prices[orderData.service_type];

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          partner_id: orderData.partner_id,
          service_type: orderData.service_type,
          weight: orderData.weight,
          total_price,
          notes: orderData.notes,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    await fetchOrders();
    return data;
  };

  return {
    orders,
    loading,
    createOrder,
    refresh: fetchOrders,
  };
}