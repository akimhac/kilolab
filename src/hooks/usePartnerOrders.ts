import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Order } from '../types/database';

export function usePartnerOrders(userId: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [partnerId, setPartnerId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchPartnerAndOrders();
  }, [userId]);

  const fetchPartnerAndOrders = async () => {
    if (!userId) return;

    try {
      // First, get the partner ID for this user
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (partnerError) throw partnerError;
      
      if (partnerData) {
        setPartnerId(partnerData.id);

        // Then fetch orders for this partner
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('partner_id', partnerData.id)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        setOrders(ordersData || []);
      }
    } catch (error) {
      console.error('Error fetching partner orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled'
  ) => {
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) throw error;
    await fetchPartnerAndOrders();
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    completed: orders.filter(o => o.status === 'completed').length,
    revenue: orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + Number(o.total_price), 0),
  };

  return {
    orders,
    loading,
    partnerId,
    stats,
    updateOrderStatus,
    refresh: fetchPartnerAndOrders,
  };
}