"use client";

import { Button } from "@/components/ui/button";
import { useWizardStore } from "../store/useWizardStore";
import { ProductDescriptionForm } from "./ProductDescriptionForm";
import { ProductGeneralForm } from "./ProductGeneralForm";
import { ProductImagesForm } from "./ProductImagesForm";
import { ProductSpecificationsForm } from "./ProductSpecificationsForm";
import { useRef } from "react";

export const WizardContent = () => {
  const { activeStep, nextStep, prevStep, steps } = useWizardStore();

  const formRef = useRef<{submit: () => boolean}>(null);

  const handleNextStep = async () => {
    if (formRef.current) {
      try {
        const isValid = await formRef.current?.submit();
        console.log(isValid)
        if (isValid) nextStep();

      } catch (error) {
        console.error("Error al enviar el formulario", error);
        return; 
      }
    }
  }

   const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <ProductGeneralForm ref={formRef} />
      case 1:
        return <ProductSpecificationsForm />;
      case 2:
        return <ProductDescriptionForm  />;
      case 3:
        return <ProductImagesForm  />;
      default:
        return null;
    }
  };
  return (
    <div>
      {renderStep()}

      <div className="flex justify-between itecms-center mt-5">
        <Button type="button" variant="outline" onClick={() => prevStep()}>
          Regresar
        </Button>
        <Button type="submit" onClick={handleNextStep}>
          {steps.length - 1 === activeStep ? "Guardar" : "Siguiente"}
        </Button>
      </div>
    </div>
  );
};
