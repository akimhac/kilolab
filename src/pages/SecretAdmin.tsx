import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SecretAdmin() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === 'KILOADMIN2025') {
      // On enregistre le "Bypass"
      localStorage.setItem('kilolab_admin_bypass', 'true');
      toast.success("Accès Autorisé !");
      // On force la navigation
      window.location.href = '/admin-dashboard';
    } else {
      toast.error("Code incorrect !");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-slate-800 p-8 rounded-3xl border border-slate-700 text-center shadow-2xl">
        <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32}/>
        </div>
        <h1 className="text-2xl font-bold mb-2">Zone Admin</h1>
        <p className="text-slate-400 mb-6">Accès sécurisé par code.</p>
        
        <input 
            type="password" 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-4 bg-slate-900 border border-slate-600 rounded-xl text-center text-xl font-mono tracking-widest mb-6 focus:border-red-500 outline-none transition text-white"
            placeholder="CODE..."
        />
        
        <button className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg">
            Déverrouiller <ArrowRight/>
        </button>
      </form>
    </div>
  );
}
