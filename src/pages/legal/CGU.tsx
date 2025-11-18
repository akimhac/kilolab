import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CGU() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à l'accueil
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <h1 className="text-5xl font-black mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Conditions Générales d'Utilisation
          </h1>
          
          <p className="text-sm text-slate-500 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <div className="prose prose-slate max-w-none space-y-8">
            
            {/* Article 1 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Article 1 - Présentation du service</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                <strong>Kilolab</strong> est une plateforme de mise en relation permettant aux utilisateurs 
                de trouver et de confier leur linge à un pressing partenaire situé à proximité, au kilo.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg my-6">
                <p className="font-bold text-blue-900 mb-2">⚠️ Important</p>
                <p className="text-blue-800">
                  Kilolab <strong>n'est pas un pressing</strong> et <strong>n'intervient pas dans la prestation 
                  de nettoyage elle-même</strong>. Nous agissons uniquement en tant qu'intermédiaire technologique 
                  entre les utilisateurs et les pressings partenaires.
                </p>
              </div>
            </section>

            {/* Article 2 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Article 2 - Création de compte</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                L'utilisateur s'engage à fournir des informations exactes lors de son inscription :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                <li>Nom et prénom</li>
                <li>Adresse email valide</li>
                <li>Numéro de téléphone</li>
                <li>Adresse de livraison</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                <strong>Kilolab se réserve le droit de suspendre tout compte</strong> en cas d'usage frauduleux, 
                abusif du service, ou de fourniture d'informations mensongères.
              </p>
            </section>

            {/* Article 3 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Article 3 - Fonctionnement du service</h2>
              <div className="bg-slate-50 rounded-xl p-6 mb-4">
                <h3 className="font-bold text-lg mb-3 text-slate-900">Processus en 4 étapes :</h3>
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                    <div>
                      <strong>Recherche :</strong> L'utilisateur sélectionne un pressing partenaire via la plateforme Kilolab.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                    <div>
                      <strong>Dépôt :</strong> Le linge est déposé et pesé directement par le pressing ou le point relais.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                    <div>
                      <strong>Nettoyage :</strong> Le pressing partenaire réalise la prestation de nettoyage.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                    <div>
                      <strong>Retrait :</strong> L'utilisateur récupère son linge au même point relais.
                    </div>
                  </li>
                </ol>
              </div>
              <p className="text-slate-700 leading-relaxed font-semibold">
                Kilolab intervient uniquement comme intermédiaire technique et commercial.
              </p>
            </section>

            {/* Article 4 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Article 4 - Prix et paiement</h2>
              <div className="space-y-4 text-slate-700">
                <p className="leading-relaxed">
                  <strong>Tarification :</strong> Les prix affichés sont déterminés librement par les pressings partenaires. 
                  Kilolab n'intervient pas dans la fixation des tarifs.
                </p>
                <p className="leading-relaxed">
                  <strong>Modalités de paiement :</strong> Le paiement est réalisé via la plateforme Kilolab 
                  pour plus de simplicité et de sécurité (paiement en ligne sécurisé par Stripe).
                </p>
                <p className="leading-relaxed">
                  <strong>Commission :</strong> Kilolab perçoit une commission de <strong>10 à 15%</strong> sur 
                  chaque commande pour le service de mise en relation et l'utilisation de la plateforme.
                </p>
              </div>
            </section>

            {/* Article 5 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Article 5 - Responsabilités</h2>
              
              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">5.1 Responsabilité du pressing partenaire</h3>
              <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg mb-6">
                <p className="text-green-900 font-semibold mb-2">Le pressing est seul responsable de :</p>
                <ul className="list-disc pl-6 space-y-2 text-green-800">
                  <li>La qualité du nettoyage</li>
                  <li>Les éventuelles dégradations du linge</li>
                  <li>Le respect des délais annoncés</li>
                  <li>La sécurité et la restitution des articles</li>
                  <li>La conformité aux normes professionnelles</li>
                </ul>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-3">5.2 Responsabilité de Kilolab (limitée)</h3>
              <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg mb-6">
                <p className="text-red-900 font-bold mb-3">⚠️ Kilolab ne peut être tenu responsable de :</p>
                <ul className="list-disc pl-6 space-y-2 text-red-800">
                  <li>La qualité des services fournis par les pressings</li>
                  <li>Les dommages causés aux vêtements pendant le nettoyage</li>
                  <li>Les retards de livraison imputables au pressing</li>
                  <li>La perte ou le vol d'articles confiés aux pressings</li>
                  <li>Les objets oubliés dans les poches</li>
                  <li>Les litiges entre utilisateurs et pressings</li>
                  <li>L'inexécution du service par un pressing partenaire</li>
                </ul>
                <p className="font-bold text-red-900 mt-4">
                  En cas de litige, l'utilisateur doit directement contacter le pressing concerné.
                </p>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-3">5.3 Responsabilité de l'utilisateur</h3>
              <p className="text-slate-700 mb-3">L'utilisateur est seul responsable :</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>De l'exactitude des informations fournies</li>
                <li>De l'utilisation de son compte (confidentialité des identifiants)</li>
                <li>Du respect des consignes du pressing</li>
                <li>De la vérification de ses articles avant dépôt</li>
                <li>Du retrait de son linge dans les délais impartis</li>
              </ul>
            </section>

            {/* Article 6 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Article 6 - Délai de retrait du linge</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
                <p className="text-yellow-900 leading-relaxed">
                  <strong>Le linge doit être récupéré dans les 15 jours</strong> après notification de disponibilité. 
                  Au-delà de ce délai, <strong>des frais de stockage peuvent être appliqués par le pressing</strong> 
                  (selon les conditions du pressing partenaire).
                </p>
              </div>
            </section>

            {/* Article 7 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Article 7 - Annulation et remboursement</h2>
              <div className="space-y-4 text-slate-700">
                <p className="leading-relaxed">
                  <strong>Avant dépôt :</strong> Une commande peut être annulée gratuitement avant le dépôt du linge.
                </p>
                <p className="leading-relaxed">
                  <strong>Après dépôt :</strong> Une commande <strong>ne peut plus être annulée</strong> une fois 
                  le linge déposé au pressing.
                </p>
                <p className="leading-relaxed">
                  <strong>Remboursements :</strong> En cas de problème avec le pressing (qualité, perte, dommage), 
                  l'utilisateur doit directement négocier avec le pressing partenaire. Kilolab peut faciliter 
                  la communication mais n'est pas responsable du remboursement.
                </p>
              </div>
            </section>

            {/* Article 8 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Article 8 - Données personnelles</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Kilolab collecte uniquement les données nécessaires à l'exécution du service. 
                Ces données <strong>ne sont jamais revendues</strong> à des tiers.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Conformément au <strong>RGPD</strong> et à la loi Informatique et Libertés, l'utilisateur peut 
                demander l'accès, la rectification ou la suppression de ses données en contactant : 
                <a href="mailto:contact@kilolab.fr" className="text-blue-600 hover:underline font-semibold"> contact@kilolab.fr</a>
              </p>
              <p className="text-slate-700 leading-relaxed">
                Pour plus d'informations, consultez notre{' '}
                <button 
                  onClick={() => navigate('/legal/privacy')} 
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Politique de confidentialité
                </button>.
              </p>
            </section>

            {/* Article 9 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Article 9 - Disponibilité de la plateforme</h2>
              <p className="text-slate-700 leading-relaxed">
                Kilolab s'efforce d'assurer l'accessibilité de la plateforme 24h/24 et 7j/7, mais ne peut 
                garantir une disponibilité continue. <strong>Kilolab ne peut être tenu responsable des interruptions 
                de service</strong> pour maintenance, pannes techniques ou cas de force majeure.
              </p>
            </section>

            {/* Article 10 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Article 10 - Réclamations</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Pour toute réclamation concernant la plateforme Kilolab, contactez-nous à : 
                <a href="mailto:contact@kilolab.fr" className="text-blue-600 hover:underline font-semibold"> contact@kilolab.fr</a>
              </p>
              <p className="text-slate-700 leading-relaxed">
                <strong>En cas de litige avec un pressing partenaire</strong>, l'utilisateur doit d'abord tenter 
                une résolution amiable directement avec le pressing. Kilolab peut faciliter la médiation mais 
                n'est pas partie prenante du litige.
              </p>
            </section>

            {/* Article 11 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Article 11 - Médiation de la consommation</h2>
              <p className="text-slate-700 leading-relaxed">
                Conformément à l'article L.612-1 du Code de la consommation, l'utilisateur peut recourir 
                <strong> gratuitement à un médiateur de la consommation</strong> en cas de litige non résolu avec Kilolab.
              </p>
            </section>

            {/* Article 12 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Article 12 - Modification des CGU</h2>
              <p className="text-slate-700 leading-relaxed">
                Kilolab se réserve le droit de modifier les présentes CGU à tout moment. Les nouvelles CGU 
                seront applicables dès leur mise en ligne sur le site. Il est recommandé de consulter 
                régulièrement cette page.
              </p>
            </section>

            {/* Article 13 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Article 13 - Droit applicable et juridiction</h2>
              <p className="text-slate-700 leading-relaxed">
                Les présentes CGU sont régies par le <strong>droit français</strong>. Tout litige relatif à 
                l'interprétation ou à l'exécution des présentes sera de la compétence exclusive des 
                <strong> tribunaux français</strong>.
              </p>
            </section>

            {/* Contact */}
            <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
              <h3 className="font-bold text-2xl mb-4 text-slate-900">Nous contacter</h3>
              <div className="space-y-2 text-slate-700">
                <p><strong>Kilolab</strong></p>
                <p>Email : <a href="mailto:contact@kilolab.fr" className="text-blue-600 hover:underline font-semibold">contact@kilolab.fr</a></p>
                <p>Site web : <a href="https://kilolab.fr" className="text-blue-600 hover:underline font-semibold">kilolab.fr</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
