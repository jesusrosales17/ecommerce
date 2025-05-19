"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface ImageUploaderProps {
  onChange: (file: File | null) => void;
  value?: File | string | null;
  className?: string;
  placeholder?: string;
  imagePath?: string;
  required?: boolean;
}

export function ImageUploader({
  onChange,
  value,
  className = "",
  placeholder = "Subir imagen",
  imagePath = "",
  required = false
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    typeof value === "string" ? `${imagePath}/${value}` : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    } else {
      setPreviewUrl(null);
      onChange(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPreviewUrl(null);
    onChange(null);
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        required={required}
      />
      
      <div className="flex flex-col items-center">
        {previewUrl ? (
          <div className="relative h-40 w-40 mb-2">
            <Image
              src={previewUrl}
              alt="Imagen de vista previa"
              fill
              className="object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="h-40 w-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
            <div className="text-center p-4">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-1 text-sm text-gray-500">{placeholder}</p>
            </div>
          </div>
        )}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={handleButtonClick}
        >
          {previewUrl ? "Cambiar imagen" : "Seleccionar imagen"}
        </Button>
      </div>
    </div>
  );
}
