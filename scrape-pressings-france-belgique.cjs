const axios = require('axios');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://dhecegehcjelbxydeolg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZWNlZ2VoY2plbGJ4eWRlb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTcyMjEsImV4cCI6MjA3NTY3MzIyMX0.ckfg9qpfAvJBXuxxIEAjZAfe5rydAurlsx65sP4Jk8s'
);

// API Geocoding gratuite
const geocode = async (address) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1,
        countrycodes: 'fr,be'
      },
      headers: {
        'User-Agent': 'Kilolab/1.0'
      }
    });
    
    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return null;
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Scraper le-epressing.fr
const scrapeLePressing = async () => {
  console.log('🔄 Scraping le-epressing.fr...');
  const pressings = [];
  
  try {
    // Liste des grandes villes françaises
    const villes = [
      'paris', 'marseille', 'lyon', 'toulouse', 'nice', 
      'nantes', 'montpellier', 'strasbourg', 'bordeaux', 'lille',
      'rennes', 'reims', 'saint-etienne', 'toulon', 'grenoble',
      'dijon', 'angers', 'nimes', 'villeurbanne', 'clermont-ferrand'
    ];
    
    for (const ville of villes) {
      console.log(`  📍 ${ville}...`);
      
      try {
        const url = `https://www.le-epressing.fr/r/${ville}`;
        const { data } = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        const $ = cheerio.load(data);
        
        $('.listing-item, .establishment-card, article').each((i, element) => {
          const name = $(element).find('.title, h2, h3, .name').first().text().trim();
          const address = $(element).find('.address, .location').text().trim();
          const phone = $(element).find('.phone, .tel').text().trim();
          
          if (name && address) {
            pressings.push({
              name: name,
              address: address,
              city: ville.charAt(0).toUpperCase() + ville.slice(1),
              phone: phone || null,
              source: 'le-epressing.fr'
            });
          }
        });
        
        await delay(2000); // Respect du serveur
      } catch (error) {
        console.error(`  ❌ Erreur ${ville}:`, error.message);
      }
    }
  } catch (error) {
    console.error('❌ Erreur le-epressing.fr:', error.message);
  }
  
  return pressings;
};

// Scraper pressingbelgique.com
const scrapePressingBelgique = async () => {
  console.log('�� Scraping pressingbelgique.com...');
  const pressings = [];
  
  try {
    const provinces = [
      'province-de-hainaut',
      'province-de-liege',
      'province-du-brabant-wallon',
      'province-de-namur',
      'province-du-luxembourg',
      'region-bruxelles-capitale'
    ];
    
    for (const province of provinces) {
      console.log(`  📍 ${province}...`);
      
      try {
        const url = `https://pressingbelgique.com/r/${province}`;
        const { data } = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        const $ = cheerio.load(data);
        
        $('.etablissement, .listing-item, article').each((i, element) => {
          const name = $(element).find('.nom, .title, h2, h3').first().text().trim();
          const address = $(element).find('.adresse, .address').text().trim();
          const phone = $(element).find('.telephone, .phone').text().trim();
          const city = $(element).find('.ville, .city').text().trim();
          
          if (name && (address || city)) {
            pressings.push({
              name: name,
              address: address || '',
              city: city || province,
              phone: phone || null,
              source: 'pressingbelgique.com'
            });
          }
        });
        
        await delay(2000);
      } catch (error) {
        console.error(`  ❌ Erreur ${province}:`, error.message);
      }
    }
  } catch (error) {
    console.error('❌ Erreur pressingbelgique.com:', error.message);
  }
  
  return pressings;
};

// Fonction principale
const main = async () => {
  console.log('🚀 Démarrage du scraping...\n');
  
  // Scraping
  const pressingsFr = await scrapeLePressing();
  const pressingsBe = await scrapePressingBelgique();
  
  const allPressings = [...pressingsFr, ...pressingsBe];
  console.log(`\n📊 Total scrapé: ${allPressings.length} pressings`);
  
  // Geocoding et insertion
  let inserted = 0;
  let errors = 0;
  
  for (const pressing of allPressings) {
    try {
      // Géocoder
      const fullAddress = `${pressing.address}, ${pressing.city}`;
      console.log(`📍 Geocoding: ${pressing.name} - ${fullAddress}`);
      
      const coords = await geocode(fullAddress);
      
      if (!coords) {
        console.log(`  ⚠️ Pas de coordonnées pour ${pressing.name}`);
        errors++;
        await delay(1000);
        continue;
      }
      
      // Insérer dans Supabase
      const { error } = await supabase.from('partners').insert({
        name: pressing.name,
        address: pressing.address,
        city: pressing.city,
        phone: pressing.phone,
        lat: coords.lat,
        lon: coords.lon,
        is_active: true,
        email: null
      });
      
      if (error) {
        if (error.code !== '23505') { // Ignore duplicates
          console.error(`  ❌ Erreur insertion:`, error.message);
          errors++;
        }
      } else {
        inserted++;
        console.log(`  ✅ Inséré: ${pressing.name}`);
      }
      
      await delay(1500); // Rate limiting Nominatim
    } catch (error) {
      console.error(`  💥 Erreur:`, error.message);
      errors++;
    }
  }
  
  console.log('\n🎉 TERMINÉ !');
  console.log(`✅ Insérés: ${inserted}`);
  console.log(`❌ Erreurs: ${errors}`);
};

main();
