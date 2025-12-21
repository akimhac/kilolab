import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO */}
          <Link to="/" className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-2">
            KILOLAB<span className="w-2 h-2 rounded-full bg-teal-500"></span>
          </Link>

          {/* MENU ORDI */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/trouver" className="text-slate-600 font-bold hover:text-teal-600 transition">Trouver un pressing</Link>
            <Link to="/partner" className="text-slate-600 font-bold hover:text-teal-600 transition">Devenir Partenaire</Link>
            <Link to="/login" className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 flex items-center gap-2">
              <User size={18} /> Mon Espace
            </Link>
          </div>

          {/* BOUTON MOBILE */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-2 text-slate-900 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE DÉROULANT */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full left-0 top-20 shadow-xl animate-in slide-in-from-top-5">
          <div className="px-4 py-6 space-y-4 flex flex-col">
            <Link onClick={() => setIsOpen(false)} to="/trouver" className="text-lg font-bold text-slate-900 py-2 border-b border-slate-50">
              Trouver un pressing
            </Link>
            <Link onClick={() => setIsOpen(false)} to="/partner" className="text-lg font-bold text-slate-900 py-2 border-b border-slate-50">
              Devenir Partenaire
            </Link>
            <Link onClick={() => setIsOpen(false)} to="/login" className="text-lg font-bold text-teal-600 py-2 flex items-center gap-2">
              <User size={20}/> Accéder à mon compte
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
