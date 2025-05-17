"use client";

import { Button } from "@/components/ui/button";
import { useWizardStore } from "../store/useWizardStore";
import { ProductDescriptionForm } from "./ProductDescriptionForm";
import { ProductGeneralForm } from "./ProductGeneralForm";
import { ProductImagesForm } from "./ProductImagesForm";
import { ProductSpecificationsForm } from "./ProductSpecificationsForm";
import { useEffect, useRef } from "react";
import { set } from "zod";

export const WizardContent = () => {
  const { activeStep, nextStep, prevStep, steps, stepClicked , setActiveStep, setStepClicked} = useWizardStore();

  const formRef = useRef<{ submit: () => boolean | string }>(null);

  const handleNextStep = async () => {
    if (formRef.current) {
      try {
        const isValid = await formRef.current?.submit();
        if (!!isValid) nextStep();

      } catch (error) {
        console.error("Error al enviar el formulario", error);
        return;
      }
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <ProductGeneralForm ref={formRef} />;
      case 1:
        return <ProductSpecificationsForm ref={formRef} />;
      case 2:
        return <ProductDescriptionForm ref={formRef} />;
      case 3:
        return <ProductImagesForm ref={formRef} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (stepClicked === null) return;
    // if(stepClicked < activeStep) {
    //   setActiveStep(stepClicked);
    //   setStepClicked(null);
    //   return;
    // };

    setTimeout(() => {
      const isValid = formRef.current?.submit();
      if(!!isValid) {
        setActiveStep(stepClicked);
      }
    }, 0);
  }, [stepClicked])
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
