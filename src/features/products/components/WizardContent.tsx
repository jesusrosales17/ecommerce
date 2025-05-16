"use client"

import { Button } from "@/components/ui/button";
import { useWizardStore } from "../store/useWizardStore";
import { ProductDescriptionForm } from "./ProductDescriptionForm";
import { ProductGeneralForm } from "./ProductGeneralForm";
import { ProductImagesForm } from "./ProductImagesForm";
import { ProductSpecificationsForm } from "./ProductSpecificationsForm";


export const WizardContent = () => {
    const {activeStep, nextStep, prevStep, steps} = useWizardStore();

  return (
    <div>
        {activeStep === 0 && <ProductGeneralForm />}
        {activeStep === 1 && <ProductSpecificationsForm />}
        {activeStep === 2 && <ProductDescriptionForm />}
        {activeStep === 3 && <ProductImagesForm />}


        <div className="flex justify-between itecms-center ">
        <Button type="button" variant="outline" onClick={() => prevStep()}>
            Regresar
        </Button>
        <Button type="submit" onClick={() => nextStep()} >
            {
                steps.length - 1 === activeStep ? "Guardar" : "Siguiente"
            }
        </Button>
        </div>
    </div>
  )
}
