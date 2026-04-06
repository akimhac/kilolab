import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface OrderUpdate {
  id: string;
  status: string;
  updated_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmee',
  paid: 'Payee',
  assigned: 'Washer assigne',
  picked_up: 'Linge collecte',
  washing: 'En cours de lavage',
  ready: 'Linge pret',
  completed: 'Terminee',
  delivered: 'Livree',
  cancelled: 'Annulee',
};

// Show browser notification (works in foreground AND background if tab is hidden)
function showBrowserNotif(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'kilolab-order-update',
        renotify: true,
      });
    } catch {
      // Fallback for iOS which doesn't support new Notification()
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification(title, { body, icon: '/icon-192.png', tag: 'kilolab-order-update' });
        }).catch(() => {});
      }
    }
  }
}

// Request notification permission
export async function requestNotifPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

// Hook for CLIENT: poll for order status changes
export function useClientOrderNotifications(userId: string | null, enabled: boolean = true) {
  const lastStatusesRef = useRef<Record<string, string>>({});
  const [newUpdates, setNewUpdates] = useState<OrderUpdate[]>([]);

  const checkForUpdates = useCallback(async () => {
    if (!userId) return;
    try {
      const { data: orders } = await supabase
        .from('orders')
        .select('id, status, updated_at')
        .eq('client_id', userId)
        .order('updated_at', { ascending: false })
        .limit(20);

      if (!orders) return;

      const prev = lastStatusesRef.current;
      const updates: OrderUpdate[] = [];

      for (const order of orders) {
        if (prev[order.id] && prev[order.id] !== order.status) {
          updates.push(order);
          const label = STATUS_LABELS[order.status] || order.status;
          const msg = `Commande #${order.id.slice(0,8)} : ${label}`;
          toast(msg, { icon: '📦', duration: 5000 });
          showBrowserNotif('Kilolab - Mise a jour', msg);
        }
        prev[order.id] = order.status;
      }

      lastStatusesRef.current = prev;
      if (updates.length > 0) setNewUpdates(updates);
    } catch (err) {
      console.warn('Poll orders failed:', err);
    }
  }, [userId]);

  useEffect(() => {
    if (!enabled || !userId) return;
    // Initial load (don't notify on first load)
    const init = async () => {
      const { data: orders } = await supabase
        .from('orders')
        .select('id, status')
        .eq('client_id', userId)
        .limit(20);
      if (orders) {
        const map: Record<string, string> = {};
        for (const o of orders) map[o.id] = o.status;
        lastStatusesRef.current = map;
      }
    };
    init();

    // Poll every 15 seconds
    const interval = setInterval(checkForUpdates, 15000);
    return () => clearInterval(interval);
  }, [userId, enabled, checkForUpdates]);

  return { newUpdates };
}

// Hook for WASHER: poll for new available missions with Uber-style escalating reminders
export function useWasherMissionNotifications(washerId: string | null, postalCode: string | null, enabled: boolean = true) {
  const lastMissionIdsRef = useRef<Set<string>>(new Set());
  const [newMissions, setNewMissions] = useState<number>(0);
  // Track reminder state: orderId -> { firstSeen, remindersSent }
  const reminderTracker = useRef<Record<string, { firstSeen: number; remindersSent: number }>>({});

  const checkForNewMissions = useCallback(async () => {
    if (!washerId) return;
    try {
      const { data: missions } = await supabase
        .from('orders')
        .select('id, created_at, total_price, pickup_address, formula')
        .is('washer_id', null)
        .in('status', ['pending', 'confirmed', 'paid'])
        .order('created_at', { ascending: false })
        .limit(20);

      if (!missions) return;

      const now = Date.now();
      const prev = lastMissionIdsRef.current;
      let newCount = 0;

      for (const m of missions) {
        // New mission detected
        if (!prev.has(m.id)) {
          newCount++;
          // Track this mission for reminders
          reminderTracker.current[m.id] = { firstSeen: now, remindersSent: 0 };
        }

        // Escalating reminders for unclaimed orders
        const tracker = reminderTracker.current[m.id];
        if (tracker && prev.has(m.id)) {
          const elapsed = now - tracker.firstSeen;
          const gain = ((parseFloat(String(m.total_price || 0)) * 0.6)).toFixed(2);
          const city = m.pickup_address?.split(',').pop()?.trim() || '';

          // Reminder 1: after 5 minutes (300s)
          if (elapsed > 5 * 60 * 1000 && tracker.remindersSent === 0) {
            tracker.remindersSent = 1;
            const msg = `Commande toujours disponible ! ${gain} EUR a gagner${city ? ' - ' + city : ''}`;
            toast(msg, { icon: '\u23F0', duration: 6000 });
            showBrowserNotif('Kilolab - Rappel', msg);
          }

          // Reminder 2: after 10 minutes (600s)
          if (elapsed > 10 * 60 * 1000 && tracker.remindersSent === 1) {
            tracker.remindersSent = 2;
            const isExpress = m.formula === 'express';
            const msg = isExpress
              ? `URGENT : Commande Express non reclamee ! ${gain} EUR - ${city}`
              : `Derniere chance ! Commande de ${gain} EUR toujours disponible`;
            toast(msg, { icon: '\u26A0\uFE0F', duration: 8000 });
            showBrowserNotif('Kilolab - Derniere chance', msg);
          }

          // Reminder 3: after 20 minutes
          if (elapsed > 20 * 60 * 1000 && tracker.remindersSent === 2) {
            tracker.remindersSent = 3;
            const msg = `${gain} EUR vous attendent ! Personne n'a pris cette commande`;
            toast(msg, { icon: '\uD83D\uDCB0', duration: 8000 });
            showBrowserNotif('Kilolab - Opportunite', msg);
          }
        }
      }

      // Clean up trackers for orders that are no longer available (taken by someone)
      const currentIds = new Set(missions.map(m => m.id));
      for (const id of Object.keys(reminderTracker.current)) {
        if (!currentIds.has(id)) {
          delete reminderTracker.current[id];
        }
      }

      if (newCount > 0 && prev.size > 0) {
        const msg = newCount === 1 ? 'Nouvelle mission disponible pres de chez vous !' : `${newCount} nouvelles missions disponibles !`;
        toast(msg, { icon: '\uD83E\uDDFA', duration: 6000 });
        showBrowserNotif('Kilolab Washer', msg);
        setNewMissions(n => n + newCount);
      }

      lastMissionIdsRef.current = currentIds;
    } catch (err) {
      console.warn('Poll missions failed:', err);
    }
  }, [washerId]);

  useEffect(() => {
    if (!enabled || !washerId) return;
    // Initial load (don't notify on first load)
    const init = async () => {
      const { data: missions } = await supabase
        .from('orders')
        .select('id')
        .is('washer_id', null)
        .in('status', ['pending', 'confirmed', 'paid'])
        .limit(20);
      if (missions) {
        lastMissionIdsRef.current = new Set(missions.map(m => m.id));
        // Initialize trackers without sending notifications
        const now = Date.now();
        for (const m of missions) {
          reminderTracker.current[m.id] = { firstSeen: now, remindersSent: 0 };
        }
      }
    };
    init();

    // Poll every 15 seconds
    const interval = setInterval(checkForNewMissions, 15000);
    return () => clearInterval(interval);
  }, [washerId, enabled, checkForNewMissions]);

  return { newMissions, resetNewMissions: () => setNewMissions(0) };
}
