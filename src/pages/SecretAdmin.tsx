import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SecretAdmin() {
  const [code, setCode] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === 'KILOADMIN2025') {
      // On enregistre le pass
      localStorage.setItem('kilolab_admin_bypass', 'true');
      toast.success('Accès autorisé Chef !');
      
      // FIX DU BUG DE REDIRECTION : On force le rechargement pour être sûr
      setTimeout(() => {
        window.location.href = '/admin-dashboard';
      }, 500);
    } else {
      toast.error('Code incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Zone Admin</h1>
        <p className="text-slate-500 mb-6 text-sm">Accès réservé à la direction.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="password" 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white text-center text-xl tracking-widest p-4 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none placeholder-slate-600"
            placeholder="CODE SECRET"
          />
          <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl transition">
            Entrer
          </button>
        </form>
      </div>
    </div>
  );
}
