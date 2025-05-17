import React from "react";
import { StepIndicator } from "./StepIndicator";
import { WizardContent } from "./WizardContent";

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

      <WizardContent />
    </>
  );
};

export default ProductPageContent;
