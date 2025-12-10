import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IMAGES = [
  "https://images.unsplash.com/photo-1545173168-9f1947eebb8f?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517677208171-0bc6799a4c67?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1582735689369-4fe8d75b0b32?q=80&w=2000&auto=format&fit=crop"
];

export default function ImageCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-slate-100">
      <AnimatePresence mode='wait'>
        <motion.img
          key={index}
          src={IMAGES[index]}
          alt="Pressing service"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}
