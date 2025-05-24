"use client"

import { ChangeEvent, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface FileUploadProps {
  accept?: string
  id: string
  value: File | string | null
  onChange: (file: File | null) => void
  defaultPreview?: string | null
}

export function FileUpload({
  accept = "image/*",
  id,
  onChange,
  defaultPreview = null
}: FileUploadProps) {  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(() => {
    // Si hay un defaultPreview proporcionado, úsalo
    if (defaultPreview) {
      return defaultPreview;
    }
    // Si el valor es una cadena (nombre de archivo), no lo usamos directamente
    // ya que esto causa el error de Next/Image
    return null;
  })
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    
    if (file) {
      onChange(file)
      
      // Limpiar cualquier preview anterior antes de crear uno nuevo
      setPreview(null)
      
      // Create a preview for the image
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      // Si no hay archivo, limpiar el preview
      setPreview(null)
      onChange(null)
    }
  }

  const handleClear = () => {
    onChange(null)
    setPreview(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col items-center justify-center gap-4">
        {preview ? (
          <div className="relative aspect-square h-40 w-40 overflow-hidden rounded-md">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6 rounded-full"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label
            htmlFor={id}
            className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-10 w-10 text-gray-400" />
              <p className="mb-2 mt-2 text-sm text-gray-500">
                <span className="font-semibold">Click para subir</span>
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
            </div>
          </label>
        )}
        
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </div>
  )
}
