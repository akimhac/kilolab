const https = require('https');
const fs = require('fs');

const GEOAPIFY_API_KEY = '89f89b49a8f845bcb7512237e68f5b0e';

const cities = [
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Lyon', lat: 45.7640, lon: 4.8357 },
  { name: 'Marseille', lat: 43.2965, lon: 5.3698 },
  { name: 'Toulouse', lat: 43.6047, lon: 1.4442 },
  { name: 'Nice', lat: 43.7102, lon: 7.2620 },
  { name: 'Nantes', lat: 47.2184, lon: -1.5536 },
  { name: 'Strasbourg', lat: 48.5734, lon: 7.7521 },
  { name: 'Montpellier', lat: 43.6108, lon: 3.8767 },
  { name: 'Bordeaux', lat: 44.8378, lon: -0.5792 },
  { name: 'Lille', lat: 50.6292, lon: 3.0573 },
];

async function searchLaundries(city) {
  return new Promise((resolve, reject) => {
    const categories = 'commercial.laundry,commercial.dry_cleaning';
    const options = {
      hostname: 'api.geoapify.com',
      path: `/v2/places?categories=${categories}&filter=circle:${city.lon},${city.lat},10000&limit=20&apiKey=${GEOAPIFY_API_KEY}`,
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const laveries = [];
          
          (json.features || []).forEach(feature => {
            const props = feature.properties;
            const coords = feature.geometry.coordinates;
            
            const name = props.name || props.datasource?.raw?.name || `Laverie ${city.name}`;
            const street = props.street || props.address_line1 || '';
            const postcode = props.postcode || '';
            const cityName = props.city || city.name;
            
            laveries.push({
              name: name.substring(0, 100).replace(/'/g, "''"),
              address: street.substring(0, 200).replace(/'/g, "''"),
              city: cityName.replace(/'/g, "''"),
              postal_code: postcode,
              lat: coords[1],
              lon: coords[0],
            });
          });
          
          resolve(laveries);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('🔍 Extraction laveries via Geoapify API...\n');
  
  const allLaveries = [];
  
  for (const city of cities) {
    console.log(`📍 ${city.name}...`);
    
    try {
      const laveries = await searchLaundries(city);
      allLaveries.push(...laveries);
      console.log(`  ✅ ${laveries.length} laveries trouvées`);
      
      await new Promise(r => setTimeout(r, 1000));
    } catch (error) {
      console.error(`  ❌ Erreur:`, error.message);
    }
  }
  
  console.log(`\n📊 Total: ${allLaveries.length} laveries\n`);
  
  if (allLaveries.length > 0) {
    const sql = allLaveries.map(p => 
      `INSERT INTO partners (name, address, city, postal_code, lat, lon, is_active) VALUES ('${p.name}', '${p.address}', '${p.city}', '${p.postal_code}', ${p.lat}, ${p.lon}, true);`
    ).join('\n');
    
    fs.writeFileSync('laveries-geoapify.sql', sql);
    console.log('✅ Fichier laveries-geoapify.sql créé !');
  }
}

main();
