const https = require('https');
const fs = require('fs');

const SIRENE_API = 'https://api.insee.fr/entreprises/sirene/V3/siret';

const activiteCodes = [
  '9601A', // Blanchisserie-teinturerie de gros
  '9601B', // Blanchisserie-teinturerie de détail
];

async function fetchPressings(city, postalCode) {
  return new Promise((resolve, reject) => {
    const query = `activitePrincipaleUniteLegale:${activiteCodes.join(' OR ')} AND etablissement.codePostalEtablissement:${postalCode}*`;
    
    const options = {
      hostname: 'api.insee.fr',
      path: `/entreprises/sirene/V3/siret?q=${encodeURIComponent(query)}&nombre=100`,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer TON_TOKEN_INSEE'
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

const cities = [
  { name: 'Paris', postal: '75' },
  { name: 'Lyon', postal: '69' },
  { name: 'Marseille', postal: '13' },
  { name: 'Toulouse', postal: '31' },
  { name: 'Nice', postal: '06' },
  { name: 'Nantes', postal: '44' },
  { name: 'Strasbourg', postal: '67' },
  { name: 'Montpellier', postal: '34' },
  { name: 'Bordeaux', postal: '33' },
  { name: 'Lille', postal: '59' },
  { name: 'Rennes', postal: '35' },
];

async function getAllPressings() {
  console.log('🔍 Recherche de VRAIS pressing via INSEE...\n');
  
  const allPressings = [];
  
  for (const city of cities) {
    console.log(`Recherche à ${city.name} (${city.postal})...`);
    try {
      const data = await fetchPressings(city.name, city.postal);
      
      if (data.etablissements) {
        data.etablissements.forEach(etab => {
          allPressings.push({
            name: etab.uniteLegale?.denominationUniteLegale || `Pressing ${city.name}`,
            address: `${etab.adresseEtablissement?.numeroVoieEtablissement || ''} ${etab.adresseEtablissement?.typeVoieEtablissement || ''} ${etab.adresseEtablissement?.libelleVoieEtablissement || ''}`,
            city: etab.adresseEtablissement?.libelleCommuneEtablissement || city.name,
            postal_code: etab.adresseEtablissement?.codePostalEtablissement || city.postal,
            siret: etab.siret,
          });
        });
        console.log(`✅ Trouvé ${data.etablissements.length} pressing`);
      }
    } catch (error) {
      console.error(`❌ Erreur ${city.name}:`, error.message);
    }
  }
  
  console.log(`\n📊 TOTAL: ${allPressings.length} pressings trouvés\n`);
  
  const sqlInserts = allPressings.map(p => 
    `INSERT INTO partners (name, address, city, postal_code, lat, lon, is_active) VALUES ('${p.name.replace(/'/g, "''")}', '${p.address.replace(/'/g, "''")}', '${p.city}', '${p.postal_code}', 0, 0, true);`
  );
  
  fs.writeFileSync('real-pressings.sql', sqlInserts.join('\n'));
  console.log('✅ Fichier real-pressings.sql créé !');
}

getAllPressings();
