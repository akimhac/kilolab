import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Envoyer email via Resend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message envoyé ! Nous vous répondrons sous 24h');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi. Réessayez ou contactez-nous par email.');
    } finally {
      setLoading(false);
    }
  };

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
            Contactez-nous
          </h1>
          <p className="text-xl text-slate-600">
            Une question ? Nous sommes là pour vous aider
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Formulaire */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Envoyez-nous un message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none"
                  placeholder="jean@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Sujet *
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none"
                >
                  <option value="">Choisissez un sujet</option>
                  <option value="question">Question générale</option>
                  <option value="order">Problème avec une commande</option>
                  <option value="partner">Devenir partenaire</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none resize-none"
                  placeholder="Décrivez votre demande..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Infos contact */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8">
              <Mail className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email</h3>
              <a href="mailto:contact@kilolab.fr" className="text-blue-600 hover:underline font-semibold text-lg">
                contact@kilolab.fr
              </a>
              <p className="text-slate-600 mt-2">
                Réponse sous 24h ouvrées
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8">
              <MapPin className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Adresse</h3>
              <p className="text-slate-700 font-semibold">
                Siège social en France
              </p>
              <p className="text-slate-600 mt-2">
                Informations complètes après création SASU
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8">
              <Phone className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Horaires</h3>
              <p className="text-slate-700">
                Lun - Ven : 9h - 18h
              </p>
              <p className="text-slate-600 mt-2">
                Support disponible par email
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
