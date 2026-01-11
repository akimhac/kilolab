# ADMIN DASHBOARD - AJOUT ONGLET CLIENTS

Dans src/pages/AdminDashboard.tsx, ajoute un nouvel onglet "Users" :

1. Dans les tabs, ajoute après "Messages" :
   <button onClick={() => setActiveTab('users')}>Users</button>

2. Ajoute cette section dans le JSX (après la section Messages) :
```tsx
{activeTab === 'users' && (
  <div className="bg-white rounded-2xl shadow-xl p-8">
    <h2 className="text-2xl font-bold mb-6">Clients inscrits</h2>
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-gray-200">
          <th className="text-left py-4">Email</th>
          <th className="text-left py-4">Nom</th>
          <th className="text-left py-4">Date inscription</th>
          <th className="text-left py-4">Commandes</th>
        </tr>
      </thead>
      <tbody>
        {users.filter(u => u.role === 'client').map(user => (
          <tr key={user.id} className="border-b border-gray-100">
            <td className="py-4">{user.email}</td>
            <td className="py-4">{user.full_name || 'N/A'}</td>
            <td className="py-4">{new Date(user.created_at).toLocaleDateString()}</td>
            <td className="py-4">
              <button className="text-teal-600 hover:underline">
                Voir les commandes
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
```

3. Dans fetchData(), assure-toi de charger TOUS les users :
   const { data: usersData } = await supabase.from('user_profiles').select('*');
# ADMIN DASHBOARD - AJOUT ONGLET CLIENTS

Dans src/pages/AdminDashboard.tsx, ajoute un nouvel onglet "Users" :

1. Dans les tabs, ajoute après "Messages" :
   <button onClick={() => setActiveTab('users')}>Users</button>

2. Ajoute cette section dans le JSX (après la section Messages) :
```tsx
{activeTab === 'users' && (
  <div className="bg-white rounded-2xl shadow-xl p-8">
    <h2 className="text-2xl font-bold mb-6">Clients inscrits</h2>
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-gray-200">
          <th className="text-left py-4">Email</th>
          <th className="text-left py-4">Nom</th>
          <th className="text-left py-4">Date inscription</th>
          <th className="text-left py-4">Commandes</th>
        </tr>
      </thead>
      <tbody>
        {users.filter(u => u.role === 'client').map(user => (
          <tr key={user.id} className="border-b border-gray-100">
            <td className="py-4">{user.email}</td>
            <td className="py-4">{user.full_name || 'N/A'}</td>
            <td className="py-4">{new Date(user.created_at).toLocaleDateString()}</td>
            <td className="py-4">
              <button className="text-teal-600 hover:underline">
                Voir les commandes
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
```

3. Dans fetchData(), assure-toi de charger TOUS les users :
   const { data: usersData } = await supabase.from('user_profiles').select('*');
# ADMIN DASHBOARD - AJOUT ONGLET CLIENTS

Dans src/pages/AdminDashboard.tsx, ajoute un nouvel onglet "Users" :

1. Dans les tabs, ajoute après "Messages" :
   <button onClick={() => setActiveTab('users')}>Users</button>

2. Ajoute cette section dans le JSX (après la section Messages) :
```tsx
{activeTab === 'users' && (
  <div className="bg-white rounded-2xl shadow-xl p-8">
    <h2 className="text-2xl font-bold mb-6">Clients inscrits</h2>
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-gray-200">
          <th className="text-left py-4">Email</th>
          <th className="text-left py-4">Nom</th>
          <th className="text-left py-4">Date inscription</th>
          <th className="text-left py-4">Commandes</th>
        </tr>
      </thead>
      <tbody>
        {users.filter(u => u.role === 'client').map(user => (
          <tr key={user.id} className="border-b border-gray-100">
            <td className="py-4">{user.email}</td>
            <td className="py-4">{user.full_name || 'N/A'}</td>
            <td className="py-4">{new Date(user.created_at).toLocaleDateString()}</td>
            <td className="py-4">
              <button className="text-teal-600 hover:underline">
                Voir les commandes
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
```

3. Dans fetchData(), assure-toi de charger TOUS les users :
   const { data: usersData } = await supabase.from('user_profiles').select('*');
