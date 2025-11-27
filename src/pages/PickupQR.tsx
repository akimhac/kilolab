import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  QrCode, Camera, CheckCircle, XCircle, Package, 
  User, Calendar, Euro, ArrowLeft, Loader2, Scan
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface Order {
  id: string;
  user_id: string;
  partner_id: string;
  weight_kg: number;
  service_type: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface User {
  email: string;
  user_metadata?: {
    name?: string;
  };
}

// ============================================
// PAGE QR CODE CLIENT (pour afficher son code)
// ============================================

export function ClientPickupQR() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Commande introuvable');
    } finally {
      setLoading(false);
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
    `KILOLAB:${orderId}`
  )}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-xl font-bold text-slate-800">Commande introuvable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex flex-col items-center justify-center p-4">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-white/80 hover:text-white flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour
      </button>

      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <QrCode className="w-8 h-8 text-purple-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Votre code de retrait
        </h1>
        <p className="text-slate-600 mb-6">
          Présentez ce code au pressing
        </p>

        {/* QR Code */}
        <div className="bg-white p-4 rounded-2xl border-4 border-purple-100 inline-block mb-6">
          <img 
            src={qrCodeUrl} 
            alt="QR Code de retrait" 
            className="w-64 h-64"
          />
        </div>

        {/* Code texte */}
        <div className="bg-purple-100 rounded-2xl p-4 mb-6">
          <p className="text-sm text-purple-600 font-medium mb-1">Code commande</p>
          <p className="text-3xl font-bold text-purple-700 tracking-wider">
            #{orderId?.slice(0, 8).toUpperCase()}
          </p>
        </div>

        {/* Statut */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
          order.status === 'ready' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {order.status === 'ready' ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Prêt à récupérer
            </>
          ) : (
            <>
              <Package className="w-4 h-4" />
              {order.status === 'in_progress' ? 'En cours' : order.status}
            </>
          )}
        </div>
      </div>

      <p className="text-white/80 text-sm mt-6 text-center max-w-xs">
        Le pressing scannera ce code pour valider le retrait de votre linge
      </p>
    </div>
  );
}

// ============================================
// SCANNER QR CODE POUR LE PRESSING
// ============================================

export function PartnerQRScanner() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [scannedOrder, setScannedOrder] = useState<Order | null>(null);
  const [scannedUser, setScannedUser] = useState<User | null>(null);
  const [processing, setProcessing] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const startScanner = () => {
    setScanning(true);
    
    // Initialiser le scanner après que le DOM soit prêt
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1
        },
        false
      );

      scanner.render(
        (decodedText) => {
          handleScanSuccess(decodedText);
          scanner.clear();
          setScanning(false);
        },
        (error) => {
          // Ignorer les erreurs de scan continues
        }
      );

      scannerRef.current = scanner;
    }, 100);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
    setScanning(false);
  };

  const handleScanSuccess = async (code: string) => {
    // Format attendu: KILOLAB:uuid
    const match = code.match(/KILOLAB:(.+)/);
    if (!match) {
      toast.error('QR Code invalide');
      return;
    }

    const orderId = match[1];
    await loadOrderDetails(orderId);
  };

  const handleManualCode = async () => {
    if (!manualCode.trim()) {
      toast.error('Entrez un code');
      return;
    }

    // Nettoyer le code (enlever # et espaces)
    const cleanCode = manualCode.replace(/[#\s]/g, '').toLowerCase();
    await loadOrderDetails(cleanCode);
  };

  const loadOrderDetails = async (orderId: string) => {
    setProcessing(true);
    
    try {
      // Chercher par ID complet ou partiel
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .or(`id.eq.${orderId},id.ilike.${orderId}%`);

      if (error) throw error;

      if (!orders || orders.length === 0) {
        toast.error('Commande introuvable');
        return;
      }

      const order = orders[0];
      setScannedOrder(order);

      // Charger les infos utilisateur
      const { data: userData } = await supabase.auth.admin.getUserById(order.user_id);
      if (userData?.user) {
        setScannedUser(userData.user as User);
      }

      toast.success('Commande trouvée !');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la recherche');
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmPickup = async () => {
    if (!scannedOrder) return;

    setProcessing(true);
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', scannedOrder.id);

      if (error) throw error;

      toast.success('Retrait confirmé !');
      setScannedOrder(null);
      setScannedUser(null);
      setManualCode('');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la confirmation');
    } finally {
      setProcessing(false);
    }
  };

  const resetScanner = () => {
    setScannedOrder(null);
    setScannedUser(null);
    setManualCode('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/partner-dashboard')}
              className="flex items-center gap-2 text-white/80 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              Dashboard
            </button>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Scan className="w-6 h-6" />
              Scanner QR
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {!scannedOrder ? (
          <>
            {/* Scanner */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Scanner le QR Code client
              </h2>

              {scanning ? (
                <div>
                  <div id="qr-reader" className="rounded-2xl overflow-hidden mb-4"></div>
                  <button
                    onClick={stopScanner}
                    className="w-full py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
                  >
                    Arrêter le scan
                  </button>
                </div>
              ) : (
                <button
                  onClick={startScanner}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Activer la caméra
                </button>
              )}
            </div>

            {/* Saisie manuelle */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                Ou entrez le code manuellement
              </h2>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  placeholder="Ex: A1B2C3D4"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 text-lg font-mono tracking-wider"
                  maxLength={8}
                />
                <button
                  onClick={handleManualCode}
                  disabled={processing}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {processing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Valider'
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Détails de la commande scannée */
          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Commande trouvée</h2>
              <p className="text-slate-600">#{scannedOrder.id.slice(0, 8).toUpperCase()}</p>
            </div>

            <div className="space-y-4 mb-6">
              {/* Client */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <User className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Client</p>
                  <p className="font-semibold text-slate-800">
                    {scannedUser?.user_metadata?.name || scannedUser?.email || 'Client'}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Date de commande</p>
                  <p className="font-semibold text-slate-800">
                    {new Date(scannedOrder.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Détails */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <Package className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Détails</p>
                  <p className="font-semibold text-slate-800">
                    {scannedOrder.weight_kg} kg • {scannedOrder.service_type === 'express' ? 'Express' : 'Standard'}
                  </p>
                </div>
              </div>

              {/* Montant */}
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                <Euro className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-purple-600">Montant total</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {scannedOrder.total_amount}€
                  </p>
                </div>
              </div>

              {/* Statut */}
              <div className={`p-4 rounded-xl text-center ${
                scannedOrder.status === 'ready' 
                  ? 'bg-green-100 text-green-800' 
                  : scannedOrder.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                <p className="font-semibold">
                  {scannedOrder.status === 'ready' && '✅ Prêt à récupérer'}
                  {scannedOrder.status === 'completed' && '✅ Déjà récupéré'}
                  {scannedOrder.status === 'in_progress' && '⏳ En cours de traitement'}
                  {scannedOrder.status === 'pending' && '⏳ En attente'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {scannedOrder.status === 'ready' && (
                <button
                  onClick={handleConfirmPickup}
                  disabled={processing}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {processing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Confirmer le retrait
                    </>
                  )}
                </button>
              )}
              
              <button
                onClick={resetScanner}
                className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
              >
                Scanner une autre commande
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export par défaut
export default ClientPickupQR;
