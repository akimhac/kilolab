// Heatmap des commandes avec Leaflet/OpenStreetMap
import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { supabase } from '../lib/supabase';
import { Loader2, MapPin, Package, TrendingUp } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface OrderLocation {
  id: string;
  lat: number;
  lng: number;
  city: string;
  status: string;
  total_price: number;
  created_at: string;
}

interface CityCluster {
  city: string;
  lat: number;
  lng: number;
  count: number;
  revenue: number;
  orders: OrderLocation[];
}

// Component to fit bounds when data changes
function FitBounds({ clusters }: { clusters: CityCluster[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (clusters.length > 0) {
      const bounds = clusters.map(c => [c.lat, c.lng] as [number, number]);
      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [50, 50] });
      } else if (bounds.length === 1) {
        map.setView(bounds[0], 10);
      }
    }
  }, [clusters, map]);
  
  return null;
}

// French cities geocoding (fallback for common cities)
const FRENCH_CITIES: Record<string, { lat: number; lng: number }> = {
  'paris': { lat: 48.8566, lng: 2.3522 },
  'marseille': { lat: 43.2965, lng: 5.3698 },
  'lyon': { lat: 45.7640, lng: 4.8357 },
  'toulouse': { lat: 43.6047, lng: 1.4442 },
  'nice': { lat: 43.7102, lng: 7.2620 },
  'nantes': { lat: 47.2184, lng: -1.5536 },
  'strasbourg': { lat: 48.5734, lng: 7.7521 },
  'montpellier': { lat: 43.6108, lng: 3.8767 },
  'bordeaux': { lat: 44.8378, lng: -0.5792 },
  'lille': { lat: 50.6292, lng: 3.0573 },
  'rennes': { lat: 48.1173, lng: -1.6778 },
  'reims': { lat: 49.2583, lng: 4.0317 },
  'toulon': { lat: 43.1242, lng: 5.9280 },
  'grenoble': { lat: 45.1885, lng: 5.7245 },
  'dijon': { lat: 47.3220, lng: 5.0415 },
  'angers': { lat: 47.4784, lng: -0.5632 },
  'nimes': { lat: 43.8367, lng: 4.3601 },
  'aix-en-provence': { lat: 43.5297, lng: 5.4474 },
  'saint-etienne': { lat: 45.4397, lng: 4.3872 },
  'brest': { lat: 48.3904, lng: -4.4861 },
  'tours': { lat: 47.3941, lng: 0.6848 },
  'amiens': { lat: 49.8941, lng: 2.2958 },
  'limoges': { lat: 45.8336, lng: 1.2611 },
  'clermont-ferrand': { lat: 45.7772, lng: 3.0870 },
  'villeurbanne': { lat: 45.7676, lng: 4.8798 },
  'metz': { lat: 49.1193, lng: 6.1757 },
  'besancon': { lat: 47.2378, lng: 6.0241 },
  'perpignan': { lat: 42.6886, lng: 2.8948 },
  'orleans': { lat: 47.9029, lng: 1.9039 },
  'rouen': { lat: 49.4432, lng: 1.0993 },
  'caen': { lat: 49.1829, lng: -0.3707 },
  'nancy': { lat: 48.6921, lng: 6.1844 },
  'argenteuil': { lat: 48.9472, lng: 2.2467 },
  'montreuil': { lat: 48.8638, lng: 2.4483 },
  'roubaix': { lat: 50.6942, lng: 3.1746 },
  'tourcoing': { lat: 50.7239, lng: 3.1612 },
  'dunkerque': { lat: 51.0343, lng: 2.3768 },
  'avignon': { lat: 43.9493, lng: 4.8055 },
  'poitiers': { lat: 46.5802, lng: 0.3404 },
  'versailles': { lat: 48.8014, lng: 2.1301 },
  'colombes': { lat: 48.9236, lng: 2.2522 },
  'aulnay-sous-bois': { lat: 48.9383, lng: 2.4974 },
  'rueil-malmaison': { lat: 48.8769, lng: 2.1894 },
  'pau': { lat: 43.2951, lng: -0.3708 },
  'calais': { lat: 50.9513, lng: 1.8587 },
  'la rochelle': { lat: 46.1591, lng: -1.1520 },
  'antibes': { lat: 43.5808, lng: 7.1239 },
  'beziers': { lat: 43.3440, lng: 3.2191 },
  'cannes': { lat: 43.5528, lng: 7.0174 },
  'colmar': { lat: 48.0794, lng: 7.3586 },
  'bourges': { lat: 47.0810, lng: 2.3988 },
  'merignac': { lat: 44.8386, lng: -0.6436 },
  'saint-malo': { lat: 48.6493, lng: -2.0007 },
  'bruxelles': { lat: 50.8503, lng: 4.3517 },
  'liege': { lat: 50.6326, lng: 5.5797 },
  'anvers': { lat: 51.2194, lng: 4.4025 },
  'gand': { lat: 51.0543, lng: 3.7174 },
};

function getCityCoordinates(cityName: string): { lat: number; lng: number } | null {
  const normalized = cityName.toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z\s-]/g, '');
  
  // Check direct match
  if (FRENCH_CITIES[normalized]) {
    return FRENCH_CITIES[normalized];
  }
  
  // Check partial match
  for (const [key, coords] of Object.entries(FRENCH_CITIES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }
  
  return null;
}

interface OrderHeatmapProps {
  dateRange?: '7d' | '30d' | '90d' | 'all';
}

