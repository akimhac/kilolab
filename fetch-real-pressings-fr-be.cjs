const https = require('https');
const fs = require('fs');

// Liste des villes France + Belgique
const cities = [
  // France - Top 100 villes
  { name: 'Paris', country: 'FR', bbox: '48.8155,2.2241,48.9022,2.4699' },
  { name: 'Marseille', country: 'FR', bbox: '43.2096,5.3171,43.3565,5.4769' },
  { name: 'Lyon', country: 'FR', bbox: '45.7080,4.7814,45.8084,4.9013' },
  { name: 'Toulouse', country: 'FR', bbox: '43.5511,1.3748,43.6527,1.4996' },
  { name: 'Nice', country: 'FR', bbox: '43.6522,7.1795,43.7405,7.3081' },
  { name: 'Nantes', country: 'FR', bbox: '47.1723,-1.6428,47.2844,-1.4617' },
  { name: 'Strasbourg', country: 'FR', bbox: '48.5261,7.6885,48.6214,7.8106' },
  { name: 'Montpellier', country: 'FR', bbox: '43.5709,3.8185,43.6429,3.9283' },
  { name: 'Bordeaux', country: 'FR', bbox: '44.8036,-0.6469,44.8976,-0.5089' },
  { name: 'Lille', country: 'FR', bbox: '50.5955,3.0082,50.6809,3.1199' },
  { name: 'Rennes', country: 'FR', bbox: '48.0835,-1.7309,48.1431,-1.6196' },
  { name: 'Reims', country: 'FR', bbox: '49.2262,4.0015,49.2828,4.0794' },
  { name: 'Le Havre', country: 'FR', bbox: '49.4720,0.0582,49.5197,0.1611' },
  { name: 'Saint-Étienne', country: 'FR', bbox: '45.4112,4.3569,45.4683,4.4493' },
  { name: 'Toulon', country: 'FR', bbox: '43.1040,5.8831,43.1491,5.9639' },
  { name: 'Grenoble', country: 'FR', bbox: '45.1518,5.6891,45.2145,5.7622' },
  { name: 'Dijon', country: 'FR', bbox: '47.2918,4.9938,47.3514,5.0749' },
  { name: 'Angers', country: 'FR', bbox: '47.4429,-0.6152,47.5024,-0.5125' },
  { name: 'Nîmes', country: 'FR', bbox: '43.8056,4.3277,43.8632,4.3969' },
  { name: 'Villeurbanne', country: 'FR', bbox: '45.7522,4.8602,45.7908,4.9125' },
  { name: 'Saint-Denis', country: 'FR', bbox: '48.9203,2.3318,48.9497,2.3791' },
  { name: 'Le Mans', country: 'FR', bbox: '47.9758,0.1688,48.0284,0.2345' },
  { name: 'Aix-en-Provence', country: 'FR', bbox: '43.5094,5.4158,43.5546,5.4807' },
  { name: 'Clermont-Ferrand', country: 'FR', bbox: '45.7601,3.0697,45.8177,3.1442' },
  { name: 'Brest', country: 'FR', bbox: '48.3605,-4.5403,48.4308,-4.4137' },
  { name: 'Tours', country: 'FR', bbox: '47.3620,0.6465,47.4197,0.7254' },
  { name: 'Amiens', country: 'FR', bbox: '49.8695,2.2556,49.9246,2.3386' },
  { name: 'Limoges', country: 'FR', bbox: '45.8090,1.2158,45.8678,1.2918' },
  { name: 'Annecy', country: 'FR', bbox: '45.8876,6.1057,45.9344,6.1671' },
  { name: 'Perpignan', country: 'FR', bbox: '42.6765,2.8624,42.7281,2.9277' },
  
  // Belgique - Top 30 villes
  { name: 'Bruxelles', country: 'BE', bbox: '50.7968,4.3113,50.9008,4.4346' },
  { name: 'Anvers', country: 'BE', bbox: '51.1809,4.3516,51.2672,4.4621' },
  { name: 'Gand', country: 'BE', bbox: '51.0113,3.6743,51.0877,3.7679' },
  { name: 'Charleroi', country: 'BE', bbox: '50.3893,4.4051,50.4411,4.4796' },
  { name: 'Liège', country: 'BE', bbox: '50.5989,5.5378,50.6625,5.6196' },
  { name: 'Bruges', country: 'BE', bbox: '51.1788,3.1946,51.2354,3.2634' },
  { name: 'Namur', country: 'BE', bbox: '50.4445,4.8274,50.4869,4.8956' },
  { name: 'Louvain', country: 'BE', bbox: '50.8615,4.6735,50.8953,4.7301' },
  { name: 'Mons', country: 'BE', bbox: '50.4370,3.9247,50.4778,3.9821' },
  { name: 'Malines', country: 'BE', bbox: '51.0118,4.4558,51.0502,4.5107' },
];

