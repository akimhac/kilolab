import { Calculator, TrendingDown } from 'lucide-react';

export default function PriceComparator() {
  const items = [
    { name: 'Chemise', traditional: 8, kilolab: 1.75, weight: 0.15 },
    { name: 'Pantalon', traditional: 10, kilolab: 2.33, weight: 0.4 },
    { name: 'Pull', traditional: 12, kilolab: 2.80, weight: 0.8 },
    { name: 'Veste', traditional: 18, kilolab: 4.20, weight: 1.2 },
    { name: 'Manteau', traditional: 25, kilolab: 7.00, weight: 2.0 }
  ];

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900">
            Comparateur de prix
          </h3>
          <p className="text-slate-600">
            Pressing traditionnel vs Kilolab (au kilo)
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const savings = ((item.traditional - item.kilolab) / item.traditional * 100);
          
          return (
            <div key={item.name} className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900">{item.name}</span>
                <span className="text-xs text-slate-500">~{item.weight}kg</span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Traditionnel</p>
                  <p className="font-bold text-slate-900">{item.traditional.toFixed(2)}€</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Kilolab</p>
                  <p className="font-bold text-blue-600">{item.kilolab.toFixed(2)}€</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-1">Économie</p>
                  <p className="font-bold text-green-600 flex items-center justify-end gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {savings.toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-green-600 rounded-xl text-white text-center">
        <p className="text-sm mb-1">Économie moyenne</p>
        <p className="text-3xl font-black">
          {(items.reduce((sum, item) => 
            sum + ((item.traditional - item.kilolab) / item.traditional * 100), 0
          ) / items.length).toFixed(0)}%
        </p>
      </div>
    </div>
  );
}
