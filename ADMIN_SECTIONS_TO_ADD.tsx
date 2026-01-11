// ============================================
// SECTION À AJOUTER AVANT LA DERNIÈRE BALISE </div></div></div>
// CHERCHE : {activeTab === "users" && (
// AJOUTE CETTE SECTION JUSTE APRÈS LA FERMETURE DE activeTab === "users"
// ============================================

{activeTab === "clients" && (
  <div>
    <h3 className="text-lg font-bold mb-6">👤 Clients inscrits ({clients.length})</h3>
    {clients.length === 0 ? (
      <div className="text-center py-12 text-slate-400">
        <Users size={48} className="mx-auto mb-3 opacity-30" />
        <p className="font-bold">Aucun client inscrit</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-4 px-4 text-sm font-semibold">Email</th>
              <th className="text-left py-4 px-4 text-sm font-semibold">Nom</th>
              <th className="text-left py-4 px-4 text-sm font-semibold">Téléphone</th>
              <th className="text-left py-4 px-4 text-sm font-semibold">Date inscription</th>
              <th className="text-left py-4 px-4 text-sm font-semibold">Commandes</th>
              <th className="text-center py-4 px-4 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-gray-100 hover:bg-slate-50">
                <td className="py-4 px-4">{client.email}</td>
                <td className="py-4 px-4 font-medium">{client.full_name || "N/A"}</td>
                <td className="py-4 px-4">{client.phone || "N/A"}</td>
                <td className="py-4 px-4 text-sm text-slate-500">
                  {new Date(client.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="py-4 px-4">
                  <span className="text-teal-600 font-bold">0</span> commandes
                </td>
                <td className="py-4 px-4 text-center">
                  <button className="text-teal-600 hover:underline text-sm font-medium">
                    Voir détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}

// ============================================
// MODAL DÉTAILS PRESSING
// À AJOUTER TOUT À LA FIN, JUSTE AVANT LES 3 DERNIÈRES BALISES </div>
// CHERCHE : </div></div></div> (les 3 dernières)
// AJOUTE CETTE SECTION JUSTE AVANT
// ============================================

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
        
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 text-teal-600">ℹ️ Informations</h3>
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-gray-600">Nom :</span>
              <p className="text-lg">{selectedPartner.name}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Email :</span>
              <p className="text-lg">{selectedPartner.email}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Téléphone :</span>
              <p className="text-lg">{selectedPartner.phone || "N/A"}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Adresse :</span>
              <p className="text-lg">{selectedPartner.address || "N/A"}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Ville :</span>
              <p className="text-lg">{selectedPartner.city}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-600">SIRET :</span>
              <p className="text-lg font-mono">{selectedPartner.siret || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 text-teal-600">📄 Statut</h3>
          
          <div className="mb-4">
            <span className="font-semibold text-gray-600">Statut :</span>
            <div className="mt-2">
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                selectedPartner.is_active 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedPartner.is_active ? '✅ Actif' : '⏳ En attente'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 md:col-span-2">
          <h3 className="text-xl font-bold mb-4 text-teal-600">📊 Statistiques</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-teal-600">{selectedPartner.totalOrders}</p>
              <p className="text-sm text-gray-600">Commandes</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-teal-600">{selectedPartner.totalRevenue.toFixed(2)}€</p>
              <p className="text-sm text-gray-600">CA généré</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-teal-600">-</p>
              <p className="text-sm text-gray-600">Note moyenne</p>
            </div>
          </div>
        </div>

      </div>

      <div className="flex gap-4 mt-6">
        <button 
          onClick={() => window.location.href = `mailto:${selectedPartner.email}`}
          className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700"
        >
          📧 Envoyer un email
        </button>
        <button 
          onClick={() => setShowModal(false)}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300"
        >
          Fermer
        </button>
      </div>

    </div>
  </div>
)}

