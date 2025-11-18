import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Trash2, Download, UserCheck } from 'lucide-react';

export default function Privacy() {
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
            Politique de Confidentialité
          </h1>
          
          <p className="text-sm text-slate-500 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-8">
            <p className="font-bold text-blue-900 mb-2">Notre engagement</p>
            <p className="text-blue-800">
              Kilolab respecte votre vie privée et s'engage à protéger vos données personnelles 
              conformément au <strong>RGPD (Règlement Général sur la Protection des Données)</strong> 
              et à la loi Informatique et Libertés.
            </p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">1. Responsable du traitement</h2>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-700 leading-relaxed mb-2">
                  Le responsable du traitement des données est :
                </p>
                <p className="font-semibold text-slate-900">la société éditrice du site</p>
                <p className="text-slate-700">Siège social : [ADRESSE COMPLÈTE]</p>
                <p className="text-slate-700">Email : <a href="mailto:contact@kilolab.fr" className="text-blue-600 hover:underline">contact@kilolab.fr</a></p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">2. Données collectées</h2>
              
              <h3 className="text-xl font-bold text-slate-800 mb-3">2.1 Données que nous collectons</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-bold text-blue-900 mb-2">Compte utilisateur</h4>
                  <ul className="space-y-1 text-blue-800 text-sm">
                    <li>• Nom et prénom</li>
                    <li>• Adresse email</li>
                    <li>• Numéro de téléphone</li>
                    <li>• Adresse postale</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-bold text-green-900 mb-2">Commandes</h4>
                  <ul className="space-y-1 text-green-800 text-sm">
                    <li>• Historique des commandes</li>
                    <li>• Préférences de service</li>
                    <li>• Montants des transactions</li>
                    <li>• Adresses de livraison</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-bold text-blue-900 mb-2">Paiements</h4>
                  <ul className="space-y-1 text-blue-800 text-sm">
                    <li>• Informations traitées par Stripe</li>
                    <li>• Carte bancaire (cryptée)</li>
                    <li>• Historique de paiement</li>
                  </ul>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <h4 className="font-bold text-orange-900 mb-2">Navigation</h4>
                  <ul className="space-y-1 text-orange-800 text-sm">
                    <li>• Adresse IP</li>
                    <li>• Cookies</li>
                    <li>• Pages visitées</li>
                    <li>• Durée des sessions</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-3">2.2 Données que nous NE collectons PAS</h3>
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <ul className="space-y-2 text-red-800">
                  <li>❌ Données bancaires en clair (gérées uniquement par Stripe)</li>
                  <li>❌ Données sensibles (santé, opinions politiques, orientation sexuelle)</li>
                  <li>❌ Données de mineurs de moins de 15 ans sans consentement parental</li>
                  <li>❌ Données biométriques</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">3. Finalités du traitement</h2>
              <p className="text-slate-700 mb-4">Vos données sont utilisées pour :</p>
              <div className="space-y-3">
                {[
                  'Créer et gérer votre compte utilisateur',
                  'Traiter vos commandes et réservations',
                  'Vous envoyer des confirmations par email/SMS',
                  'Améliorer nos services et votre expérience',
                  'Respecter nos obligations légales (facturation, comptabilité)',
                  'Prévenir la fraude et sécuriser les transactions',
                  'Vous envoyer notre newsletter (avec votre consentement)',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mt-4">
                <p className="text-yellow-900 font-semibold">
                  ❌ Nous ne faisons PAS de prospection commerciale sans votre consentement explicite.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">4. Base légale du traitement</h2>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-5">
                  <h4 className="font-bold text-slate-900 mb-2">Exécution du contrat</h4>
                  <p className="text-slate-700 text-sm">Pour traiter vos commandes et gérer votre compte</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5">
                  <h4 className="font-bold text-slate-900 mb-2">Obligation légale</h4>
                  <p className="text-slate-700 text-sm">Conservation des factures (10 ans), déclarations fiscales</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5">
                  <h4 className="font-bold text-slate-900 mb-2">Consentement</h4>
                  <p className="text-slate-700 text-sm">Newsletter, cookies non essentiels (opt-in uniquement)</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5">
                  <h4 className="font-bold text-slate-900 mb-2">Intérêt légitime</h4>
                  <p className="text-slate-700 text-sm">Amélioration du service, prévention de la fraude</p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">5. Destinataires des données</h2>
              <p className="text-slate-700 mb-4">Vos données peuvent être partagées avec :</p>
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-xl p-5">
                  <h4 className="font-bold text-blue-900 mb-2">Pressings partenaires</h4>
                  <p className="text-blue-800 text-sm">Pour l'exécution de votre commande (nom, téléphone, adresse)</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-5">
                  <h4 className="font-bold text-blue-900 mb-2">Stripe (prestataire de paiement)</h4>
                  <p className="text-blue-800 text-sm">Certifié PCI-DSS niveau 1, données bancaires cryptées</p>
                </div>
                <div className="bg-green-50 rounded-xl p-5">
                  <h4 className="font-bold text-green-900 mb-2">Supabase (hébergement base de données)</h4>
                  <p className="text-green-800 text-sm">Serveurs situés dans l'Union Européenne, conformité RGPD</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5">
                  <h4 className="font-bold text-slate-900 mb-2">Vercel (hébergement site web)</h4>
                  <p className="text-slate-700 text-sm">CDN mondial, données de navigation uniquement</p>
                </div>
              </div>
              <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg mt-6">
                <p className="font-bold text-red-900 text-lg">
                  🚫 Nous ne vendons JAMAIS vos données à des tiers.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">6. Durée de conservation</h2>
              <table className="w-full border-collapse bg-slate-50 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-4 text-left font-bold">Type de données</th>
                    <th className="p-4 text-left font-bold">Durée de conservation</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="border-b border-slate-200">
                    <td className="p-4">Compte actif</td>
                    <td className="p-4 font-semibold">Tant que le compte existe</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-4">Compte inactif</td>
                    <td className="p-4 font-semibold">3 ans après dernière connexion</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-4">Factures</td>
                    <td className="p-4 font-semibold">10 ans (obligation légale)</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-4">Logs de connexion</td>
                    <td className="p-4 font-semibold">1 an</td>
                  </tr>
                  <tr>
                    <td className="p-4">Cookies</td>
                    <td className="p-4 font-semibold">13 mois maximum</td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">7. Vos droits (RGPD)</h2>
              <p className="text-slate-700 mb-6">
                Vous disposez des droits suivants sur vos données personnelles :
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: Eye, title: 'Droit d\'accès', desc: 'Consulter vos données personnelles' },
                  { icon: UserCheck, title: 'Droit de rectification', desc: 'Corriger vos données inexactes' },
                  { icon: Trash2, title: 'Droit à l\'effacement', desc: 'Supprimer vos données (droit à l\'oubli)' },
                  { icon: Lock, title: 'Droit d\'opposition', desc: 'Refuser un traitement de données' },
                  { icon: Download, title: 'Droit à la portabilité', desc: 'Récupérer vos données dans un format structuré' },
                  { icon: Shield, title: 'Droit à la limitation', desc: 'Limiter le traitement de vos données' },
                ].map((right, i) => (
                  <div key={i} className="bg-white border-2 border-blue-200 rounded-xl p-6 hover:border-blue-500 transition">
                    <right.icon className="w-10 h-10 text-blue-600 mb-3" />
                    <h4 className="font-bold text-slate-900 mb-2">{right.title}</h4>
                    <p className="text-slate-600 text-sm">{right.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mt-8">
                <p className="text-blue-900 leading-relaxed">
                  <strong>Pour exercer vos droits :</strong> Envoyez un email à{' '}
                  <a href="mailto:contact@kilolab.fr" className="font-bold hover:underline">contact@kilolab.fr</a>
                  {' '}avec l'objet "RGPD - [Votre demande]".<br />
                  <strong>Délai de réponse :</strong> 1 mois maximum (peut être prolongé de 2 mois si la demande est complexe).
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">8. Sécurité des données</h2>
              <p className="text-slate-700 mb-4">Nous mettons en œuvre les mesures suivantes :</p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  '🔒 Chiffrement HTTPS (SSL/TLS)',
                  '🔒 Mots de passe hashés (bcrypt)',
                  '🔒 Accès restreint aux données',
                  '🔒 Authentification à deux facteurs',
                  '🔒 Sauvegardes régulières',
                  '�� Conformité RGPD sous-traitants',
                  '🔒 Surveillance 24/7',
                  '🔒 Plan de réponse aux incidents',
                ].map((item, i) => (
                  <div key={i} className="bg-green-50 rounded-lg p-4 text-green-900 font-medium">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">9. Cookies</h2>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-5">
                  <h4 className="font-bold text-slate-900 mb-2">Cookies essentiels (obligatoires)</h4>
                  <p className="text-slate-700 text-sm">Authentification, panier, préférences de langue</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5">
                  <h4 className="font-bold text-slate-900 mb-2">Cookies analytiques (avec consentement)</h4>
                  <p className="text-slate-700 text-sm">Google Analytics, mesure d'audience</p>
                </div>
              </div>
              <p className="text-slate-600 mt-4 text-sm">
                Vous pouvez désactiver les cookies non essentiels dans votre navigateur, mais certaines fonctionnalités 
                peuvent être limitées.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">10. Transferts hors UE</h2>
              <p className="text-slate-700 leading-relaxed">
                Certains prestataires (Vercel, Stripe) peuvent transférer vos données hors de l'Union Européenne. 
                Ces transferts sont encadrés par des <strong>clauses contractuelles types</strong> approuvées par 
                la Commission européenne, garantissant un niveau de protection équivalent au RGPD.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">11. Réclamation auprès de la CNIL</h2>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                <p className="text-blue-900 leading-relaxed mb-4">
                  Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation 
                  auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) :
                </p>
                <div className="bg-white rounded-lg p-4">
                  <p className="font-bold text-slate-900">CNIL</p>
                  <p className="text-slate-700">3 Place de Fontenoy - TSA 80715</p>
                  <p className="text-slate-700">75334 PARIS CEDEX 07</p>
                  <p className="text-slate-700">
                    Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">cnil.fr</a>
                  </p>
                </div>
              </div>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">12. Modifications</h2>
              <p className="text-slate-700 leading-relaxed">
                Cette politique de confidentialité peut être modifiée à tout moment. La version en vigueur 
                est toujours accessible sur cette page. Les modifications substantielles vous seront notifiées 
                par email.
              </p>
            </section>

            {/* Contact */}
            <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
              <h3 className="font-bold text-2xl mb-4 text-slate-900">
                Contact DPO (Délégué à la Protection des Données)
              </h3>
              <div className="space-y-2 text-slate-700">
                <p>Pour toute question sur vos données personnelles :</p>
                <p className="font-semibold">Email : <a href="mailto:contact@kilolab.fr" className="text-blue-600 hover:underline">contact@kilolab.fr</a></p>
                <p className="font-semibold">Objet : "RGPD - Demande de [votre demande]"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
