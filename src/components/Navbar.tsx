import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    // Gestion du scroll pour l'effet de transparence
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Vérifier si connecté
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Design : Fond blanc si scrollé ou si on n'est pas sur l'accueil
  const isHome = location.pathname === '/';
  const navClass = isScrolled || !isHome || isOpen
    ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' 
    : 'bg-transparent py-6';

  const textClass = isScrolled || !isHome || isOpen
    ? 'text-slate-900' 
    : 'text-slate-900 lg:text-white'; // Blanc sur fond sombre (Hero), Noir sinon

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* LOGO */}
          <Link to="/" className={`flex items-center gap-2 font-extrabold text-2xl ${textClass}`}>
            <div className="bg-teal-500 p-1.5 rounded-lg text-white shadow-lg shadow-teal-500/30">
              <Sparkles size={20} fill="currentColor" />
            </div>
            Kilolab
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/trouver" className={`font-medium hover:text-teal-500 transition ${textClass}`}>
              Trouver un pressing
            </Link>
            <Link to="/tarifs" className={`font-medium hover:text-teal-500 transition ${textClass}`}>
              Tarifs
            </Link>
            <Link to="/partner" className={`font-medium hover:text-teal-500 transition ${textClass}`}>
              Espace Pro <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full ml-1">B2B</span>
            </Link>

            {user ? (
              <Link to="/dashboard" className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition">
                <User size={18} /> Mon Espace
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className={`font-bold hover:text-teal-500 transition ${textClass}`}>
                  Connexion
                </Link>
                <Link to="/signup" className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-full font-bold transition shadow-lg shadow-teal-500/20 hover:scale-105">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden ${textClass}`}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl py-6 px-4 flex flex-col gap-4">
          <Link to="/trouver" className="text-lg font-medium text-slate-900 py-2 border-b border-slate-50">Trouver un pressing</Link>
          <Link to="/tarifs" className="text-lg font-medium text-slate-900 py-2 border-b border-slate-50">Tarifs</Link>
          <Link to="/partner" className="text-lg font-medium text-teal-600 py-2 border-b border-slate-50">Devenir Partenaire</Link>
          
          {user ? (
             <Link to="/dashboard" className="w-full text-center py-3 bg-slate-900 text-white rounded-xl font-bold">Mon Espace</Link>
          ) : (
             <>
               <Link to="/login" className="w-full text-center py-3 border border-slate-200 text-slate-900 rounded-xl font-bold">Connexion</Link>
               <Link to="/signup" className="w-full text-center py-3 bg-teal-500 text-slate-900 rounded-xl font-bold">S'inscrire</Link>
             </>
          )}
        </div>
      )}
    </nav>
  );
}
