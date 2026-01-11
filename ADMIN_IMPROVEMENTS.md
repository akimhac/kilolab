# ADMIN DASHBOARD - AMÉLIORATIONS

## Problème 1 : Clients invisibles

### Solution rapide :

Dans `src/pages/AdminDashboard.tsx`, modifie la fonction `fetchData()` :
```typescript
// AVANT (charge uniquement les partners)
const { data: partnersData } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('role', 'partner');

// APRÈS (charge tous les users)
const { data: usersData } = await supabase
  .from('user_profiles')
  .select('*');

// Ensuite sépare par rôle
const partners = usersData?.filter(u => u.role === 'partner') || [];
const clients = usersData?.filter(u => u.role === 'client') || [];

setUsers(usersData || []);
setPartners(partners);
// Ajoute un state pour les clients si besoin
```

### Ajouter un onglet "Clients" :

1. Ajoute ce state :
```typescript
const [activeTab, setActiveTab] = useState('overview');
```

2. Ajoute un bouton dans les tabs :
```tsx
<button 
  onClick={() => setActiveTab('clients')}
  className={activeTab === 'clients' ? 'active' : ''}
>
  Clients ({clients.length})
</button>
```

3. Ajoute la section clients :
```tsx
{activeTab === 'clients' && (
  <div className="bg-white rounded-2xl shadow-xl p-8">
    <h2 className="text-2xl font-bold mb-6">👤 Clients inscrits</h2>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-4 px-4">Email</th>
            <th className="text-left py-4 px-4">Nom</th>
            <th className="text-left py-4 px-4">Date inscription</th>
            <th className="text-left py-4 px-4">Commandes</th>
            <th className="text-center py-4 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-4 px-4">{client.email}</td>
              <td className="py-4 px-4">{client.full_name || 'N/A'}</td>
              <td className="py-4 px-4">
                {new Date(client.created_at).toLocaleDateString('fr-FR')}
              </td>
              <td className="py-4 px-4">
                <span className="text-teal-600 font-bold">0</span> commandes
              </td>
              <td className="py-4 px-4 text-center">
                <button className="text-teal-600 hover:underline">
                  Voir détails
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
```

## Problème 4 : Dashboard basique

### Améliorations à ajouter :

#### 1. Modal détails pressing
```typescript
const [selectedPartner, setSelectedPartner] = useState<any>(null);
const [showModal, setShowModal] = useState(false);

// Quand tu cliques sur une ligne
<tr 
  onClick={() => {
    setSelectedPartner(partner);
    setShowModal(true);
  }}
  className="cursor-pointer hover:bg-gray-50"
>

// Modal à ajouter
{showModal && selectedPartner && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">📋 Détails du pressing</h2>
        <button 
          onClick={() => setShowModal(false)}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Informations générales */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 text-teal-600">ℹ️ Informations</h3>
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-gray-600">Nom :</span>
              <p className="text-lg">{selectedPartner.business_name}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Email :</span>
              <p className="text-lg">{selectedPartner.email}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Téléphone :</span>
              <p className="text-lg">{selectedPartner.phone}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Adresse :</span>
              <p className="text-lg">{selectedPartner.address}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Ville :</span>
              <p className="text-lg">{selectedPartner.city}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-600">SIRET :</span>
              <p className="text-lg font-mono">{selectedPartner.siret}</p>
            </div>
          </div>
        </div>

        {/* Statut et documents */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 text-teal-600">📄 Statut & Documents</h3>
          
          <div className="mb-4">
            <span className="font-semibold text-gray-600">Statut :</span>
            <div className="mt-2">
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                selectedPartner.status === 'approved' 
                  ? 'bg-green-100 text-green-800'
                  : selectedPartner.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedPartner.status === 'approved' ? '✅ Actif' : 
                 selectedPartner.status === 'pending' ? '⏳ En attente' : '❌ Rejeté'}
              </span>
            </div>
          </div>

          <div>
            <span className="font-semibold text-gray-600">Documents :</span>
            <div className="mt-2 space-y-2">
              {/* Liste des documents - À adapter selon ta structure */}
              <div className="bg-white p-3 rounded-lg flex justify-between items-center">
                <span>📄 KBIS</span>
                <button className="text-teal-600 hover:underline text-sm">
                  Télécharger
                </button>
              </div>
              <div className="bg-white p-3 rounded-lg flex justify-between items-center">
                <span>🏦 RIB</span>
                <button className="text-teal-600 hover:underline text-sm">
                  Télécharger
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-gray-50 rounded-xl p-6 md:col-span-2">
          <h3 className="text-xl font-bold mb-4 text-teal-600">📊 Statistiques</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-teal-600">0</p>
              <p className="text-sm text-gray-600">Commandes</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-teal-600">0.00€</p>
              <p className="text-sm text-gray-600">CA généré</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-teal-600">-</p>
              <p className="text-sm text-gray-600">Note moyenne</p>
            </div>
          </div>
        </div>

      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        <button 
          onClick={() => {/* Envoyer email */}}
          className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700"
        >
          📧 Envoyer un email
        </button>
        <button 
          onClick={() => {/* Voir commandes */}}
          className="flex-1 bg-cyan-600 text-white py-3 rounded-xl font-bold hover:bg-cyan-700"
        >
          📦 Voir les commandes
        </button>
      </div>

    </div>
  </div>
)}
```

#### 2. Recherche avancée
```typescript
const [searchTerm, setSearchTerm] = useState('');

const filteredPartners = partners.filter(p => 
  p.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  p.city?.toLowerCase().includes(searchTerm.toLowerCase())
);
```

