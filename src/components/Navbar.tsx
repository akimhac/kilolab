import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LanguageSelector } from './LanguageSelector';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on a page with dark hero (landing, washers)
  const isDarkHero = ['/', '/become-washer', '/washers'].includes(location.pathname);

  useEffect(() => {
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) fetchProfile(session.user.id);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) fetchProfile(user.id);
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('role, full_name')
      .eq('id', userId)
      .single();
    setProfile(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!profile) return '/dashboard';
    if (profile.role === 'admin') return '/admin';
    if (profile.role === 'partner') return '/partner-dashboard';
    if (profile.role === 'washer') return '/washer-dashboard';
    return '/dashboard';
  };

  // Dynamic styles based on scroll and page
  const navBg = scrolled || !isDarkHero
    ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm'
    : 'bg-transparent border-b border-white/10';
  
  const textColor = scrolled || !isDarkHero ? 'text-slate-700' : 'text-white/90';
  const logoColor = scrolled || !isDarkHero ? 'text-slate-900' : 'text-white';
  const hoverColor = scrolled || !isDarkHero ? 'hover:text-teal-600' : 'hover:text-white';

  return (
    <nav 
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* LOGO */}
          <Link 
            to="/" 
            data-testid="logo"
            className="flex items-center gap-2.5 group"
          >
            <div className={`w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-teal-500/30 transition-all duration-300 group-hover:scale-105`}>
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${logoColor}`}>
              Kilo<span className="text-teal-500">lab</span>
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-1">
            {[
              { to: '/tarifs', label: 'Tarifs' },
              { to: '/trouver', label: 'Trouver un Washer' },
              { to: '/faq', label: 'FAQ' },
              { to: '/contact', label: 'Contact' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                data-testid={`nav-${item.to.slice(1)}`}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${textColor} ${hoverColor}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardLink()}
                  data-testid="dashboard-link"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    scrolled || !isDarkHero 
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <User size={18} />
                  <span className="max-w-[120px] truncate">{profile?.full_name || 'Mon compte'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  data-testid="logout-btn"
                  className={`p-2 rounded-full transition-all duration-200 ${
                    scrolled || !isDarkHero 
                      ? 'text-slate-500 hover:text-red-600 hover:bg-red-50' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title="Déconnexion"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  data-testid="login-link"
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${textColor} ${hoverColor}`}
                >
                  Connexion
                </Link>
                <Link
                  to="/washers"
                  data-testid="washer-link"
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Devenir Washer
                </Link>
                <Link
                  to="/new-order"
                  data-testid="order-link"
                  className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                    scrolled || !isDarkHero 
                      ? 'bg-slate-900 text-white hover:bg-slate-800' 
                      : 'bg-white text-slate-900 hover:bg-white/90'
                  }`}
                >
                  Commander
                </Link>
              </>
            )}
            
            {/* Language Selector */}
            <LanguageSelector variant="minimal" />
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            data-testid="mobile-menu-btn"
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled || !isDarkHero 
                ? 'text-slate-600 hover:bg-slate-100' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div 
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-slate-200 shadow-xl px-4 py-6 space-y-2">
          {[
            { to: '/tarifs', label: 'Tarifs' },
            { to: '/trouver', label: 'Trouver un Washer' },
            { to: '/faq', label: 'FAQ' },
            { to: '/contact', label: 'Contact' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-slate-700 font-medium hover:bg-slate-50 rounded-xl transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-4 border-t border-slate-200 space-y-3">
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-900 rounded-xl font-semibold"
                >
                  <User size={18} />
                  {profile?.full_name || 'Mon compte'}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold"
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 bg-slate-100 text-slate-900 rounded-xl font-semibold text-center"
                >
                  Connexion
                </Link>
                <Link
                  to="/washers"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold text-center"
                >
                  Devenir Washer
                </Link>
                <Link
                  to="/new-order"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 bg-slate-900 text-white rounded-xl font-semibold text-center"
                >
                  Commander
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
