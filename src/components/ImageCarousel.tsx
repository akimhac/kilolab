import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  {
    url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&q=80',
    alt: 'Machine à laver professionnelle',
    caption: 'Équipement professionnel de pointe'
  },
  {
    url: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&q=80',
    alt: 'Vêtements propres pliés',
    caption: 'Pliage impeccable et soigné'
  },
  {
    url: 'https://images.unsplash.com/photo-1545434492-3bf4d27f0e9b?w=800&q=80',
    alt: 'Pressing professionnel',
    caption: 'Service express 24h disponible'
  },
  {
    url: 'https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=800&q=80',
    alt: 'Linge fraîchement lavé',
    caption: 'Fraîcheur et propreté garanties'
  },
  {
    url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
    alt: 'Blanchisserie moderne',
    caption: 'Technologie de nettoyage avancée'
  }
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className="relative w-full h-full"
        >
          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-8 left-8 right-8"
          >
            <p className="text-white text-2xl font-bold drop-shadow-lg">
              {images[currentIndex].caption}
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl hover:bg-white transition-all z-10"
        aria-label="Image précédente"
      >
        <ChevronLeft className="w-6 h-6 text-slate-900" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl hover:bg-white transition-all z-10"
        aria-label="Image suivante"
      >
        <ChevronRight className="w-6 h-6 text-slate-900" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
