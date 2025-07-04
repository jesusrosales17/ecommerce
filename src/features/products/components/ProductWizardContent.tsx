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
import { useCategoryStore } from "@/features/categories/store/useCategoryStore";

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
  const {
    general,
    specifications,
    description,
    images,
    productSelectedId,
    originalImages,
    setOriginalImages
  } = useProductStore();
  const { reset: resetWizard } = useWizardStore();
  const { categoriesFetch } = useCategoryStore();
  const formRef = useRef<{ submit: () => boolean | string }>(null);

  const router = useRouter();

  useEffect(() => {
    if (originalImages.length > 0) return;
    const productOriginalImages =  images
      .filter((image) => image.file === null && image.preview)
      .map((image) => ({
        preview: image.preview,
      }));

    setOriginalImages(productOriginalImages.map((image) => image.preview));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const handleSubmit = async () => {

    const imagesDeleted = originalImages?.filter((originalImage) => {
      return !images.some(
        (newImage) => newImage.preview === originalImage
      );
    }) || [];
    const imagesToDelete = imagesDeleted.map(
      (image) => image.split("/").pop() || ""
    );
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
      // Mapear imágenes y recopilar información sobre cuál es la principal
    const principalImageIndex = images.findIndex(img => img.isPrincipal);
    
    // Si estamos editando un producto existente, necesitamos enviar también la información
    // de qué imagen existente se ha marcado como principal
    if (productSelectedId) {
      // Enviar información sobre imágenes existentes y su estado principal
      const existingImages = images
        .filter(img => !img.file && img.preview) // Solo imágenes existentes (sin nuevos archivos)
        .map((img) => ({
          url: img.preview,
          isPrincipal: img.isPrincipal || false,
          name: img.preview.split('/').pop() || '' // Extraer el nombre del archivo de la URL
        }));
      
      if (existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }
    }
    
    // Agregar archivos de imagen nuevos al formData
    data.images.forEach((image, index) => {
      if (image.file) {
        formData.append(`images`, image.file);
        // Si esta imagen nueva es la principal, añadir su índice al formData
        if (image.isPrincipal) {
          formData.append("principalImageIndex", index.toString());
        }
      }
    });
    
    // Si ninguna imagen está marcada como principal pero hay imágenes, marcar la primera como principal
    if (principalImageIndex === -1 && images.some(img => img.file !== null || img.preview)) {
      // Buscar la primera imagen con contenido
      const firstImageWithContent = images.findIndex(img => img.file !== null || img.preview);
      if (firstImageWithContent >= 0) {
        formData.append("principalImageIndex", firstImageWithContent.toString());
      }
    }
    
    formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
    
  
    
    try {
      if (!productSelectedId) {
        await axios.post("/api/products", formData);
        sonnerNotificationAdapter.success("Producto creado con éxito");
      } else {
         await axios.put(
          `/api/products/${productSelectedId}`,
          formData
        );
        sonnerNotificationAdapter.success("Producto actualizado con éxito");
      }
      // redireccionar
      router.push(`/admin/products`);
      // setActiveStep(0);
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
        if (!isValid) return;
        if (activeStep === steps.length - 1) {
          handleSubmit();
        }
        nextStep();
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepClicked]);

  useEffect(() => {
    resetWizard();
    categoriesFetch();
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
