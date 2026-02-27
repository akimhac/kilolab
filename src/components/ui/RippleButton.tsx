import { ButtonHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '../../lib/utils';

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  ripple?: boolean;
}

interface Ripple {
  x: number;
  y: number;
  id: number;
}

export const RippleButton = forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, ripple = true, children, onClick, disabled, ...props }, ref) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!ripple || disabled || loading) return;
      
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples(prev => [...prev, { x, y, id }]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 600);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(e);
      onClick?.(e);
    };

    const variants = {
      primary: 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-teal-500/25',
      secondary: 'bg-white border-2 border-slate-200 text-slate-700 hover:border-teal-500 hover:text-teal-600',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
      danger: 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-lg hover:shadow-red-500/25',
      success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/25',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-xl',
      md: 'px-6 py-3 text-base rounded-2xl',
      lg: 'px-8 py-4 text-lg rounded-2xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'relative overflow-hidden font-bold transition-all duration-300',
          'active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          'hover:scale-[1.02]',
          variants[variant],
          sizes[size],
          className
        )}
        onClick={handleClick}
        disabled={disabled || loading}
        {...props}
      >
        {/* Ripple effects */}
        {ripples.map(({ x, y, id }) => (
          <span
            key={id}
            className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
            style={{
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
        
        {/* Loading spinner */}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center bg-inherit">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </span>
        )}
        
        {/* Content */}
        <span className={cn('relative z-10 flex items-center justify-center gap-2', loading && 'opacity-0')}>
          {children}
        </span>
      </button>
    );
  }
);

RippleButton.displayName = 'RippleButton';

// CSS for ripple animation - add to your global styles or tailwind config
// @keyframes ripple {
//   0% { width: 0; height: 0; opacity: 0.5; }
//   100% { width: 500px; height: 500px; opacity: 0; }
// }
// .animate-ripple { animation: ripple 0.6s linear; }
