import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import ClientPricing from '../components/ClientPricing';

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à l'accueil
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-black text-slate-900 mb-6">
            Nos tarifs
          </h1>
          <p className="text-2xl text-slate-600 mb-8">
            Des prix transparents, sans mauvaise surprise
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl inline-block">
            <div className="flex items-start gap-3 text-left">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-blue-900 font-semibold mb-2">Prix au kilogramme</p>
                <p className="text-blue-800">
                  Vous payez uniquement le poids de votre linge. Pesée précise au gramme près 
                  par nos pressings partenaires certifiés.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing component */}
      <ClientPricing />

      {/* FAQ Prix */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Questions fréquentes sur les tarifs
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Comment est pesé mon linge ?',
                a: 'Votre linge est pesé par le pressing partenaire sur une balance certifiée. Le poids est validé et vous recevez une notification avec le montant exact avant le début du traitement.'
              },
              {
                q: 'Y a-t-il un poids minimum ?',
                a: 'Non, il n\'y a pas de poids minimum. Cependant, la plupart des pressings recommandent un minimum de 2-3kg pour optimiser le traitement.'
              },
              {
                q: 'Que comprend le prix ?',
                a: 'Le prix au kilo comprend le lavage, le séchage, le repassage et le pliage de votre linge. Tout est inclus, aucun frais caché.'
              },
              {
                q: 'Puis-je changer de formule ?',
                a: 'Oui, vous choisissez la formule à chaque commande selon vos besoins. Pas d\'abonnement, pas d\'engagement.'
              },
              {
                q: 'Les prix varient-ils selon le pressing ?',
                a: 'Non, les prix affichés sont fixes sur toute la plateforme Kilolab. Tous nos pressings partenaires appliquent les mêmes tarifs.'
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{faq.q}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à essayer ?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Trouvez un pressing près de chez vous et commencez en 5 minutes
          </p>
          <button
            onClick={() => navigate('/partners-map')}
            className="px-10 py-5 bg-white text-purple-600 rounded-full font-bold text-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Trouver un pressing
          </button>
        </div>
      </section>
    </div>
  );
}
