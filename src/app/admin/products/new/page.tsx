"use client";
import React, { useState } from "react";
import { ChevronRight, Check, ChevronLeft } from "lucide-react";
import { cn } from "@/libs/utils";
import { Form, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StepIndicator } from "@/features/products/components/StepIndicator";
import { Separator } from "@/components/ui/separator";
import { WizardContent } from "@/features/products/components/WizardContent";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// export const metadata = {
//   title: "Nuevo Producto",
//   description: "Crea un nuevo producto",
// }

const NewProductPage = () => {
  return (
    <div className="w-full">
      <div className=" ">
        {/* boton de regresar */}
        <div className="flex items-center justify-between mb-4">
          
            <Link href="/admin/products" className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Regresar
            </Link>
        </div>
        {/* <div className="flex-1">
          <h1 className="text-xl">Registrar nuevo producto</h1>
          <p className="text-sm">
            Completa el siguiente formulario para registrar un nuevo producto
          </p>
        </div> */}
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
      </div>
    </div>
  );
};

export default NewProductPage;
