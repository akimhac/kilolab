import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, TrendingUp, Zap, Clock } from 'lucide-react';

export default function LaverVsPressing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button onClick={() => navigate('/blog')} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition">
            <ArrowLeft className="w-5 h-5" />
            Retour au blog
          </button>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
            Comparatif & Analyse
          </span>
        </div>

        <h1 className="text-5xl font-black text-slate-900 mb-6">
          Laver à la maison VS Pressing : Le vrai coût en 2025
        </h1>

        <div className="flex items-center gap-4 text-slate-600 mb-8">
          <span>Par l'équipe Kilolab</span>
          <span>•</span>
          <span>12 min de lecture</span>
          <span>•</span>
          <span>Mars 2025</span>
        </div>

        <img 
          src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=1200&q=80" 
          alt="Laver vs Pressing"
          className="w-full h-96 object-cover rounded-2xl mb-8"
        />

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed mb-8">
            "Le pressing coûte cher, je préfère laver chez moi." Vraiment ? 
            Nous avons fait les calculs pour vous : <strong>la réponse pourrait vous surprendre</strong>.
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6">
            💶 Le coût RÉEL du lavage à domicile
          </h2>

          <p className="text-slate-700 leading-relaxed mb-6">
            Beaucoup pensent que laver chez soi ne coûte "presque rien". Détaillons les vrais coûts :
          </p>

          <div className="bg-slate-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Coût par machine (7kg) :</h3>
            <table className="w-full">
              <tbody className="text-slate-700">
                <tr className="border-b">
                  <td className="py-3">Électricité (60°C)</td>
                  <td className="py-3 text-right font-semibold">1,20€</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Eau (50L)</td>
                  <td className="py-3 text-right font-semibold">0,25€</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Lessive</td>
                  <td className="py-3 text-right font-semibold">0,50€</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Adoucissant</td>
                  <td className="py-3 text-right font-semibold">0,30€</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Séchage (sèche-linge)</td>
                  <td className="py-3 text-right font-semibold">1,50€</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Amortissement machine (10 ans)</td>
                  <td className="py-3 text-right font-semibold">0,80€</td>
                </tr>
                <tr className="border-b font-bold text-lg">
                  <td className="py-3">TOTAL par machine</td>
                  <td className="py-3 text-right text-red-600">4,55€</td>
                </tr>
              </tbody>
            </table>
            <p className="text-sm text-slate-600 mt-4">
              Soit <strong>0,65€/kg</strong> (sans compter votre temps)
            </p>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6">
            ⏱️ Le coût de votre TEMPS
          </h2>

          <p className="text-slate-700 leading-relaxed mb-6">
            C'est le coût caché que personne ne compte. Calculons :
          </p>

          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Temps nécessaire par semaine :</h3>
            <ul className="space-y-3 text-slate-700">
              <li>• Trier le linge : <strong>15 min</strong></li>
              <li>• Lancer 2 machines : <strong>10 min</strong></li>
              <li>• Étendre/mettre au sèche-linge : <strong>20 min</strong></li>
              <li>• Plier et ranger : <strong>30 min</strong></li>
              <li>• Repasser (5 chemises) : <strong>40 min</strong></li>
            </ul>
            <p className="mt-4 text-lg font-bold text-blue-900">
              Total : <span className="text-2xl">1h55/semaine</span> = <strong>100h/an</strong>
            </p>
          </div>

          <p className="text-slate-700 leading-relaxed mb-6">
            Si vous valorisez votre temps à seulement 15€/h (SMIC), ce sont <strong>1500€/an</strong> de temps perdu. 
            Et on ne parle même pas du stress, de la fatigue, et des week-ends gâchés.
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6">
            🏆 Le coût du pressing au kilo (Kilolab)
          </h2>

          <div className="bg-green-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-green-900 mb-4">Tarifs Kilolab :</h3>
            <table className="w-full">
              <tbody className="text-slate-700">
                <tr className="border-b">
                  <td className="py-3">Standard (48-72h)</td>
                  <td className="py-3 text-right font-bold text-green-600 text-xl">3,50€/kg</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Express (24h)</td>
                  <td className="py-3 text-right font-bold text-green-600 text-xl">5€/kg</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 p-4 bg-white rounded-lg">
              <p className="font-semibold text-slate-900">Pour 7kg (une machine) :</p>
              <p className="text-2xl font-black text-green-600 mt-2">24,50€ en Standard</p>
              <p className="text-sm text-slate-600">Lavage + Séchage + Pliage + Livraison inclus</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6">
            📊 Le verdict : Comparaison complète
          </h2>

          <div className="overflow-x-auto mb-8">
            <table className="w-full bg-white border-2 border-slate-200 rounded-xl">
              <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <tr>
                  <th className="px-4 py-4 text-left">Critère</th>
                  <th className="px-4 py-4 text-center">Maison</th>
                  <th className="px-4 py-4 text-center">Kilolab</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b">
                  <td className="px-4 py-4 font-semibold">Coût (7kg)</td>
                  <td className="px-4 py-4 text-center">4,55€</td>
                  <td className="px-4 py-4 text-center font-bold text-green-600">24,50€</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-4 font-semibold">Temps investi</td>
                  <td className="px-4 py-4 text-center text-red-600">1h55</td>
                  <td className="px-4 py-4 text-center font-bold text-green-600">5 min</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-4 font-semibold">Qualité repassage</td>
                  <td className="px-4 py-4 text-center">⭐⭐</td>
                  <td className="px-4 py-4 text-center font-bold">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-4 font-semibold">Effort physique</td>
                  <td className="px-4 py-4 text-center text-red-600">Élevé</td>
                  <td className="px-4 py-4 text-center font-bold text-green-600">Aucun</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-4 font-semibold">Stress</td>
                  <td className="px-4 py-4 text-center text-red-600">Oui</td>
                  <td className="px-4 py-4 text-center font-bold text-green-600">Non</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6">
            🎯 Dans quels cas utiliser le pressing ?
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-900 mb-4">✅ Idéal pour :</h3>
              <ul className="space-y-2 text-slate-700">
                <li>• Chemises professionnelles</li>
                <li>• Costumes / Tailleurs</li>
                <li>• Linge délicat (soie, cachemire)</li>
                <li>• Rideaux / Couettes</li>
                <li>• Quand vous manquez de temps</li>
                <li>• Période chargée au travail</li>
              </ul>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4">🏠 Lavez chez vous :</h3>
              <ul className="space-y-2 text-slate-700">
                <li>• Linge de maison basique</li>
                <li>• T-shirts quotidiens</li>
                <li>• Sous-vêtements</li>
                <li>• Jeans (lavage espacé)</li>
                <li>• Vêtements de sport</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white mt-12">
            <h2 className="text-3xl font-bold mb-4">Le calcul final (pour 1 an)</h2>
            <div className="space-y-4 text-lg">
              <div className="flex justify-between items-center">
                <span>Lavage maison (coût matériel)</span>
                <span className="font-bold">240€</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Valeur de votre temps (100h × 15€)</span>
                <span className="font-bold">1 500€</span>
              </div>
              <div className="flex justify-between items-center border-t-2 border-white/30 pt-4">
                <span className="text-xl">Total réel maison :</span>
                <span className="font-black text-3xl">1 740€</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t-2 border-white/30">
              <div className="flex justify-between items-center">
                <span className="text-xl">Kilolab (50 kg/an) :</span>
                <span className="font-black text-3xl text-yellow-300">175€</span>
              </div>
            </div>
            <p className="text-xl font-bold mt-6 text-blue-100 text-center">
              Vous économisez <span className="text-white text-4xl">1 565€/an</span> de temps ! 🎉
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 mt-12 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Convaincu ? Essayez Kilolab
            </h3>
            <p className="text-slate-600 mb-6">
              Reprenez le contrôle de votre temps libre
            </p>
            <button
              onClick={() => navigate('/partners-map')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition"
            >
              Trouver un pressing maintenant
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
