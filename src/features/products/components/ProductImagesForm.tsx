import { Button } from "@/components/ui/button";
import { forwardRef, useEffect, useImperativeHandle, useMemo} from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { sonnerNotificationAdapter } from "@/libs/adapters/sonnerAdapter";
import { useProductStore } from "../store/useProductStore";
import Image from "next/image";

export const ProductImagesForm = forwardRef<{ submit: () => boolean | string  }>(
  (_, ref) => {
    const { images, setImages, productSelectedId, setImagesToDelete } = useProductStore();
    // guardar imagenes originales (no cambian)
   

    const handleImageChange = (index: number, file: File | null) => {
      const newImages = [...images];

      if (file) {
        // Generar URL de vista previa para la imagen seleccionada
        const preview = URL.createObjectURL(file);
        newImages[index] = { file, preview };
      } else {
        // Resetear la imagen si se elimina
        newImages[index] = { file: null, preview: "" };
      }

      setImages(newImages);
    };

    useImperativeHandle(ref, () => ({
      submit: () => {
        
        // Verificar si hay al menos una imagen seleccionada
        const hasImages = images.some((img) => img.file !== null );
        // si no hay imagenes pero se esta actualizando un producto si puede continuar
        if(!hasImages && productSelectedId) return true;

        // si no hay imagenes y no se esta actualizando un producto mostrar error
        if (!hasImages && !productSelectedId) {
          sonnerNotificationAdapter.error(
            "Debes agregar al menos una imagen del producto"
          );


          return false;
        }

       
       
        
        setImages(images);

        return  hasImages 
      },
    }));

    useEffect(() => {
      if(images.length === 0) {
           setImages([
        {
          file: null,
          preview: "",
        },
        {
          file: null,
          preview: "",
        },
        {
          file: null,
          preview: "",
        },
        {
          file: null,
          preview: "",
        },
        {
          file: null,
          preview: "",
        },
      ]);
      }
      if (images.length < 5) {
        const newImages = [...images];
        for (let i = images.length; i < 5; i++) {
          newImages.push({ file: null, preview: "" });
        }
        setImages(newImages);
      }
    }, []);
    return (
      <>
        <div>
          <h2 className="text-lg font-bold mb-4">Imágenes del producto</h2>
          <p className="text-sm text-gray-500 mb-4">
            Agrega las imágenes del producto que se mostrarán en la tienda. La
            primera imagen será la principal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="rounded-lg border ">
                <div className="relative">
                  <div className="flex items-center justify-between">
                    {image.preview && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleImageChange(index, null)}
                        className="absolute top-2 right-2 z-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {image.preview ? (
                    <div className="relative aspect-square overflow-hidden rounded-md">
                      <Image
                        width={200}
                        height={200}
                        src={image.preview}
                        alt={`Vista previa ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label
                          htmlFor={`image-${index}`}
                          className="bg-white text-black px-3 py-1 rounded-md cursor-pointer hover:bg-gray-100"
                        >
                          Cambiar
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor={`image-${index}`}
                      className="border-2 border-dashed border-gray-300 rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      <ImagePlus className="h-10 w-10 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">
                        Subir imagen
                      </span>
                    </label>
                  )}

                  <input
                    type="file"
                    id={`image-${index}`}
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) =>
                      handleImageChange(index, e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
);
