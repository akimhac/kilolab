import { supabase } from "./supabase";

export const findNearbyPartners = async (
  userLat: number,
  userLon: number,
  radiusKm: number = 10
) => {
  // Query SQL avec calcul de distance
  const { data, error } = await supabase.rpc("find_nearby_partners", {
    user_lat: userLat,
    user_lon: userLon,
    radius_km: radiusKm,
  });

  if (error) {
    console.error("Erreur géolocalisation:", error);
    return [];
  }

  return data;
};

// Obtenir la position de l'utilisateur
export const getUserLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Géolocalisation non supportée"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  });
};
