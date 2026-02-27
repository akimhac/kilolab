import Lottie from 'lottie-react';
import { 
  washingMachineAnimation, 
  checkmarkAnimation, 
  deliveryAnimation, 
  basketAnimation,
  moneyAnimation 
} from './LottieData';

interface LottieIconProps {
  size?: number;
  className?: string;
  loop?: boolean;
}

export function WashingMachineIcon({ size = 80, className = '', loop = true }: LottieIconProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <Lottie 
        animationData={washingMachineAnimation} 
        loop={loop}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export function CheckmarkIcon({ size = 60, className = '', loop = false }: LottieIconProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <Lottie 
        animationData={checkmarkAnimation} 
        loop={loop}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export function DeliveryIcon({ size = 120, className = '', loop = true }: LottieIconProps) {
  return (
    <div className={className} style={{ width: size, height: size / 2 }}>
      <Lottie 
        animationData={deliveryAnimation} 
        loop={loop}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export function BasketIcon({ size = 80, className = '', loop = true }: LottieIconProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <Lottie 
        animationData={basketAnimation} 
        loop={loop}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export function MoneyIcon({ size = 80, className = '', loop = true }: LottieIconProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <Lottie 
        animationData={moneyAnimation} 
        loop={loop}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

// Export all icons
export const LottieIcons = {
  WashingMachine: WashingMachineIcon,
  Checkmark: CheckmarkIcon,
  Delivery: DeliveryIcon,
  Basket: BasketIcon,
  Money: MoneyIcon,
};

export default LottieIcons;
