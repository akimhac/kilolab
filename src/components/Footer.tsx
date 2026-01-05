import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Instagram, MessageCircle, MapPin } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate(); // 👈 Indispensable pour la redirection

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">
        
        {/* Colonne 1 : Logo + Description + Réseaux sociaux */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-teal-500 rounded-lg"></div>
            <span className="text-2xl font-bold text-white">Kilolab</span>
          </div>
          <p className="text-sm leading-relaxed mb-6">
            Le pressing au kilo, simple et transparent.
          </p>
          <div className="flex gap-4">
            <a 
              href="https://instagram.com/kilolab.fr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-teal-500 transition"
              aria-label="Instagram"
            >
              <Instagram size={20}/>
            </a>
            <a 
              href="https://facebook.com/kilolab.fr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-teal-500 transition"
              aria-label="Facebook"
            >
              <Facebook size={20}/>
            </a>
          </div>
        </div>

        {/* Colonne 2 : Liens */}
        <div>
          <h3 className="text-white font-bold mb-6">Liens</h3>
          <ul className="space-y-4 text-sm">
            <li><Link to="/" className="hover:text-white transition">Accueil</Link></li>
            <li><Link to="/tarifs" className="hover:text-white transition">Tarifs</Link></li>
            <li><Link to="/trouver" className="hover:text-white transition">Trouver un pressing</Link></li>
            <li><Link to="/partner" className="hover:text-white transition">Espace Pro</Link></li>
            <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
          </ul>
        </div>

        {/* Colonne 3 : Légal */}
        <div>
          <h3 className="text-white font-bold mb-6">Légal</h3>
          <ul className="space-y-4 text-sm">
            <li><Link to="/cgu" className="hover:text-white transition">CGU</Link></li>
            <li><Link to="/cgv" className="hover:text-white transition">CGV</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition">Confidentialité</Link></li>
            <li><Link to="/cookies" className="hover:text-white transition">Cookies</Link></li>
            <li><Link to="/legal" className="hover:text-white transition">Mentions Légales</Link></li>
          </ul>
        </div>

        {/* Colonne 4 : Aide */}
        <div>
          <h3 className="text-white font-bold mb-6">Aide</h3>
          <ul className="space-y-4 text-sm">
            <li>
              <Link 
                to="/contact" 
                className="flex items-center gap-2 hover:text-white transition"
              >
                <MessageCircle size={16}/> Nous contacter
              </Link>
            </li>
            <li>
              <Link to="/for-who" className="hover:text-white transition">
                Comment ça marche
              </Link>
            </li>
            {/* J'ai supprimé le point visible qui était ici */}
          </ul>
        </div>
      </div>

      {/* SECTION SEO : Maillage interne des villes */}
      <div className="max-w-7xl mx-auto px-4 text-xs text-slate-600 mb-8">
        <p className="font-bold text-slate-500 mb-3 flex items-center gap-2 uppercase tracking-wider">
          <MapPin size={12}/> Zones d'intervention principales
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link to="/pressing/lille" className="hover:text-teal-500 transition-colors">Pressing Lille</Link>
          <Link to="/pressing/nantes" className="hover:text-teal-500 transition-colors">Blanchisserie Nantes</Link>
          <Link to="/pressing/lyon" className="hover:text-teal-500 transition-colors">Pressing Lyon</Link>
          <Link to="/pressing/bordeaux" className="hover:text-teal-500 transition-colors">Pressing Bordeaux</Link>
          <Link to="/pressing/paris" className="hover:text-teal-500 transition-colors">Pressing Paris</Link>
          <Link to="/pressing/marseille" className="hover:text-teal-500 transition-colors">Pressing Marseille</Link>
          <Link to="/pressing/toulouse" className="hover:text-teal-500 transition-colors">Pressing Toulouse</Link>
          <Link to="/pressing/nice" className="hover:text-teal-500 transition-colors">Pressing Nice</Link>
        </div>
      </div>

      {/* Copyright & Accès Secret */}
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-slate-700 text-xs select-none">
           {/* 👇 ZONE SECRÈTE START */}
          <span 
            onClick={() => navigate('/admin')} 
            className="cursor-default hover:text-slate-600 transition-colors"
            title=" " 
          >
            ©
          </span>
           {/* 👆 ZONE SECRÈTE END */}
          {' '}{new Date().getFullYear()} Kilolab SAS. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
