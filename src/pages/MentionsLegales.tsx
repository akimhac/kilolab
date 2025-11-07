import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Building2, Mail, Phone } from 'lucide-react';

export default function MentionsLegales() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex items-center gap-4 mb-8">
            <FileText className="w-12 h-12 text-purple-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">Mentions Légales</h1>
              <p className="text-white/60">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          <div className="space-y-8 text-white/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Building2 className="w-6 h-6" />
                1. Éditeur du site
              </h2>
              <div className="bg-white/5 rounded-lg p-6 space-y-2">
                <p><strong>Raison sociale :</strong> KiloLab</p>
                <p><strong>Forme juridique :</strong> SAS (Société par Actions Simplifiée)</p>
                <p><strong>Capital social :</strong> 10 000 €</p>
                <p><strong>Siège social :</strong> 10 Rue du Pressing, 75001 Paris, France</p>
                <p><strong>SIRET :</strong> 123 456 789 00010</p>
                <p><strong>TVA intracommunautaire :</strong> FR12345678900</p>
                <p><strong>Email :</strong> contact@kilolab.fr</p>
                <p><strong>Téléphone :</strong> 01 23 45 67 89</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Directeur de la publication</h2>
              <p>Akim Hachili, Président de KiloLab SAS</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Hébergement</h2>
              <div className="bg-white/5 rounded-lg p-6 space-y-2">
                <p><strong>Hébergeur :</strong> Netlify, Inc.</p>
                <p><strong>Adresse :</strong> 512 2nd Street, Suite 200, San Francisco, CA 94107, USA</p>
                <p><strong>Site web :</strong> <a href="https://www.netlify.com" className="text-purple-300 hover:underline">netlify.com</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Propriété intellectuelle</h2>
              <p>
                L'ensemble du contenu de ce site (textes, images, logos, design) est la propriété exclusive de KiloLab 
                et est protégé par les lois françaises et internationales sur la propriété intellectuelle. 
                Toute reproduction, représentation, modification ou adaptation sans autorisation expresse est interdite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Données personnelles</h2>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, 
                vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données vous concernant.
              </p>
              <p className="mt-2">
                Pour exercer ces droits, contactez-nous à : <a href="mailto:privacy@kilolab.fr" className="text-purple-300 hover:underline">privacy@kilolab.fr</a>
              </p>
              <p className="mt-2">
                Consultez notre <button onClick={() => navigate('/privacy')} className="text-purple-300 hover:underline font-semibold">Politique de Confidentialité</button> pour plus d'informations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Cookies</h2>
              <p>
                Ce site utilise des cookies pour améliorer votre expérience utilisateur et réaliser des statistiques de visite. 
                Vous pouvez accepter ou refuser les cookies via le bandeau de consentement affiché lors de votre première visite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Limitation de responsabilité</h2>
              <p>
                KiloLab met tout en œuvre pour offrir un service de qualité, mais ne peut garantir l'exactitude, 
                la complétude ou l'actualité des informations diffusées. L'utilisation du site se fait sous votre 
                entière responsabilité.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Loi applicable</h2>
              <p>
                Les présentes mentions légales sont régies par le droit français. Tout litige relatif à l'utilisation 
                du site est soumis à la compétence exclusive des tribunaux français.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
