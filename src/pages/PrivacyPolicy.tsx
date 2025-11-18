import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
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
            <Shield className="w-12 h-12 text-green-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">Politique de Confidentialité</h1>
              <p className="text-white/60">Conforme au RGPD - Mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          <div className="space-y-8 text-white/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Database className="w-6 h-6" />
                1. Données collectées
              </h2>
              <p className="mb-4">Nous collectons les données suivantes :</p>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="font-bold text-white mb-3">Pour les clients :</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Nom, prénom, email, téléphone</li>
                  <li>Adresse de livraison (optionnelle)</li>
                  <li>Historique des commandes et paiements</li>
                  <li>Photos du linge (si fournies)</li>
                </ul>

                <h3 className="font-bold text-white mb-3 mt-6">Pour les partenaires (pressings) :</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Nom de l'établissement, email, téléphone</li>
                  <li>Adresse complète du pressing</li>
                  <li>Données bancaires (via Stripe, non stockées par KiloLab)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6" />
                2. Finalité du traitement
              </h2>
              <p className="mb-4">Vos données sont utilisées pour :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Gérer vos commandes et assurer la prestation de service</li>
                <li>Traiter les paiements de manière sécurisée</li>
                <li>Vous envoyer des notifications par email (pesée, commande prête)</li>
                <li>Améliorer nos services et notre plateforme</li>
                <li>Respecter nos obligations légales et réglementaires</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6" />
                3. Base légale du traitement
              </h2>
              <p>
                Le traitement de vos données repose sur :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li><strong>L'exécution d'un contrat</strong> : traitement de vos commandes</li>
                <li><strong>Votre consentement</strong> : envoi d'emails marketing (opt-in)</li>
                <li><strong>Une obligation légale</strong> : conservation des factures (10 ans)</li>
                <li><strong>L'intérêt légitime</strong> : amélioration de nos services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Durée de conservation</h2>
              <div className="bg-white/5 rounded-lg p-6 space-y-2">
                <p><strong>Données clients :</strong> 3 ans après la dernière commande</p>
                <p><strong>Données partenaires :</strong> Durée de la collaboration + 3 ans</p>
                <p><strong>Factures :</strong> 10 ans (obligation légale)</p>
                <p><strong>Cookies :</strong> 13 mois maximum</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Partage des données</h2>
              <p className="mb-4">Vos données ne sont <strong>jamais vendues</strong> à des tiers. Elles peuvent être partagées avec :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Nos partenaires pressings</strong> : uniquement les données nécessaires à la prestation</li>
                <li><strong>Stripe</strong> : pour le traitement sécurisé des paiements</li>
                <li><strong>Resend</strong> : pour l'envoi d'emails transactionnels</li>
                <li><strong>Supabase</strong> : hébergement sécurisé de la base de données (EU)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Vos droits (RGPD)</h2>
              <p className="mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="font-bold text-white mb-2">✅ Droit d'accès</p>
                  <p className="text-sm">Obtenir une copie de vos données</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="font-bold text-white mb-2">✏️ Droit de rectification</p>
                  <p className="text-sm">Corriger vos données inexactes</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="font-bold text-white mb-2">🗑️ Droit à l'effacement</p>
                  <p className="text-sm">Supprimer vos données</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="font-bold text-white mb-2">⛔ Droit d'opposition</p>
                  <p className="text-sm">Refuser un traitement</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="font-bold text-white mb-2">📦 Droit à la portabilité</p>
                  <p className="text-sm">Récupérer vos données</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="font-bold text-white mb-2">⏸️ Droit à la limitation</p>
                  <p className="text-sm">Limiter le traitement</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6" />
                7. Exercer vos droits
              </h2>
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6">
                <p className="font-bold text-green-200 mb-3">Pour toute demande concernant vos données :</p>
                <p className="text-white">
                  📧 Email : <a href="mailto:privacy@kilolab.fr" className="text-green-300 hover:underline font-bold">privacy@kilolab.fr</a>
                </p>
                <p className="text-white mt-2">
                  📮 Courrier : KiloLab - DPO, 10 Rue du Pressing, 75001 Paris
                </p>
                <p className="text-white/80 text-sm mt-4">
                  Nous nous engageons à répondre sous 1 mois maximum.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Sécurité</h2>
              <p>
                Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour protéger 
                vos données contre tout accès, modification, divulgation ou destruction non autorisés :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Chiffrement SSL/TLS (HTTPS)</li>
                <li>Authentification sécurisée</li>
                <li>Hébergement certifié ISO 27001</li>
                <li>Accès restreint aux données</li>
                <li>Sauvegardes régulières</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Cookies</h2>
              <p>
                Nous utilisons des cookies essentiels au fonctionnement du site et des cookies analytiques pour 
                améliorer votre expérience. Vous pouvez gérer vos préférences via le bandeau de consentement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Modifications</h2>
              <p>
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
                Les modifications entrent en vigueur dès leur publication sur cette page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Contact DPO</h2>
              <p>
                Pour toute question relative à cette politique de confidentialité, contactez notre 
                Délégué à la Protection des Données (DPO) :
              </p>
              <p className="mt-3 font-bold text-white">
                📧 dpo@kilolab.fr
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Autorité de contrôle</h2>
              <p>
                Vous avez le droit d'introduire une réclamation auprès de la Commission Nationale de l'Informatique 
                et des Libertés (CNIL) si vous estimez que vos droits ne sont pas respectés :
              </p>
              <div className="bg-white/5 rounded-lg p-6 mt-4">
                <p><strong>CNIL</strong></p>
                <p>3 Place de Fontenoy - TSA 80715</p>
                <p>75334 Paris Cedex 07</p>
                <p>Tél : 01 53 73 22 22</p>
                <p><a href="https://www.cnil.fr" className="text-blue-300 hover:underline">www.cnil.fr</a></p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
