import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // On cache la navbar sur certaines pages si nécessaire, sinon on laisse tout le temps
  const isDashboard = location.pathname.includes('/dashboard') || location.pathname.includes('/partner-app');

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              K
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-900">Kilolab<span className="text-teal-500">.</span></span>
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/new-order" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
              Trouver un pressing
            </Link>
            <Link to="/tarifs" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
              Tarifs
            </Link>
            
            {/* --- C'EST ICI QUE C'ÉTAIT L'ERREUR --- */}
            {/* Avant c'était peut-être /partner-app, maintenant c'est /partner */}
            <Link to="/partner" className="text-sm font-bold text-teal-600 bg-teal-50 px-4 py-2 rounded-full hover:bg-teal-100 transition-colors">
              Espace Pro B2B
            </Link>

            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            <Link to="/login" className="text-sm font-bold text-slate-900 hover:text-teal-600 transition-colors">
              Connexion
            </Link>
            <Link 
              to="/new-order" 
              className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Nouvelle Commande
            </Link>
          </div>

          {/* BOUTON MOBILE */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-2xl animate-fade-in-down">
          <div className="px-4 py-6 space-y-4 flex flex-col">
            <Link to="/new-order" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-600 py-2">
              Trouver un pressing
            </Link>
            <Link to="/tarifs" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-600 py-2">
              Tarifs
            </Link>
            <Link to="/partner" onClick={() => setIsOpen(false)} className="text-lg font-bold text-teal-600 py-2">
              Devenir Partenaire
            </Link>
            <hr className="border-slate-100"/>
            <Link to="/login" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-900 py-2">
              Se connecter
            </Link>
            <Link to="/new-order" onClick={() => setIsOpen(false)} className="bg-slate-900 text-white text-center py-4 rounded-xl font-bold text-lg shadow-lg">
              Commander
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
