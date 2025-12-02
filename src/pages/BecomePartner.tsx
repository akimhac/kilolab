// src/pages/BecomePartner.tsx
// Landing Page PARTENAIRES - Zéro abonnement, zéro engagement

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, Euro, TrendingUp, Users, CheckCircle, 
  Star, Zap, Shield, Clock, Phone, Mail, MapPin,
  ChevronRight, Play, Award, Sparkles, BarChart3, X,
  CreditCard, Percent, UserPlus, BadgeCheck
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function BecomePartner() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    siret: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('partners')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postal_code,
          siret: formData.siret,
          description: formData.message,
          is_active: false,
          price_per_kg: 3.50,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast.success('🎉 Demande envoyée avec succès !');
      setShowForm(false);
      setFormData({
        name: '', email: '', phone: '', address: '', 
        city: '', postal_code: '', siret: '', message: ''
      });

    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: CreditCard,
      title: 'Zéro frais d\'inscription',
      description: 'Aucun abonnement, aucun frais fixe. Vous ne payez absolument rien pour rejoindre Kilolab.',
      color: 'green'
    },
    {
      icon: Users,
      title: 'Nouveaux clients qualifiés',
      description: 'Recevez des clients qui cherchent activement un pressing de qualité près de chez eux.',
      color: 'blue'
    },
    {
      icon: Euro,
      title: 'Rentable dès le 1er euro',
      description: 'Petite commission uniquement sur les commandes réalisées. Pas de commande = pas de frais.',
      color: 'orange'
    },
    {
      icon: Shield,
      title: 'Zéro engagement',
      description: 'Vous pouvez quitter le réseau quand vous voulez. Aucun contrat, aucune durée minimum.',
      color: 'purple'
    }
  ];

  const stats = [
    { value: '2600+', label: 'Pressings partenaires' },
    { value: '0€', label: 'Frais d\'inscription' },
    { value: '0€', label: 'Abonnement mensuel' },
    { value: '24h', label: 'Validation' }
  ];

  const testimonials = [
    {
      name: 'Marie L.',
      role: 'Pressing du Marché, Lyon',
      content: 'Depuis que je suis sur Kilolab, j\'ai 30% de clients en plus. Je ne paie que quand je gagne, c\'est parfait !',
      rating: 5
    },
    {
      name: 'Jean-Pierre M.',
      role: 'Laverie Express, Paris 15',
      content: 'Zéro prise de tête ! Je reçois les commandes, je fais mon travail, et je suis payé. Aucun abonnement à gérer.',
      rating: 5
    },
    {
      name: 'Fatou D.',
      role: 'Pressing Soleil, Marseille',
      content: 'J\'étais sceptique au début mais c\'est vraiment sans engagement. J\'ai testé et je ne regrette pas !',
      rating: 5
    }
  ];

  const steps = [
    { step: 1, title: 'Inscrivez-vous', description: 'Formulaire gratuit en 2 minutes' },
    { step: 2, title: 'Validation 24h', description: 'Notre équipe vérifie votre profil' },
    { step: 3, title: 'Recevez des clients', description: 'Les commandes arrivent automatiquement' },
    { step: 4, title: 'Gagnez de l\'argent', description: 'Commission uniquement sur les ventes' }
  ];

  const faqs = [
    {
      question: 'Combien ça coûte ?',
      answer: 'RIEN pour s\'inscrire. Nous prenons une petite commission (10%) uniquement sur les commandes que vous réalisez via Kilolab. Pas de commande = pas de frais.'
    },
    {
      question: 'Y a-t-il un engagement ?',
      answer: 'NON. Zéro engagement, zéro durée minimum. Vous pouvez quitter le réseau quand vous voulez, sans préavis, sans frais.'
    },
    {
      question: 'Comment je suis payé ?',
      answer: 'Le client paie directement chez vous lors du retrait. Vous gardez 90% du montant, la commission Kilolab est prélevée mensuellement.'
    },
    {
      question: 'Et si je n\'ai pas de commandes ?',
      answer: 'Vous ne payez rien ! Kilolab est 100% basé sur la performance. Pas de commande = pas de commission.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Kilolab
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Devenir partenaire
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            {/* Badge principal */}
            <div className="inline-flex items-center gap-2 bg-green-500 px-4 py-2 rounded-full mb-6">
              <BadgeCheck className="w-5 h-5" />
              <span className="font-bold">100% GRATUIT • Zéro engagement</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Développez votre pressing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                sans aucun risque
              </span>
            </h1>

            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Rejoignez le réseau Kilolab et recevez de nouveaux clients. 
              <strong className="text-white"> Zéro abonnement. Zéro engagement. </strong> 
              Vous ne payez qu'une petite commission sur les commandes réalisées.
              <strong className="text-green-400"> Rentable dès le premier euro.</strong>
            </p>

            {/* Points clés */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>0€ d'inscription</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>0€ d'abonnement</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>0 engagement</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-4 bg-green-500 text-white rounded-2xl font-bold text-lg hover:bg-green-600 hover:shadow-2xl transition transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Rejoindre gratuitement
              </button>
              <a
                href="#comment-ca-marche"
                className="px-8 py-4 border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Comment ça marche ?
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bandeau de confiance */}
      <section className="bg-green-500 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4 text-center text-white">
          <CheckCircle className="w-6 h-6" />
          <span className="font-bold text-lg">
            Inscription gratuite • Aucun abonnement • Aucun engagement • Rentable dès le 1er client
          </span>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Pourquoi c'est sans risque ?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              On croit en notre service. C'est pour ça qu'on ne vous fait rien payer avant que vous gagniez.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, i) => (
              <div 
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                  benefit.color === 'green' ? 'bg-green-100' :
                  benefit.color === 'blue' ? 'bg-blue-100' :
                  benefit.color === 'orange' ? 'bg-orange-100' :
                  'bg-purple-100'
                }`}>
                  <benefit.icon className={`w-7 h-7 ${
                    benefit.color === 'green' ? 'text-green-600' :
                    benefit.color === 'blue' ? 'text-blue-600' :
                    benefit.color === 'orange' ? 'text-orange-600' :
                    'text-purple-600'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition">
                  {benefit.title}
                </h3>
                <p className="text-slate-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-slate-600">
              4 étapes simples pour commencer à gagner plus
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-purple-200"></div>
                )}
                <div className="relative bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modèle économique clair */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Notre modèle est simple
            </h2>
            <p className="text-xl text-slate-600">
              Vous gagnez → On gagne. Vous ne gagnez pas → On ne gagne pas.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Côté gratuit */}
              <div className="p-8 bg-green-50 border-b md:border-b-0 md:border-r border-green-100">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-700 mb-6">Ce qui est GRATUIT</h3>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700">Inscription sur la plateforme</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700">Création de votre profil</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700">Accès au dashboard</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700">Support client</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700">Visibilité sur la plateforme</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Côté commission */}
              <div className="p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Percent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-purple-700 mb-6">Notre commission</h3>
                  <div className="text-5xl font-bold text-purple-600 mb-2">10%</div>
                  <p className="text-slate-600 mb-6">sur les commandes réalisées via Kilolab</p>
                  
                  <div className="bg-purple-50 rounded-xl p-4 text-left">
                    <p className="text-sm text-slate-600 mb-2">
                      <strong>Exemple :</strong> Un client commande 35€
                    </p>
                    <p className="text-sm text-slate-600">
                      → Vous gardez <strong className="text-green-600">31,50€</strong>
                    </p>
                    <p className="text-sm text-slate-600">
                      → Commission Kilolab : 3,50€
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer du bloc */}
            <div className="bg-slate-50 p-4 text-center">
              <p className="text-slate-600">
                <strong className="text-green-600">Pas de commande = Pas de commission.</strong> Vous ne prenez aucun risque.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-slate-600">
              Découvrez ce que nos partenaires disent de Kilolab
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
              <div className="text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Un dashboard simple et efficace
                </h2>
                <p className="text-white/80 text-lg mb-8">
                  Gérez toutes vos commandes depuis une interface intuitive. Pas besoin d'être un expert en informatique.
                </p>
                <ul className="space-y-4">
                  {[
                    'Vue en temps réel des commandes',
                    'Notifications automatiques aux clients',
                    'Scanner QR pour le retrait',
                    'Statistiques de performance',
                    'Réponse aux avis clients'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="bg-slate-800 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <BarChart3 className="w-8 h-8 text-purple-400" />
                    <div>
                      <p className="text-white font-bold">Ce mois-ci</p>
                      <p className="text-3xl font-bold text-green-400">+2 450€</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-2xl font-bold text-white">47</p>
                      <p className="text-xs text-white/60">Commandes</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-2xl font-bold text-white">4.8</p>
                      <p className="text-xs text-white/60">Note moyenne</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-2xl font-bold text-white">32</p>
                      <p className="text-xs text-white/60">Clients</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Prêt à développer votre activité ?
          </h2>
          <p className="text-xl text-white/90 mb-4">
            Rejoignez les 2600+ pressings qui font confiance à Kilolab.
          </p>
          <p className="text-2xl font-bold mb-8">
            Inscription gratuite. Zéro engagement. Rentable dès le 1er client.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-10 py-5 bg-white text-green-600 rounded-2xl font-bold text-xl hover:shadow-2xl transition transform hover:scale-105"
          >
            Devenir partenaire gratuitement
          </button>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/80">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Sans carte bancaire
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Validation sous 24h
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Support dédié
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-2xl font-bold mb-4">Kilolab</div>
          <p className="text-slate-400 mb-6">Le pressing au kilo, simple et transparent</p>
          <div className="flex justify-center gap-6 text-sm text-slate-400">
            <a href="/legal/cgu" className="hover:text-white transition">CGU</a>
            <a href="/legal/privacy" className="hover:text-white transition">Confidentialité</a>
            <a href="/contact" className="hover:text-white transition">Contact</a>
          </div>
          <p className="text-slate-500 mt-6">© 2025 Kilolab. Tous droits réservés.</p>
        </div>
      </footer>

      {/* Modal Formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 relative my-8">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Devenez partenaire Kilolab</h2>
              <p className="text-slate-600 mt-2">Inscription 100% gratuite • Validation sous 24h</p>
              
              {/* Rappel des avantages */}
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" /> 0€ d'inscription
                </span>
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" /> 0€ d'abonnement
                </span>
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" /> 0 engagement
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nom du pressing *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Pressing du Centre"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email professionnel *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="contact@pressing.fr"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="06 12 34 56 78"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    N° SIRET (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.siret}
                    onChange={(e) => setFormData({...formData, siret: e.target.value})}
                    placeholder="123 456 789 00012"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Adresse du pressing *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="12 Rue de la Paix"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Paris"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postal_code}
                    onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                    placeholder="75001"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Message (optionnel)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Parlez-nous de votre pressing..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Envoyer ma demande gratuite
                  </>
                )}
              </button>

              <p className="text-xs text-slate-500 text-center">
                En soumettant ce formulaire, vous acceptez nos CGU et notre politique de confidentialité.
                <br />
                <strong>Rappel : 0€ d'inscription, 0€ d'abonnement, 0 engagement.</strong>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
