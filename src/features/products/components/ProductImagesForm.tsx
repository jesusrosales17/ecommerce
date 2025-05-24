import { Button } from "@/components/ui/button";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { ImagePlus, Trash2, Star } from "lucide-react";
import { sonnerNotificationAdapter } from "@/libs/adapters/sonnerAdapter";
import { useProductStore } from "../store/useProductStore";
import Image from "next/image";

export const ProductImagesForm = forwardRef<{ submit: () => boolean | string }>(
  (_, ref) => {
    const { images, setImages, productSelectedId } = useProductStore();
    // guardar imagenes originales (no cambian)
    const handleImageChange = (index: number, file: File | null) => {
      const newImages = [...images];

      if (file) {
        // Generar URL de vista previa para la imagen seleccionada
        const preview = URL.createObjectURL(file);
        // Mantener la propiedad isPrincipal si existe
        newImages[index] = {
          file,
          preview,
          isPrincipal: newImages[index]?.isPrincipal,
        };
      } else {
        // Resetear la imagen si se elimina
        newImages[index] = { file: null, preview: "" };
      }

      setImages(newImages);
    };

    // Función para marcar una imagen como principal
    const handleSetMainImage = (index: number) => {
      if (!images[index].preview) return;

      const newImages = [...images];

      // Quitar la marca de principal de todas las imágenes
      newImages.forEach((image) => {
        if (image.isPrincipal) {
          image.isPrincipal = false;
        }
      });      // Marcar la imagen seleccionada como principal
      newImages[index].isPrincipal = true;
      
      setImages(newImages);
      sonnerNotificationAdapter.success("Imagen principal actualizada");
    };

    useImperativeHandle(ref, () => ({
      submit: () => {
        // Verificar si hay al menos una imagen seleccionada
        const hasImages = images.some((img) => img.file !== null);
        // si no hay imagenes pero se esta actualizando un producto si puede continuar
        if (!hasImages && productSelectedId) return true;

        // si no hay imagenes y no se esta actualizando un producto mostrar error
        if (!hasImages && !productSelectedId) {
          sonnerNotificationAdapter.error(
            "Debes agregar al menos una imagen del producto"
          );

          return false;
        }

        setImages(images);

        return hasImages;
      },
    }));    // Asegurarse de que haya una imagen principal
   

    useEffect(() => {
      if (images.length === 0) {
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    console.log(images)
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
                  {" "}
                  <div className="flex items-center justify-between">
                    {image.preview && (
                      <>
                        {/* Botón para eliminar imagen */}
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleImageChange(index, null)}
                          className="absolute top-2 right-2 z-10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        {/* Botón para marcar como principal */}
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          value={image.isPrincipal ? "true" : "false"}
                          onClick={() => handleSetMainImage(index)}
                          className={`absolute top-2 left-2 z-10 ${
                            image.isPrincipal
                              ? "bg-orange-500 hover:bg-orange-600 text-white"
                              : "bg-white/80 hover:bg-white"
                          }`}
                          title={
                            image.isPrincipal
                              ? "Imagen principal"
                              : "Marcar como principal"
                          }
                        >
                          <Star
                            className="h-4 w-4"
                            fill={image.isPrincipal ? "currentColor" : "none"}
                          />
                        </Button>
                      </>
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

ProductImagesForm.displayName = "ProductImagesForm";
