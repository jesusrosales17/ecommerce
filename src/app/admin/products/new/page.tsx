"use client";
import React, { useState } from "react";
import { ChevronRight, Check } from "lucide-react";
import { cn } from "@/libs/utils";
import { Form, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// export const metadata = {
//   title: "Nuevo Producto",
//   description: "Crea un nuevo producto",
// }

const steps = [
  { id: "paso-1", label: "Básico" },
  { id: "paso-2", label: "Detalles" },
  { id: "paso-3", label: "Imágenes" },
];

const NewProductPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const totalSteps = steps.length;

  const nextStep = () => {
    if (activeStep < totalSteps - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const progressWidth = `${(activeStep / (totalSteps - 1)) * 100}%`;

  return (
    <div className="">
      <div className=" ">
        <div className="flex-1">
          <h1 className="text-xl">Registrar nuevo producto</h1>
          <p className="text-sm">
            Completa el siguiente formulario para registrar un nuevo producto
          </p>
        </div>
        <div className="mt-6">
          {/* Indicador de pasos */}
          <div className="mb-6 w-1d/3 mx-autok">
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

          {/* Contenido del paso actual (placeholder) */}
          <div className="mb-6">
            <p className="text-lg">
              Contenido del paso: <strong>{steps[activeStep].label}</strong>
            </p>
          </div>
        </div>
      </div>

              <div>
                {/* <FormLabel  /> */}
                <Input name="name"  /> 
                <Input name="name"  /> 
                <Input name="name"  /> 
                             </div>
          {/* Botones de navegación */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={activeStep === 0}
          className={cn(
            "px-4 py-2 rounded-lg border",
            activeStep === 0
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-gray-600 text-gray-700 hover:bg-gray-100"
          )}
        >
          Anterior
        </button>

        <button
          onClick={nextStep}
          disabled={activeStep === totalSteps - 1}
          className={cn(
            "flex items-center px-4 py-2 rounded-lg border",
            activeStep === totalSteps - 1
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-gray-600 text-gray-700 hover:bg-gray-100"
          )}
        >
          {activeStep < totalSteps - 1 ? (
            <>
              Siguiente
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            "Finalizar"
          )}
        </button>
      </div>
    </div>
  );
};

export default NewProductPage;
