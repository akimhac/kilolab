import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, LayoutDashboard, Shirt, ChevronDown, Settings } from "lucide-react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

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
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-100 h-20 transition-all">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-teal-500 text-white p-2.5 rounded-xl shadow-lg shadow-teal-200 group-hover:scale-105 transition">
            <Shirt size={24} strokeWidth={3} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">
            Kilolab<span className="text-teal-500">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/trouver" className="hidden md:block font-bold text-slate-600 hover:text-teal-600 transition text-sm">Trouver un pressing</Link>
          <Link to="/tarifs" className="hidden md:block font-bold text-slate-600 hover:text-teal-600 transition text-sm">Tarifs</Link>
          <Link to="/partner" className="hidden md:block bg-teal-50 text-teal-700 px-4 py-2 rounded-full font-bold hover:bg-teal-100 transition border border-teal-100 text-sm">Vous êtes un pressing ?</Link>

          {user ? (
            <div className="relative pl-4 border-l border-slate-200" ref={menuRef}>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-xl transition"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-400 font-bold uppercase">Mon compte</p>
                  <p className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{user.email}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white shadow-md">
                  <User size={20} />
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${showMenu ? "rotate-180" : ""}`} />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400 font-bold uppercase">Compte</p>
                    <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
                  </div>
                  
                  <Link 
                    to={user.user_metadata?.role === 'admin' ? "/admin" : "/dashboard"}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-slate-700 font-medium"
                    onClick={() => setShowMenu(false)}
                  >
                    <LayoutDashboard size={18} className="text-teal-600" />
                    Tableau de bord
                  </Link>
                  
                  <Link 
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-slate-700 font-medium"
                    onClick={() => setShowMenu(false)}
                  >
                    <Settings size={18} className="text-slate-600" />
                    Paramètres
                  </Link>
                  
                  <div className="h-px bg-slate-100 my-1"></div>
                  
                  <button 
                    onClick={() => {
                      setShowMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-red-600 font-medium"
                  >
                    <LogOut size={18} />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <Link to="/login" className="font-bold text-slate-900 hover:text-teal-600 transition text-sm">Connexion</Link>
              <Link to="/login" className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200 text-sm">S'inscrire</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
