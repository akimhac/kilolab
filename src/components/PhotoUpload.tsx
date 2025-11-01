import { useState, useRef } from 'react';
import { Camera, Upload, X, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PhotoUploadProps {
  orderId: string;
  photoType: 'bag' | 'scale' | 'progress' | 'ready';
  onUploadComplete?: (photoUrl: string) => void;
  existingPhotoUrl?: string;
}

const photoTypeLabels = {
  bag: '📦 Photo du sac',
  scale: '⚖️ Photo de la balance',
  progress: '🔄 Photo en cours',
  ready: '✅ Photo finale',
};

export default function PhotoUpload({ orderId, photoType, onUploadComplete, existingPhotoUrl }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(existingPhotoUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5MB");
      return;
    }

    setError(null);
    setSuccess(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    await uploadPhoto(file);
  };

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${orderId}/${photoType}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('order-photos')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('order-photos').getPublicUrl(fileName);
      const publicUrl = urlData.publicUrl;

      const { error: dbError } = await supabase.from('order_photos').insert({
        order_id: orderId,
        photo_type: photoType,
        photo_url: publicUrl,
      });

      if (dbError) throw dbError;

      setSuccess(true);
      if (onUploadComplete) onUploadComplete(publicUrl);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => fileInputRef.current?.click();

  const handleRemove = () => {
    setPreview(null);
    setSuccess(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{photoTypeLabels[photoType]}</h3>
        {success && (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Photo uploadée !</span>
          </div>
        )}
      </div>

      <div className="relative">
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-lg border-2 border-white/20" />
            <button onClick={handleRemove} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all" disabled={uploading}>
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button onClick={handleClick} disabled={uploading} className="w-full h-64 border-2 border-dashed border-white/30 rounded-lg hover:border-purple-400 transition-all bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed">
            {uploading ? (
              <>
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-white/60">Upload en cours...</p>
              </>
            ) : (
              <>
                <div className="flex gap-4">
                  <Camera className="w-12 h-12 text-white/40" />
                  <Upload className="w-12 h-12 text-white/40" />
                </div>
                <div className="text-center">
                  <p className="text-white font-medium mb-1">Cliquez pour uploader une photo</p>
                  <p className="text-white/60 text-sm">PNG, JPG jusqu'à 5MB</p>
                </div>
              </>
            )}
          </button>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" disabled={uploading} />
      </div>

      {error && <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">{error}</div>}
    </div>
  );
}
