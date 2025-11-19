import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Briefcase, GraduationCap, Home, Sparkles } from 'lucide-react';

export default function ForWho() {
  const navigate = useNavigate();

  const personas = [
    {
      icon: Users,
      title: 'Particuliers',
      subtitle: 'Simplifiez votre quotidien',
      benefits: [
        'Gagnez du temps sur la lessive',
        'Plus de week-ends gâchés',
        'Service professionnel accessible',
        'Pressings près de chez vous'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Briefcase,
      title: 'Professionnels',
      subtitle: 'Image impeccable garantie',
      benefits: [
        'Chemises toujours parfaites',
        'Service express disponible',
        'Factures mensuelles possibles',
        'Qualité professionnelle'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: GraduationCap,
      title: 'Étudiants',
      subtitle: 'Solution économique et pratique',
      benefits: [
        'Tarifs au kilo avantageux',
        'Pas de machine à acheter',
        'Points relais près des campus',
        'Flexible selon votre emploi du temps'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Home,
      title: 'Familles',
      subtitle: 'Gérez la montagne de linge facilement',
      benefits: [
        'Grande capacité au kilo',
        'Économisez eau et électricité',
        'Plus de temps pour vos enfants',
        'Service régulier possible'
      ],
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition">
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-slate-900 mb-4">
            Kilolab pour tous
          </h1>
          <p className="text-xl text-slate-600">
            Une solution adaptée à chaque besoin
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {personas.map((persona, index) => (
            <div key={index} className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all">
              <div className={`w-16 h-16 bg-gradient-to-br ${persona.color} rounded-2xl flex items-center justify-center mb-6`}>
                <persona.icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                {persona.title}
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                {persona.subtitle}
              </p>
              <ul className="space-y-3">
                {persona.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-black mb-6">
            Prêt à essayer Kilolab ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Trouvez un pressing près de chez vous en quelques clics
          </p>
          <button
            onClick={() => navigate('/partners-map')}
            className="px-12 py-5 bg-white text-blue-600 rounded-xl font-bold text-xl hover:shadow-2xl transition-all"
          >
            Trouver un pressing
          </button>
        </div>
      </div>
    </div>
  );
}
