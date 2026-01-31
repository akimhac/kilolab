import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CGU() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-32">
        <h1 className="text-4xl font-extrabold mb-2">Conditions Générales d’Utilisation</h1>
        <p className="text-slate-500 mb-8">Dernière mise à jour : Février 2026</p>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 space-y-8 text-slate-700 leading-relaxed text-sm md:text-base">

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">1. Objet et Acceptation</h2>
            <p>
              Les présentes Conditions Générales d’Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Kilolab (ci-après "la Plateforme"), 
              mettant en relation des particuliers ou professionnels souhaitant faire laver leur linge ("Clients") 
              et des prestataires indépendants ou professionnels ("Washers" ou "Partenaires").
            </p>
            <p className="mt-2">
              L'utilisation de Kilolab entraîne l'acceptation sans réserve des présentes CGU.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">2. Description du Service</h2>
            <p>
              Kilolab est une plateforme technique de mise en relation. Kilolab n'est pas une blanchisserie industrielle 
              mais un tiers de confiance garantissant la sécurité des transactions et la qualité du réseau de Washers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">3. Accès et Compte</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>L'utilisateur doit être majeur et capable juridiquement.</li>
              <li>Les informations fournies (identité, adresse) doivent être exactes.</li>
              <li>L'utilisateur est responsable de la confidentialité de ses identifiants.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">4. Obligations des Utilisateurs</h2>
            <p className="font-semibold mb-2">Pour les Clients :</p>
            <p className="mb-2">Ne pas confier de linge contaminé, dangereux, ou contenant des objets de valeur. Vérifier les poches avant remise.</p>
            
            <p className="font-semibold mb-2">Pour les Washers :</p>
            <p>Respecter la Charte Qualité Kilolab (Machine propre, lessive hypoallergénique, pesée contradictoire, respect des délais).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">5. Propriété Intellectuelle</h2>
            <p>
              Tous les éléments du site (textes, logos, images, algorithmes) sont la propriété exclusive de Kilolab. 
              Toute reproduction est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">6. Sanctions</h2>
            <p>
              En cas de non-respect des CGU, Kilolab se réserve le droit de suspendre ou supprimer le compte de l'utilisateur sans préavis.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}
