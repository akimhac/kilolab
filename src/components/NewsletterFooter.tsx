import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingButton from './LoadingButton';

export default function NewsletterFooter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Email invalide');
      return;
    }

    setLoading(true);
    try {
      // Appeler fonction netlify pour inscription newsletter
      const response = await fetch('/.netlify/functions/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) throw new Error('Erreur inscription');

      setSubscribed(true);
      toast.success('Inscription réussie !');
      setEmail('');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Merci de votre inscription !</h3>
          <p className="text-green-100">Vous recevrez nos actualités et offres exclusives.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center text-white">
        <Mail className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-3xl font-black mb-2">
          Restez informé
        </h3>
        <p className="text-lg text-blue-100 mb-6">
          Recevez nos offres exclusives et conseils d'entretien
        </p>

        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="flex-1 px-6 py-4 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-300"
            required
          />
          <LoadingButton
            loading={loading}
            type="submit"
            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:shadow-xl transition"
          >
            S'inscrire
          </LoadingButton>
        </form>

        <p className="text-xs text-blue-100 mt-4">
          Aucun spam. Désinscription facile à tout moment.
        </p>
      </div>
    </div>
  );
}
