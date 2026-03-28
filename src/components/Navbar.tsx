import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isDarkHero = ['/', '/washers'].includes(location.pathname);

  useEffect(() => {
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) fetchProfile(session.user.id);
    });
    return () => { authListener?.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) fetchProfile(user.id);
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('user_profiles').select('role, full_name').eq('id', userId).single();
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

  const navBg = scrolled || !isDarkHero
    ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm'
    : 'bg-transparent border-b border-white/10';
  const textColor = scrolled || !isDarkHero ? 'text-slate-700' : 'text-white/90';
  const logoColor = scrolled || !isDarkHero ? 'text-slate-900' : 'text-white';
  const hoverColor = scrolled || !isDarkHero ? 'hover:text-teal-600' : 'hover:text-white';

  const navLinks = [
    { to: '/tarifs', label: t('nav.pricing') },
    { to: '/trouver', label: t('nav.findWasher') },
    { to: '/faq', label: t('nav.faq') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <nav data-testid="navbar" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          <Link to="/" data-testid="logo" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-teal-500/30 transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${logoColor}`}>
              Kilo<span className="text-teal-500">lab</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => (
              <Link key={item.to} to={item.to} data-testid={`nav-${item.to.slice(1)}`}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${textColor} ${hoverColor}`}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link to={getDashboardLink()} data-testid="dashboard-link"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    scrolled || !isDarkHero ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}>
                  <User size={18} />
                  <span className="max-w-[120px] truncate">{profile?.full_name || t('nav.myAccount')}</span>
                </Link>
                <Link to="/settings" data-testid="settings-link" title={t('nav.settings')}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    scrolled || !isDarkHero ? 'text-slate-500 hover:text-teal-600 hover:bg-teal-50' : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </Link>
                <button onClick={handleLogout} data-testid="logout-btn" title={t('nav.logout')}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    scrolled || !isDarkHero ? 'text-slate-500 hover:text-red-600 hover:bg-red-50' : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}>
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" data-testid="login-link"
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${textColor} ${hoverColor}`}>
                  {t('nav.login')}
                </Link>
                <Link to="/washers" data-testid="washer-link"
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98]">
                  {t('nav.becomeWasher')}
                </Link>
                <Link to="/new-order" data-testid="order-link"
                  className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                    scrolled || !isDarkHero ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-900 hover:bg-white/90'
                  }`}>
                  {t('nav.order')}
                </Link>
              </>
            )}
            <LanguageSelector variant="minimal" />
            <ThemeToggle variant="icon" />
          </div>

          <button onClick={() => setIsOpen(!isOpen)} data-testid="mobile-menu-btn"
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled || !isDarkHero ? 'text-slate-600 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white border-t border-slate-100 shadow-2xl">
          {/* Main nav links */}
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 text-slate-700 font-medium hover:bg-teal-50 hover:text-teal-700 rounded-xl transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* User section */}
          <div className="border-t border-slate-100 px-4 py-4">
            {user ? (
              <div className="space-y-2">
                {/* User menu items with better design */}
                <Link to="/dashboard" onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 px-4 py-3.5 bg-slate-50 hover:bg-teal-50 rounded-xl transition-colors group">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                    <span className="text-lg">📦</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Mes commandes</p>
                    <p className="text-xs text-slate-500">Suivi et historique</p>
                  </div>
                </Link>
                <Link to="/dashboard?tab=loyalty" onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 px-4 py-3.5 bg-slate-50 hover:bg-teal-50 rounded-xl transition-colors group">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                    <span className="text-lg">🎁</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Points fidélité</p>
                    <p className="text-xs text-slate-500">Vos récompenses</p>
                  </div>
                </Link>
                <Link to="/profile" onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 px-4 py-3.5 bg-slate-50 hover:bg-teal-50 rounded-xl transition-colors group">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-lg">👤</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Mon compte</p>
                    <p className="text-xs text-slate-500">Profil et informations</p>
                  </div>
                </Link>
                <Link to="/account-settings" onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 px-4 py-3.5 bg-slate-50 hover:bg-teal-50 rounded-xl transition-colors group">
                  <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center group-hover:bg-slate-300 transition-colors">
                    <span className="text-lg">⚙️</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Paramètres</p>
                    <p className="text-xs text-slate-500">Sécurité et préférences</p>
                  </div>
                </Link>
                
                {/* Dashboard and logout */}
                <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
                  <Link to={getDashboardLink()} onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-colors">
                    <User size={18} />
                    {profile?.full_name || t('nav.myAccount')}
                  </Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors">
                    <LogOut size={18} /> {t('nav.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link to="/login" onClick={() => setIsOpen(false)}
                  className="block px-4 py-3.5 bg-slate-100 text-slate-900 rounded-xl font-bold text-center hover:bg-slate-200 transition-colors">
                  {t('nav.login')}
                </Link>
                <Link to="/washers" onClick={() => setIsOpen(false)}
                  className="block px-4 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold text-center hover:shadow-lg transition-all">
                  {t('nav.becomeWasher')}
                </Link>
                <Link to="/new-order" onClick={() => setIsOpen(false)}
                  className="block px-4 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-center hover:bg-slate-800 transition-colors">
                  {t('nav.order')}
                </Link>
              </div>
            )}
            <div className="flex items-center justify-center gap-3 pt-4 mt-3 border-t border-slate-100">
              <LanguageSelector variant="buttons" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
