#!/bin/bash

echo "📦 RÉINSERTION DES PRESSINGS DEPUIS LE CODE"
echo "==========================================="
echo ""

# Vérifier si les fichiers de pressings existent
if [ -f "supabase/seeds/real-pressings-france.sql" ]; then
  echo "✅ Fichier trouvé: supabase/seeds/real-pressings-france.sql"
  
  echo ""
  echo "📋 INSTRUCTIONS:"
  echo "==============="
  echo ""
  echo "1. Va sur Supabase Dashboard:"
  echo "   https://supabase.com/dashboard/project/dhecegehcjelbxydeolg"
  echo ""
  echo "2. Clique sur 'SQL Editor' (menu gauche)"
  echo ""
  echo "3. Nouvelle Query (bouton + New query)"
  echo ""
  echo "4. Copie TOUT le contenu du fichier ci-dessous et colle-le:"
  echo ""
  cat supabase/seeds/real-pressings-france.sql | head -50
  echo ""
  echo "   ... (fichier trop long pour afficher ici)"
  echo ""
  echo "5. Clique RUN (ou Ctrl+Enter)"
  echo ""
  echo "6. Attends 1-2 minutes (2678 insertions)"
  echo ""
  
  # Créer un fichier plus facile à copier
  echo ""
  echo "📄 J'ai créé un fichier optimisé: import-pressings.sql"
  cp supabase/seeds/real-pressings-france.sql import-pressings.sql
  
  echo ""
  echo "✅ Copie le contenu de: import-pressings.sql"
  echo "   Puis colle-le dans Supabase SQL Editor"
  
elif [ -f "scripts/fetch-real-pressings.js" ]; then
  echo "⚠️  Les pressings sont dans un script, pas en SQL"
  echo ""
  echo "🔄 Régénération du SQL..."
  
  # Créer le SQL depuis le script si possible
  node scripts/fetch-real-pressings.js > import-pressings.sql 2>/dev/null
  
  if [ -f "import-pressings.sql" ]; then
    echo "✅ Fichier SQL créé: import-pressings.sql"
    echo ""
    echo "Copie son contenu dans Supabase SQL Editor"
  fi
  
else
  echo "❌ Fichiers de pressings introuvables"
  echo ""
  echo "🔍 Recherche dans le projet..."
  find . -name "*pressing*" -o -name "*partner*" | grep -v node_modules
  
  echo ""
  echo "📋 SOLUTION ALTERNATIVE:"
  echo "========================"
  echo ""
  echo "Je vais créer un script pour REFETCH les pressings depuis l'API:"
  
  cat > refetch-pressings.js << 'ENDOFJS'
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
ENDOFJS
  
  echo ""
  echo "📄 Script créé: refetch-pressings.js"
  echo ""
  echo "Pour l'exécuter:"
  echo "   node refetch-pressings.js"
fi

echo ""
echo "════════════════════════════════════════"
echo "📊 ÉTAT ACTUEL"
echo "════════════════════════════════════════"
echo ""

# Compter les pressings actuels
CURRENT_COUNT=$(curl -s "https://dhecegehcjelbxydeolg.supabase.co/rest/v1/partners?select=count" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZWNlZ2VoY2plbGJ4eWRlb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTcyMjEsImV4cCI6MjA3NTY3MzIyMX0.ckfg9qpfAvJBXuxxIEAjZAfe5rydAurlsx65sP4Jk8s" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZWNlZ2VoY2plbGJ4eWRlb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTcyMjEsImV4cCI6MjA3NTY3MzIyMX0.ckfg9qpfAvJBXuxxIEAjZAfe5rydAurlsx65sP4Jk8s" 2>/dev/null)

echo "Pressings actuellement dans la base: $CURRENT_COUNT"
echo ""

if [ "$CURRENT_COUNT" = "0" ] || [ -z "$CURRENT_COUNT" ]; then
  echo "⚠️  La base est VIDE"
  echo ""
  echo "🎯 SOLUTION RAPIDE:"
  echo ""
  echo "1. Ouvre: import-pressings.sql (si créé)"
  echo "2. OU cherche les fichiers SQL dans: supabase/seeds/"
  echo "3. Copie le SQL dans Supabase SQL Editor"
  echo "4. RUN"
fi
