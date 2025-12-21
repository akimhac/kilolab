import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Legal() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Mentions Légales</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
          <h2 className="text-2xl font-bold text-white mt-8">Éditeur du site</h2>
          <p>
            <strong>Kilolab SAS</strong><br/>
            Capital social : 10 000€<br/>
            SIRET : XXX XXX XXX XXXXX<br/>
            Siège social : [Adresse à compléter]<br/>
            Email : contact@kilolab.fr<br/>
            Directeur de la publication : [Nom à compléter]
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8">Hébergement</h2>
          <p>
            <strong>Netlify, Inc.</strong><br/>
            2325 3rd Street, Suite 296<br/>
            San Francisco, California 94107<br/>
            États-Unis
          </p>
          
          <p>
            <strong>Supabase, Inc.</strong> (Base de données)<br/>
            970 Toa Payoh North, #07-04<br/>
            Singapore 318992
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8">Propriété intellectuelle</h2>
          <p>L'ensemble du contenu de ce site (textes, images, logos) est la propriété exclusive de Kilolab SAS et est protégé par le droit d'auteur.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8">CNIL</h2>
          <p>Conformément à la loi Informatique et Libertés, vous disposez d'un droit d'accès et de rectification des données vous concernant.</p>
          
          <p className="text-slate-500 text-sm mt-12">Pour toute question : contact@kilolab.fr</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
