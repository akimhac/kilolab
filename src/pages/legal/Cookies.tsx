import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

export default function Cookies() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-32">
        <h1 className="text-4xl font-extrabold mb-2">Politique de Gestion des Cookies</h1>
        <p className="text-slate-500 mb-8">Conformément à la directive ePrivacy et au RGPD — Version 2.0, Février 2026</p>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">1. Qu'est-ce qu'un cookie ?</h2>
            <p>
              Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, téléphone, tablette) lors de votre visite sur notre site. 
              Il permet de mémoriser vos préférences, d'assurer le bon fonctionnement du site, et d'analyser son utilisation.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">2. Cookies utilisés par Kilolab</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold">Cookie</th>
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold">Type</th>
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold">Finalité</th>
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold">Durée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-200 px-4 py-2">sb-*-auth-token</td>
                    <td className="border border-slate-200 px-4 py-2">Essentiel</td>
                    <td className="border border-slate-200 px-4 py-2">Authentification Supabase (session utilisateur)</td>
                    <td className="border border-slate-200 px-4 py-2">Session / 7 jours</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-4 py-2">__stripe_mid / __stripe_sid</td>
                    <td className="border border-slate-200 px-4 py-2">Essentiel</td>
                    <td className="border border-slate-200 px-4 py-2">Sécurisation des paiements Stripe</td>
                    <td className="border border-slate-200 px-4 py-2">Session / 30 min</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-4 py-2">kilolab_pwa_install</td>
                    <td className="border border-slate-200 px-4 py-2">Fonctionnel</td>
                    <td className="border border-slate-200 px-4 py-2">Mémoriser le refus de l'installation PWA</td>
                    <td className="border border-slate-200 px-4 py-2">30 jours</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-4 py-2">kilolab_ig_promo</td>
                    <td className="border border-slate-200 px-4 py-2">Fonctionnel</td>
                    <td className="border border-slate-200 px-4 py-2">Mémoriser la fermeture de la popup Instagram</td>
                    <td className="border border-slate-200 px-4 py-2">7 jours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">3. Cookies essentiels (obligatoires)</h2>
            <p>
              Ces cookies sont indispensables au fonctionnement du site (authentification, sécurité des paiements). 
              Ils ne nécessitent pas votre consentement conformément à l'article 82 de la loi Informatique et Libertés.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">4. Cookies analytiques (optionnels)</h2>
            <p>
              Kilolab n'utilise actuellement <strong>aucun cookie analytique tiers</strong> (pas de Google Analytics, pas de Facebook Pixel actif). 
              Si nous en mettons en place à l'avenir, votre consentement explicite sera systématiquement demandé.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">5. Cookies publicitaires</h2>
            <p>
              Kilolab <strong>n'utilise aucun cookie publicitaire</strong>. Nous ne vendons pas vos données à des régies publicitaires et ne faisons pas de retargeting.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">6. Gestion de vos préférences</h2>
            <p>
              Vous pouvez à tout moment supprimer les cookies stockés sur votre appareil ou paramétrer votre navigateur pour les refuser :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies</li>
              <li><strong>Firefox :</strong> Options → Vie privée et sécurité</li>
              <li><strong>Safari :</strong> Préférences → Confidentialité</li>
              <li><strong>Edge :</strong> Paramètres → Cookies et autorisations de sites</li>
            </ul>
            <p className="mt-2 text-sm text-slate-500">
              Note : La suppression des cookies essentiels peut empêcher l'utilisation de certaines fonctionnalités (ex: vous serez déconnecté).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">7. Contact</h2>
            <p>
              Pour toute question relative aux cookies, contactez-nous : <a href="mailto:privacy@kilolab.fr" className="text-teal-600 font-bold underline">privacy@kilolab.fr</a>
            </p>
            <p className="mt-2">
              Pour en savoir plus sur le traitement de vos données, consultez notre{' '}
              <Link to="/privacy" className="text-teal-600 underline font-medium">Politique de confidentialité</Link>.
            </p>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
}
