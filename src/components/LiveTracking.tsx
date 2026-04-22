import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../lib/supabase';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const washerIcon = L.divIcon({
  html: `<div style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 3px 12px rgba(139,92,246,0.4);">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
  </div>`,
  className: 'washer-live-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const pickupIcon = L.divIcon({
  html: `<div style="background:#14b8a6;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
  </div>`,
  className: 'pickup-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface LiveTrackingProps {
  orderId: string;
  washerId: string;
  pickupLat?: number;
  pickupLng?: number;
  pickupAddress?: string;
}

export default function LiveTracking({ orderId, washerId, pickupLat, pickupLng, pickupAddress }: LiveTrackingProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const washerMarkerRef = useRef<L.Marker | null>(null);
  const [washerPos, setWasherPos] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { data } = await supabase
          .from('washer_locations')
          .select('lat, lng, updated_at')
          .eq('washer_id', washerId)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();
        if (data?.lat && data?.lng) {
          setWasherPos({ lat: data.lat, lng: data.lng });
        }
      } catch {
        const { data } = await supabase.from('washers').select('lat, lng').eq('id', washerId).single();
        if (data?.lat && data?.lng) setWasherPos({ lat: data.lat, lng: data.lng });
      }
      setLoading(false);
    };
    fetchLocation();
    const interval = setInterval(fetchLocation, 10000);
    return () => clearInterval(interval);
  }, [washerId]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const center: [number, number] = pickupLat && pickupLng ? [pickupLat, pickupLng] : [48.8566, 2.3522];
    try {
      const map = L.map(mapRef.current, { center, zoom: 13, zoomControl: false, attributionControl: false });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);
      if (pickupLat && pickupLng) {
        L.marker([pickupLat, pickupLng], { icon: pickupIcon }).addTo(map).bindPopup(`<b>Point de collecte</b><br/>${pickupAddress || ''}`);
      }
      mapInstance.current = map;
      setTimeout(() => map.invalidateSize(), 200);
    } catch (e: any) { setError(e?.message || 'Erreur carte'); }
    return () => { mapInstance.current?.remove(); mapInstance.current = null; };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !washerPos) return;
    if (washerMarkerRef.current) {
      washerMarkerRef.current.setLatLng([washerPos.lat, washerPos.lng]);
    } else {
      washerMarkerRef.current = L.marker([washerPos.lat, washerPos.lng], { icon: washerIcon }).addTo(map).bindPopup('<b>Votre Washer</b><br/>Position en temps reel');
    }
    if (pickupLat && pickupLng) {
      map.fitBounds(L.latLngBounds([[washerPos.lat, washerPos.lng], [pickupLat, pickupLng]]), { padding: [50, 50] });
    } else {
      map.setView([washerPos.lat, washerPos.lng], 14);
    }
  }, [washerPos]);

  if (error) return <div className="h-48 bg-slate-100 rounded-xl flex items-center justify-center text-sm text-slate-500">{error}</div>;

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 relative" data-testid="live-tracking">
      {loading && <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center"><Loader2 className="animate-spin text-teal-500" size={24} /></div>}
      <div ref={mapRef} style={{ height: '220px', width: '100%' }} />
      {washerPos && (
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-lg px-3 py-1.5 text-xs font-bold text-purple-700 flex items-center gap-1.5 shadow-sm z-[1000]">
          <Navigation size={12} className="text-purple-500" /> Washer en route
        </div>
      )}
      {!washerPos && !loading && (
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-lg px-3 py-1.5 text-xs text-slate-500 shadow-sm z-[1000]">
          <MapPin size={12} className="inline mr-1" /> Position non disponible
        </div>
      )}
    </div>
  );
}
