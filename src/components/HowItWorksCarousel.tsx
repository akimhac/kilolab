import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    number: '1',
    title: 'Trouvez votre pressing',
    description: 'Découvrez nos 2600+ pressings partenaires près de chez vous',
    image: 'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?w=800&q=80',
    bgColor: 'from-blue-500 to-cyan-500'
  },
  {
    number: '2',
    title: 'Déposez votre linge',
    description: 'Apportez votre linge au pressing. Il est pesé sur place pour un tarif transparent',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&q=80',
    bgColor: 'from-purple-500 to-pink-500'
  },
  {
    number: '3',
    title: 'Nettoyage professionnel',
    description: 'Votre linge est lavé, séché et plié par des experts avec du matériel pro',
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&q=80',
    bgColor: 'from-orange-500 to-red-500'
  },
  {
    number: '4',
    title: 'Récupérez impeccable',
    description: 'Récupérez votre linge propre en 24h (Express) ou 48-72h (Standard)',
    image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80',
    bgColor: 'from-green-500 to-emerald-500'
  }
];

export default function HowItWorksCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative w-full h-full">
      {/* Carrousel principal */}
      <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl">
        {/* Background avec gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.bgColor} transition-all duration-700`} />

        {/* Image avec overlay */}
        <div className="absolute inset-0">
          <img
            src={currentSlideData.image}
            alt={currentSlideData.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Contenu */}
        <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
          {/* Numéro de l'étape */}
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-white/40">
              <span className="text-3xl font-black text-white">
                {currentSlideData.number}
              </span>
            </div>
          </div>

          {/* Titre */}
          <h3 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
            {currentSlideData.title}
          </h3>

          {/* Description */}
          <p className="text-lg text-white/90 mb-6 max-w-lg leading-relaxed">
            {currentSlideData.description}
          </p>

          {/* Navigation dots */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-12 bg-white'
                    : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Aller à l'étape ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Boutons de navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all group"
          aria-label="Slide précédent"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all group"
          aria-label="Slide suivant"
        >
          <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Badge "Comment ça marche" en haut */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-white px-6 py-2 rounded-full shadow-xl border-2 border-blue-100">
          <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            COMMENT ÇA MARCHE
          </span>
        </div>
      </div>
    </div>
  );
}
