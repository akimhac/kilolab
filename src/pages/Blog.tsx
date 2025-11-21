import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';

export default function Blog() {
  const navigate = useNavigate();

  const articles = [
    {
      id: 'economiser-pressing',
      title: 'Comment économiser sur son pressing : 7 astuces infaillibles',
      excerpt: 'Réduisez votre facture de pressing de 30 à 50% sans sacrifier la qualité. Découvrez nos astuces d\'expert.',
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&q=80',
      category: 'Astuces & Économies',
      readTime: '8 min',
      date: 'Mars 2025'
    },
    {
      id: 'laver-vs-pressing',
      title: 'Laver à la maison VS Pressing : Le vrai coût en 2025',
      excerpt: 'Nous avons fait les calculs pour vous : la réponse pourrait vous surprendre. Analyse complète coût + temps.',
      image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&q=80',
      category: 'Comparatif & Analyse',
      readTime: '12 min',
      date: 'Mars 2025'
    },
    {
      id: 'vetements-delicats',
      title: 'Comment entretenir ses vêtements délicats : Le guide complet',
      excerpt: 'Soie, cachemire, laine mérinos, dentelle... Le guide d\'expert pour prolonger la vie de vos vêtements de luxe.',
      image: 'https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=800&q=80',
      category: 'Guide Expert',
      readTime: '15 min',
      date: 'Mars 2025'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
            >
              Kilolab
            </button>
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
            Le blog <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Kilolab</span>
          </h1>
          <p className="text-xl text-slate-600">
            Conseils, astuces et guides d'expert pour entretenir vos vêtements
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div
                key={article.id}
                onClick={() => navigate(`/blog/${article.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 text-sm">
                      <Clock className="w-4 h-4" />
                      {article.readTime}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
                    {article.title}
                  </h2>
                  
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{article.date}</span>
                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1">
                      Lire l'article
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-6">
            Prêt à essayer Kilolab ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Trouvez un pressing près de chez vous en quelques clics
          </p>
          <button
            onClick={() => navigate('/partners-map')}
            className="px-12 py-5 bg-white text-blue-600 rounded-xl font-bold text-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Trouver un pressing
          </button>
        </div>
      </section>
    </div>
  );
}
