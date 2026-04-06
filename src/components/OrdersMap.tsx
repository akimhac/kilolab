import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle } from 'lucide-react';

// Fix Leaflet default icon paths for Vite bundled environments
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type Order = {
  id: string;
  pickup_address: string;
  pickup_city?: string;
  city?: string;
  postal_code?: string;
  lat?: number;
  lng?: number;
  weight: number;
  total_price: number;
  formula: string;
};

type WasherLocation = {
  lat: number;
  lng: number;
  maxDistance: number;
};

function createOrderIcon(formula: string): L.DivIcon {
  const color = formula === 'express' ? '#8b5cf6' : formula === 'eco' ? '#22c55e' : '#14b8a6';
  return L.divIcon({
    html: `<div style="background:${color};width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.3);">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
    </div>`,
    className: 'custom-order-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

const washerIconDef = L.divIcon({
  html: `<div style="background:linear-gradient(135deg,#14b8a6,#06b6d4);width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:4px solid white;box-shadow:0 4px 15px rgba(20,184,166,0.4);">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  </div>`,
  className: 'washer-marker',
  iconSize: [44, 44],
  iconAnchor: [22, 44],
  popupAnchor: [0, -44],
});

export default function OrdersMap({
  orders,
  washerLocation,
  onOrderClick,
}: {
  orders: Order[];
  washerLocation: WasherLocation | null;
  onOrderClick?: (order: Order) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  const center: [number, number] = washerLocation
    ? [washerLocation.lat, washerLocation.lng]
    : [48.8566, 2.3522];

  const ordersWithCoords = orders.filter(o => o.lat && o.lng);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom: 11,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Fix Leaflet sizing issue when container loads
      setTimeout(() => map.invalidateSize(), 200);
    } catch (e: any) {
      console.error('Map init error:', e);
      setError(e?.message || 'Erreur de chargement');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing layers (except tile layer)
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    // Washer location + zone
    if (washerLocation) {
      L.circle([washerLocation.lat, washerLocation.lng], {
        radius: washerLocation.maxDistance * 1000,
        color: '#14b8a6',
        fillColor: '#14b8a6',
        fillOpacity: 0.1,
        weight: 2,
        dashArray: '5, 10',
      }).addTo(map);

      L.marker([washerLocation.lat, washerLocation.lng], { icon: washerIconDef })
        .addTo(map)
        .bindPopup(`<div style="text-align:center;padding:4px;"><b style="color:#0d9488;">Votre position</b><br/><span style="font-size:11px;color:#64748b;">Zone de ${washerLocation.maxDistance} km</span></div>`);

      map.setView([washerLocation.lat, washerLocation.lng], 11);
    }

    // Order markers
    ordersWithCoords.forEach((order) => {
      const marker = L.marker([order.lat!, order.lng!], {
        icon: createOrderIcon(order.formula),
      }).addTo(map);

      const gain = (parseFloat(String(order.total_price)) * 0.6).toFixed(2);
      const formulaLabel = order.formula === 'express' ? 'Express' : order.formula === 'eco' ? 'Eco' : 'Standard';
      const formulaColor = order.formula === 'express' ? '#8b5cf6' : order.formula === 'eco' ? '#22c55e' : '#14b8a6';
      const city = order.pickup_city || order.city || order.pickup_address?.split(',').pop()?.trim() || '';

      marker.bindPopup(`
        <div style="padding:8px;min-width:180px;font-family:system-ui,sans-serif;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <b style="color:#1e293b;">${order.weight} kg</b>
            <span style="font-size:11px;padding:2px 8px;border-radius:20px;background:${formulaColor}20;color:${formulaColor};font-weight:600;">${formulaLabel}</span>
          </div>
          <div style="font-size:12px;color:#64748b;margin-bottom:8px;">${city}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid #e2e8f0;">
            <span style="font-size:11px;color:#94a3b8;">Votre gain</span>
            <b style="color:#0d9488;">${gain} EUR</b>
          </div>
        </div>
      `);

      if (onOrderClick) {
        marker.on('click', () => onOrderClick(order));
      }
    });
  }, [orders, washerLocation, onOrderClick]);

  if (error) {
    return (
      <div className="h-full bg-slate-800 rounded-2xl flex items-center justify-center p-6" data-testid="orders-map-error">
        <div className="text-center">
          <AlertCircle className="text-orange-400 mx-auto mb-3" size={32} />
          <p className="text-white/80 text-sm font-bold mb-2">La carte n'a pas pu se charger</p>
          <p className="text-white/40 text-xs mb-3">{error}</p>
          <button
            onClick={() => { setError(null); mapInstanceRef.current = null; }}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg text-xs font-bold">
            Reessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full rounded-2xl overflow-hidden border border-white/10" data-testid="orders-map">
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%', minHeight: '380px' }} />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-3 border border-white/10 z-[1000]">
        <p className="text-xs text-white/60 font-bold mb-2">Legende</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-teal-500" /><span className="text-white/80">Standard</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-purple-500" /><span className="text-white/80">Express</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-white/80">Eco</span>
          </div>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-3 border border-white/10 z-[1000]">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-2xl font-black text-white">{orders.length}</p>
            <p className="text-xs text-white/60">Missions</p>
          </div>
          {ordersWithCoords.length < orders.length && (
            <div className="text-center border-l border-white/10 pl-3">
              <p className="text-lg font-bold text-orange-400">{orders.length - ordersWithCoords.length}</p>
              <p className="text-xs text-white/60">Sans GPS</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
