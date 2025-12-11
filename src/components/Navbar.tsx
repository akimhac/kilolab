import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu quand on change de page
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Comment ça marche', href: '/#how-it-works' },
    { name: 'Tarifs', href: '/pricing' },
    { name: 'Devenir partenaire', href: '/become-partner', highlight: true },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled || isOpen || !isHomePage 
        ? 'bg-slate-950 shadow-lg py-2' 
        : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-slate-900 font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-white">Kilolab</span>
          </Link>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  item.highlight
                    ? 'bg-teal-500 text-slate-900 px-4 py-2 rounded-full font-medium hover:bg-teal-400 transition-all hover:scale-105'
                    : 'text-gray-300 hover:text-white font-medium transition-colors'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {/* Bouton Connexion */}
            <Link
              to="/login"
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Connexion
            </Link>
            {/* Bouton S'inscrire */}
            <Link
              to="/signup"
              className="border-2 border-teal-500 text-teal-500 px-4 py-2 rounded-full font-medium hover:bg-teal-500 hover:text-slate-900 transition-all"
            >
              S'inscrire
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 transition-colors"
              aria-label="Menu principal"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-950 shadow-xl border-t border-gray-800">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`block text-lg font-medium ${
                  item.highlight
                    ? 'text-teal-500'
                    : 'text-gray-300 hover:text-white'
                } flex items-center justify-between group`}
              >
                {item.name}
                <ChevronRight className={`h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity ${item.highlight ? 'text-teal-500' : 'text-gray-500'}`} />
              </Link>
            ))}
            {/* Bouton Connexion Mobile */}
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block text-lg font-medium text-gray-300 hover:text-white"
            >
              Connexion
            </Link>
            {/* Bouton S'inscrire bien visible sur Mobile */}
            <div className="pt-4 mt-4 border-t border-gray-800">
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-slate-900 bg-teal-500 hover:bg-teal-400 transition-all"
              >
                S'inscrire maintenant
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
