// Composant de prise de photo pour le linge (sans IA)
import { useState, useRef } from 'react';
import { Camera, Upload, X, CheckCircle, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';

interface PhotoCaptureProps {
  onPhotoCapture?: (base64: string) => void;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
}

export function PhotoCapture({ onPhotoCapture, onClose, title = "Photo du linge", subtitle = "Prenez une photo de votre linge" }: PhotoCaptureProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
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
      const base64Data = base64.split(',')[1];
      setImageBase64(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const resetPhoto = () => {
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const confirmPhoto = () => {
    if (imageBase64 && onPhotoCapture) {
      onPhotoCapture(imageBase64);
      toast.success('Photo enregistrée !');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center">
              <Camera size={22} />
            </div>
            <div>
              <h3 className="font-black text-lg">{title}</h3>
              <p className="text-white/80 text-sm">{subtitle}</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-all">
              <X size={22} />
            </button>
          )}
        </div>
      </div>

      <div className="p-5">
        {/* Image Upload Area */}
        {!imagePreview ? (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-teal-400 transition-all bg-slate-50">
            <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ImagePlus size={28} className="text-teal-600" />
            </div>
            <h4 className="font-bold text-slate-900 mb-1">Ajouter une photo</h4>
            <p className="text-sm text-slate-500 mb-5">
              Cette photo sera partagée avec votre Washer
            </p>
            
            <div className="flex flex-col gap-2.5">
              {/* Camera button (mobile) */}
              <label className="flex items-center justify-center gap-2 px-5 py-3 bg-teal-500 text-white rounded-xl font-bold cursor-pointer hover:bg-teal-600 transition-all">
                <Camera size={18} />
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
              <label className="flex items-center justify-center gap-2 px-5 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-bold cursor-pointer hover:bg-slate-100 transition-all">
                <Upload size={18} />
                <span>Choisir depuis la galerie</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-100">
              <img 
                src={imagePreview} 
                alt="Aperçu" 
                className="w-full h-56 object-contain"
              />
              <button
                onClick={resetPhoto}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg"
              >
                <X size={16} />
              </button>
            </div>

            {/* Confirm Button */}
            <div className="flex gap-2">
              <button
                onClick={resetPhoto}
                className="flex-1 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Reprendre
              </button>
              <button
                onClick={confirmPhoto}
                className="flex-1 py-3 bg-teal-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-600 transition-all"
              >
                <CheckCircle size={18} />
                Valider
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact button to trigger photo capture
export function PhotoCaptureButton({ onClick, label = "Prendre une photo" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 text-white rounded-xl font-bold text-sm hover:bg-teal-600 transition-all"
    >
      <Camera size={16} />
      {label}
    </button>
  );
}

export default PhotoCapture;
