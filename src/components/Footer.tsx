import { Link } from 'react-router-dom';
import { Facebook, Instagram, MessageCircle, Lock, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-teal-500 rounded-lg"></div>
            <span className="text-2xl font-bold text-white">Kilolab</span>
          </div>
          <p className="text-sm leading-relaxed mb-6">Le pressing au kilo, simple et transparent.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-teal-500"><Instagram size={20}/></a>
            <a href="#" className="hover:text-teal-500"><Facebook size={20}/></a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6">Liens</h3>
          <ul className="space-y-4 text-sm">
            <li><Link to="/" className="hover:text-white">Accueil</Link></li>
            <li><Link to="/tarifs" className="hover:text-white">Tarifs</Link></li>
            <li><Link to="/partner" className="hover:text-white">Espace Pro</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6">Légal</h3>
          <ul className="space-y-4 text-sm">
            <li><Link to="/cgu" className="hover:text-white">CGU</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Confidentialité</Link></li>
            <li><Link to="/legal" className="hover:text-white">Mentions Légales</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6">Aide</h3>
          <ul className="space-y-4 text-sm">
            <li><Link to="/contact" className="flex items-center gap-2 hover:text-white"><MessageCircle size={16}/> Nous contacter</Link></li>
            <li className="pt-8">
                <Link to="/admin-access" className="flex items-center gap-2 text-slate-600 hover:text-white transition text-xs">
                    <Lock size={12}/> Accès Administrateur
                </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* --- NOUVELLE SECTION SEO (MAILLAGE INTERNE) --- */}
      <div className="max-w-7xl mx-auto px-4 text-xs text-slate-600">
        <p className="font-bold text-slate-500 mb-3 flex items-center gap-2 uppercase tracking-wider">
            <MapPin size={12}/> Zones d'intervention principales
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/pressing/lille" className="hover:text-teal-500 transition-colors">Pressing Lille</Link>
            <Link to="/pressing/nantes" className="hover:text-teal-500 transition-colors">Blanchisserie Nantes</Link>
            <Link to="/pressing/lyon" className="hover:text-teal-500 transition-colors">Pressing Lyon</Link>
            <Link to="/pressing/bordeaux" className="hover:text-teal-500 transition-colors">Pressing Bordeaux</Link>
            <Link to="/pressing/paris" className="hover:text-teal-500 transition-colors">Pressing Paris</Link>
        </div>
        <p className="mt-8 text-center text-slate-700">
            © {new Date().getFullYear()} Kilolab SAS. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
