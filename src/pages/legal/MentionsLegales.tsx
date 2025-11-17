import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function MentionsLegales() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 transition font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à l'accueil
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <h1 className="text-5xl font-black mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Mentions Légales
          </h1>

          <div className="prose prose-slate max-w-none space-y-8">
            
            {/* Éditeur */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Éditeur du site</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-6">
                <p className="text-sm font-bold text-yellow-900 mb-2">
                  ⚠️ À COMPLÉTER après création de votre SASU
                </p>
                <p className="text-yellow-800 text-sm">
                  Ces informations doivent être complétées une fois votre société immatriculée.
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="space-y-2 text-slate-700">
                  <p><strong>Raison sociale :</strong> [VOTRE SASU - À COMPLÉTER]</p>
                  <p><strong>Forme juridique :</strong> SASU (Société par Actions Simplifiée Unipersonnelle)</p>
                  <p><strong>Capital social :</strong> [MONTANT] euros</p>
                  <p><strong>Siège social :</strong> [ADRESSE COMPLÈTE]</p>
                  <p><strong>SIRET :</strong> [NUMÉRO SIRET - 14 chiffres]</p>
                  <p><strong>RCS :</strong> [VILLE D'IMMATRICULATION]</p>
                  <p><strong>Email :</strong> <a href="mailto:contact@kilolab.fr" className="text-purple-600 hover:underline">contact@kilolab.fr</a></p>
                  <p><strong>Directeur de publication :</strong> [VOTRE NOM], Président</p>
                  <p><strong>TVA intracommunautaire :</strong> [NUMÉRO DE TVA]</p>
                </div>
              </div>
            </section>

            {/* Hébergement */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Hébergement</h2>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-700 mb-4">
                  <strong>Le site kilolab.fr est hébergé par :</strong>
                </p>
                <div className="space-y-2 text-slate-700">
                  <p><strong>Vercel Inc.</strong></p>
                  <p>340 S Lemon Ave #4133</p>
                  <p>Walnut, CA 91789</p>
                  <p>États-Unis</p>
                  <p>Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">vercel.com</a></p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 mt-4">
                <p className="text-slate-700 mb-4">
                  <strong>La base de données est hébergée par :</strong>
                </p>
                <div className="space-y-2 text-slate-700">
                  <p><strong>Supabase Inc.</strong></p>
                  <p>Serveurs situés dans l'Union Européenne</p>
                  <p>Conformité RGPD garantie</p>
                  <p>Site web : <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">supabase.com</a></p>
                </div>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Propriété intellectuelle</h2>
              <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-lg mb-4">
                <p className="text-purple-900 leading-relaxed">
                  L'ensemble du site <strong>Kilolab</strong> (structure générale, textes, logos, images, 
                  vidéos, graphismes, design) est la propriété exclusive de <strong>[VOTRE SASU]</strong> 
                  ou de ses partenaires et est protégé par les lois françaises et internationales relatives 
                  à la propriété intellectuelle.
                </p>
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">
                Toute reproduction, représentation, modification, publication, transmission, dénaturation, 
                totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, et sur 
                quelque support que ce soit, est <strong>strictement interdite sans l'autorisation écrite 
                préalable de Kilolab</strong>.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Le non-respect de cette interdiction constitue une contrefaçon pouvant engager la responsabilité 
                civile et pénale du contrefacteur.
              </p>
            </section>

            {/* Crédits */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Crédits</h2>
              <div className="space-y-3 text-slate-700">
                <p><strong>Photographies :</strong> Pexels.com (Licence libre de droits)</p>
                <p><strong>Icônes :</strong> Lucide Icons (Licence MIT)</p>
                <p><strong>Typographie :</strong> Google Fonts (Licence Open Font)</p>
                <p><strong>Framework :</strong> React (Licence MIT)</p>
                <p><strong>Cartographie :</strong> OpenStreetMap (Licence ODbL)</p>
              </div>
            </section>

            {/* Protection des données */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Protection des données personnelles</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Conformément au <strong>Règlement Général sur la Protection des Données (RGPD)</strong> et à 
                la <strong>loi Informatique et Libertés</strong>, vous disposez de droits sur vos données personnelles.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Pour plus d'informations, consultez notre{' '}
                <button 
                  onClick={() => navigate('/legal/privacy')}
                  className="text-purple-600 hover:underline font-semibold"
                >
                  Politique de confidentialité
                </button>.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Cookies</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Le site <strong>kilolab.fr</strong> utilise des cookies pour améliorer l'expérience utilisateur 
                et réaliser des statistiques de visites.
              </p>
              <div className="bg-slate-50 rounded-xl p-6">
                <h4 className="font-bold text-slate-900 mb-3">Types de cookies utilisés :</h4>
                <ul className="space-y-2 text-slate-700">
                  <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site (authentification, panier)</li>
                  <li><strong>Cookies analytiques :</strong> Google Analytics (avec votre consentement)</li>
                  <li><strong>Cookies de préférence :</strong> Mémorisation de vos choix (langue, etc.)</li>
                </ul>
              </div>
              <p className="text-slate-700 leading-relaxed mt-4">
                Vous pouvez désactiver les cookies dans les paramètres de votre navigateur. Cependant, 
                certaines fonctionnalités du site peuvent être limitées.
              </p>
            </section>

            {/* Responsabilité */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Limitation de responsabilité</h2>
              <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg">
                <p className="text-red-900 leading-relaxed mb-4">
                  <strong>Kilolab</strong> ne peut être tenu responsable :
                </p>
                <ul className="space-y-2 text-red-800">
                  <li>• Des interruptions ou dysfonctionnements du site</li>
                  <li>• De la perte de données</li>
                  <li>• Des dommages indirects résultant de l'utilisation du site</li>
                  <li>• Du contenu des sites tiers accessibles via des liens hypertextes</li>
                  <li>• Des prestations fournies par les pressings partenaires</li>
                </ul>
              </div>
            </section>

            {/* Droit applicable */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Droit applicable</h2>
              <p className="text-slate-700 leading-relaxed">
                Les présentes mentions légales sont régies par le <strong>droit français</strong>. 
                Tout litige relatif à l'utilisation du site <strong>kilolab.fr</strong> sera de la 
                compétence exclusive des tribunaux français.
              </p>
            </section>

            {/* Contact */}
            <div className="mt-12 p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
              <h3 className="font-bold text-2xl mb-4 text-slate-900">Nous contacter</h3>
              <div className="space-y-2 text-slate-700">
                <p>Pour toute question concernant les mentions légales :</p>
                <p className="font-semibold">
                  Email : <a href="mailto:contact@kilolab.fr" className="text-purple-600 hover:underline">contact@kilolab.fr</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
