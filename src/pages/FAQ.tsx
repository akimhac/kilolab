import { useState, useRef, useEffect, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle, MessageCircle, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Animation component
function AnimateOnScroll({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translateY(20px)',
        transition: `opacity 0.5s ease-out ${delay}ms, transform 0.5s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const faqs = [
  {
    category: "Service",
    questions: [
      {
        question: "Comment fonctionne Kilolab ?",
        answer: "C'est simple ! Passez commande, un Washer vient collecter votre linge, le lave, sèche et plie, puis vous le livre sous 48h. Vous payez au poids (dès 3€/kg)."
      },
      {
        question: "Dois-je trier mon linge ?",
        answer: "Non ! C'est l'avantage de Kilolab. Nos Washers s'occupent du tri par couleur et matière. Mettez tout dans un sac, on s'occupe du reste."
      },
      {
        question: "Quels vêtements puis-je faire laver ?",
        answer: "Tous vos vêtements du quotidien : t-shirts, pantalons, sous-vêtements, draps, serviettes... Pour les pièces délicates (soie, cachemire), nous recommandons un pressing traditionnel."
      },
    ]
  },
  {
    category: "Livraison",
    questions: [
      {
        question: "Quel est le délai de livraison ?",
        answer: "Formule Standard : 48-72h. Formule Express : 24h. Vous recevez des notifications à chaque étape."
      },
      {
        question: "Comment se passe la collecte ?",
        answer: "Choisissez un créneau de collecte lors de votre commande. Le Washer vient directement chez vous récupérer votre sac de linge."
      },
      {
        question: "Puis-je choisir mon Washer ?",
        answer: "Oui ! Lors de votre commande, vous pouvez sélectionner un Washer proche de chez vous ou laisser notre algorithme vous en attribuer un."
      },
    ]
  },
  {
    category: "Paiement",
    questions: [
      {
        question: "Comment fonctionne la facturation ?",
        answer: "Vous payez au poids. Le prix final est calculé après pesée par le Washer. Paiement 100% sécurisé par Stripe."
      },
      {
        question: "Puis-je utiliser un code promo ?",
        answer: "Oui ! Entrez votre code lors de l'étape paiement. Les codes sont cumulables avec le parrainage."
      },
      {
        question: "Comment fonctionne le parrainage ?",
        answer: "Partagez votre code unique avec vos amis. Vous recevez 10€ de crédit pour chaque filleul, et votre filleul reçoit aussi 10€ sur sa première commande."
      },
    ]
  },
  {
    category: "Problèmes",
    questions: [
      {
        question: "Que faire si j'ai un problème avec ma commande ?",
        answer: "Contactez-nous dans les 48h via contact@kilolab.fr ou depuis votre dashboard. Nous traitons toutes les réclamations sous 24h ouvrées."
      },
      {
        question: "Mon linge est-il assuré ?",
        answer: "Oui, tous les vêtements confiés sont couverts par notre assurance jusqu'à 500€ par commande en cas de dommage."
      },
    ]
  },
];

function FAQItem({ question, answer, isOpen, onClick, delay }: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void;
  delay: number;
}) {
  return (
    <AnimateOnScroll delay={delay}>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-shadow hover:shadow-md">
        <button
          onClick={onClick}
          className="w-full px-6 py-5 flex items-center justify-between text-left"
        >
          <span className="font-semibold text-slate-900 pr-4">{question}</span>
          <ChevronDown 
            className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
        <div 
          className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48' : 'max-h-0'}`}
        >
          <p className="px-6 pb-5 text-slate-600 leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </AnimateOnScroll>
  );
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ "0-0": true });

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <Helmet>
        <title>FAQ - Questions Fréquentes | Kilolab</title>
        <meta name="description" content="Trouvez les réponses à vos questions sur Kilolab : fonctionnement, tarifs, livraison, paiement et plus encore." />
        <link rel="canonical" href="https://kilolab.fr/faq" />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <Navbar />

        {/* Hero */}
        <header className="pt-32 pb-16 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <AnimateOnScroll>
              <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 text-teal-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <HelpCircle size={16} />
                Centre d'aide
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Questions fréquentes
              </h1>
              <p className="text-xl text-slate-400">
                Tout ce que vous devez savoir sur Kilolab
              </p>
            </AnimateOnScroll>
          </div>
        </header>

        {/* FAQ Content */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            {faqs.map((category, catIndex) => (
              <div key={catIndex} className="mb-12">
                <AnimateOnScroll delay={catIndex * 50}>
                  <h2 className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-6">
                    {category.category}
                  </h2>
                </AnimateOnScroll>
                <div className="space-y-3">
                  {category.questions.map((faq, qIndex) => (
                    <FAQItem
                      key={qIndex}
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openItems[`${catIndex}-${qIndex}`] || false}
                      onClick={() => toggleItem(`${catIndex}-${qIndex}`)}
                      delay={catIndex * 50 + qIndex * 30}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-white border-t border-slate-200">
          <div className="max-w-3xl mx-auto text-center">
            <AnimateOnScroll>
              <MessageCircle className="w-12 h-12 text-teal-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Vous n'avez pas trouvé votre réponse ?
              </h2>
              <p className="text-slate-600 mb-8">
                Notre équipe est disponible pour vous aider
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Nous contacter
                <ArrowRight size={18} />
              </Link>
            </AnimateOnScroll>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
