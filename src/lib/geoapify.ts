const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export async function geocodeAddress(address: string) {
  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${GEOAPIFY_API_KEY}`
  );
  
  const data = await response.json();
  
  if (data.features && data.features.length > 0) {
    const coords = data.features[0].geometry.coordinates;
    return {
      lat: coords[1],
      lon: coords[0],
      display_name: data.features[0].properties.formatted,
    };
  }
  
  return null;
}
