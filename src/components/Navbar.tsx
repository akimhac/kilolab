import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { User, LogOut, Settings, LayoutDashboard, Shirt, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    setShowMenu(false);
  };

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 h-20">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-teal-600 text-white p-2.5 rounded-xl shadow-lg shadow-teal-200 group-hover:scale-105 transition">
            <Shirt size={24} strokeWidth={3} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-gray-900">
            Kilolab<span className="text-teal-600">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/trouver" className="hidden md:block font-bold text-gray-600 hover:text-teal-600 transition text-sm">
            Trouver un pressing
          </Link>
          <Link to="/tarifs" className="hidden md:block font-bold text-gray-600 hover:text-teal-600 transition text-sm">
            Tarifs
          </Link>
          <Link to="/partner" className="hidden md:block bg-teal-50 text-teal-700 px-4 py-2 rounded-full font-bold hover:bg-teal-100 transition border border-teal-100 text-sm">
            Vous êtes un pressing ?
          </Link>

          {user ? (
            <div className="relative pl-4 border-l border-gray-200" ref={menuRef}>
              <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-400 font-bold uppercase">Mon compte</p>
                  <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{user.email?.split('@')[0]}</p>
                </div>
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-md">
                  <User size={20} />
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Compte Kilolab</p>
                  </div>
                  
                  <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-gray-700 font-medium" onClick={() => setShowMenu(false)}>
                    <LayoutDashboard size={18} className="text-teal-600" />
                    Tableau de bord
                  </Link>
                  
                  <Link to="/user-profile" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-gray-700 font-medium" onClick={() => setShowMenu(false)}>
                    <Settings size={18} className="text-teal-600" />
                    Profil
                  </Link>
                  
                  <div className="h-px bg-gray-100 my-1"></div>
                  
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-red-600 font-medium text-left">
                    <LogOut size={18} />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <Link to="/select-dashboard" className="font-bold text-gray-900 hover:text-teal-600 transition text-sm">
                Connexion
              </Link>
              <Link to="/select-signup" className="bg-gray-900 text-white px-5 py-2.5 rounded-full font-bold hover:bg-gray-800 transition shadow-lg shadow-gray-200 text-sm">
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
