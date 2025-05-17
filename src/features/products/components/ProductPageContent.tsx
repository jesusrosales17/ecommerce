import React from "react";
import { StepIndicator } from "./StepIndicator";
import { ProductWizardContent } from "./ProductWizardContent";

const ProductPageContent = () => {
    
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
