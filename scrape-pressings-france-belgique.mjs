import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dhecegehcjelbxydeolg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZWNlZ2VoY2plbGJ4eWRlb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTcyMjEsImV4cCI6MjA3NTY3MzIyMX0.ckfg9qpfAvJBXuxxIEAjZAfe5rydAurlsx65sP4Jk8s'
);

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

const scrapeLePressing = async () => {
  console.log('🔄 Scraping le-epressing.fr...');
  const pressings = [];
  
  const villes = [
    'paris', 'marseille', 'lyon', 'toulouse', 'nice', 
    'nantes', 'montpellier', 'strasbourg', 'bordeaux', 'lille'
  ];
  
  for (const ville of villes) {
    console.log(`  📍 ${ville}...`);
    
    try {
      const url = `https://www.le-epressing.fr/r/${ville}`;
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });
      
      const $ = cheerio.load(data);
      
      $('.listing-item, .establishment-card, article, .etablissement').each((i, element) => {
        const name = $(element).find('.title, h2, h3, .name, .nom').first().text().trim();
        const address = $(element).find('.address, .location, .adresse').text().trim();
        const phone = $(element).find('.phone, .tel, .telephone').text().trim();
        
        if (name && address && name.length > 3) {
          pressings.push({
            name: name,
            address: address,
            city: ville.charAt(0).toUpperCase() + ville.slice(1),
            phone: phone || null,
            source: 'le-epressing.fr'
          });
        }
      });
      
      await delay(2000);
    } catch (error) {
      console.error(`  ❌ ${ville}:`, error.message);
    }
  }
  
  return pressings;
};

const scrapePressingBelgique = async () => {
  console.log('🔄 Scraping pressingbelgique.com...');
  const pressings = [];
  
  const provinces = [
    'province-de-hainaut',
    'province-de-liege',
    'region-bruxelles-capitale'
  ];
  
  for (const province of provinces) {
    console.log(`  �� ${province}...`);
    
    try {
      const url = `https://pressingbelgique.com/r/${province}`;
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });
      
      const $ = cheerio.load(data);
      
      $('.etablissement, .listing-item, article').each((i, element) => {
        const name = $(element).find('.nom, .title, h2, h3').first().text().trim();
        const address = $(element).find('.adresse, .address').text().trim();
        const phone = $(element).find('.telephone, .phone').text().trim();
        const city = $(element).find('.ville, .city').text().trim();
        
        if (name && name.length > 3) {
          pressings.push({
            name: name,
            address: address || city,
            city: city || province.replace('province-de-', '').replace('-', ' '),
            phone: phone || null,
            source: 'pressingbelgique.com'
          });
        }
      });
      
      await delay(2000);
    } catch (error) {
      console.error(`  ❌ ${province}:`, error.message);
    }
  }
  
  return pressings;
};

const main = async () => {
  console.log('🚀 Scraping pressings France & Belgique\n');
  
  const pressingsFr = await scrapeLePressing();
  const pressingsBe = await scrapePressingBelgique();
  
  const allPressings = [...pressingsFr, ...pressingsBe];
  console.log(`\n📊 Scrapé: ${allPressings.length} pressings`);
  
  let inserted = 0;
  let errors = 0;
  
  for (const pressing of allPressings.slice(0, 20)) { // Limité à 20 pour test
    try {
      const fullAddress = `${pressing.address}, ${pressing.city}, ${pressing.source.includes('belgique') ? 'Belgique' : 'France'}`;
      console.log(`📍 ${pressing.name} - ${fullAddress}`);
      
      const coords = await geocode(fullAddress);
      
      if (!coords) {
        console.log(`  ⚠️ Pas de coordonnées`);
        errors++;
        await delay(1000);
        continue;
      }
      
      const { error } = await supabase.from('partners').insert({
        name: pressing.name,
        address: pressing.address,
        city: pressing.city,
        phone: pressing.phone,
        lat: coords.lat,
        lon: coords.lon,
        is_active: true
      });
      
      if (error) {
        if (error.code !== '23505') {
          console.error(`  ❌ ${error.message}`);
          errors++;
        } else {
          console.log(`  ⏭️ Déjà existant`);
        }
      } else {
        inserted++;
        console.log(`  ✅ Inséré`);
      }
      
      await delay(1500);
    } catch (error) {
      console.error(`  💥 ${error.message}`);
      errors++;
    }
  }
  
  console.log('\n✅ Terminé !');
  console.log(`Insérés: ${inserted}, Erreurs: ${errors}`);
};

main();
