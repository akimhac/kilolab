import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Building2, Globe, Shield, Mail, Phone, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function Legal() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Mentions Légales</h1>
        <p className="text-slate-400 mb-8">Conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004</p>

        <div className="space-y-8">
          {/* Éditeur */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
                <Building2 className="text-teal-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Éditeur du site</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-slate-300">
              <div>
                <p className="text-slate-500 text-sm">Raison sociale</p>
                <p className="font-medium">Kilolab SAS</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Capital social</p>
                <p className="font-medium">1 000 €</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">SIRET</p>
                <p className="font-medium">En cours d'immatriculation</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Numéro TVA</p>
                <p className="font-medium">En cours d'attribution</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-slate-500 text-sm">Siège social</p>
                <p className="font-medium">8 Square de Liège, 59000 Lille, France</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Directeur de la publication</p>
                <p className="font-medium">Akim Hachili</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm">Responsable de la rédaction</p>
                <p className="font-medium">Akim Hachili</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Mail className="text-purple-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Contact</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-slate-300">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-slate-500" />
                <a href="mailto:contact@kilolab.fr" className="text-teal-400 hover:underline">contact@kilolab.fr</a>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-slate-500" />
                <a href="https://kilolab.fr" className="text-teal-400 hover:underline">www.kilolab.fr</a>
              </div>
            </div>
          </section>

          {/* Hébergement */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Globe className="text-blue-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Hébergement</h2>
            </div>
            <div className="space-y-4 text-slate-300">
              <div>
                <p className="font-medium text-white">Vercel Inc.</p>
                <p className="text-sm text-slate-400">340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
                <a href="https://vercel.com" className="text-teal-400 text-sm hover:underline">https://vercel.com</a>
              </div>
              <div>
                <p className="font-medium text-white">Supabase Inc. (Base de données)</p>
                <p className="text-sm text-slate-400">970 Toa Payoh North, #07-04, Singapore 318992</p>
                <a href="https://supabase.com" className="text-teal-400 text-sm hover:underline">https://supabase.com</a>
              </div>
              <div>
                <p className="font-medium text-white">Stripe Payments Europe Ltd (Paiements)</p>
                <p className="text-sm text-slate-400">1 Grand Canal Street Lower, Dublin 2, Irlande</p>
                <a href="https://stripe.com" className="text-teal-400 text-sm hover:underline">https://stripe.com</a>
              </div>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Shield className="text-orange-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Propriété intellectuelle</h2>
            </div>
            <div className="text-slate-300 space-y-3">
              <p>
                L'ensemble du contenu du site Kilolab (textes, images, graphismes, logo, icônes, sons, logiciels, etc.) 
                est la propriété exclusive de Kilolab SAS ou de ses partenaires et est protégé par les lois françaises 
                et internationales relatives à la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments 
                du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Kilolab SAS.
              </p>
              <p>
                La marque "Kilolab" et le logo associé sont des marques déposées. Toute utilisation non autorisée 
                constitue une contrefaçon passible de sanctions pénales.
              </p>
            </div>
          </section>

          {/* Données personnelles */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <FileText className="text-emerald-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Données personnelles & RGPD</h2>
            </div>
            <div className="text-slate-300 space-y-3">
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, 
                vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles.
              </p>
              <p>
                Pour exercer ces droits ou pour toute question relative au traitement de vos données, vous pouvez nous contacter :
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-1">
                <li>Par email : <a href="mailto:dpo@kilolab.fr" className="text-teal-400 hover:underline">dpo@kilolab.fr</a></li>
                <li>Via notre <Link to="/contact" className="text-teal-400 hover:underline">formulaire de contact</Link></li>
              </ul>
              <p>
                Pour plus d'informations sur le traitement de vos données, consultez notre{" "}
                <Link to="/privacy" className="text-teal-400 hover:underline font-medium">Politique de confidentialité</Link>.
              </p>
            </div>
          </section>

          {/* Liens utiles */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Documents légaux</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <Link to="/cgu" className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition">
                <FileText className="text-teal-400" size={18} />
                <span>Conditions Générales d'Utilisation</span>
              </Link>
              <Link to="/cgv" className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition">
                <FileText className="text-teal-400" size={18} />
                <span>Conditions Générales de Vente</span>
              </Link>
              <Link to="/privacy" className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition">
                <Shield className="text-teal-400" size={18} />
                <span>Politique de confidentialité</span>
              </Link>
              <Link to="/cookies" className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition">
                <Shield className="text-teal-400" size={18} />
                <span>Politique des cookies</span>
              </Link>
            </div>
          </section>

          <p className="text-slate-500 text-sm text-center pt-6 border-t border-slate-800">
            Dernière mise à jour : Mars 2026
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}