import { Link } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-slate-900 text-white p-2 rounded-xl group-hover:scale-105 transition duration-300">
              <Sparkles size={24} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900">
              Kilo<span className="text-teal-600">lab</span>.
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/trouver" 
              className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
            >
              Commander
            </Link>
            <Link 
              to="/tarifs" 
              className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
            >
              Tarifs
            </Link>
            <Link 
              to="/for-who" 
              className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
            >
              Comment ça marche
            </Link>
            
            {/* CTA PRINCIPAL : DEVENIR WASHER */}
            <Link 
              to="/become-washer" 
              className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              💰 Devenir Washer
            </Link>

            <Link 
              to="/login" 
              className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
            >
              Connexion
            </Link>
          </div>

          {/* MOBILE HAMBURGER */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-slate-900 p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full px-4 py-6 shadow-xl">
          <div className="flex flex-col gap-4">
            <Link 
              to="/trouver" 
              className="text-lg font-bold text-slate-900 py-2" 
              onClick={() => setIsOpen(false)}
            >
              Commander
            </Link>
            <Link 
              to="/tarifs" 
              className="text-lg font-bold text-slate-900 py-2" 
              onClick={() => setIsOpen(false)}
            >
              Tarifs
            </Link>
            <Link 
              to="/for-who" 
              className="text-lg font-bold text-slate-900 py-2" 
              onClick={() => setIsOpen(false)}
            >
              Comment ça marche
            </Link>
            
            {/* CTA WASHER MOBILE */}
            <Link 
              to="/become-washer" 
              className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-3 rounded-full font-bold text-center hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2" 
              onClick={() => setIsOpen(false)}
            >
              💰 Devenir Washer
            </Link>

            <Link 
              to="/login" 
              className="text-sm font-medium text-slate-500 text-center py-2" 
              onClick={() => setIsOpen(false)}
            >
              Connexion
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