export function OrderHeatmap({ dateRange = '30d' }: OrderHeatmapProps) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderLocation[]>([]);
  const [clusters, setClusters] = useState<CityCluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<CityCluster | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [dateRange]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Calculate date filter
      const now = new Date();
      let startDate: Date;
      switch (dateRange) {
        case '7d': startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
        case '30d': startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); break;
        case '90d': startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); break;
        default: startDate = new Date('2020-01-01');
      }

      const { data, error } = await supabase
        .from('orders')
        .select('id, pickup_address, pickup_lat, pickup_lng, status, total_price, created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process orders and extract locations
      const processedOrders: OrderLocation[] = [];
      const cityMap = new Map<string, CityCluster>();

      for (const order of data || []) {
        let lat = order.pickup_lat;
        let lng = order.pickup_lng;
        let city = 'Inconnu';

        // Extract city from address
        const addressMatch = order.pickup_address?.match(/\d{5}\s+([A-Za-zÀ-ÿ\s-]+)/);
        if (addressMatch) {
          city = addressMatch[1].trim();
        }

        // If no coordinates, try to geocode from city name
        if (!lat || !lng) {
          const coords = getCityCoordinates(city);
          if (coords) {
            lat = coords.lat + (Math.random() - 0.5) * 0.02; // Add slight randomness
            lng = coords.lng + (Math.random() - 0.5) * 0.02;
          }
        }

        if (lat && lng) {
          const orderLoc: OrderLocation = {
            id: order.id,
            lat,
            lng,
            city,
            status: order.status,
            total_price: parseFloat(order.total_price) || 0,
            created_at: order.created_at,
          };
          processedOrders.push(orderLoc);

          // Cluster by city
          const existing = cityMap.get(city);
          if (existing) {
            existing.count++;
            existing.revenue += orderLoc.total_price;
            existing.orders.push(orderLoc);
            // Update center to average
            existing.lat = (existing.lat * (existing.count - 1) + lat) / existing.count;
            existing.lng = (existing.lng * (existing.count - 1) + lng) / existing.count;
          } else {
            cityMap.set(city, {
              city,
              lat,
              lng,
              count: 1,
              revenue: orderLoc.total_price,
              orders: [orderLoc],
            });
          }
        }
      }

      setOrders(processedOrders);
      setClusters(Array.from(cityMap.values()).sort((a, b) => b.count - a.count));
    } catch (error) {
      console.error('Error fetching orders for heatmap:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate max for scaling
  const maxCount = useMemo(() => Math.max(...clusters.map(c => c.count), 1), [clusters]);

  // Get color based on intensity
  const getColor = (count: number) => {
    const intensity = count / maxCount;
    if (intensity > 0.7) return '#ef4444'; // red
    if (intensity > 0.4) return '#f97316'; // orange
    if (intensity > 0.2) return '#eab308'; // yellow
    return '#22c55e'; // green
  };

  // Get radius based on count
  const getRadius = (count: number) => {
    const base = 15;
    const scale = Math.log(count + 1) * 10;
    return Math.min(base + scale, 50);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-teal-500" size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="text-red-500" size={20} />
            <h3 className="font-bold text-slate-900">Carte des commandes</h3>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-slate-400" />
              <span className="text-slate-600">{orders.length} commandes</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-slate-600">{clusters.length} villes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-[400px] relative">
        {clusters.length > 0 ? (
          <MapContainer
            center={[46.603354, 1.888334]} // Center of France
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds clusters={clusters} />
            
            {clusters.map((cluster) => (
              <CircleMarker
                key={cluster.city}
                center={[cluster.lat, cluster.lng]}
                radius={getRadius(cluster.count)}
                fillColor={getColor(cluster.count)}
                color={getColor(cluster.count)}
                weight={2}
                opacity={0.8}
                fillOpacity={0.5}
                eventHandlers={{
                  click: () => setSelectedCluster(cluster),
                }}
              >
                <Popup>
                  <div className="text-center min-w-[150px]">
                    <p className="font-bold text-lg text-slate-900">{cluster.city}</p>
                    <div className="flex justify-center gap-4 mt-2">
                      <div>
                        <p className="text-2xl font-black text-teal-600">{cluster.count}</p>
                        <p className="text-xs text-slate-500">commandes</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-green-600">{cluster.revenue.toFixed(0)}€</p>
                        <p className="text-xs text-slate-500">CA</p>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-50">
            <div className="text-center">
              <MapPin size={48} className="text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500">Aucune donnée de localisation</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Intensité:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500" />
              <span className="text-xs text-slate-600">Faible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500" />
              <span className="text-xs text-slate-600">Moyenne</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500" />
              <span className="text-xs text-slate-600">Haute</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <span className="text-xs text-slate-600">Très haute</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">Données OpenStreetMap</p>
        </div>
      </div>

      {/* Top Cities List */}
      {clusters.length > 0 && (
        <div className="p-4 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-700 mb-3">Top 5 villes</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {clusters.slice(0, 5).map((cluster, idx) => (
              <div 
                key={cluster.city}
                className="bg-slate-50 rounded-xl p-3 text-center hover:bg-slate-100 transition-all cursor-pointer"
                onClick={() => setSelectedCluster(cluster)}
              >
                <span className={`inline-block w-6 h-6 rounded-full text-white text-xs font-bold leading-6 mb-1 ${
                  idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-amber-700' : 'bg-slate-300'
                }`}>
                  {idx + 1}
                </span>
                <p className="font-bold text-slate-900 text-sm truncate">{cluster.city}</p>
                <p className="text-xs text-slate-500">{cluster.count} cmd • {cluster.revenue.toFixed(0)}€</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHeatmap;
