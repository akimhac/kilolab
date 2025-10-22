import { useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface PhotoUploadProps {
  orderId: string;
  photoType: 'before' | 'after';
  onUploadComplete: () => void;
}

export function PhotoUpload({ orderId, photoType, onUploadComplete }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image doit faire moins de 5 MB');
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${orderId}-${photoType}-${Date.now()}.${fileExt}`;
      const filePath = `orders/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('order-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('order-photos')
        .getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase
        .from('order_photos')
        .insert({
          order_id: orderId,
          photo_url: publicUrl,
          photo_type: photoType,
        });

      if (dbError) throw dbError;

      toast.success('Photo uploadée avec succès !');
      onUploadComplete();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
        id={`photo-upload-${photoType}`}
      />
      <label
        htmlFor={`photo-upload-${photoType}`}
        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition ${
          uploading
            ? 'border-gray-600 bg-gray-800/50 cursor-not-allowed'
            : 'border-purple-500 hover:border-purple-400 bg-white/5 hover:bg-white/10'
        }`}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
        ) : uploading ? (
          <>
            <Loader className="w-10 h-10 text-purple-400 animate-spin mb-2" />
            <p className="text-gray-400">Upload en cours...</p>
          </>
        ) : (
          <>
            <Upload className="w-10 h-10 text-purple-400 mb-2" />
            <p className="text-gray-300">Cliquez pour uploader</p>
            <p className="text-sm text-gray-500 mt-1">Photo {photoType === 'before' ? 'avant' : 'après'}</p>
          </>
        )}
      </label>
    </div>
  );
}