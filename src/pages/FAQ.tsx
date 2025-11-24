import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import SchemaOrg from '../components/SchemaOrg';

export default function FAQ() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const faqSchemaData = {
  questions: faqs.flatMap(category => 
    category.questions.map(q => ({
      question: q.q,
      answer: q.a
    }))
  )
};

  const faqs = [
    {
      category: "Pour les clients",
      questions: [
        {
          q: "Comment fonctionne Kilolab ?",
          a: "C'est simple : 1) Choisissez un pressing près de chez vous sur la carte. 2) Réservez en ligne en indiquant le poids de votre linge. 3) Déposez votre linge au pressing. 4) Récupérez-le propre, plié et repassé en 24h (Express) ou 48-72h (Standard)."
        },
        {
          q: "Combien ça coûte ?",
          a: "Nos tarifs sont simples et transparents : Standard (48-72h) : 3,50€/kg • Express (24h) : 5€/kg. Le prix exact vous est indiqué avant paiement. Exemple : 5kg en Standard = 17,50€."
        },
        {
          q: "Comment est calculé le poids ?",
          a: "Vous estimez le poids lors de la réservation (pour le paiement en ligne). Le pressing pèse ensuite exactement votre linge lors du dépôt. Si le poids réel diffère de plus de 10%, nous ajustons la facture."
        },
        {
          q: "Quels vêtements puis-je confier ?",
          a: "Tous vos vêtements du quotidien : t-shirts, pantalons, chemises, pulls, jeans, sous-vêtements, serviettes, draps... Pour les pièces délicates (soie, cachemire, costumes), vérifiez avec le pressing au moment du dépôt."
        },
        {
          q: "Que faire si un vêtement est abîmé ?",
          a: "Chaque pressing partenaire est assuré. En cas de problème, contactez immédiatement le pressing ET notre support via contact@kilolab.fr avec photos. Nous traitons chaque réclamation sous 48h."
        },
        {
          q: "Puis-je annuler ma commande ?",
          a: "Oui, gratuitement jusqu'à 2h avant le créneau de dépôt prévu. Après le dépôt du linge, l'annulation n'est plus possible car le nettoyage est lancé."
        },
        {
          q: "Comment payer ?",
          a: "Paiement 100% sécurisé par carte bancaire en ligne via Stripe. Nous acceptons Visa, Mastercard, American Express. Le paiement est effectué lors de la réservation."
        },
        {
          q: "Et si je ne suis pas satisfait ?",
          a: "Satisfaction garantie ou remboursé ! Si le résultat ne vous convient pas, signalez-le dans les 24h suivant la récupération. Nous traitons personnellement chaque cas."
        }
      ]
    },
    {
      category: "Pour les pressings partenaires",
      questions: [
        {
          q: "Comment devenir pressing partenaire ?",
          a: "Cliquez sur 'Devenir partenaire' en haut du site. Remplissez le formulaire avec vos informations (SIRET, adresse, contact). Nous validons votre dossier sous 24-48h et vous recevez vos accès au dashboard."
        },
        {
          q: "Combien coûte l'inscription ?",
          a: "L'inscription est 100% GRATUITE. Vous bénéficiez même du 1er mois sans commission (pour les 100 premiers inscrits). Ensuite, nous prélevons seulement 10% de commission sur chaque commande. Aucun abonnement, aucun frais fixe."
        },
        {
          q: "Comment reçois-je les paiements ?",
          a: "Les paiements sont automatiques via Stripe Connect. Le client paie en ligne, nous prélevons notre commission (10%), et vous recevez 90% directement sur votre compte bancaire sous 2-7 jours ouvrés."
        },
        {
          q: "Puis-je refuser une commande ?",
          a: "Oui, vous avez 2h pour accepter ou refuser une commande. Si vous la refusez, le client en est informé automatiquement et peut choisir un autre pressing. Attention : un taux de refus élevé impacte votre visibilité."
        },
        {
          q: "Comment gérer mes horaires ?",
          a: "Dans votre dashboard partenaire, section 'Paramètres' > 'Horaires'. Vous pouvez définir vos horaires d'ouverture, vos jours de congés, et même vous mettre en 'Pause' temporairement."
        },
        {
          q: "Que se passe-t-il en cas de litige client ?",
          a: "Kilolab vous soutient. En cas de litige, notre équipe analyse la situation. Si le client a tort, nous le gérons. Si c'est justifié, nous vous aidons à trouver une solution amiable. Vous êtes assuré pour les dommages."
        }
      ]
    },
    {
      category: "Technique et sécurité",
      questions: [
        {
          q: "Mes données bancaires sont-elles sécurisées ?",
          a: "Oui, 100%. Nous utilisons Stripe, leader mondial du paiement en ligne (utilisé par Amazon, Google, etc.). Kilolab ne stocke JAMAIS vos données bancaires. Toutes les transactions sont cryptées selon les normes PCI-DSS niveau 1."
        },
        {
          q: "Comment mes données personnelles sont-elles protégées ?",
          a: "Nous sommes conformes RGPD. Vos données (nom, email, adresse) sont stockées de manière sécurisée et ne sont JAMAIS vendues à des tiers. Seul le pressing choisi reçoit les infos nécessaires pour traiter votre commande."
        },
        {
          q: "Puis-je supprimer mon compte ?",
          a: "Oui, à tout moment. Allez dans 'Mon profil' > 'Supprimer mon compte'. Toutes vos données seront effacées sous 30 jours (délai légal pour les factures). Vous recevrez une confirmation par email."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
        </div>
      </nav>
      
    <SchemaOrg type="FAQPage" data={faqSchemaData} />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* ... reste du code ... */}
    </div>
  </>
);
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black text-slate-900 mb-6">
            Questions Fréquentes
          </h1>
          <p className="text-xl text-slate-600">
            Toutes les réponses à vos questions sur Kilolab
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="mb-12">
              <h2 className="text-2xl font-black text-slate-900 mb-6">
                {category.category}
              </h2>

              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = catIndex * 100 + faqIndex;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div
                      key={faqIndex}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition"
                      >
                        <span className="font-bold text-lg text-slate-900 pr-4">
                          {faq.q}
                        </span>
                        {isOpen ? (
                          <Minus className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        ) : (
                          <Plus className="w-6 h-6 text-slate-400 flex-shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-5">
                          <p className="text-slate-600 leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-black mb-6">
            Vous n'avez pas trouvé votre réponse ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Notre équipe est là pour vous aider
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="px-12 py-5 bg-white text-blue-600 rounded-xl font-bold text-xl hover:shadow-2xl transition transform hover:scale-105"
          >
            Contactez-nous
          </button>
        </div>
      </section>
    </div>
  );
}
