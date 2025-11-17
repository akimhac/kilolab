import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dhecegehcjelbxydeolg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZWNlZ2VoY2plbGJ4eWRlb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTcyMjEsImV4cCI6MjA3NTY3MzIyMX0.ckfg9qpfAvJBXuxxIEAjZAfe5rydAurlsx65sP4Jk8s'
);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Geocoding avec Nominatim
const geocode = async (address) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1,
        countrycodes: 'fr,be'
      },
      headers: { 'User-Agent': 'Kilolab/1.0' }
    });
    
    if (response.data?.[0]) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return null;
  }
};

// Générer des pressings fictifs mais réalistes pour les grandes villes
const generatePressings = () => {
  const villes = [
    // France
    { nom: 'Paris', code: '75000', coords: [48.8566, 2.3522] },
    { nom: 'Marseille', code: '13000', coords: [43.2965, 5.3698] },
    { nom: 'Lyon', code: '69000', coords: [45.7640, 4.8357] },
    { nom: 'Toulouse', code: '31000', coords: [43.6047, 1.4442] },
    { nom: 'Nice', code: '06000', coords: [43.7102, 7.2620] },
    { nom: 'Nantes', code: '44000', coords: [47.2184, -1.5536] },
    { nom: 'Montpellier', code: '34000', coords: [43.6108, 3.8767] },
    { nom: 'Strasbourg', code: '67000', coords: [48.5734, 7.7521] },
    { nom: 'Bordeaux', code: '33000', coords: [44.8378, -0.5792] },
    { nom: 'Lille', code: '59000', coords: [50.6292, 3.0573] },
    { nom: 'Rennes', code: '35000', coords: [48.1173, -1.6778] },
    { nom: 'Reims', code: '51100', coords: [49.2583, 4.0317] },
    { nom: 'Le Havre', code: '76600', coords: [49.4944, 0.1079] },
    { nom: 'Saint-Étienne', code: '42000', coords: [45.4397, 4.3872] },
    { nom: 'Toulon', code: '83000', coords: [43.1242, 5.9280] },
    { nom: 'Grenoble', code: '38000', coords: [45.1885, 5.7245] },
    { nom: 'Dijon', code: '21000', coords: [47.3220, 5.0415] },
    { nom: 'Angers', code: '49000', coords: [47.4784, -0.5632] },
    { nom: 'Nîmes', code: '30000', coords: [43.8367, 4.3601] },
    { nom: 'Aix-en-Provence', code: '13100', coords: [43.5297, 5.4474] },
    { nom: 'Clermont-Ferrand', code: '63000', coords: [45.7772, 3.0870] },
    { nom: 'Le Mans', code: '72000', coords: [48.0077, 0.1984] },
    { nom: 'Brest', code: '29200', coords: [48.3905, -4.4861] },
    { nom: 'Tours', code: '37000', coords: [47.3941, 0.6848] },
    { nom: 'Amiens', code: '80000', coords: [49.8941, 2.2958] },
    // Belgique
    { nom: 'Bruxelles', code: '1000', coords: [50.8503, 4.3517], pays: 'BE' },
    { nom: 'Anvers', code: '2000', coords: [51.2194, 4.4025], pays: 'BE' },
    { nom: 'Gand', code: '9000', coords: [51.0543, 3.7174], pays: 'BE' },
    { nom: 'Charleroi', code: '6000', coords: [50.4108, 4.4446], pays: 'BE' },
    { nom: 'Liège', code: '4000', coords: [50.6326, 5.5797], pays: 'BE' },
    { nom: 'Bruges', code: '8000', coords: [51.2093, 3.2247], pays: 'BE' },
    { nom: 'Namur', code: '5000', coords: [50.4674, 4.8720], pays: 'BE' },
    { nom: 'Louvain', code: '3000', coords: [50.8798, 4.7005], pays: 'BE' },
  ];

  const noms = [
    'Pressing', 'Nettoyage Express', 'Clean Pro', 'Pressing Moderne',
    'Laverie Premium', 'Pressing du Centre', 'Express Clean',
    'Pressing Royal', 'Net & Clean', 'Pressing Étoile',
    'Pressing Saint', 'Pressing de la Gare', 'Eco Pressing',
    'Pressing Central', 'Speed Clean', 'Pressing Plus'
  ];

  const rues = [
    'Rue du Centre', 'Avenue de la République', 'Boulevard Victor Hugo',
    'Rue de la Gare', 'Place du Marché', 'Rue Nationale',
    'Avenue des Alpes', 'Rue du Commerce', 'Boulevard de la Liberté',
    'Rue Saint-Michel', 'Avenue Jean Jaurès', 'Rue de Paris'
  ];

  const pressings = [];

  villes.forEach(ville => {
    // 15-30 pressings par ville
    const count = Math.floor(Math.random() * 16) + 15;
    
    for (let i = 0; i < count; i++) {
      const nom = `${noms[Math.floor(Math.random() * noms.length)]} ${ville.nom}`;
      const numero = Math.floor(Math.random() * 200) + 1;
      const rue = rues[Math.floor(Math.random() * rues.length)];
      const address = `${numero} ${rue}`;
      
      // Variation aléatoire des coordonnées (±0.02 degrés ~ 2km)
      const latVariation = (Math.random() - 0.5) * 0.04;
      const lonVariation = (Math.random() - 0.5) * 0.04;
      
      pressings.push({
        name: nom,
        address: address,
        city: ville.nom,
        postal_code: ville.code,
        lat: ville.coords[0] + latVariation,
        lon: ville.coords[1] + lonVariation,
        phone: `0${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
        is_active: true
      });
    }
  });

  return pressings;
};

const main = async () => {
  console.log('🚀 Génération de pressings réalistes...\n');
  
  const pressings = generatePressings();
  console.log(`📊 Générés: ${pressings.length} pressings\n`);
  
  let inserted = 0;
  let errors = 0;
  let duplicates = 0;
  
  for (const pressing of pressings) {
    try {
      const { error } = await supabase.from('partners').insert(pressing);
      
      if (error) {
        if (error.code === '23505') {
          duplicates++;
          if (duplicates % 100 === 0) {
            console.log(`⏭️  ${duplicates} doublons ignorés...`);
          }
        } else {
          console.error(`❌ ${pressing.name}: ${error.message}`);
          errors++;
        }
      } else {
        inserted++;
        if (inserted % 100 === 0) {
          console.log(`✅ ${inserted} pressings insérés...`);
        }
      }
      
      if (inserted % 500 === 0) {
        await delay(1000); // Pause tous les 500
      }
    } catch (error) {
      console.error(`💥 ${pressing.name}:`, error.message);
      errors++;
    }
  }
  
  console.log('\n🎉 TERMINÉ !');
  console.log(`✅ Insérés: ${inserted}`);
  console.log(`⏭️  Doublons: ${duplicates}`);
  console.log(`❌ Erreurs: ${errors}`);
  console.log(`📊 Total dans la base: ${inserted + 2678} pressings`);
};

main();
