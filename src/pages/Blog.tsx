import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Tag } from 'lucide-react';

export default function Blog() {
  const navigate = useNavigate();

  const articles = [
    {
      title: 'Comment bien laver son linge délicat ?',
      excerpt: 'Découvrez les techniques professionnelles pour prendre soin de vos vêtements fragiles sans les abîmer.',
      image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&q=80',
      category: 'Conseils',
      readTime: '5 min',
      date: 'Il y a 2 jours'
    },
    {
      title: '10 astuces pour économiser sur votre lessive',
      excerpt: 'Des conseils pratiques pour réduire vos dépenses tout en gardant un linge impeccable.',
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&q=80',
      category: 'Économies',
      readTime: '7 min',
      date: 'Il y a 5 jours'
    },
    {
      title: 'Pressing vs Machine à laver : le vrai coût',
      excerpt: 'Comparaison détaillée des coûts réels entre pressing au kilo et lavage à domicile.',
      image: 'https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=600&q=80',
      category: 'Comparatif',
      readTime: '10 min',
      date: 'Il y a 1 semaine'
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

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-slate-900 mb-4">
            Le Blog Kilolab
          </h1>
          <p className="text-xl text-slate-600">
            Conseils, astuces et actualités du pressing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-bold">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition">
                  {article.title}
                </h2>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {article.readTime}
                  </div>
                  <span>{article.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
