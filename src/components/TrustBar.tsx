import { Clock, ThumbsUp, Truck } from 'lucide-react';

const items = [
  { icon: Clock, text: "Prêt en 24h", subtext: "Livraison rapide" },
  { icon: ThumbsUp, text: "Satisfait ou relavé", subtext: "Qualité garantie" },
  { icon: Truck, text: "Collecte & livraison", subtext: "À domicile ou au bureau" },
];

export default function TrustBar() {
  return (
    <div className="bg-white py-4 border-b border-gray-100 overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-start md:justify-around items-center gap-6 md:gap-0 min-w-max md:min-w-0">
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 flex-shrink-0">
              <item.icon className="h-5 w-5 text-teal-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{item.text}</p>
                <p className="text-xs text-gray-500 hidden sm:block">{item.subtext}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
