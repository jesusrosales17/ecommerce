"use client"

import { useWizardStore } from "../store/useWizardStore";


export const WizardContent = () => {
    const {activeStep, nextStep} = useWizardStore();

  return (
    <div>
        <div className="flex flex-col items-center justify-center w-full h-full">
            <h2 className="text-2xl font-bold">Paso {activeStep + 1}</h2>
            <p className="text-sm text-muted-foreground">
            Contenido del paso {activeStep + 1}
            </p>
        </div>
    </div>
  )
}
