import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Euro, TrendingDown, Sparkles, Clock, Package } from 'lucide-react';

export default function EconomiserPressing() {
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
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
            Astuces & Économies
          </span>
        </div>

        <h1 className="text-5xl font-black text-slate-900 mb-6">
          Comment économiser sur son pressing : 7 astuces infaillibles
        </h1>

        <div className="flex items-center gap-4 text-slate-600 mb-8">
          <span>Par l'équipe Kilolab</span>
          <span>•</span>
          <span>8 min de lecture</span>
          <span>•</span>
          <span>Mars 2025</span>
        </div>

        <img 
          src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=1200&q=80" 
          alt="Économiser sur son pressing"
          className="w-full h-96 object-cover rounded-2xl mb-8"
        />

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed mb-8">
            Le pressing est un service pratique, mais les coûts peuvent vite grimper si on n'y prend pas garde. 
            Voici comment <strong>réduire votre facture de pressing de 30 à 50%</strong> sans sacrifier la qualité.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-8">
            <p className="text-slate-700 font-semibold">
              💡 <strong>Le saviez-vous ?</strong> Un ménage français dépense en moyenne 600€/an en pressing. 
              Avec nos astuces, vous pouvez économiser jusqu'à 300€ !
            </p>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6 flex items-center gap-3">
            <Euro className="w-8 h-8 text-blue-600" />
            1. Optez pour le pressing au kilo
          </h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Le tarif à la pièce est souvent 40% plus cher que le tarif au kilo. Avec Kilolab, 
            vous payez <strong>3,50€/kg en formule Standard</strong> au lieu de 5-8€ par pièce chez les pressings traditionnels.
          </p>
          <div className="bg-slate-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-slate-900 mb-3">Exemple concret :</h3>
            <ul className="space-y-2 text-slate-700">
              <li>• 5 chemises (2kg) : <span className="line-through">25€</span> → <strong className="text-green-600">7€</strong> (économie : 18€)</li>
              <li>• 3 pantalons (1,5kg) : <span className="line-through">21€</span> → <strong className="text-green-600">5,25€</strong> (économie : 15,75€)</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6 flex items-center gap-3">
            <TrendingDown className="w-8 h-8 text-blue-600" />
            2. Choisissez la bonne formule
          </h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Si vous n'êtes pas pressé, la <strong>formule Standard (48-72h)</strong> est 30% moins chère que l'Express. 
            Planifiez vos dépôts en début de semaine pour récupérer tranquillement le week-end.
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6 flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            3. Groupez vos dépôts
          </h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Au lieu de déposer 2kg par semaine, déposez 8kg une fois par mois. Vous économisez :
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 mb-6">
            <li>Les frais de déplacement (essence, temps)</li>
            <li>Les potentiels frais de service minimum</li>
            <li>Vous optimisez votre temps</li>
          </ul>

          <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-blue-600" />
            4. Triez avant de déposer
          </h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Certains vêtements n'ont pas besoin d'un nettoyage professionnel à chaque fois :
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 mb-6">
            <li><strong>T-shirts basiques</strong> : Lavage maison suffit</li>
            <li><strong>Jeans</strong> : Tous les 5-6 ports seulement</li>
            <li><strong>Vestes</strong> : Aération + nettoyage pressing 2x/an</li>
            <li><strong>Chemises importantes</strong> : Pressing obligatoire pour un rendu impeccable</li>
          </ul>

          <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6 flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" />
            5. Entretenez vos vêtements au quotidien
          </h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Plus vos vêtements sont bien entretenus, moins vous aurez besoin du pressing :
          </p>
          <div className="bg-green-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-green-900 mb-3">Nos tips d'entretien :</h3>
            <ul className="space-y-2 text-slate-700">
              <li>✓ Aérez vos vêtements après chaque port (1h fenêtre ouverte)</li>
              <li>✓ Utilisez un défroisseur vapeur pour les plis légers</li>
              <li>✓ Traitez les taches immédiatement (eau froide + savon)</li>
              <li>✓ Brossez vos manteaux après chaque sortie</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6">
            6. Profitez du programme parrainage
          </h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Avec Kilolab, parrainez vos amis et gagnez <strong>10€ par filleul</strong> ! 
            Eux aussi reçoivent 10€. En parrainant 3 amis, vous économisez 30€ sur vos prochaines commandes.
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6">
            7. Utilisez les points relais
          </h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Les pressings en point relais (comme Kilolab) sont <strong>25% moins chers</strong> que les boutiques en centre-ville. 
            Vous économisez aussi sur le stationnement et le temps de trajet.
          </p>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white mt-12">
            <h2 className="text-3xl font-bold mb-4">Récapitulatif : votre plan d'économies</h2>
            <ul className="space-y-3 text-lg">
              <li>✓ Passez au pressing au kilo → <strong>-40%</strong></li>
              <li>✓ Choisissez Standard au lieu d'Express → <strong>-30%</strong></li>
              <li>✓ Groupez vos dépôts → <strong>-15%</strong></li>
              <li>✓ Entretenez au quotidien → <strong>-20%</strong></li>
            </ul>
            <p className="text-xl font-bold mt-6 text-blue-100">
              Total économisé : jusqu'à <span className="text-white text-3xl">300€/an</span> 🎉
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 mt-12 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Prêt à économiser sur votre pressing ?
            </h3>
            <p className="text-slate-600 mb-6">
              Essayez Kilolab dès maintenant et constatez la différence
            </p>
            <button
              onClick={() => navigate('/partners-map')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition"
            >
              Trouver un pressing près de chez moi
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
