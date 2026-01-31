import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings as SettingsIcon, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

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
    if (profile.role === 'washer') return '/washer-app';
    return '/dashboard';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl">K</span>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              Kilo<span className="text-teal-600">lab</span>
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/tarifs" className="text-slate-700 hover:text-teal-600 font-semibold transition">
              Tarifs
            </Link>
            <Link to="/trouver" className="text-slate-700 hover:text-teal-600 font-semibold transition">
              Trouver un Washer
            </Link>
            <Link to="/faq" className="text-slate-700 hover:text-teal-600 font-semibold transition">
              FAQ
            </Link>
            <Link to="/contact" className="text-slate-700 hover:text-teal-600 font-semibold transition">
              Contact
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardLink()}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
                >
                  <User size={18} />
                  {profile?.full_name || 'Mon compte'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-600 hover:text-red-600 transition"
                  title="Déconnexion"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-slate-700 font-semibold hover:text-teal-600 transition"
                >
                  Connexion
                </Link>
                <Link
                  to="/washers"
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-bold hover:from-teal-700 hover:to-cyan-700 transition shadow-lg shadow-teal-200"
                >
                  🧺 Devenir Washer
                </Link>
                <Link
                  to="/new-order"
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition"
                >
                  Commander
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 shadow-xl">
          <div className="px-4 py-6 space-y-4">
            <Link
              to="/tarifs"
              onClick={() => setIsOpen(false)}
              className="block text-slate-700 font-semibold hover:text-teal-600 py-2"
            >
              Tarifs
            </Link>
            <Link
              to="/trouver"
              onClick={() => setIsOpen(false)}
              className="block text-slate-700 font-semibold hover:text-teal-600 py-2"
            >
              Trouver un Washer
            </Link>
            <Link
              to="/faq"
              onClick={() => setIsOpen(false)}
              className="block text-slate-700 font-semibold hover:text-teal-600 py-2"
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block text-slate-700 font-semibold hover:text-teal-600 py-2"
            >
              Contact
            </Link>

            <div className="pt-4 border-t border-slate-200 space-y-3">
              {user ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 bg-slate-100 text-slate-900 rounded-xl font-bold text-center"
                  >
                    <User size={18} className="inline mr-2" />
                    {profile?.full_name || 'Mon compte'}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold"
                  >
                    <LogOut size={18} className="inline mr-2" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 bg-slate-100 text-slate-900 rounded-xl font-bold text-center"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/washers"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-bold text-center"
                  >
                    🧺 Devenir Washer
                  </Link>
                  <Link
                    to="/new-order"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 bg-slate-900 text-white rounded-xl font-bold text-center"
                  >
                    Commander
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
