const https = require('https');
const fs = require('fs');

const cities = [
  { name: 'Paris', bbox: '48.8155,2.2241,48.9022,2.4699' },
  { name: 'Lyon', bbox: '45.7080,4.7814,45.8084,4.9013' },
  { name: 'Marseille', bbox: '43.2096,5.3171,43.3565,5.4769' },
  { name: 'Toulouse', bbox: '43.5511,1.3748,43.6527,1.4996' },
  { name: 'Nice', bbox: '43.6522,7.1795,43.7405,7.3081' },
  { name: 'Nantes', bbox: '47.1723,-1.6428,47.2844,-1.4617' },
  { name: 'Strasbourg', bbox: '48.5261,7.6885,48.6214,7.8106' },
  { name: 'Montpellier', bbox: '43.5709,3.8185,43.6429,3.9283' },
  { name: 'Bordeaux', bbox: '44.8036,-0.6469,44.8976,-0.5089' },
  { name: 'Lille', bbox: '50.5955,3.0082,50.6809,3.1199' },
  { name: 'Rennes', bbox: '48.0835,-1.7309,48.1431,-1.6196' },
  { name: 'Reims', bbox: '49.2262,4.0015,49.2828,4.0794' },
  { name: 'Le Havre', bbox: '49.4720,0.0582,49.5197,0.1611' },
  { name: 'Saint-Étienne', bbox: '45.4112,4.3569,45.4683,4.4493' },
  { name: 'Toulon', bbox: '43.1040,5.8831,43.1491,5.9639' },
  { name: 'Grenoble', bbox: '45.1518,5.6891,45.2145,5.7622' },
  { name: 'Dijon', bbox: '47.2918,4.9938,47.3514,5.0749' },
  { name: 'Angers', bbox: '47.4429,-0.6152,47.5024,-0.5125' },
  { name: 'Nîmes', bbox: '43.8056,4.3277,43.8632,4.3969' },
  { name: 'Villeurbanne', bbox: '45.7522,4.8602,45.7908,4.9125' },
];

async function searchLaundries(bbox, cityName) {
  return new Promise((resolve, reject) => {
    const query = `
[out:json][timeout:25];
(
  node["shop"="laundry"](${bbox});
  way["shop"="laundry"](${bbox});
  node["shop"="dry_cleaning"](${bbox});
  way["shop"="dry_cleaning"](${bbox});
  node["amenity"="lavoir"](${bbox});
  way["amenity"="lavoir"](${bbox});
);
out body;
>;
out skel qt;
    `.trim();

    const postData = `data=${encodeURIComponent(query)}`;
    
    const options = {
      hostname: 'overpass-api.de',
      path: '/api/interpreter',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const laveries = [];
          
          (json.elements || []).forEach(element => {
            if (element.type === 'node' || element.type === 'way') {
              const name = element.tags?.name || `Laverie ${cityName}`;
              const street = element.tags?.['addr:street'] || '';
              const housenumber = element.tags?.['addr:housenumber'] || '';
              const address = [housenumber, street].filter(Boolean).join(' ') || 'Adresse à préciser';
              
              const lat = element.lat || element.center?.lat || 0;
              const lon = element.lon || element.center?.lon || 0;
              
              if (lat !== 0 && lon !== 0) {
                laveries.push({
                  name: name.substring(0, 100).replace(/'/g, "''"),
                  address: address.substring(0, 200).replace(/'/g, "''"),
                  city: element.tags?.['addr:city'] || cityName,
                  postal_code: element.tags?.['addr:postcode'] || '',
                  lat: lat,
                  lon: lon,
                });
              }
            }
          });
          
          resolve(laveries);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('🔍 Extraction laveries via Overpass API (OpenStreetMap)...\n');
  
  const allLaveries = [];
  
  for (const city of cities) {
    console.log(`📍 ${city.name}...`);
    
    try {
      const laveries = await searchLaundries(city.bbox, city.name);
      allLaveries.push(...laveries);
      console.log(`  ✅ ${laveries.length} laveries trouvées`);
      
      await new Promise(r => setTimeout(r, 3000));
    } catch (error) {
      console.error(`  ❌ Erreur:`, error.message);
    }
  }
  
  console.log(`\n📊 Total: ${allLaveries.length} laveries\n`);
  
  if (allLaveries.length > 0) {
    const sql = allLaveries.map(p => 
      `INSERT INTO partners (name, address, city, postal_code, lat, lon, is_active) VALUES ('${p.name}', '${p.address}', '${p.city}', '${p.postal_code}', ${p.lat}, ${p.lon}, true);`
    ).join('\n');
    
    fs.writeFileSync('laveries-overpass.sql', sql);
    console.log('✅ Fichier laveries-overpass.sql créé !');
  }
}

main();
