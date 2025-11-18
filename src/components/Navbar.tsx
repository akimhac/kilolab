import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="text-3xl font-black cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Kilolab
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className={`font-medium transition ${
                isActive('/') 
                  ? 'text-blue-600' 
                  : 'text-slate-700 hover:text-blue-600'
              }`}
            >
              Comment ça marche
            </button>
            <button
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className={`font-medium transition ${
                isActive('/') 
                  ? 'text-blue-600' 
                  : 'text-slate-700 hover:text-blue-600'
              }`}
            >
              Avis
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-5 py-2.5 text-slate-700 hover:text-blue-600 transition font-medium"
            >
              <LogIn className="w-4 h-4" />
              Connexion
            </button>
            <button
              onClick={() => navigate('/partners-map')}
              className="px-6 py-2.5 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Trouver un pressing
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <button
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-blue-50 rounded-lg"
            >
              Comment ça marche
            </button>
            <button
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-blue-50 rounded-lg"
            >
              Avis
            </button>
            <button
              onClick={() => {
                navigate('/login');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-blue-50 rounded-lg"
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Connexion
            </button>
            <button
              onClick={() => {
                navigate('/partners-map');
                setMobileMenuOpen(false);
              }}
              className="block w-full px-6 py-3 rounded-full font-semibold text-white text-center"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Trouver un pressing
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
