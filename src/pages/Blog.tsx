import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';

export default function Blog() {
  const navigate = useNavigate();

  const articles = [
    { title: "Comment économiser sur votre pressing ?", date: "15 Déc 2024", excerpt: "Découvrez nos astuces pour réduire vos dépenses pressing de 85%." },
    { title: "Pressing au kilo vs pressing traditionnel", date: "10 Déc 2024", excerpt: "Comparatif complet des deux méthodes de pressing." },
    { title: "5 erreurs à éviter avec votre linge", date: "5 Déc 2024", excerpt: "Les erreurs courantes qui abîment vos vêtements." }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" /> Retour
          </button>
          <Link to="/" className="text-xl font-bold text-teal-600">Kilolab</Link>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">Blog Kilolab</h1>
        
        <div className="grid gap-6">
          {articles.map((article, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition cursor-pointer">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <Calendar className="w-4 h-4" /> {article.date}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">{article.title}</h2>
              <p className="text-slate-600">{article.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
