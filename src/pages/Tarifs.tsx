import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, X, ArrowRight, Star, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Tarifs() {
  return (
    <>
      {/* SEO OPTIMISÉ */}
      <Helmet>
        <title>Tarifs Kilolab - 5€/kg | Pressing au Kilo jusqu'à 85% moins cher</title>
        <meta 
          name="description" 
          content="Tarifs Kilolab : 5€/kg tout compris (lavage + séchage + pliage). Économisez jusqu'à 85% vs pressing traditionnel. Devis gratuit en ligne." 
        />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kilolab.fr/tarifs" />
        <meta property="og:title" content="Tarifs Kilolab - 5€/kg | Jusqu'à 85% moins cher" />
        <meta property="og:description" content="Pressing au kilo transparent : 5€/kg tout compris. Comparez avec les pressings traditionnels." />
        <meta property="og:image" content="https://kilolab.fr/og-tarifs.jpg" />
        
        {/* Schema.org - Offer */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Offer",
            "name": "Lavage de linge au kilo",
            "description": "Service de lavage professionnel au poids. Lavage, séchage et pliage inclus.",
            "price": "5.00",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "url": "https://kilolab.fr/tarifs",
            "seller": {
              "@type": "Organization",
              "name": "Kilolab"
            },
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": "5.00",
              "priceCurrency": "EUR",
              "unitCode": "KGM",
              "unitText": "kilogramme"
            }
          })}
        </script>
        
        {/* Schema.org - Service */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Pressing au kilo",
            "provider": {
              "@type": "Organization",
              "name": "Kilolab",
              "url": "https://kilolab.fr"
            },
            "areaServed": [
              {
                "@type": "City",
                "name": "Lille"
              },
              {
                "@type": "City",
                "name": "Nantes"
              }
            ],
            "offers": {
              "@type": "Offer",
              "price": "5.00",
              "priceCurrency": "EUR"
            }
          })}
        </script>
        
        <link rel="canonical" href="https://kilolab.fr/tarifs" />
      </Helmet>

      <div className="min-h-screen bg-white font-sans">
        <Navbar />

        {/* HERO */}
        <header className="pt-32 pb-20 bg-gradient-to-br from-teal-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
              <TrendingDown size={16} />
              Prix transparent, sans surprise
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              5€ par kilo.<br/>
              <span className="text-teal-600">Tout compris.</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              Lavage + Séchage + Pliage. Économisez jusqu'à <strong className="text-teal-600">85%</strong> par rapport aux pressings traditionnels.
            </p>
            <Link 
              to="/trouver"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-500 transition shadow-lg hover:scale-105"
            >
              Commander maintenant
              <ArrowRight size={20} />
            </Link>
          </div>
        </header>

        {/* COMPARAISON PRIX */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4">
                Arrêtez de brûler votre argent 🔥
              </h2>
              <p className="text-xl text-slate-600">
                Le modèle "à la pièce" est obsolète. Passez au kilo et redonnez du pouvoir d'achat à votre foyer.
              </p>
            </div>

            {/* TABLEAU COMPARATIF */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              
              {/* PRESSING TRADITIONNEL */}
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-red-500 p-3 rounded-xl">
                    <X className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-red-900">Pressing Traditionnel</h3>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center pb-3 border-b border-red-200">
                    <span className="text-slate-700">3 Chemises</span>
                    <span className="font-bold text-red-900">24.00€</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-red-200">
                    <span className="text-slate-700">2 Pantalons</span>
                    <span className="font-bold text-red-900">20.00€</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-red-200">
                    <span className="text-slate-700">1 Manteau</span>
                    <span className="font-bold text-red-900">25.00€</span>
                  </div>
                </div>

                <div className="bg-red-100 p-4 rounded-xl">
                  <p className="text-sm text-red-700 mb-2 font-bold">TOTAL</p>
                  <p className="text-4xl font-black text-red-900">69.00€</p>
                </div>
              </div>

              {/* KILOLAB */}
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-500 rounded-2xl p-8 shadow-lg relative">
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  ✅ RECOMMANDÉ
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-teal-600 p-3 rounded-xl">
                    <Check className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-teal-900">Méthode Kilolab</h3>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center pb-3 border-b border-teal-200">
                    <span className="text-slate-700">3 Chemises (0.6kg)</span>
                    <span className="font-bold text-teal-900">3.00€</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-teal-200">
                    <span className="text-slate-700">2 Pantalons (1kg)</span>
                    <span className="font-bold text-teal-900">5.00€</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-teal-200">
                    <span className="text-slate-700">1 Manteau (1.5kg)</span>
                    <span className="font-bold text-teal-900">7.50€</span>
                  </div>
                </div>

                <div className="bg-teal-600 text-white p-4 rounded-xl">
                  <p className="text-sm mb-2 font-bold">TOTAL KILOLAB</p>
                  <p className="text-4xl font-black">15.50€</p>
                  <p className="text-sm mt-2 bg-white/20 inline-block px-3 py-1 rounded-full">
                    ↘ Vous économisez 53.50€ (78%)
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-slate-50 rounded-2xl p-8 text-center">
              <p className="text-lg text-slate-700 mb-4">
                <strong>Un foyer français moyen dépense 450€/an en pressing.</strong><br/>
                Avec Kilolab, vous économisez <span className="text-teal-600 font-black">350€/an</span>.
              </p>
              <Link 
                to="/trouver"
                className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 transition"
              >
                Calculer mes économies
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* CE QUI EST INCLUS */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-black text-center mb-12">
              Qu'est-ce qui est inclus dans les 5€/kg ?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                "✅ Lavage professionnel",
                "✅ Séchage complet",
                "✅ Pliage soigné",
                "✅ Linge protégé en sac individuel",
                "✅ Collecte à domicile",
                "✅ Livraison à domicile",
                "✅ Traçabilité en temps réel",
                "✅ Assurance jusqu'à 200€"
              ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ TARIFS */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-black text-center mb-12">
              Questions fréquentes sur les tarifs
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: "Comment sont pesés les vêtements ?",
                  a: "Le Washer pèse votre linge devant vous avec une balance certifiée. Vous payez uniquement le poids réel. Transparence totale."
                },
                {
                  q: "Y a-t-il un poids minimum ?",
                  a: "Oui, 3kg minimum par commande (soit 15€). Cela permet de garantir la rentabilité des Washers."
                },
                {
                  q: "Le prix change selon le type de vêtement ?",
                  a: "Non. Chemise, pantalon, pull, drap : tout est à 5€/kg. Seuls les articles spéciaux (cuir, fourrure) ont un supplément."
                },
                {
                  q: "Y a-t-il des frais de livraison ?",
                  a: "Non, la collecte et la livraison sont incluses dans les 5€/kg. Aucun frais caché."
                },
                {
                  q: "Puis-je avoir une facture ?",
                  a: "Oui, vous recevez une facture par email après chaque lavage. Idéal pour les notes de frais."
                }
              ].map((item, i) => (
                <details key={i} className="bg-slate-50 rounded-xl p-6 group">
                  <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                    {item.q}
                    <span className="text-teal-600 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="text-slate-600 mt-4 leading-relaxed">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 bg-gradient-to-br from-teal-600 to-emerald-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-black mb-6">
              Prêt à économiser 350€/an ?
            </h2>
            <p className="text-xl mb-8 text-teal-50">
              Rejoignez les 10 000+ clients qui ont abandonné les pressings traditionnels.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/trouver"
                className="px-8 py-4 bg-white text-teal-600 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg"
              >
                Trouver un Washer
              </Link>
              <Link 
                to="/become-washer"
                className="px-8 py-4 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition border-2 border-white/20"
              >
                Devenir Washer
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
