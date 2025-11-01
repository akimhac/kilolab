// Script pour récupérer de VRAIS pressing depuis l'API Sirene
const fetch = require('node-fetch');

async function fetchPressings() {
  // Recherche des pressing/blanchisseries en France
  const url = 'https://api.insee.fr/entreprises/sirene/V3/siret';
  
  // Code NAF 9601A = Blanchisserie-teinturerie de détail
  // Code NAF 9601B = Blanchisserie-teinturerie de gros
  
  const params = new URLSearchParams({
    q: 'activitePrincipaleEtablissement:9601A OR activitePrincipaleEtablissement:9601B',
    nombre: 100,
  });

  try {
    const response = await fetch(`${url}?${params}`, {
      headers: {
        'Authorization': 'Bearer VOTRE_CLE_API_INSEE',
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log('Nombre de pressing trouvés:', data.header.total);
    
    // Formater pour Supabase
    const partners = data.etablissements.map(etab => ({
      name: etab.uniteLegale.denominationUniteLegale || 'Pressing',
      address: `${etab.adresseEtablissement.numeroVoieEtablissement} ${etab.adresseEtablissement.typeVoieEtablissement} ${etab.adresseEtablissement.libelleVoieEtablissement}`,
      city: etab.adresseEtablissement.libelleCommuneEtablissement,
      postal_code: etab.adresseEtablissement.codePostalEtablissement,
      lat: etab.adresseEtablissement.coordonneeLambertAbscisseEtablissement, // À convertir
      lon: etab.adresseEtablissement.coordonneeLambertOrdonneeEtablissement,  // À convertir
      is_active: true,
    }));

    console.log(JSON.stringify(partners, null, 2));
  } catch (error) {
    console.error('Erreur:', error);
  }
}

fetchPressings();
