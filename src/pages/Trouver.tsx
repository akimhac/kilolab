import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getUserLocation, findNearbyPartners } from "../lib/geolocation";
import { MapPin, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { analytics } from "../lib/analytics"; // 📊 Import Analytics

export default function TrouverOptimized() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setLoading(true);

      // 1️⃣ Demande la géolocalisation
      const position = await getUserLocation();
      const { latitude, longitude } = position.coords;

      setUserLocation({ lat: latitude, lon: longitude });

      // 2️⃣ Cherche les partenaires proches
      const nearbyPartners = await findNearbyPartners(latitude, longitude, 15);

      if (nearbyPartners && nearbyPartners.length > 0) {
        setPartners(nearbyPartners);
        toast.success(`${nearbyPartners.length} partenaires trouvés à proximité`);
      } else {
        // Fallback : charge tous les partenaires
        await loadAllPartners();
      }
    } catch (error: any) {
      console.error("Erreur géolocalisation:", error);
      toast.error("Impossible de vous géolocaliser");
      // Fallback : charge tous les partenaires
      await loadAllPartners();
    } finally {
      setLoading(false);
    }
  };

  const loadAllPartners = async () => {
    const { data } = await supabase
      .from("partners")
      .select("*")
      .eq("is_active", true);

    if (data) {
      setPartners(data);
    }
  };

  // 📊 Fonction de tracking
  const handleSelectPartner = (partner: any) => {
    analytics.partnerSelected(partner.id, partner.city); 
    // Ici tu pourrais ajouter une navigation, ex: navigate('/new-order')
    toast.success(`Sélection : ${partner.company_name}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-teal-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Partenaires proches</h1>

      {userLocation && (
        <p className="text-slate-600 mb-6">
          📍 Position : {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <div 
            key={partner.id} 
            onClick={() => handleSelectPartner(partner)} // 👈 Ajout du click
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:border-teal-500 hover:shadow-md transition"
          >
            <h3 className="text-lg font-bold mb-2">{partner.company_name}</h3>
            <p className="text-slate-600 mb-2 flex items-center gap-2">
              <MapPin size={16} />
              {partner.city}
            </p>
            {partner.distance_km && (
              <p className="text-teal-600 font-semibold">
                📍 {partner.distance_km} km
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
