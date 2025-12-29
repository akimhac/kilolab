import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Camera, Upload, X } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  orderId: string;
  onUploadComplete: (urls: string[]) => void;
}

export default function ImageUpload({ orderId, onUploadComplete }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;

          // Redimensionne si > 1200px
          let width = img.width;
          let height = img.height;
          const maxSize = 1200;

          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(
                new File([blob!], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                })
              );
            },
            "image/jpeg",
            0.8
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const uploadedUrls: string[] = [];

      for (const file of files) {
        // Compression
        const compressedFile = await compressImage(file);

        // Upload vers Supabase Storage
        const fileName = `${user.id}/${orderId}/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from("order-photos")
          .upload(fileName, compressedFile);

        if (error) throw error;

        // Récupère l'URL publique
        const {
          data: { publicUrl },
        } = supabase.storage.from("order-photos").getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);

        // Preview
        const preview = URL.createObjectURL(compressedFile);
        setPreviews((prev) => [...prev, preview]);
      }

      // Sauvegarde les URLs dans la BDD
      const { error: dbError } = await supabase
        .from("order_photos")
        .insert(
          uploadedUrls.map((url) => ({
            order_id: orderId,
            photo_url: url,
            uploaded_by: user.id,
          }))
        );

      if (dbError) throw dbError;

      toast.success(`${files.length} photo(s) ajoutée(s)`);
      onUploadComplete(uploadedUrls);
    } catch (error: any) {
      console.error("Erreur upload:", error);
      toast.error("Erreur d'upload : " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-lg cursor-pointer hover:bg-teal-700 transition">
        <Camera size={20} />
        <span>{uploading ? "Upload en cours..." : "Ajouter des photos"}</span>
        <input
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((preview, idx) => (
            <div key={idx} className="relative aspect-square">
              <img
                src={preview}
                alt={`Photo ${idx + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => setPreviews((prev) => prev.filter((_, i) => i !== idx))}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
