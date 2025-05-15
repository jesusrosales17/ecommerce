import { cn } from "@/libs/utils";
import React, { useEffect } from "react";
import { useWizardStore } from "../store/WizardStore";
import { Check } from "lucide-react";

interface Props {
  initialSteps?: { id: string; label: string }[];
  className?: string; 
}

export const StepIndicator = ({initialSteps = [], className}: Props) => {
  const { activeStep, progressWidth, setSteps, steps } = useWizardStore();

  useEffect(() => {
    setSteps(initialSteps);
  }, [])


  return (
    <div className={cn( className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 mb-2 text-base",
                activeStep === index
                  ? "border-primary bg-primary text-primary-foreground"
                  : activeStep > index
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground text-muted-foreground"
              )}
            >
              {activeStep > index ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span
              className={cn(
                "text-sm font-medium",
                activeStep === index || activeStep > index
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Barra de progreso */}
      <div className="relative mt-2 h-2.5 bg-muted rounded-full">
        <div
          className="absolute left-0 top-0 h-2.5 bg-primary rounded-full transition-all duration-300"
          style={{ width: progressWidth }}
        />
      </div>
    </div>
  );
};
