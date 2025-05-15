"use client";
import React, { useState } from "react";
import { ChevronRight, Check } from "lucide-react";
import { cn } from "@/libs/utils";
import { Form, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StepIndicator } from "@/features/products/components/StepIndicator";
import { Separator } from "@/components/ui/separator";

// export const metadata = {
//   title: "Nuevo Producto",
//   description: "Crea un nuevo producto",
// }

const NewProductPage = () => {
  return (
    <div className="">
      <div className=" ">
        <div className="flex-1">
          <h1 className="text-xl">Registrar nuevo producto</h1>
          <p className="text-sm">
            Completa el siguiente formulario para registrar un nuevo producto
          </p>
        </div>
        <StepIndicator
        className="my-4"
          initialSteps={[
            { id: "step-1", label: "General" },
            { id: "step-2", label: "Especificaciones" },
            { id: "step-3", label: "Descripcion" },
            {id: "step-4", label: "Imagenes"},
          ]}
        />
      </div>
    </div>
  );
};

export default NewProductPage;