async function searchPressingsOSM(bbox, cityName, country) {
  return new Promise((resolve, reject) => {
    const query = `
[out:json][timeout:30];
(
  node["shop"="laundry"](${bbox});
  way["shop"="laundry"](${bbox});
  node["shop"="dry_cleaning"](${bbox});
  way["shop"="dry_cleaning"](${bbox});
  node["craft"="cleaning"](${bbox});
  way["craft"="cleaning"](${bbox});
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
          const pressings = [];
          
          (json.elements || []).forEach(element => {
            if (element.type === 'node' || element.type === 'way') {
              const name = element.tags?.name || `Pressing ${cityName}`;
              const street = element.tags?.['addr:street'] || '';
              const housenumber = element.tags?.['addr:housenumber'] || '';
              const address = [housenumber, street].filter(Boolean).join(' ') || 'Adresse à préciser';
              
              const lat = element.lat || element.center?.lat || 0;
              const lon = element.lon || element.center?.lon || 0;
              
              if (lat !== 0 && lon !== 0) {
                pressings.push({
                  name: name.substring(0, 100),
                  address: address.substring(0, 200),
                  city: element.tags?.['addr:city'] || cityName,
                  postal_code: element.tags?.['addr:postcode'] || '',
                  lat: lat,
                  lon: lon,
                  phone: element.tags?.phone || '',
                  country: country
                });
              }
            }
          });
          
          resolve(pressings);
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
  console.log('🗺️  EXTRACTION PRESSINGS - FRANCE + BELGIQUE\n');
  console.log('✅ 100% GRATUIT via OpenStreetMap\n');
  
  const allPressings = [];
  let totalCities = cities.length;
  let processedCities = 0;
  
  for (const city of cities) {
    processedCities++;
    console.log(`[${processedCities}/${totalCities}] 🔍 ${city.name} (${city.country})...`);
    
    try {
      const pressings = await searchPressingsOSM(city.bbox, city.name, city.country);
      allPressings.push(...pressings);
      console.log(`    ✅ ${pressings.length} pressings trouvés`);
      
      // Pause de 3 secondes entre chaque requête pour éviter le rate limit
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(`    ❌ Erreur: ${error.message}`);
    }
  }
  
  console.log(`\n📊 RÉSULTAT FINAL\n`);
  console.log(`Total pressings: ${allPressings.length}`);
  console.log(`France: ${allPressings.filter(p => p.country === 'FR').length}`);
  console.log(`Belgique: ${allPressings.filter(p => p.country === 'BE').length}\n`);
  
  if (allPressings.length > 0) {
    const sqlInserts = allPressings.map(p => 
      `INSERT INTO partners (name, address, city, postal_code, lat, lon, phone, is_active) VALUES ('${p.name.replace(/'/g, "''")}', '${p.address.replace(/'/g, "''")}', '${p.city.replace(/'/g, "''")}', '${p.postal_code}', ${p.lat}, ${p.lon}, '${p.phone}', true);`
    );
    
    fs.writeFileSync('pressings-france-belgique.sql', sqlInserts.join('\n'));
    console.log('✅ Fichier pressings-france-belgique.sql créé !\n');
    console.log('📋 PROCHAINES ÉTAPES:');
    console.log('1. Ouvre Supabase SQL Editor');
    console.log('2. Copie le contenu du fichier SQL');
    console.log('3. Exécute-le');
    console.log('4. Rafraîchis ta carte !');
  } else {
    console.log('❌ Aucun pressing trouvé.');
  }
}

main();
