# DASHBOARD ADMIN - FONCTIONNALITÉS AVANCÉES

## Fonctionnalités à ajouter :

### 1. Vue détaillée du pressing
Quand tu cliques sur un pressing, afficher une modal avec :
- ✅ Toutes les infos (nom, email, téléphone, adresse, SIRET)
- ✅ Documents joints (KBIS, RIB, etc.)
- ✅ Statut de vérification
- ✅ Historique des actions

### 2. Gestion des documents
- Afficher les documents uploadés
- Télécharger les documents
- Valider/Rejeter chaque document

### 3. Analytics avancées
- Nombre de commandes par pressing
- CA généré par pressing
- Taux de satisfaction
- Graphiques de performance

### 4. Actions en masse
- Valider plusieurs pressings d'un coup
- Envoyer un email groupé
- Exporter les données en CSV

### 5. Logs d'activité
- Qui a validé quel pressing
- Quand
- Modifications apportées

## Code à ajouter dans AdminDashboard.tsx :
```tsx
// Modal détails pressing
const [selectedPartner, setSelectedPartner] = useState<any>(null);
const [showModal, setShowModal] = useState(false);

// Dans le JSX, remplacer la ligne simple par :
<tr onClick={() => { setSelectedPartner(partner); setShowModal(true); }}>
  {/* Contenu de la ligne */}
</tr>

// Ajouter la modal à la fin :
{showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">Détails du pressing</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold mb-2">Informations</h3>
          <p><strong>Nom :</strong> {selectedPartner.business_name}</p>
          <p><strong>Email :</strong> {selectedPartner.email}</p>
          <p><strong>Téléphone :</strong> {selectedPartner.phone}</p>
          <p><strong>Ville :</strong> {selectedPartner.city}</p>
          <p><strong>SIRET :</strong> {selectedPartner.siret}</p>
        </div>
        
        <div>
          <h3 className="font-bold mb-2">Documents</h3>
          {selectedPartner.documents?.map((doc: any) => (
            <div key={doc.id} className="flex items-center justify-between mb-2">
              <span>{doc.name}</span>
              <a href={doc.url} download className="text-teal-600">Télécharger</a>
            </div>
          ))}
        </div>
      </div>
      
      <button onClick={() => setShowModal(false)} className="mt-6 bg-gray-200 px-6 py-2 rounded-xl">
        Fermer
      </button>
    </div>
  </div>
)}
```
