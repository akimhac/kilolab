import { useState, useRef, useEffect, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ "0-0": true });

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // FAQ data using translations
  const faqs = [
    {
      category: t('faq.categories.service'),
      questions: [
        { question: t('faq.questions.howItWorks'), answer: t('faq.questions.howItWorksAnswer') },
        { question: t('faq.questions.sorting'), answer: t('faq.questions.sortingAnswer') },
        { question: t('faq.questions.clothes'), answer: t('faq.questions.clothesAnswer') },
      ]
    },
    {
      category: t('faq.categories.delivery'),
      questions: [
        { question: t('faq.questions.deliveryTime'), answer: t('faq.questions.deliveryTimeAnswer') },
        { question: t('faq.questions.pickup'), answer: t('faq.questions.pickupAnswer') },
        { question: t('faq.questions.chooseWasher'), answer: t('faq.questions.chooseWasherAnswer') },
      ]
    },
    {
      category: t('faq.categories.payment'),
      questions: [
        { question: t('faq.questions.billing'), answer: t('faq.questions.billingAnswer') },
        { question: t('faq.questions.promo'), answer: t('faq.questions.promoAnswer') },
        { question: t('faq.questions.referral'), answer: t('faq.questions.referralAnswer') },
      ]
    },
    {
      category: t('faq.categories.issues'),
      questions: [
        { question: t('faq.questions.orderIssue'), answer: t('faq.questions.orderIssueAnswer') },
        { question: t('faq.questions.insurance'), answer: t('faq.questions.insuranceAnswer') },
      ]
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('faq.title')} | Kilolab</title>
        <meta name="description" content={t('faq.subtitle')} />
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
                {t('faq.badge')}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t('faq.title')}
              </h1>
              <p className="text-xl text-slate-400">
                {t('faq.subtitle')}
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
                {t('faq.ctaTitle')}
              </h2>
              <p className="text-slate-600 mb-8">
                {t('faq.ctaSubtitle')}
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {t('faq.ctaButton')}
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
