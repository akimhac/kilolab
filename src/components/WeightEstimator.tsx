// Composant d'estimation du poids par photo IA
import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Scale, AlertCircle, CheckCircle, X, RefreshCw, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface WeightEstimation {
  estimation_min: number;
  estimation_max: number;
  estimation_moyenne: number;
  confiance: 'haute' | 'moyenne' | 'basse';
  description: string;
  conseils: string;
}

interface EstimationResult {
  success: boolean;
  estimation: WeightEstimation;
  prix: {
    standard: { min: string; max: string; avg: string };
    express: { min: string; max: string; avg: string };
  };
  message: string;
}

interface WeightEstimatorProps {
  onEstimationComplete?: (weight: number) => void;
  onClose?: () => void;
}

export function WeightEstimator({ onEstimationComplete, onClose }: WeightEstimatorProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Format non supporté. Utilisez JPG, PNG ou WEBP.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image trop volumineuse. Maximum 10 MB.');
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      // Extract base64 data without the data URL prefix
      const base64Data = base64.split(',')[1];
      setImageBase64(base64Data);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!imageBase64) {
      toast.error('Veuillez d\'abord sélectionner une image');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/estimate-weight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_base64: imageBase64,
          mime_type: 'image/jpeg',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }

      setResult(data);
      
      if (onEstimationComplete && data.estimation) {
        // Use the average estimation
        onEstimationComplete(data.estimation.estimation_moyenne);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetEstimation = () => {
    setImagePreview(null);
    setImageBase64(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const getConfidenceColor = (confiance: string) => {
    switch (confiance) {
      case 'haute': return 'text-green-600 bg-green-100';
      case 'moyenne': return 'text-amber-600 bg-amber-100';
      case 'basse': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-black text-xl">Estimation IA</h3>
              <p className="text-white/70 text-sm">Prenez une photo pour estimer le poids</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-all">
              <X size={24} />
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Image Upload Area */}
        {!imagePreview ? (
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-all">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Scale size={32} className="text-purple-500" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Photographiez votre linge</h4>
            <p className="text-sm text-slate-500 mb-6">
              Prenez une photo de votre sac ou tas de linge pour obtenir une estimation du poids
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {/* Camera button (mobile) */}
              <label className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl font-bold cursor-pointer hover:bg-purple-600 transition-all">
                <Camera size={20} />
                <span>Prendre une photo</span>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              
              {/* File upload button */}
              <label className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer hover:bg-slate-50 transition-all">
                <Upload size={20} />
                <span>Choisir une image</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            <p className="text-xs text-slate-400 mt-4">
              Formats acceptés: JPG, PNG, WEBP (max 10 MB)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-100">
              <img 
                src={imagePreview} 
                alt="Aperçu du linge" 
                className="w-full h-48 object-contain"
              />
              <button
                onClick={resetEstimation}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Analyze Button */}
            {!result && !loading && (
              <button
                onClick={analyzeImage}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <Sparkles size={20} />
                Analyser avec l'IA
              </button>
            )}

            {/* Loading */}
            {loading && (
              <div className="text-center py-8">
                <Loader2 size={48} className="animate-spin text-purple-500 mx-auto mb-4" />
                <p className="font-bold text-slate-900">Analyse en cours...</p>
                <p className="text-sm text-slate-500">Notre IA examine votre photo</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-bold text-red-700">Erreur d'analyse</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Results */}
            {result && result.estimation && (
              <div className="space-y-4">
                {/* Estimation Card */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-green-500" size={24} />
                      <span className="font-bold text-slate-900">Estimation terminée</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getConfidenceColor(result.estimation.confiance)}`}>
                      Confiance {result.estimation.confiance}
                    </span>
                  </div>

                  {/* Weight estimation */}
                  <div className="text-center mb-4">
                    <p className="text-5xl font-black text-purple-600">
                      {result.estimation.estimation_min} - {result.estimation.estimation_max}
                      <span className="text-2xl ml-1">kg</span>
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      Moyenne estimée: <strong>{result.estimation.estimation_moyenne} kg</strong>
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 mb-4">{result.estimation.description}</p>

                  {/* Price estimates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-4 border border-purple-100">
                      <p className="text-xs text-slate-500 mb-1">Standard (3€/kg)</p>
                      <p className="font-bold text-lg text-slate-900">{result.prix.standard.min} - {result.prix.standard.max}€</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-purple-100">
                      <p className="text-xs text-slate-500 mb-1">Express (5€/kg)</p>
                      <p className="font-bold text-lg text-slate-900">{result.prix.express.min} - {result.prix.express.max}€</p>
                    </div>
                  </div>

                  {/* Tip */}
                  {result.estimation.conseils && (
                    <div className="mt-4 p-3 bg-white rounded-xl border border-purple-100">
                      <p className="text-sm text-slate-600">
                        💡 <strong>Conseil:</strong> {result.estimation.conseils}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={resetEstimation}
                    className="flex-1 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                  >
                    <RefreshCw size={18} />
                    Nouvelle photo
                  </button>
                  {onEstimationComplete && (
                    <button
                      onClick={() => onEstimationComplete(result.estimation.estimation_moyenne)}
                      className="flex-1 py-3 bg-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-600 transition-all"
                    >
                      <CheckCircle size={18} />
                      Utiliser cette estimation
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* How it works */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">
            🤖 Notre IA analyse la taille et le type de contenant pour estimer le poids. 
            L'estimation finale sera confirmée par votre Washer lors de la collecte.
          </p>
        </div>
      </div>
    </div>
  );
}

// Compact button to trigger estimation
export function WeightEstimatorButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
    >
      <Camera size={16} />
      Estimer avec une photo
    </button>
  );
}

export default WeightEstimator;
