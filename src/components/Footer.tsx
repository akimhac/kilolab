import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold text-white">
                Kilo<span className="text-teal-400">lab</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Le 1er service de laverie à domicile en France. 
              Collecte, lavage et pliage dès 3€/kg.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://instagram.com/kilolab.fr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://facebook.com/kilolab.fr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://twitter.com/kilolab_fr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/new-order" className="hover:text-teal-400 transition-colors">
                  Commander
                </Link>
              </li>
              <li>
                <Link to="/tarifs" className="hover:text-teal-400 transition-colors">
                  Nos tarifs
                </Link>
              </li>
              <li>
                <Link to="/trouver" className="hover:text-teal-400 transition-colors">
                  Trouver un Washer
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-teal-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Partenaires */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Partenaires</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/become-washer" className="hover:text-teal-400 transition-colors">
                  Devenir Washer
                </Link>
              </li>
              <li>
                <Link to="/partner" className="hover:text-teal-400 transition-colors">
                  Espace Pressing
                </Link>
              </li>
              <li>
                <Link to="/partner-dashboard" className="hover:text-teal-400 transition-colors">
                  Dashboard Pro
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Légal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/cgu" className="hover:text-teal-400 transition-colors">
                  CGU
                </Link>
              </li>
              <li>
                <Link to="/cgv" className="hover:text-teal-400 transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-teal-400 transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-teal-400 transition-colors">
                  Cookies
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-teal-400 transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/contact" className="flex items-center gap-2 hover:text-teal-400 transition-colors">
                  <MessageCircle size={14} />
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center gap-2 hover:text-teal-400 transition-colors">
                  <Mail size={14} />
                  contact@kilolab.fr
                </Link>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <span>Lille • Nantes • Bordeaux</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">
              © {currentYear} Kilolab SAS. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <Link to="/admin" className="hover:text-slate-400 transition-colors">
                Admin
              </Link>
              <span>•</span>
              <span>Made with ❤️ in France</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
