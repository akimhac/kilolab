const https = require('https');
const fs = require('fs');

async function searchPressingsOSM(bbox) {
  return new Promise((resolve, reject) => {
    const query = `
[out:json][timeout:25];
(
  node["shop"="laundry"](${bbox});
  way["shop"="laundry"](${bbox});
  node["shop"="dry_cleaning"](${bbox});
  way["shop"="dry_cleaning"](${bbox});
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
          resolve(JSON.parse(data));
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

const zones = [
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
];

async function main() {
  console.log('🗺️  Extraction des pressings depuis OpenStreetMap...\n');
  console.log('✅ 100% GRATUIT - Pas besoin d\'API key!\n');
  
  const allPressings = [];
  
  for (const zone of zones) {
    console.log(`🔍 Recherche à ${zone.name}...`);
    
    try {
      const data = await searchPressingsOSM(zone.bbox);
      
      if (data.elements) {
        data.elements.forEach(element => {
          if (element.type === 'node' || element.type === 'way') {
            const name = element.tags?.name || `Pressing ${zone.name}`;
            const address = [
              element.tags?.['addr:housenumber'],
              element.tags?.['addr:street']
            ].filter(Boolean).join(' ') || 'Adresse à préciser';
            
            const lat = element.lat || (element.center?.lat) || 0;
            const lon = element.lon || (element.center?.lon) || 0;
            
            if (lat !== 0 && lon !== 0) {
              allPressings.push({
                name: name.substring(0, 100),
                address: address.substring(0, 200),
                city: element.tags?.['addr:city'] || zone.name,
                postal_code: element.tags?.['addr:postcode'] || '',
                lat: lat,
                lon: lon,
                phone: element.tags?.phone || '',
                website: element.tags?.website || ''
              });
            }
          }
        });
        console.log(`✅ ${data.elements.length} pressings trouvés`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Erreur ${zone.name}:`, error.message);
    }
  }
  
  console.log(`\n📊 TOTAL: ${allPressings.length} pressings extraits d'OpenStreetMap\n`);
  
  if (allPressings.length > 0) {
    const sqlInserts = allPressings.map(p => 
      `INSERT INTO partners (name, address, city, postal_code, lat, lon, is_active) VALUES ('${p.name.replace(/'/g, "''")}', '${p.address.replace(/'/g, "''")}', '${p.city.replace(/'/g, "''")}', '${p.postal_code}', ${p.lat}, ${p.lon}, true);`
    );
    
    fs.writeFileSync('osm-pressings.sql', sqlInserts.join('\n'));
    console.log('✅ Fichier osm-pressings.sql créé !');
    console.log('\n📋 Prochaines étapes:');
    console.log('1. Ouvre Supabase SQL Editor');
    console.log('2. Copie le contenu de osm-pressings.sql');
    console.log('3. Exécute le SQL');
    console.log('4. Rafraîchis ta carte !');
    
    console.log(`\n📱 Exemple de pressing trouvé:`);
    console.log(JSON.stringify(allPressings[0], null, 2));
  } else {
    console.log('⚠️  Peu de pressings trouvés sur OSM.');
    console.log('💡 OpenStreetMap a moins de données commerciales qu\'INSEE.');
  }
}

main();
