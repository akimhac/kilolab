// Live Washer Tracking Component - Real-time GPS tracking like Uber
import { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { supabase } from '../lib/supabase';
import { Navigation, Phone, MessageCircle, Clock, MapPin, User, Loader2, X, RefreshCw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface WasherLocation {
  id: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  updated_at: string;
}

interface WasherInfo {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  rating?: number;
}

interface LiveTrackingProps {
  orderId: string;
  washerId: string;
  pickupLat: number;
  pickupLng: number;
  onClose?: () => void;
  onChat?: () => void;
}

// Custom washer marker icon
const washerIcon = new L.DivIcon({
  className: 'washer-marker',
  html: `
    <div style="
      width: 48px; 
      height: 48px; 
      background: linear-gradient(135deg, #14b8a6, #0d9488);
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-50%, -50%);
    ">
      <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
});

// Destination marker icon
const destinationIcon = new L.DivIcon({
  className: 'destination-marker',
  html: `
    <div style="
      width: 40px; 
      height: 40px; 
      background: #ef4444;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-50%, -50%);
    ">
      <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Auto-center map on washer
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

// Calculate ETA based on distance and average speed
function calculateETA(washerLat: number, washerLng: number, destLat: number, destLng: number, speed?: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (destLat - washerLat) * Math.PI / 180;
  const dLon = (destLng - washerLng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(washerLat * Math.PI / 180) * Math.cos(destLat * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  // Average urban speed: 20 km/h, or use actual speed
  const avgSpeed = speed || 20;
  return Math.ceil((distance / avgSpeed) * 60); // Return minutes
}

export function LiveWasherTracking({ orderId, washerId, pickupLat, pickupLng, onClose, onChat }: LiveTrackingProps) {
  const [loading, setLoading] = useState(true);
  const [washerLocation, setWasherLocation] = useState<WasherLocation | null>(null);
  const [washerInfo, setWasherInfo] = useState<WasherInfo | null>(null);
  const [eta, setEta] = useState<number | null>(null);
  const [followWasher, setFollowWasher] = useState(true);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    fetchInitialData();
    setupRealtimeSubscription();

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [washerId, orderId]);

  const fetchInitialData = async () => {
    try {
      // Fetch washer info
      const { data: washer, error: washerError } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name, phone')
        .eq('id', washerId)
        .single();

      if (washerError) throw washerError;
      setWasherInfo(washer);

      // Fetch latest location
      const { data: location, error: locationError } = await supabase
        .from('washer_locations')
        .select('*')
        .eq('washer_id', washerId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (!locationError && location) {
        setWasherLocation({
          id: location.id,
          lat: location.lat,
          lng: location.lng,
          heading: location.heading,
          speed: location.speed,
          updated_at: location.updated_at,
        });

        const estimatedTime = calculateETA(location.lat, location.lng, pickupLat, pickupLng, location.speed);
        setEta(estimatedTime);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    subscriptionRef.current = supabase
      .channel(`washer-location-${washerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'washer_locations',
          filter: `washer_id=eq.${washerId}`,
        },
        (payload) => {
          const newLocation = payload.new as any;
          if (newLocation) {
            setWasherLocation({
              id: newLocation.id,
              lat: newLocation.lat,
              lng: newLocation.lng,
              heading: newLocation.heading,
              speed: newLocation.speed,
              updated_at: newLocation.updated_at,
            });

            const estimatedTime = calculateETA(newLocation.lat, newLocation.lng, pickupLat, pickupLng, newLocation.speed);
            setEta(estimatedTime);
          }
        }
      )
      .subscribe();
  };

  const handleCall = () => {
    if (washerInfo?.phone) {
      window.location.href = `tel:${washerInfo.phone}`;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="animate-spin text-teal-500 mx-auto mb-3" size={40} />
          <p className="text-slate-500">Localisation du Washer...</p>
        </div>
      </div>
    );
  }

  // Default position if no washer location yet
  const mapCenter: [number, number] = washerLocation 
    ? [washerLocation.lat, washerLocation.lng] 
    : [pickupLat, pickupLng];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center overflow-hidden">
              <User className="text-teal-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">
                {washerInfo?.first_name} {washerInfo?.last_name?.charAt(0)}.
              </h3>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <Navigation size={14} className="text-teal-500" />
                En route vers vous
              </p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
              <X size={20} className="text-slate-400" />
            </button>
          )}
        </div>

        {/* ETA Banner */}
        {eta !== null && (
          <div className="mt-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl p-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={20} />
                <span className="font-medium">Arrivée estimée</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black">{eta}</span>
                <span className="text-sm ml-1">min</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="h-[300px] relative">
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {followWasher && washerLocation && (
            <MapUpdater center={[washerLocation.lat, washerLocation.lng]} />
          )}

          {/* Washer marker */}
          {washerLocation && (
            <Marker 
              position={[washerLocation.lat, washerLocation.lng]} 
              icon={washerIcon}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-bold">{washerInfo?.first_name}</p>
                  <p className="text-sm text-slate-500">Votre Washer</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Destination marker */}
          <Marker 
            position={[pickupLat, pickupLng]} 
            icon={destinationIcon}
          >
            <Popup>
              <div className="text-center">
                <p className="font-bold">Point de collecte</p>
                <p className="text-sm text-slate-500">Votre adresse</p>
              </div>
            </Popup>
          </Marker>

          {/* Route line */}
          {washerLocation && (
            <Polyline
              positions={[
                [washerLocation.lat, washerLocation.lng],
                [pickupLat, pickupLng],
              ]}
              color="#14b8a6"
              weight={4}
              opacity={0.7}
              dashArray="10, 10"
            />
          )}
        </MapContainer>

        {/* Follow toggle */}
        <button
          onClick={() => setFollowWasher(!followWasher)}
          className={`absolute bottom-4 left-4 z-[1000] px-3 py-2 rounded-xl text-sm font-medium shadow-lg transition-all ${
            followWasher 
              ? 'bg-teal-500 text-white' 
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          <RefreshCw size={14} className={`inline mr-1 ${followWasher ? 'animate-spin' : ''}`} />
          {followWasher ? 'Suivi actif' : 'Suivre'}
        </button>
      </div>

      {/* Actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="flex gap-3">
          <button
            onClick={handleCall}
            disabled={!washerInfo?.phone}
            className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Phone size={18} />
            Appeler
          </button>
          <button
            onClick={onChat}
            className="flex-1 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            Message
          </button>
        </div>
      </div>
    </div>
  );
}

// Mini tracking card for dashboard
export function LiveTrackingMini({ orderId, washerId, pickupLat, pickupLng, onClick }: LiveTrackingProps & { onClick: () => void }) {
  const [eta, setEta] = useState<number | null>(null);
  const [washerName, setWasherName] = useState('');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [washerId]);

  const fetchData = async () => {
    try {
      const [{ data: washer }, { data: location }] = await Promise.all([
        supabase.from('user_profiles').select('first_name').eq('id', washerId).single(),
        supabase.from('washer_locations').select('lat, lng, speed').eq('washer_id', washerId).order('updated_at', { ascending: false }).limit(1).single(),
      ]);

      if (washer) setWasherName(washer.first_name);
      if (location) {
        const time = calculateETA(location.lat, location.lng, pickupLat, pickupLng, location.speed);
        setEta(time);
      }
    } catch (error) {
      console.error('Error fetching tracking data:', error);
    }
  };

  return (
    <button
      onClick={onClick}
      className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-4 text-white text-left hover:from-teal-600 hover:to-emerald-600 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Navigation size={20} />
          </div>
          <div>
            <p className="font-bold">{washerName || 'Washer'} en route</p>
            <p className="text-sm text-white/80">Appuyez pour voir la carte</p>
          </div>
        </div>
        {eta !== null && (
          <div className="text-right">
            <p className="text-2xl font-black">{eta}</p>
            <p className="text-xs text-white/70">min</p>
          </div>
        )}
      </div>
    </button>
  );
}

export default LiveWasherTracking;
