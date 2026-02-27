// Multi-Services: Pressing, Repassage, Nettoyage Sneakers, Express 2h
import { useState } from 'react';
import { Shirt, Wind, Footprints, Zap, Clock, Check, ChevronRight, Sparkles } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  price: string;
  unit: string;
  duration: string;
  color: string;
  features: string[];
  popular?: boolean;
  isNew?: boolean;
}

const SERVICES: Service[] = [
  {
    id: 'standard',
    name: 'Lavage Standard',
    description: 'Lavage, séchage et pliage de votre linge du quotidien',
    icon: <Sparkles size={28} />,
    price: '3',
    unit: 'kg',
    duration: '48h',
    color: 'from-teal-500 to-emerald-500',
    features: ['Linge du quotidien', 'Lavage 40°C', 'Séchage doux', 'Pliage soigné'],
    popular: true,
  },
  {
    id: 'express',
    name: 'Lavage Express',
    description: 'Service prioritaire avec livraison en 24h garantie',
    icon: <Zap size={28} />,
    price: '5',
    unit: 'kg',
    duration: '24h',
    color: 'from-amber-500 to-orange-500',
    features: ['Priorité absolue', 'Livraison J+1', 'Suivi temps réel', 'Garantie ponctualité'],
  },
  {
    id: 'express_2h',
    name: 'Express 2h',
    description: 'Collecte en 2h chrono pour les urgences',
    icon: <Clock size={28} />,
    price: '8',
    unit: 'kg',
    duration: '2h collecte',
    color: 'from-red-500 to-pink-500',
    features: ['Collecte en 2h', 'Livraison J+1', 'SMS en temps réel', 'Washer dédié'],
    isNew: true,
  },
  {
    id: 'pressing',
    name: 'Pressing',
    description: 'Nettoyage à sec professionnel pour vos vêtements délicats',
    icon: <Shirt size={28} />,
    price: '5',
    unit: 'pièce',
    duration: '72h',
    color: 'from-purple-500 to-indigo-500',
    features: ['Chemises, costumes', 'Nettoyage à sec', 'Repassage pro', 'Sur cintre'],
  },
  {
    id: 'repassage',
    name: 'Repassage',
    description: 'Service de repassage uniquement pour linge propre',
    icon: <Wind size={28} />,
    price: '2',
    unit: 'pièce',
    duration: '48h',
    color: 'from-blue-500 to-cyan-500',
    features: ['Chemises parfaites', 'Pantalons', 'Pliage ou cintre', 'Sans lavage'],
  },
  {
    id: 'sneakers',
    name: 'Nettoyage Sneakers',
    description: 'Redonnez vie à vos baskets préférées',
    icon: <Footprints size={28} />,
    price: '15',
    unit: 'paire',
    duration: '5 jours',
    color: 'from-slate-600 to-slate-800',
    features: ['Nettoyage complet', 'Semelles blanches', 'Imperméabilisation', 'Photos avant/après'],
    isNew: true,
  },
];

export function ServiceCard({ 
  service, 
  selected, 
  onSelect 
}: { 
  service: Service; 
  selected: boolean; 
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
        selected 
          ? 'border-teal-500 bg-teal-50 shadow-lg scale-[1.02]' 
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Badges */}
      <div className="absolute top-3 right-3 flex gap-2">
        {service.popular && (
          <span className="px-2 py-0.5 bg-teal-500 text-white text-xs font-bold rounded-full">
            POPULAIRE
          </span>
        )}
        {service.isNew && (
          <span className="px-2 py-0.5 bg-purple-500 text-white text-xs font-bold rounded-full">
            NOUVEAU
          </span>
        )}
      </div>

      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white flex-shrink-0`}>
          {service.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-slate-900">{service.name}</h3>
          <p className="text-sm text-slate-500 mb-2">{service.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-black text-xl text-slate-900">{service.price}€<span className="text-sm font-normal text-slate-400">/{service.unit}</span></span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock size={14} /> {service.duration}
            </span>
          </div>
        </div>
        {selected && (
          <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
            <Check size={16} />
          </div>
        )}
      </div>
    </button>
  );
}

export function ServiceSelector({ 
  selected, 
  onSelect 
}: { 
  selected: string; 
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-black text-slate-900">Choisissez votre service</h3>
      <div className="grid gap-3">
        {SERVICES.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            selected={selected === service.id}
            onSelect={() => onSelect(service.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Service details modal
export function ServiceDetails({ 
  serviceId, 
  onClose,
  onSelect 
}: { 
  serviceId: string; 
  onClose: () => void;
  onSelect: () => void;
}) {
  const service = SERVICES.find(s => s.id === serviceId);
  if (!service) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-br ${service.color} p-6 text-white`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              {service.icon}
            </div>
            <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl">
              ✕
            </button>
          </div>
          <h2 className="text-2xl font-black">{service.name}</h2>
          <p className="text-white/80">{service.description}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Price */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <p className="text-slate-500 text-sm">Prix</p>
              <p className="text-3xl font-black text-slate-900">{service.price}€<span className="text-lg font-normal text-slate-400">/{service.unit}</span></p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-sm">Délai</p>
              <p className="text-xl font-bold text-slate-900">{service.duration}</p>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h4 className="font-bold text-slate-900 mb-3">Ce qui est inclus</h4>
            <div className="space-y-2">
              {service.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-teal-600" />
                  </div>
                  <span className="text-slate-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onSelect}
            className={`w-full py-4 bg-gradient-to-r ${service.color} text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all`}
          >
            Choisir ce service <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Horizontal service pills for quick selection
export function ServicePills({ 
  selected, 
  onSelect 
}: { 
  selected: string; 
  onSelect: (id: string) => void;
}) {
  const mainServices = SERVICES.filter(s => ['standard', 'express', 'express_2h'].includes(s.id));
  
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {mainServices.map((service) => (
        <button
          key={service.id}
          onClick={() => onSelect(service.id)}
          className={`flex-shrink-0 px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
            selected === service.id
              ? `bg-gradient-to-r ${service.color} text-white shadow-lg`
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {service.icon}
          <span className="font-bold text-sm">{service.name}</span>
          {service.isNew && (
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          )}
        </button>
      ))}
    </div>
  );
}

// Calculate price based on service and weight
export function calculatePrice(serviceId: string, weight: number, quantity: number = 1): number {
  const service = SERVICES.find(s => s.id === serviceId);
  if (!service) return 0;

  const pricePerUnit = parseFloat(service.price);
  
  if (service.unit === 'kg') {
    return pricePerUnit * weight;
  } else {
    return pricePerUnit * quantity;
  }
}

// Get service by ID
export function getServiceById(id: string): Service | undefined {
  return SERVICES.find(s => s.id === id);
}

export { SERVICES };
export default { ServiceSelector, ServiceCard, ServiceDetails, ServicePills, calculatePrice, getServiceById };
