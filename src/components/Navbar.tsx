import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { User, LogOut, LayoutDashboard, Shirt, Settings, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  // Ferme le menu si clic dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <Link to="/trouver" className="hidden md:block font-bold text-slate-600 hover:text-teal-600 transition">
            Trouver un pressing
          </Link>
          <Link to="/tarifs" className="hidden md:block font-bold text-slate-600 hover:text-teal-600 transition">
            Tarifs
          </Link>

          <Link 
            to="/partner" 
            className="hidden md:block bg-teal-50 text-teal-700 px-4 py-2 rounded-full font-bold hover:bg-teal-100 transition border border-teal-100"
          >
            Vous êtes un pressing ?
          </Link>

          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              <Link 
                to={user.user_metadata?.role === 'admin' ? "/admin/dashboard" : "/dashboard"}
                className="hidden sm:flex items-center gap-2 font-bold text-slate-900 hover:text-teal-600 transition"
              >
                <LayoutDashboard size={20} />
                <span>Mon Espace</span>
              </Link>
              
              {/* MENU DÉROULANT */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
                >
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-teal-600" />
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${showMenu ? "rotate-180" : ""}`} />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-bold uppercase">Compte</p>
                      <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
                    </div>
                    
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition text-slate-700"
                      onClick={() => setShowMenu(false)}
                    >
                      <Settings size={16} />
                      <span className="text-sm font-medium">Paramètres</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition text-red-600"
                    >
                      <LogOut size={16} />
                      <span className="text-sm font-medium">Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <Link to="/login" className="font-bold text-slate-900 hover:text-teal-600 transition">
                Connexion
              </Link>
              <Link 
                to="/login" 
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
