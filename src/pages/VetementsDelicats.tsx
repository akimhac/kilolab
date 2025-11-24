import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { analytics } from '../../analytics';

export default function VetementsDelicats() {
  const navigate = useNavigate();

  useEffect(() => {
    analytics.pageView('/blog/vetements-delicats');
  }, []);

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
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-bold">
            Guide Expert
          </span>
        </div>

        <h1 className="text-5xl font-black text-slate-900 mb-6">
          Comment entretenir ses vêtements délicats : Le guide complet 2025
        </h1>

        <div className="flex items-center gap-4 text-slate-600 mb-8">
          <span>Par l'équipe Kilolab</span>
          <span>•</span>
          <span>15 min de lecture</span>
          <span>•</span>
          <span>Novembre 2024</span>
        </div>

        <img 
          src="https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=800&q=75&auto=format" 
          alt="Vêtements délicats"
          className="w-full h-96 object-cover rounded-2xl mb-8"
        />

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed mb-8">
            Soie, cachemire, laine mérinos, dentelle... Ces matières nobles méritent une attention particulière. 
            Un mauvais entretien et c'est <strong>des centaines d'euros perdus</strong>. Suivez notre guide d'expert 
            pour prolonger la vie de vos vêtements de luxe.
          </p>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg mb-8">
            <p className="text-slate-700 font-semibold flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <span><strong>Attention !</strong> Une chemise en soie mal lavée peut rétrécir de 30% et perdre son éclat. 
              Un pull en cachemire peut feutrer irrémédiablement. Les erreurs coûtent cher.</span>
            </p>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6">
            🧵 Décrypter les étiquettes d'entretien
          </h2>

          <p className="text-slate-700 leading-relaxed mb-6">
            Avant tout, <strong>lisez TOUJOURS l'étiquette</strong>. Voici le décodage des symboles essentiels :
          </p>

          <div className="bg-slate-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Symboles de lavage :</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border-2 border-slate-300 rounded-lg flex items-center justify-center text-2xl">
                  ⚠️
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Lavage à la main uniquement</p>
                  <p className="text-sm text-slate-600">Ne JAMAIS mettre en machine</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border-2 border-slate-300 rounded-lg flex items-center justify-center text-2xl">
                  30°
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Lavage machine délicat 30°C max</p>
                  <p className="text-sm text-slate-600">Programme laine ou délicat</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border-2 border-slate-300 rounded-lg flex items-center justify-center text-2xl">
                  ⊗
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Ne pas essorer</p>
                  <p className="text-sm text-slate-600">Risque de déformation</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border-2 border-slate-300 rounded-lg flex items-center justify-center text-2xl">
                  P
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Nettoyage à sec uniquement</p>
                  <p className="text-sm text-slate-600 font-bold text-red-600">→ Pressing obligatoire</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6">
            🌟 Matière par matière : Le guide ultime
          </h2>

          {/* SOIE */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 mb-8 border-2 border-pink-200">
            <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-pink-600" />
              LA SOIE
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  À FAIRE
                </h4>
                <ul className="space-y-2 text-slate-700">
                  <li>✓ Lavage à la main eau froide (20°C max)</li>
                  <li>✓ Lessive spéciale soie ou shampoing doux</li>
                  <li>✓ Rincer abondamment</li>
                  <li>✓ Sécher à plat sur serviette éponge</li>
                  <li>✓ Repasser envers, fer doux (110°C)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  NE JAMAIS FAIRE
                </h4>
                <ul className="space-y-2 text-slate-700">
                  <li>✗ Eau chaude (détruit les fibres)</li>
                  <li>✗ Essorage machine (déformation)</li>
                  <li>✗ Sèche-linge (désastre garanti)</li>
                  <li>✗ Soleil direct (décoloration)</li>
                  <li>✗ Javel ou détachant agressif</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-pink-300">
              <p className="font-bold text-slate-900 mb-2">💡 Astuce Pro :</p>
              <p className="text-slate-700">
                Pour les chemisiers en soie précieux, <strong>confiez-les au pressing dès le départ</strong>. 
                Un nettoyage professionnel coûte 8-10€ mais préserve votre chemise à 200€.
              </p>
            </div>
          </div>

          {/* CACHEMIRE */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 mb-8 border-2 border-blue-200">
            <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-blue-600" />
              LE CACHEMIRE
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  À FAIRE
                </h4>
                <ul className="space-y-2 text-slate-700">
                  <li>✓ Lavage à la main eau tiède (30°C)</li>
                  <li>✓ Lessive laine ou shampoing bébé</li>
                  <li>✓ Ne pas frotter, presser doucement</li>
                  <li>✓ Sécher à plat loin de la chaleur</li>
                  <li>✓ Brosser avec brosse spéciale cachemire</li>
                  <li>✓ Plier, ne JAMAIS suspendre</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  NE JAMAIS FAIRE
                </h4>
                <ul className="space-y-2 text-slate-700">
                  <li>✗ Machine classique (feutrage immédiat)</li>
                  <li>✗ Tordre ou essorer (déformation)</li>
                  <li>✗ Radiateur ou soleil (rétrécissement)</li>
                  <li>✗ Cintre (étire les épaules)</li>
                  <li>✗ Porter plusieurs jours d'affilée</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
              <p className="font-bold text-slate-900 mb-2">💡 Astuce Pro :</p>
              <p className="text-slate-700">
                Lavez votre cachemire <strong>maximum 2 fois par hiver</strong>. Entre deux, aérez-le 24h et brossez-le. 
                Pour les pièces exceptionnelles (plus de 300€), pressing spécialisé recommandé.
              </p>
            </div>
          </div>

          {/* LAINE MÉRINOS */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-8 border-2 border-green-200">
            <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-green-600" />
              LA LAINE MÉRINOS
            </h3>
            
            <p className="text-slate-700 mb-4">
              Bonne nouvelle : la laine mérinos est <strong>plus résistante</strong> que le cachemire !
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  À FAIRE
                </h4>
                <ul className="space-y-2 text-slate-700">
                  <li>✓ Machine programme laine 30°C</li>
                  <li>✓ Essorage doux (400 tours max)</li>
                  <li>✓ Lessive spéciale laine</li>
                  <li>✓ Sécher à plat</li>
                  <li>✓ Vapeur pour défroissage</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  NE JAMAIS FAIRE
                </h4>
                <ul className="space-y-2 text-slate-700">
                  <li>✗ Programme coton (trop agressif)</li>
                  <li>✗ Température supérieure à 30°C</li>
                  <li>✗ Sèche-linge</li>
                  <li>✗ Eau de javel</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-green-300">
              <p className="font-bold text-slate-900 mb-2">💡 Astuce Pro :</p>
              <p className="text-slate-700">
                La laine mérinos est <strong>naturellement anti-odeurs</strong>. Vous pouvez porter votre pull 5-7 fois 
                avant lavage ! Aérez-le simplement 24h entre chaque port.
              </p>
            </div>
          </div>

          {/* DENTELLE ET LINGERIE */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 mb-8 border-2 border-red-200">
            <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-red-600" />
              DENTELLE & LINGERIE FINE
            </h3>
            
            <div className="bg-white rounded-lg p-4 mb-6 border-2 border-red-300">
              <p className="font-bold text-red-900 mb-2">⚠️ ULTRA FRAGILE :</p>
              <p className="text-slate-700">
                La dentelle peut se déchirer, les armatures se tordre, les élastiques se détendre. 
                <strong> Un soutien-gorge de qualité coûte 80-150€</strong> : traitez-le avec respect !
              </p>
            </div>

            <h4 className="font-bold text-slate-900 mb-3">Méthode d'entretien :</h4>
            <ol className="space-y-3 text-slate-700 mb-6">
              <li><strong>1. Filet de lavage OBLIGATOIRE</strong> : Protège dentelle et armatures</li>
              <li><strong>2. Lavage main ou machine délicate 30°C</strong></li>
              <li><strong>3. Lessive douce sans enzymes</strong></li>
              <li><strong>4. Pas d'essorage</strong> : Presser délicatement dans une serviette</li>
              <li><strong>5. Sécher à plat</strong>, jamais suspendu (détend élastiques)</li>
            </ol>

            <div className="bg-white rounded-lg p-4 border-2 border-red-300">
              <p className="font-bold text-slate-900 mb-2">💡 Règle d'or :</p>
              <p className="text-slate-700">
                Alternez vos soutiens-gorge : <strong>ne portez jamais le même 2 jours de suite</strong>. 
                Les élastiques ont besoin de 24h pour reprendre leur forme.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6">
            🚨 Les erreurs fatales à éviter absolument
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-red-900">Erreur #1 : Mélanger les couleurs</p>
                <p className="text-slate-700">Une chaussette rouge et votre chemise blanche devient rose. TOUJOURS laver séparément.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-red-900">Erreur #2 : Surcharger la machine</p>
                <p className="text-slate-700">Les vêtements doivent avoir de l'espace. Maximum 2/3 du tambour pour le délicat.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-red-900">Erreur #3 : Ignorer les taches</p>
                <p className="text-slate-700">Une tache qui sèche devient permanente. Traitez IMMÉDIATEMENT à l'eau froide.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-red-900">Erreur #4 : Trop de lessive</p>
                <p className="text-slate-700">Plus de lessive ≠ plus propre. Au contraire, ça laisse des résidus et rigidifie les fibres.</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6">
            ✨ Quand confier au pressing professionnel ?
          </h2>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white mb-8">
            <h3 className="text-2xl font-bold mb-6">Le pressing est OBLIGATOIRE pour :</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold mb-3 text-blue-100">Vêtements :</h4>
                <ul className="space-y-2">
                  <li>✓ Costumes et tailleurs</li>
                  <li>✓ Manteaux et doudounes</li>
                  <li>✓ Robes de soirée</li>
                  <li>✓ Chemises importantes</li>
                  <li>✓ Vêtements avec étiquette "P"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3 text-blue-100">Textiles maison :</h4>
                <ul className="space-y-2">
                  <li>✓ Rideaux épais</li>
                  <li>✓ Couettes en duvet</li>
                  <li>✓ Tapis</li>
                  <li>✓ Housses de canapé</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t-2 border-white/30">
              <p className="text-xl font-bold text-center">
                <strong>Avec Kilolab</strong> : 3,50€/kg pour un nettoyage professionnel qui prolonge la vie de vos vêtements
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 text-center border-2 border-orange-300">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Vos vêtements de luxe méritent le meilleur
            </h3>
            <p className="text-slate-700 mb-6 text-lg">
              Pour les pièces exceptionnelles, faites confiance à des professionnels. 
              Kilolab sélectionne les meilleurs pressings pour un entretien expert.
            </p>
            <button
              onClick={() => {
                analytics.trackEvent('cta_clicked', {
                  location: 'blog_vetements_delicats',
                  cta_text: 'Trouver un pressing'
                });
                navigate('/partners-map');
              }}
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
