import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Package, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue in Vite/Webpack bundled environments
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

// Create icons lazily inside functions to avoid module-scope issues on iOS Safari
function createOrderIcon(formula: string): L.DivIcon {
  const color = formula === 'express' ? '#8b5cf6' : formula === 'eco' ? '#22c55e' : '#14b8a6';
  return L.divIcon({
    html: `<div style="background: ${color}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
    </div>`,
    className: 'custom-order-marker',
    iconSize: [36, 36] as [number, number],
    iconAnchor: [18, 36] as [number, number],
    popupAnchor: [0, -36] as [number, number],
  });
}

function createWasherIcon(): L.DivIcon {
  return L.divIcon({
    html: `<div style="background: linear-gradient(135deg, #14b8a6, #06b6d4); width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 4px solid white; box-shadow: 0 4px 15px rgba(20,184,166,0.4);">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>`,
    className: 'washer-marker',
    iconSize: [44, 44] as [number, number],
    iconAnchor: [22, 44] as [number, number],
    popupAnchor: [0, -44] as [number, number],
  });
}

// Component to auto-center map
function MapCenterController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.setView(center, 11);
    }
  }, [center, map]);
  return null;
}

export default function OrdersMap({
  orders,
  washerLocation,
  onOrderClick,
}: {
  orders: Order[];
  washerLocation: WasherLocation | null;
  onOrderClick?: (order: Order) => void;
}) {
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Default center (Paris) or washer location
  const center: [number, number] = washerLocation 
    ? [washerLocation.lat, washerLocation.lng]
    : [48.8566, 2.3522];

  // Filter orders with valid coordinates
  const ordersWithCoords = useMemo(() => orders.filter(o => o.lat && o.lng), [orders]);

  // Create icons lazily via useMemo to avoid re-creation on every render
  const washerIcon = useMemo(() => createWasherIcon(), []);

  useEffect(() => {
    try {
      setMapReady(true);
    } catch (e: any) {
      console.error('Map init error:', e);
      setMapError(e?.message || 'Erreur de chargement de la carte');
    }
  }, []);

  if (mapError) {
    return (
      <div className="h-full bg-slate-800 rounded-2xl flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-400 text-sm font-bold mb-2">Erreur carte</p>
          <p className="text-slate-400 text-xs">{mapError}</p>
          <button onClick={() => { setMapError(null); setMapReady(false); setTimeout(() => setMapReady(true), 100); }}
            className="mt-3 px-4 py-2 bg-teal-500 text-white rounded-lg text-xs font-bold">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!mapReady) {
    return (
      <div className="h-full bg-slate-800 rounded-2xl flex items-center justify-center">
        <div className="text-slate-400 text-sm">Chargement de la carte...</div>
      </div>
    );
  }

  try {
    return (
      <div className="relative h-full rounded-2xl overflow-hidden border border-white/10" data-testid="orders-map">
        <MapContainer
          center={center}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          <MapCenterController center={center} />

          {/* Washer location and zone */}
          {washerLocation && (
            <>
              <Circle
                center={[washerLocation.lat, washerLocation.lng]}
                radius={washerLocation.maxDistance * 1000}
                pathOptions={{
                  color: '#14b8a6',
                  fillColor: '#14b8a6',
                  fillOpacity: 0.1,
                  weight: 2,
                  dashArray: '5, 10',
                }}
              />
              <Marker position={[washerLocation.lat, washerLocation.lng]} icon={washerIcon}>
                <Popup className="custom-popup">
                  <div className="text-center p-2">
                    <p className="font-bold text-teal-600">Votre position</p>
                    <p className="text-xs text-slate-500">Zone de {washerLocation.maxDistance} km</p>
                  </div>
                </Popup>
              </Marker>
            </>
          )}

          {/* Order markers */}
          {ordersWithCoords.map((order) => (
            <Marker
              key={order.id}
              position={[order.lat!, order.lng!]}
              icon={createOrderIcon(order.formula)}
              eventHandlers={{
                click: () => onOrderClick?.(order),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-3 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Package size={16} className="text-teal-500" />
                    <span className="font-bold text-slate-800">{order.weight} kg</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.formula === 'express' ? 'bg-purple-100 text-purple-700' :
                      order.formula === 'eco' ? 'bg-green-100 text-green-700' :
                      'bg-teal-100 text-teal-700'
                    }`}>
                      {order.formula === 'express' ? 'Express' : order.formula === 'eco' ? 'Eco' : 'Standard'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm mb-2">
                    <MapPin size={14} />
                    <span className="truncate">{order.pickup_city || order.city || order.pickup_address || 'Zone non precisee'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-500">Votre gain</span>
                    <span className="font-bold text-teal-600">
                      {(parseFloat(String(order.total_price)) * 0.6).toFixed(2)} EUR
                    </span>
                  </div>
                  <button
                    onClick={() => onOrderClick?.(order)}
                    className="w-full mt-3 py-2 bg-teal-500 text-white rounded-lg text-sm font-bold hover:bg-teal-600 transition"
                  >
                    Voir les details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-3 border border-white/10 z-[1000]">
          <p className="text-xs text-white/60 font-bold mb-2">Legende</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-teal-500"></div>
              <span className="text-white/80">Standard</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-white/80">Express</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-white/80">Eco</span>
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
  } catch (e: any) {
    console.error('Map render error:', e);
    return (
      <div className="h-full bg-slate-800 rounded-2xl flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-400 text-sm font-bold mb-2">La carte n'a pas pu se charger</p>
          <p className="text-slate-400 text-xs">{e?.message || 'Erreur inconnue'}</p>
        </div>
      </div>
    );
  }
}
