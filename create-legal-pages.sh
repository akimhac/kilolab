#!/bin/bash

echo "📄 Création des pages légales..."

mkdir -p src/pages/legal

# CGU
cat > src/pages/legal/CGU.tsx << 'CGUFILE'
export default function CGU() {
  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-4xl mx-auto prose prose-slate">
        <h1 className="text-4xl font-bold mb-8">Conditions Générales d'Utilisation</h1>
        
        <h2>1. Objet</h2>
        <p>
          Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation 
          de la plateforme Kilolab, accessible à l'adresse kilolab.fr
        </p>

        <h2>2. Définitions</h2>
        <ul>
          <li><strong>Plateforme :</strong> Site web Kilolab</li>
          <li><strong>Utilisateur :</strong> Toute personne utilisant la plateforme</li>
          <li><strong>Partenaire :</strong> Pressing inscrit sur la plateforme</li>
        </ul>

        <h2>3. Services proposés</h2>
        <p>
          Kilolab est une plateforme mettant en relation les clients et les pressings partenaires.
        </p>

        <h2>4. Responsabilités</h2>
        <p>
          Kilolab agit en tant qu'intermédiaire. Les prestations de nettoyage sont 
          effectuées par les pressings partenaires.
        </p>

        <h2>5. Prix</h2>
        <p>
          Les prix sont fixés librement par chaque pressing partenaire.
        </p>

        <h2>6. Données personnelles</h2>
        <p>
          Voir notre <a href="/legal/privacy">Politique de confidentialité</a>
        </p>

        <p className="text-sm text-gray-500 mt-12">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>
      </div>
    </div>
  );
}
CGUFILE

# Mentions légales
cat > src/pages/legal/MentionsLegales.tsx << 'MLFILE'
export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-4xl mx-auto prose prose-slate">
        <h1 className="text-4xl font-bold mb-8">Mentions Légales</h1>
        
        <h2>Éditeur du site</h2>
        <p>
          <strong>Raison sociale :</strong> [VOTRE SASU]<br />
          <strong>Siège social :</strong> [ADRESSE]<br />
          <strong>SIRET :</strong> [NUMERO]<br />
          <strong>Email :</strong> contact@kilolab.fr<br />
          <strong>Directeur de publication :</strong> [VOTRE NOM]
        </p>

        <h2>Hébergement</h2>
        <p>
          <strong>Vercel Inc.</strong><br />
          340 S Lemon Ave #4133<br />
          Walnut, CA 91789<br />
          États-Unis
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          Le site et son contenu sont la propriété de [VOTRE SASU]. 
          Toute reproduction est interdite sans autorisation.
        </p>
      </div>
    </div>
  );
}
MLFILE

echo "✅ Pages légales créées dans src/pages/legal/"
ENDOFFILE
