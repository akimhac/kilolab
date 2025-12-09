import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "Comment fonctionne le pressing au kilo ?",
    answer: "C'est simple ! Vous déposez votre linge en vrac dans un sac, il est pesé, lavé, séché et plié. Vous payez au poids (3€/kg) au lieu de payer à la pièce."
  },
  {
    question: "Dois-je trier mon linge ?",
    answer: "Non ! C'est l'avantage du pressing au kilo. Nos partenaires professionnels s'occupent du tri par couleur et matière."
  },
  {
    question: "Quel est le délai de traitement ?",
    answer: "Le délai standard est de 24h. Des options express (4h) et ultra-express (2h) sont disponibles selon les pressings."
  },
  {
    question: "Comment récupérer mon linge ?",
    answer: "Présentez votre ticket de dépôt ou le QR code depuis l'application au pressing partenaire."
  },
  {
    question: "Que faire en cas de problème ?",
    answer: "Contactez-nous dans les 48h suivant la récupération à contact@kilolab.fr. Nous traiterons votre réclamation rapidement."
  },
  {
    question: "Le pressing au kilo convient-il aux vêtements délicats ?",
    answer: "Pour les vêtements très délicats (soie, cachemire), nous recommandons le pressing traditionnel à la pièce. Le pressing au kilo est idéal pour le linge courant."
  }
];

export default function FAQ() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" /> Retour
          </button>
          <Link to="/" className="text-xl font-bold text-teal-600">Kilolab</Link>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 text-center">Questions fréquentes</h1>
        <p className="text-slate-600 text-center mb-12">Tout ce que vous devez savoir sur Kilolab</p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="font-semibold text-slate-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">Vous ne trouvez pas votre réponse ?</p>
          <button
            onClick={() => navigate('/contact')}
            className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition"
          >
            Contactez-nous
          </button>
        </div>
      </div>
    </div>
  );
}
