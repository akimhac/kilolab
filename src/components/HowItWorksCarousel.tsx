import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Sparkles, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: Search,
    title: 'Trouvez votre pressing',
    description: 'Recherchez un pressing partenaire près de chez vous',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-100'
  },
  {
    number: 2,
    icon: Package,
    title: 'Déposez votre linge',
    description: 'Apportez votre linge dans un point relais',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-100'
  },
  {
    number: 3,
    icon: Sparkles,
    title: 'Nettoyage professionnel',
    description: 'Votre linge est lavé, séché et plié avec soin',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-100'
  },
  {
    number: 4,
    icon: CheckCircle,
    title: 'Récupérez-le propre',
    description: 'Votre linge vous attend, impeccable',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-100'
  }
];

export default function HowItWorksCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % steps.length);
  };

  const currentStep = steps[currentIndex];
  const Icon = currentStep.icon;

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full flex items-center justify-center"
        >
          <div className="text-center px-8">
            {/* Numéro */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${currentStep.color} text-white text-4xl font-black flex items-center justify-center mx-auto mb-6 shadow-2xl`}
            >
              {currentStep.number}
            </motion.div>

            {/* Icône */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
              className={`w-20 h-20 rounded-2xl ${currentStep.bgColor} flex items-center justify-center mx-auto mb-6`}
            >
              <Icon className="w-10 h-10 text-slate-700" />
            </motion.div>

            {/* Titre */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-black text-slate-900 mb-4"
            >
              {currentStep.title}
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-slate-600 max-w-md mx-auto"
            >
              {currentStep.description}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center z-10"
        aria-label="Étape précédente"
      >
        <ChevronLeft className="w-6 h-6 text-slate-900" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center z-10"
        aria-label="Étape suivante"
      >
        <ChevronRight className="w-6 h-6 text-slate-900" />
      </button>

      {/* Indicateurs */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all rounded-full ${
              index === currentIndex
                ? 'w-12 h-3 bg-blue-600'
                : 'w-3 h-3 bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Aller à l étape ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
