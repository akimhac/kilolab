import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Trouvez votre pressing',
    description: 'Recherchez un pressing partenaire près de chez vous sur notre carte interactive',
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    number: 2,
    title: 'Déposez votre linge',
    description: 'Apportez votre linge au pressing. Pesée sur place, tarif transparent',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&q=80',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    number: 3,
    title: 'Nettoyage professionnel',
    description: 'Votre linge est lavé, séché et plié par des experts avec du matériel pro',
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&q=80',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    number: 4,
    title: 'Récupérez-le propre',
    description: 'Récupérez votre linge impeccable en 24h à 72h selon la formule choisie',
    image: 'https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=800&q=80',
    gradient: 'from-green-500 to-emerald-500'
  }
];

export default function HowItWorksCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % steps.length);
  };

  const currentStep = steps[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl overflow-hidden shadow-2xl">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0"
        >
          {/* Image de fond */}
          <div className="absolute inset-0">
            <img
              src={currentStep.image}
              alt={currentStep.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </div>

          {/* Contenu */}
          <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
            {/* Numéro de l'étape */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${currentStep.gradient} text-white text-3xl font-black shadow-2xl mb-4`}
            >
              {currentStep.number}
            </motion.div>

            {/* Titre */}
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg"
            >
              {currentStep.title}
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/90 max-w-2xl drop-shadow-lg leading-relaxed"
            >
              {currentStep.description}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Boutons de navigation */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/95 backdrop-blur-sm shadow-2xl hover:bg-white hover:scale-110 transition-all flex items-center justify-center z-20 group"
        aria-label="Étape précédente"
      >
        <ChevronLeft className="w-7 h-7 text-slate-900 group-hover:text-blue-600 transition" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/95 backdrop-blur-sm shadow-2xl hover:bg-white hover:scale-110 transition-all flex items-center justify-center z-20 group"
        aria-label="Étape suivante"
      >
        <ChevronRight className="w-7 h-7 text-slate-900 group-hover:text-blue-600 transition" />
      </button>

      {/* Indicateurs de progression */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`transition-all rounded-full ${
              index === currentIndex
                ? 'w-12 h-3 bg-white'
                : 'w-3 h-3 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Aller à l'étape ${index + 1}`}
          />
        ))}
      </div>

      {/* Badge "Comment ça marche" */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-xl">
          <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">
            Comment ça marche
          </p>
        </div>
      </div>
    </div>
  );
}
