import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Printer, Scale, AlertTriangle, CheckCircle } from 'lucide-react';

export default function PartnerGuide() {
  return (
    <div className="font-sans text-slate-900 bg-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-16">
            <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Formation</span>
            <h1 className="text-4xl md:text-5xl font-black mt-4 mb-6">Comment gérer vos commandes Kilolab ?</h1>
            <p className="text-lg text-slate-500">Le guide complet pour devenir un partenaire 5 étoiles.</p>
        </div>

        <div className="space-y-12">
            
            {/* ETAPE 1 */}
            <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xl shrink-0">1</div>
                <div>
                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">Réception & Pesée <Scale className="text-teal-500"/></h3>
                    <p className="text-slate-600 mb-4">
                        Lorsque le client arrive, ouvrez votre <strong>Espace Pro</strong>. Scannez son QR Code client ou cherchez son nom.
                        Pesez le sac devant lui. Entrez le poids exact dans l'application. Le prix se met à jour automatiquement.
                    </p>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 text-sm text-orange-800">
                        <strong>Important :</strong> Vérifiez toujours qu'il n'y a pas d'objets (clés, stylos) dans les poches avant de valider.
                    </div>
                </div>
            </div>

            {/* ETAPE 2 */}
            <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xl shrink-0">2</div>
                <div>
                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">Étiquetage <Printer className="text-teal-500"/></h3>
                    <p className="text-slate-600 mb-4">
                        Une fois le poids validé, cliquez sur <strong>"Imprimer Ticket"</strong>. 
                        L'étiquette sortira avec un QR Code unique. Collez-la immédiatement sur le sac du client.
                    </p>
                    <p className="text-slate-600">Ce code suivra le linge pendant tout le processus de lavage et séchage pour éviter les mélanges.</p>
                </div>
            </div>

            {/* ETAPE 3 */}
            <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xl shrink-0">3</div>
                <div>
                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">Validation & Notification <CheckCircle className="text-teal-500"/></h3>
                    <p className="text-slate-600 mb-4">
                        Quand le linge est plié et prêt, allez sur la commande et cliquez sur <strong>"Marquer comme PRÊT"</strong>.
                        Le client reçoit automatiquement un SMS et un Email pour venir récupérer ses affaires.
                    </p>
                </div>
            </div>

            {/* GESTION LITIGES */}
            <div className="mt-16 bg-red-50 p-8 rounded-3xl border border-red-100">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-red-700"><AlertTriangle/> Gestion des Litiges</h3>
                <p className="text-red-800 mb-4">
                    Un vêtement a déteint ? Une tâche persiste ? Ne paniquez pas.
                </p>
                <ul className="list-disc list-inside text-red-700 space-y-2">
                    <li>Ne validez pas la commande comme "Prête".</li>
                    <li>Utilisez le bouton <strong>"Signaler un problème"</strong> dans la fiche commande.</li>
                    <li>Prenez une photo du vêtement concerné via l'app.</li>
                    <li>Notre service support (support@kilolab.fr) prendra le relais avec le client.</li>
                </ul>
            </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
