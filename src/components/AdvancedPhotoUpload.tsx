import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../lib/supabase';
import { Upload, X, Camera, Loader } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface AdvancedPhotoUploadProps {
  onUpload: (urls: string[]) => void;
  maxFiles?: number;
}

export default function AdvancedPhotoUpload({ onUpload, maxFiles = 5 }: AdvancedPhotoUploadProps) {
  const [files, setFiles] = useState<{ url: string; preview: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    const uploadedUrls: { url: string; preview: string }[] = [];

    try {
      for (const file of acceptedFiles.slice(0, maxFiles - files.length)) {
        // Compression
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };
        const compressedFile = await imageCompression(file, options);

        // Upload Supabase
        const fileExt = compressedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `order-photos/${fileName}`;

        const { error } = await supabase.storage
          .from('orders')
          .upload(filePath, compressedFile);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('orders')
          .getPublicUrl(filePath);

        uploadedUrls.push({
          url: publicUrl,
          preview: URL.createObjectURL(compressedFile)
        });
      }

      const newFiles = [...files, ...uploadedUrls];
      setFiles(newFiles);
      onUpload(newFiles.map(f => f.url));
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  }, [files, maxFiles, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: maxFiles - files.length,
    disabled: uploading || files.length >= maxFiles
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onUpload(newFiles.map(f => f.url));
  };

  return (
    <div className="space-y-3">
      <label className="block text-white/80 font-semibold flex items-center gap-2">
        <Camera className="w-5 h-5" />
        Photos du linge ({files.length}/{maxFiles})
      </label>

      <div className="grid grid-cols-3 gap-3">
        {files.map((file, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-white/10 group">
            <img src={file.preview} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => removeFile(i)}
              className="absolute top-2 right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}

        {files.length < maxFiles && (
          <div
            {...getRootProps()}
            className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-white/20 hover:border-white/40 bg-white/5'
            }`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <Loader className="w-8 h-8 text-white/60 animate-spin" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-white/60 mb-2" />
                <span className="text-white/60 text-sm text-center px-2">
                  {isDragActive ? 'Déposez ici' : 'Glissez ou cliquez'}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-white/60 text-sm">
        📸 Ajoutez jusqu'à {maxFiles} photos pour signaler des taches ou vêtements délicats
      </p>
    </div>
  );
}
