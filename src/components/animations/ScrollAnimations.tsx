import { useEffect, useRef, useState, ReactNode } from 'react';

// Hook pour détecter si un élément est visible
export function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// Composant FadeInOnScroll
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  className?: string;
}

export function FadeInOnScroll({ 
  children, 
  delay = 0, 
  direction = 'up',
  duration = 600,
  className = '' 
}: FadeInProps) {
  const { ref, isInView } = useInView(0.1);

  const getTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(40px)';
      case 'down': return 'translateY(-40px)';
      case 'left': return 'translateX(40px)';
      case 'right': return 'translateX(-40px)';
      default: return 'none';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'none' : getTransform(),
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Composant StaggerChildren - anime les enfants en cascade
interface StaggerProps {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export function StaggerChildren({ children, staggerDelay = 100, className = '' }: StaggerProps) {
  const { ref, isInView } = useInView(0.1);

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'none' : 'translateY(30px)',
            transition: `opacity 500ms ease-out ${index * staggerDelay}ms, transform 500ms ease-out ${index * staggerDelay}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// Composant CountUp - anime les nombres
interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountUp({ end, duration = 2000, prefix = '', suffix = '', className = '' }: CountUpProps) {
  const { ref, isInView } = useInView(0.3);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}

// Composant Parallax
interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ children, speed = 0.5, className = '' }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;
      setOffset(scrolled * speed * 0.1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  );
}

// Composant PulseOnHover
interface PulseProps {
  children: ReactNode;
  className?: string;
}

export function PulseOnHover({ children, className = '' }: PulseProps) {
  return (
    <div className={`group ${className}`}>
      <div className="transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
        {children}
      </div>
    </div>
  );
}

// Composant FloatingElement - animation flottante continue
interface FloatingProps {
  children: ReactNode;
  duration?: number;
  distance?: number;
  className?: string;
}

export function FloatingElement({ children, duration = 3, distance = 10, className = '' }: FloatingProps) {
  return (
    <div
      className={className}
      style={{
        animation: `floating ${duration}s ease-in-out infinite`,
      }}
    >
      {children}
      <style>{`
        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-${distance}px); }
        }
      `}</style>
    </div>
  );
}

// Composant GlowOnHover
interface GlowProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export function GlowOnHover({ children, color = 'rgba(20, 184, 166, 0.4)', className = '' }: GlowProps) {
  return (
    <div 
      className={`transition-shadow duration-300 hover:shadow-[0_0_30px_${color}] ${className}`}
    >
      {children}
    </div>
  );
}
