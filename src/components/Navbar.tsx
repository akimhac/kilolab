import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-105 transition transform">K</div>
            <span className="font-black text-2xl tracking-tight text-slate-900">Kilolab<span className="text-teal-500">.</span></span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/trouver" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition">Trouver un pressing</Link>
            <Link to="/tarifs" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition">Tarifs</Link>
            <Link to="/partner" className="text-sm font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full hover:bg-teal-100 transition">Espace Pro B2B</Link>
            
            <div className="h-6 w-px bg-slate-200"></div>
            
            <Link to="/login" className="text-sm font-bold text-slate-900 hover:text-teal-600 transition">Connexion</Link>
            <Link to="/new-order" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition shadow-lg shadow-slate-900/20 transform hover:-translate-y-0.5">
              Nouvelle Commande
            </Link>
          </div>

          {/* MOBILE BUTTON */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full h-screen pb-20 overflow-y-auto">
          <div className="px-4 pt-8 pb-4 space-y-6">
            <Link to="/new-order" onClick={() => setIsOpen(false)} className="block w-full text-center bg-teal-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg">
              Commander maintenant
            </Link>
            
            <div className="space-y-4 pt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Navigation</p>
                <Link to="/trouver" onClick={() => setIsOpen(false)} className="block text-lg font-bold text-slate-800">Trouver un pressing</Link>
                <Link to="/tarifs" onClick={() => setIsOpen(false)} className="block text-lg font-bold text-slate-800">Nos Tarifs</Link>
                <Link to="/partner" onClick={() => setIsOpen(false)} className="block text-lg font-bold text-teal-600">Devenir Partenaire Pro</Link>
            </div>

            <div className="space-y-4 pt-8 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mon Compte</p>
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-bold text-slate-800">
                    <User size={20}/> Accéder à mon espace
                </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
