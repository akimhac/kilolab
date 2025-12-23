import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ShieldCheck, Clock, Phone, FileText } from 'lucide-react';

export default function PartnerPending() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 flex items-center justify-center min-h-[80vh]">
        <div className="max-w-2xl w-full bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 text-center">
          
          <div className="w-24 h-24 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Clock size={48} />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Vérification en cours</h1>
          <p className="text-slate-500 text-lg mb-8 leading-relaxed">
            Merci de votre inscription ! Pour garantir la sécurité du réseau Kilolab, 
            nous vérifions manuellement chaque partenaire avant l'activation.
          </p>

          <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="text-teal-500"/> Prochaines étapes :
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-slate-600"><Phone size={18}/></div>
                <div>
                  <span className="block font-bold text-sm">Appel de vérification</span>
                  <span className="text-sm text-slate-500">Notre équipe va vous contacter sous 24h sur le numéro fourni.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-slate-600"><FileText size={18}/></div>
                <div>
                  <span className="block font-bold text-sm">Document KBIS (Optionnel)</span>
                  <span className="text-sm text-slate-500">Nous pourrions vous demander un extrait Kbis par email.</span>
                </div>
              </li>
            </ul>
          </div>

          <p className="text-sm text-slate-400 mb-6">
            Vous avez fait une erreur dans votre inscription ?
          </p>
          
          <Link to="/contact" className="inline-block px-8 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition">
            Contacter le support
          </Link>

        </div>
      </div>
    </div>
  );
}
