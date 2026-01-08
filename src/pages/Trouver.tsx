import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getUserLocation, findNearbyPartners } from "../lib/geolocation";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { analytics } from "../lib/analytics";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Trouver() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [geoError, setGeoError] = useState(false);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setLoading(true);
      setGeoError(false);

      // 1️⃣ Demande la géolocalisation
      const position = await getUserLocation();
      const { latitude, longitude } = position.coords;

      setUserLocation({ lat: latitude, lon: longitude });

      // 2️⃣ Cherche les partenaires proches
      const nearbyPartners = await findNearbyPartners(latitude, longitude, 15);

      if (nearbyPartners && nearbyPartners.length > 0) {
        setPartners(nearbyPartners);
        toast.success(`${nearbyPartners.length} partenaire(s) trouvé(s) à proximité`);
      } else {
        // Fallback : charge tous les partenaires
        await loadAllPartners();
        toast.success("Tous les partenaires disponibles");
      }
    } catch (error: any) {
      console.error("Erreur géolocalisation:", error);
      setGeoError(true);
      
      // Message d'erreur plus clair
      if (error.code === 1) {
        toast.error("Géolocalisation refusée. Affichage de tous les partenaires.");
      } else {
        toast.error("Impossible de vous géolocaliser");
      }
      
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
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (data) {
      setPartners(data);
    }
  };

  // 📊 Fonction de tracking (CORRIGÉE)
  const handleSelectPartner = (partner: any) => {
    const partnerCity = partner.city || partner.address || "Ville non renseignée";
    const partnerName = partner.company_name || partner.name || "Partenaire";
    
    analytics.partnerSelected(partner.id, partnerCity);
    toast.success(`✅ Sélection : ${partnerName}`);
    
    // TODO: Navigation vers /new-order avec le partner sélectionné
    // navigate('/new-order', { state: { partnerId: partner.id } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-teal-600" size={48} />
          <p className="text-slate-600 font-medium">Recherche des partenaires...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-4">
            Partenaires proches
          </h1>
          
          {userLocation && !geoError ? (
            <p className="text-slate-600 flex items-center justify-center gap-2">
              <MapPin size={18} className="text-teal-600" />
              Position détectée : {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
            </p>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm border border-orange-200">
              <AlertCircle size={16} />
              Géolocalisation désactivée - Tous les partenaires affichés
            </div>
          )}
        </div>

        {/* LISTE PARTENAIRES */}
        {partners.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 font-medium">Aucun partenaire disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => {
              const partnerName = partner.company_name || partner.name || "Partenaire";
              const partnerCity = partner.city || partner.address || "Ville non renseignée";
              
              return (
                <div
                  key={partner.id}
                  onClick={() => handleSelectPartner(partner)}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-teal-500 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition">
                      {partnerName}
                    </h3>
                    {partner.distance_km && (
                      <span className="px-2 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-bold">
                        {partner.distance_km} km
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-600 mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-slate-400" />
                    {partnerCity}
                  </p>
                  
                  {partner.address && (
                    <p className="text-sm text-slate-400 truncate">
                      {partner.address}
                    </p>
                  )}
                  
                  <button className="mt-4 w-full py-2 bg-teal-50 text-teal-700 rounded-lg font-bold text-sm hover:bg-teal-100 transition">
                    Sélectionner ce pressing
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
