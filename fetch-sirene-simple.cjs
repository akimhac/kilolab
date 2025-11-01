const https = require('https');
const fs = require('fs');

const API_KEY = 'a508a239-0dbc-4c38-88a2-390dbc2c3867';

async function searchPressings(departement) {
  return new Promise((resolve, reject) => {
    const query = `(activitePrincipaleEtablissement:96.01A OR activitePrincipaleEtablissement:96.01B) AND etablissement.etatAdministratifEtablissement:A AND etablissement.codeCommuneEtablissement:${departement}*`;
    
    const options = {
      hostname: 'api.insee.fr',
      path: `/entreprises/sirene/V3/siret?q=${encodeURIComponent(query)}&nombre=20`,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function geocode(address) {
  return new Promise((resolve) => {
    const query = encodeURIComponent(address);
    const options = {
      hostname: 'nominatim.openstreetmap.org',
      path: `/search?format=json&q=${query}&countrycodes=fr&limit=1`,
      headers: { 'User-Agent': 'KiloLab/1.0' }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json[0]) {
            resolve({ lat: parseFloat(json[0].lat), lon: parseFloat(json[0].lon) });
          } else {
            resolve({ lat: 0, lon: 0 });
          }
        } catch (e) {
          resolve({ lat: 0, lon: 0 });
        }
      });
    }).on('error', () => resolve({ lat: 0, lon: 0 }));
  });
}

const departements = ['75', '69', '13', '31', '06', '59', '33', '44'];

async function main() {
  console.log('🔍 Extraction pressings via API Sirene...\n');
  
  const allPressings = [];
  
  for (const dept of departements) {
    console.log(`📍 Département ${dept}...`);
    
    try {
      const data = await searchPressings(dept);
      
      if (data.etablissements && data.etablissements.length > 0) {
        console.log(`  ✅ ${data.etablissements.length} établissements trouvés`);
        
        for (const etab of data.etablissements.slice(0, 5)) {
          const addr = etab.adresseEtablissement;
          const name = etab.uniteLegale?.denominationUniteLegale || 
                      `Pressing ${addr?.libelleCommuneEtablissement || ''}`;
          
          const address = `${addr?.numeroVoieEtablissement || ''} ${addr?.typeVoieEtablissement || ''} ${addr?.libelleVoieEtablissement || ''}`.trim();
          const fullAddress = `${address}, ${addr?.codePostalEtablissement || ''} ${addr?.libelleCommuneEtablissement || ''}`;
          
          const coords = await geocode(fullAddress);
          await new Promise(r => setTimeout(r, 1100));
          
          if (coords.lat !== 0) {
            allPressings.push({
              name: name.substring(0, 100).replace(/'/g, "''"),
              address: address.substring(0, 200).replace(/'/g, "''"),
              city: (addr?.libelleCommuneEtablissement || '').replace(/'/g, "''"),
              postal_code: addr?.codePostalEtablissement || '',
              lat: coords.lat,
              lon: coords.lon
            });
          }
        }
      }
      
      await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
      console.error(`  ❌ Erreur:`, error.message);
    }
  }
  
  console.log(`\n📊 Total: ${allPressings.length} pressings\n`);
  
  if (allPressings.length > 0) {
    const sql = allPressings.map(p => 
      `INSERT INTO partners (name, address, city, postal_code, lat, lon, is_active) VALUES ('${p.name}', '${p.address}', '${p.city}', '${p.postal_code}', ${p.lat}, ${p.lon}, true);`
    ).join('\n');
    
    fs.writeFileSync('pressings-sirene.sql', sql);
    console.log('✅ Fichier pressings-sirene.sql créé !');
  }
}

main();
