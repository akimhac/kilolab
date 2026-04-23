import { useMemo } from 'react';
import { MapPin, Route, Clock, TrendingUp } from 'lucide-react';

interface Mission {
  id: string;
  pickup_address: string;
  pickup_lat?: number | null;
  pickup_lng?: number | null;
  weight: number;
  total_price: number;
  formula: string;
  status: string;
}

interface RouteGroup {
  zone: string;
  missions: Mission[];
  totalWeight: number;
  totalGain: number;
  estimatedTime: number;
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function clusterMissions(missions: Mission[], maxDistanceKm: number = 2): RouteGroup[] {
  const withCoords = missions.filter(m => m.pickup_lat && m.pickup_lng);
  const withoutCoords = missions.filter(m => !m.pickup_lat || !m.pickup_lng);
  const visited = new Set<string>();
  const groups: RouteGroup[] = [];

  for (const mission of withCoords) {
    if (visited.has(mission.id)) continue;
    visited.add(mission.id);

    const cluster: Mission[] = [mission];

    for (const other of withCoords) {
      if (visited.has(other.id)) continue;
      const dist = haversine(mission.pickup_lat!, mission.pickup_lng!, other.pickup_lat!, other.pickup_lng!);
      if (dist <= maxDistanceKm) {
        cluster.push(other);
        visited.add(other.id);
      }
    }

    const zone = mission.pickup_address?.split(',').pop()?.trim() || 'Zone inconnue';
    const totalWeight = cluster.reduce((s, m) => s + m.weight, 0);
    const totalGain = cluster.reduce((s, m) => s + parseFloat(String(m.total_price || 0)) * 0.6, 0);
    const estimatedTime = cluster.length * 25; // ~25 min per mission

    groups.push({ zone, missions: cluster, totalWeight, totalGain, estimatedTime });
  }

  // Group missions without coordinates by address similarity
  if (withoutCoords.length > 0) {
    const addressGroups: Record<string, Mission[]> = {};
    for (const m of withoutCoords) {
      const key = m.pickup_address?.split(',').pop()?.trim() || 'Autre';
      if (!addressGroups[key]) addressGroups[key] = [];
      addressGroups[key].push(m);
    }
    for (const [zone, missions] of Object.entries(addressGroups)) {
      const totalWeight = missions.reduce((s, m) => s + m.weight, 0);
      const totalGain = missions.reduce((s, m) => s + parseFloat(String(m.total_price || 0)) * 0.6, 0);
      groups.push({ zone, missions, totalWeight, totalGain, estimatedTime: missions.length * 25 });
    }
  }

  // Sort by number of missions descending (best routes first)
  return groups.sort((a, b) => b.missions.length - a.missions.length);
}

export default function RouteOptimizer({ missions, onSelectMission }: {
  missions: Mission[];
  onSelectMission?: (mission: Mission) => void;
}) {
  const routes = useMemo(() => clusterMissions(missions), [missions]);

  if (missions.length < 2) return null;

  const multiRoutes = routes.filter(r => r.missions.length >= 2);
  if (multiRoutes.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-2xl border border-blue-500/20 p-5 mb-6" data-testid="route-optimizer">
      <h3 className="text-white font-black text-base flex items-center gap-2 mb-1">
        <Route size={18} className="text-blue-400" /> Tournees optimisees
      </h3>
      <p className="text-white/40 text-xs mb-4">Missions groupees par proximite pour gagner du temps</p>

      <div className="space-y-3">
        {multiRoutes.map((route, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-400 font-black text-sm">{route.missions.length}</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{route.zone}</p>
                  <p className="text-white/40 text-xs">{route.totalWeight} kg au total</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-teal-400 font-black text-sm">{route.totalGain.toFixed(2)} EUR</p>
                <p className="text-white/30 text-xs flex items-center gap-1 justify-end">
                  <Clock size={10} /> ~{route.estimatedTime} min
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {route.missions.map(m => (
                <button
                  key={m.id}
                  onClick={() => onSelectMission?.(m)}
                  className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300 hover:bg-blue-500/20 transition"
                >
                  <MapPin size={10} className="inline mr-1" />
                  {m.weight}kg - {(parseFloat(String(m.total_price || 0)) * 0.6).toFixed(2)} EUR
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-white/30">
        <TrendingUp size={12} />
        <span>Grouper ces missions vous fait economiser du temps et des deplacements</span>
      </div>
    </div>
  );
}
