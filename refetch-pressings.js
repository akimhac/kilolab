const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://dhecegehcjelbxydeolg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZWNlZ2VoY2plbGJ4eWRlb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTcyMjEsImV4cCI6MjA3NTY3MzIyMX0.ckfg9qpfAvJBXuxxIEAjZAfe5rydAurlsx65sP4Jk8s'
);

// Liste de 100 pressings réels (échantillon)
const pressings = [
  { business_name: "Pressing du Centre", address: "15 Rue de la République", city: "Paris", postal_code: "75001", latitude: 48.8566, longitude: 2.3522 },
  { business_name: "Clean Express", address: "23 Avenue des Champs", city: "Lyon", postal_code: "69001", latitude: 45.7640, longitude: 4.8357 },
  // ... ajouter plus
];

async function insertPressings() {
  console.log('Insertion de', pressings.length, 'pressings...');
  
  const { data, error } = await supabase
    .from('partners')
    .insert(pressings);
  
  if (error) {
    console.error('Erreur:', error);
  } else {
    console.log('✅ Insertions réussies !');
  }
}

insertPressings();
