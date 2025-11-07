import { useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';

interface PhotoUploadProps {
  onUpload: (urls: string[]) => void;
  maxFiles?: number;
}

export default function PhotoUpload({ onUpload, maxFiles = 5 }: PhotoUploadProps) {
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // @ts-ignore
    import('@uploadcare/blocks').then((module) => {
      // @ts-ignore
      widgetRef.current = document.querySelector('lr-file-uploader-regular');
      
      if (widgetRef.current) {
        widgetRef.current.addEventListener('lr-file-upload-success', (e: any) => {
          const cdnUrl = e.detail.cdnUrl;
          onUpload([cdnUrl]);
        });
      }
    });
  }, [onUpload]);

  return (
    <div className="space-y-3">
      <label className="block text-white/80 font-semibold flex items-center gap-2">
        <Camera className="w-5 h-5" />
        Photos du linge (optionnel)
      </label>
      
      <lr-file-uploader-regular
        css-src="https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.35.2/web/lr-file-uploader-regular.min.css"
        class="uploadcare-config"
        pubkey={import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY || 'demopublickey'}
      />
      
      <p className="text-white/60 text-sm">
        Vous pouvez ajouter des photos pour signaler des taches ou vêtements délicats
      </p>
    </div>
  );
}
