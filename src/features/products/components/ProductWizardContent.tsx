"use client";

import { Button } from "@/components/ui/button";
import { useWizardStore } from "../store/useWizardStore";
import { ProductDescriptionForm } from "./ProductDescriptionForm";
import { ProductGeneralForm } from "./ProductGeneralForm";
import { ProductImagesForm } from "./ProductImagesForm";
import { ProductSpecificationsForm } from "./ProductSpecificationsForm";
import { useEffect, useRef } from "react";
import { useProductStore } from "../store/useProductStore";
import axios from "axios";
import { sonnerNotificationAdapter } from "@/libs/adapters/sonnerAdapter";
import { useRouter } from "next/navigation";

export const ProductWizardContent = () => {
  const {
    activeStep,
    nextStep,
    prevStep,
    steps,
    stepClicked,
    setActiveStep,
    setStepClicked,
  } = useWizardStore();
  const { general, specifications, description, images, reset } = useProductStore();
  const {reset: resetWizard} = useWizardStore();
  const formRef = useRef<{ submit: () => boolean | string }>(null);
 
  const router = useRouter();
  const handleSubmit = async () => {
    const data = {
      general,
      specifications,
      description,
      images,
    };
    const formData = new FormData();
    formData.append("general", JSON.stringify(data.general));
    formData.append("specifications", JSON.stringify(data.specifications));
    formData.append("description", data.description);
    data.images.forEach((image, index) => {
      if (image.file) {
        formData.append(`images[${index}]`, image.file);
      }
    });
    try {
      const response = await axios.post("/api/products", formData);
      sonnerNotificationAdapter.success("Producto creado con éxito");
      // redireccionar
      router.push(`/admin/products`);
      setActiveStep(0);
    } catch (error) {
      console.error("Error al enviar el formulario", error);
      if (axios.isAxiosError(error)) {
        console.error("Error de Axios:", error.response?.data);
        sonnerNotificationAdapter.error(
          error.response?.data.error || "Error al crear el producto"
        );
        return;
      }

      sonnerNotificationAdapter.error("Error al crear el producto");
    }
  };

  const handleNextStep = async () => {
    if (formRef.current) {
      try {
        const isValid = await formRef.current?.submit();
        if (!!isValid) nextStep();
        if (activeStep === steps.length - 1) {
          handleSubmit();
        }
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
    const validateStep = async () => {
      if (stepClicked === null) return;

      if (stepClicked < activeStep) {
        setStepClicked(null);
        setActiveStep(stepClicked);
        return;
      }

      const isValid = await formRef.current?.submit();
      if (!!isValid) {
        setActiveStep(stepClicked);
      }
      setStepClicked(null);
    };
    validateStep();
  }, [stepClicked]);

  useEffect(() => {
 resetWizard();
 reset();
  }, [])
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
