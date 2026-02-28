import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Instagram, Facebook, Twitter, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold text-white">Kilo<span className="text-teal-400">lab</span></span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">{t('footer.description')}</p>
            <div className="flex gap-3">
              <a href="https://instagram.com/kilolab.fr" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-10 h-10 bg-slate-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com/kilolab.fr" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-10 h-10 bg-slate-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com/kilolab_fr" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                className="w-10 h-10 bg-slate-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('footer.services')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/new-order" className="hover:text-teal-400 transition-colors">{t('footer.order')}</Link></li>
              <li><Link to="/tarifs" className="hover:text-teal-400 transition-colors">{t('footer.pricing')}</Link></li>
              <li><Link to="/trouver" className="hover:text-teal-400 transition-colors">{t('footer.findWasher')}</Link></li>
              <li><Link to="/faq" className="hover:text-teal-400 transition-colors">{t('footer.faq')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('footer.partners')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/become-washer" className="hover:text-teal-400 transition-colors">{t('footer.becomeWasher')}</Link></li>
              <li><Link to="/partner" className="hover:text-teal-400 transition-colors">{t('footer.pressingSpace')}</Link></li>
              <li><Link to="/partner-dashboard" className="hover:text-teal-400 transition-colors">{t('footer.proDashboard')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('footer.legal')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/cgu" className="hover:text-teal-400 transition-colors">{t('footer.cgu')}</Link></li>
              <li><Link to="/cgv" className="hover:text-teal-400 transition-colors">{t('footer.cgv')}</Link></li>
              <li><Link to="/privacy" className="hover:text-teal-400 transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to="/cookies" className="hover:text-teal-400 transition-colors">{t('footer.cookies')}</Link></li>
              <li><Link to="/legal" className="hover:text-teal-400 transition-colors">{t('footer.legalMentions')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('footer.contactTitle')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/contact" className="flex items-center gap-2 hover:text-teal-400 transition-colors">
                  <MessageCircle size={14} /> {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center gap-2 hover:text-teal-400 transition-colors">
                  <Mail size={14} /> contact@kilolab.fr
                </Link>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <span>Lille - Nantes - Bordeaux</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">{t('footer.copyright', { year: currentYear })}</p>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <Link to="/admin" className="hover:text-slate-400 transition-colors">Admin</Link>
              <span>-</span>
              <span>{t('footer.madeIn')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
