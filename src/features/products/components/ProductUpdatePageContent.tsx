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
  console.log(productData)
  const { setGeneral, setDescription, setSpecifications, setImages, setProductSelectedId, setImagesToDelete, setOriginalImages } = useProductStore();
  useEffect(() => {
    setGeneral({
      name: productData.name,
      price: Number( productData.price ),
      stock: productData.stock,
      status: productData.status,
      isOnSale: productData.isOnSale,
      salePrice: productData.salePrice as number | undefined,
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
      preview: `/api/uploads/products/${image.name}`

    })));
    setProductSelectedId(productData.id);
    setImagesToDelete([]);
    setOriginalImages([])
  }, []);

  return (
    <>
      <StepIndicator
        className="my-4"
        initialSteps={[
          { id: "general", label: "General" },
          { id: "specifications", label: "Especificaciones" },
          { id: "description", label: "Descripcion" },
          { id: "images", label: "Imagenes" },
        ]}
      />

      <ProductWizardContent />
    </>
  )
}
