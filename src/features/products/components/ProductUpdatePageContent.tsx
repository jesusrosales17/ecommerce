'use client'
import { useEffect } from "react"
import { Product } from "../interfaces/product"
import { ProductWizardContent } from "./ProductWizardContent"
import { StepIndicator } from "./StepIndicator"
import { useProductStore } from "../store/useProductStore"

interface Props {
  productData: Product
}

export const ProductUpdatePageContent = ({ productData }: Props) => {
  const { setGeneral, setDescription, setSpecifications, setImages } = useProductStore();
  useEffect(() => {
    setGeneral({
      id: productData.id,
      name: productData.name,
      price: Number( productData.price ),
      stock: productData.stock,
      status: productData.status,
      categoryId: productData.categoryId as string | undefined,
      isFeatured: productData.isFeatured,
    });
    setDescription(productData.description);
    setSpecifications(productData.specifications.map((specification) => ({
      label: specification.name,
      value: specification.value,
    })));
    setImages(productData.images.map((image) => ({
      file: null,
      preview: `${process.env.UPLOADS_PATH}/products/${image.name}`,
    })));
  }, []);
  console.log("carpeta", process.env.UPLOADS_PATH)

  return (
    <>
      <StepIndicator
        className="my-4"
        initialSteps={[
          { id: "genetal", label: "General" },
          { id: "specifications", label: "Especificaciones" },
          { id: "description", label: "Descripcion" },
          { id: "images", label: "Imagenes" },
        ]}
      />

      <ProductWizardContent />
    </>
  )
}
