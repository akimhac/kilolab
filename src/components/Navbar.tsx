import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { User, LogOut, LayoutDashboard, Shirt } from "lucide-react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 h-20">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-teal-500 text-white p-2 rounded-lg">
            <Shirt size={24} strokeWidth={3} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">
            Kilolab<span className="text-teal-500">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/trouver-pressing" className="hidden md:block font-bold text-slate-600 hover:text-teal-600 transition">
            Trouver un pressing
          </Link>
          <Link to="/tarifs" className="hidden md:block font-bold text-slate-600 hover:text-teal-600 transition">
            Tarifs
          </Link>

          <Link 
            to="/pro" 
            className="hidden md:block bg-teal-50 text-teal-700 px-4 py-2 rounded-full font-bold hover:bg-teal-100 transition border border-teal-100"
          >
            Vous êtes un pressing ?
          </Link>

          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              <Link 
                to={user.user_metadata?.role === 'admin' ? "/admin/dashboard" : "/dashboard"}
                className="flex items-center gap-2 font-bold text-slate-900 hover:text-teal-600 transition"
              >
                <LayoutDashboard size={20} />
                <span className="hidden sm:inline">Mon Espace</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-500 transition"
                title="Déconnexion"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <Link to="/login" className="font-bold text-slate-900 hover:text-teal-600 transition">
                Connexion
              </Link>
              <Link 
                to="/register" 
                className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200"
              >
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
