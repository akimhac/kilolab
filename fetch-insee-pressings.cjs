const https = require('https');
const fs = require('fs');

async function getInseeToken() {
  return new Promise((resolve, reject) => {
    const postData = 'grant_type=client_credentials';
    const credentials = Buffer.from('CONSUMER_KEY:CONSUMER_SECRET').toString('base64');
    
    const options = {
      hostname: 'api.insee.fr',
      path: '/token',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
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
          resolve(json.access_token);
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

async function searchPressings(token, departement) {
  return new Promise((resolve, reject) => {
    const query = `(activitePrincipaleEtablissement:96.01A OR activitePrincipaleEtablissement:96.01B) AND codeCommuneEtablissement:${departement}*`;
    
    const options = {
      hostname: 'api.insee.fr',
      path: `/entreprises/sirene/V3/siret?q=${encodeURIComponent(query)}&nombre=1000`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function geocodeAddress(address) {
  return new Promise((resolve) => {
    const query = encodeURIComponent(address);
    const options = {
      hostname: 'nominatim.openstreetmap.org',
      path: `/search?format=json&q=${query}&countrycodes=fr&limit=1`,
      headers: {
        'User-Agent': 'KiloLab/1.0'
      }
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

const departements = [
  { code: '75', name: 'Paris' },
  { code: '69', name: 'Rhône' },
  { code: '13', name: 'Bouches-du-Rhône' },
  { code: '31', name: 'Haute-Garonne' },
  { code: '06', name: 'Alpes-Maritimes' },
  { code: '44', name: 'Loire-Atlantique' },
  { code: '67', name: 'Bas-Rhin' },
  { code: '34', name: 'Hérault' },
  { code: '33', name: 'Gironde' },
  { code: '59', name: 'Nord' },
  { code: '35', name: 'Ille-et-Vilaine' },
  { code: '92', name: 'Hauts-de-Seine' },
  { code: '93', name: 'Seine-Saint-Denis' },
  { code: '94', name: 'Val-de-Marne' },
];

async function main() {
  console.log('🔑 Obtention du token INSEE...');
  console.log('⚠️  IMPORTANT: Configure d\'abord tes clés API INSEE dans le script!\n');
  console.log('👉 Va sur: https://api.insee.fr/catalogue/');
  console.log('👉 Créer un compte');
  console.log('👉 Créer une application');
  console.log('�� Copier Consumer Key et Consumer Secret\n');
  
  try {
    const token = await getInseeToken();
    console.log('✅ Token obtenu\n');
    
    const allPressings = [];
    
    for (const dept of departements) {
      console.log(`🔍 Recherche dans ${dept.name} (${dept.code})...`);
      
      try {
        const data = await searchPressings(token, dept.code);
        
        if (data.etablissements) {
          for (const etab of data.etablissements) {
            const addr = etab.adresseEtablissement;
            const name = etab.uniteLegale?.denominationUniteLegale || 
                        etab.uniteLegale?.nomUniteLegale || 
                        `Pressing ${addr?.libelleCommuneEtablissement || ''}`;
            
            const address = `${addr?.numeroVoieEtablissement || ''} ${addr?.typeVoieEtablissement || ''} ${addr?.libelleVoieEtablissement || ''}`.trim();
            const fullAddress = `${address}, ${addr?.codePostalEtablissement || ''} ${addr?.libelleCommuneEtablissement || ''}`;
            
            console.log(`  Géocodage: ${name}...`);
            const coords = await geocodeAddress(fullAddress);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (coords.lat !== 0 && coords.lon !== 0) {
              allPressings.push({
                name: name.substring(0, 100),
                address: address.substring(0, 200),
                city: addr?.libelleCommuneEtablissement || '',
                postal_code: addr?.codePostalEtablissement || '',
                lat: coords.lat,
                lon: coords.lon,
                siret: etab.siret
              });
            }
          }
          console.log(`✅ ${data.etablissements.length} pressings trouvés`);
        }
      } catch (error) {
        console.error(`❌ Erreur ${dept.name}:`, error.message);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log(`\n📊 TOTAL: ${allPressings.length} pressings validés avec coordonnées\n`);
    
    if (allPressings.length > 0) {
      const sqlInserts = allPressings.map(p => 
        `INSERT INTO partners (name, address, city, postal_code, lat, lon, is_active) VALUES ('${p.name.replace(/'/g, "''")}', '${p.address.replace(/'/g, "''")}', '${p.city.replace(/'/g, "''")}', '${p.postal_code}', ${p.lat}, ${p.lon}, true);`
      );
      
      fs.writeFileSync('insee-pressings.sql', sqlInserts.join('\n'));
      console.log('✅ Fichier insee-pressings.sql créé !');
      console.log('\n📋 Prochaines étapes:');
      console.log('1. Ouvre Supabase SQL Editor');
      console.log('2. Copie le contenu de insee-pressings.sql');
      console.log('3. Exécute le SQL');
      console.log('4. Rafraîchis ta carte !');
    } else {
      console.log('❌ Aucun pressing trouvé. Vérifie ta config API INSEE.');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.log('\n💡 Si erreur d\'authentification:');
    console.log('1. Va sur https://api.insee.fr/catalogue/');
    console.log('2. Crée un compte');
    console.log('3. Crée une app "Sirene"');
    console.log('4. Copie Consumer Key et Secret dans ce script ligne 5');
  }
}

main();
