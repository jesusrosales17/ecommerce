'use client'
import { StepIndicator } from "./StepIndicator";
import { ProductWizardContent } from "./ProductWizardContent";
import { useProductStore } from "../store/useProductStore";
import { useEffect } from "react";

const ProductPageContent = () => {
  const {reset} = useProductStore();
  useEffect(() => {
    reset();
  }, [reset]);
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
  );
};

export default ProductPageContent;
