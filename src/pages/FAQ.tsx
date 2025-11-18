import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'Comment fonctionne Kilolab ?',
    answer: 'Kilolab vous permet de trouver des pressings partenaires près de chez vous. Vous déposez votre linge au poids (kg), le pressing le lave et vous le récupérez propre 24h à 96h plus tard selon la formule choisie.'
  },
  {
    question: 'Quels sont les tarifs ?',
    answer: 'Nous proposons 3 formules : Premium (5€/kg, 72-96h), Express (10€/kg, 24h), et Ultra Express (15€/kg, 6h). Le prix comprend lavage, séchage et pliage.'
  },
  {
    question: 'Y a-t-il un poids minimum ?',
    answer: 'Non, pas de poids minimum. Cependant, nous recommandons un minimum de 2-3kg pour optimiser le traitement.'
  },
  {
    question: 'Comment est pesé mon linge ?',
    answer: 'Votre linge est pesé par le pressing partenaire sur une balance certifiée. Vous recevez une notification avec le poids exact et le montant avant validation.'
  },
  {
    question: 'Puis-je annuler ma commande ?',
    answer: 'Oui, avant le dépôt du linge au pressing. Une fois déposé, l\'annulation n\'est plus possible car le traitement commence immédiatement.'
  },
  {
    question: 'Que faire en cas de problème ?',
    answer: 'Contactez directement le pressing concerné en premier lieu. Si le problème persiste, notre support est disponible à contact@kilolab.fr.'
  },
  {
    question: 'Les pressings sont-ils fiables ?',
    answer: 'Tous nos pressings partenaires sont vérifiés et certifiés. Ils respectent les normes professionnelles les plus strictes.'
  },
  {
    question: 'Puis-je payer au pressing ?',
    answer: 'Cela dépend du pressing partenaire. La plupart acceptent le paiement en ligne sécurisé via Stripe, certains acceptent aussi le paiement sur place.'
  },
];

export default function FAQ() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Questions fréquentes
          </h1>
          <p className="text-xl text-slate-600">
            Tout ce que vous devez savoir sur Kilolab
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-blue-50 transition"
              >
                <span className="font-bold text-lg text-slate-900">{faq.question}</span>
                <ChevronDown
                  className={`w-6 h-6 text-blue-600 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="text-slate-700 mb-6">
            Notre équipe est là pour vous aider
          </p>
          
            href="mailto:contact@kilolab.fr"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-xl transition"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  );
}
