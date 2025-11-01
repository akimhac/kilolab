const https = require('https');
const fs = require('fs');

async function getOSMPressings(bbox, zoneName) {
  return new Promise((resolve, reject) => {
    const query = `[out:json][timeout:25];(node["shop"="laundry"](${bbox});way["shop"="laundry"](${bbox});node["shop"="dry_cleaning"](${bbox});way["shop"="dry_cleaning"](${bbox}););out body;>;out skel qt;`;
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
          const pressings = (json.elements || []).map(el => ({
            name: el.tags?.name || `Pressing ${zoneName}`,
            address: [el.tags?.['addr:housenumber'], el.tags?.['addr:street']].filter(Boolean).join(' ') || 'À préciser',
            city: el.tags?.['addr:city'] || zoneName,
            postal_code: el.tags?.['addr:postcode'] || '',
            lat: el.lat || el.center?.lat || 0,
            lon: el.lon || el.center?.lon || 0,
            source: 'OpenStreetMap'
          })).filter(p => p.lat !== 0 && p.lon !== 0);
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

async function getDataGouvPressings() {
  return new Promise((resolve, reject) => {
    https.get('https://www.data.gouv.fr/fr/datasets/r/0651fb76-bcf3-4f6a-a38d-bc04fa708576', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const lines = data.split('\n');
          const pressings = [];
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(';');
            if (cols.length > 5 && (cols[2]?.includes('PRESSING') || cols[2]?.includes('LAVERIE'))) {
              pressings.push({
                name: cols[2] || 'Pressing',
                address: cols[3] || '',
                city: cols[4] || '',
                postal_code: cols[5] || '',
                lat: 0,
                lon: 0,
                source: 'Data.gouv.fr'
              });
            }
          }
          resolve(pressings);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
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
  console.log('🚀 EXTRACTION HYBRID - OpenStreetMap + Data.gouv\n');
  console.log('✅ 100% GRATUIT - 0 config - Rapide!\n');
  
  let allPressings = [];
  
  console.log('📍 Extraction depuis OpenStreetMap...\n');
  for (const zone of zones) {
    console.log(`🔍 ${zone.name}...`);
    try {
      const pressings = await getOSMPressings(zone.bbox, zone.name);
      allPressings = allPressings.concat(pressings);
      console.log(`✅ ${pressings.length} trouvés`);
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.log(`⚠️  Erreur: ${e.message}`);
    }
  }
  
  console.log(`\n�� TOTAL: ${allPressings.length} pressings\n`);
  
  if (allPressings.length > 0) {
    const sql = allPressings.map(p => 
      `INSERT INTO partners (name, address, city, postal_code, lat, lon, is_active) VALUES ('${p.name.replace(/'/g, "''")}', '${p.address.replace(/'/g, "''")}', '${p.city.replace(/'/g, "''")}', '${p.postal_code}', ${p.lat}, ${p.lon}, true);`
    ).join('\n');
    
    fs.writeFileSync('real-pressings.sql', sql);
    console.log('✅ real-pressings.sql créé!\n');
    console.log('📋 MAINTENANT:');
    console.log('1. Ouvre Supabase SQL Editor');
    console.log('2. Colle le SQL');
    console.log('3. RUN');
    console.log('4. Ta carte est remplie! 🎉');
  }
}

main();
