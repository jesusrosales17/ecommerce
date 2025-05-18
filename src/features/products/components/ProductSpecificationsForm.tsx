import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sonnerNotificationAdapter } from "@/libs/adapters/sonnerAdapter";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useProductStore } from "../store/useProductStore";

export const ProductSpecificationsForm = forwardRef<{submit: () => string | boolean}>((_, ref) => {
  const {specifications, setSpecifications} = useProductStore();
 
  const handleAddSpecifications = () => {
    const newSpecifications = [...specifications, { label: "", value: "" }];
    setSpecifications(newSpecifications);
  };

  useImperativeHandle(ref, () => ({
    submit: () => {
      const hasEmptyFields = specifications.some(
        (specification) => specification.label.trim() === "" || specification.value.trim() === ""
      );
      const isValid = !hasEmptyFields && specifications.length > 0;

     console.log(hasEmptyFields); 
      if (!isValid) {
        sonnerNotificationAdapter.error(
          "No debe haber campos vacios en las especificaciones");
          return false;
      }
      setSpecifications(specifications);
      return true;
    },
  }))

  return (
    <>
      <div>
        <h2 className="text-lg font-bold mb-4">
          Especificaciones del producto
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Agrega las especificaciones del producto que se mostraran en la
          tienda, como el procesador, peso, y materiales.
        </p>
      </div>

      <form>
        {(specifications.length === 0 && (
          <p className="text-sm text-gray-500 mb-4 text-center">
            No hay especificaciones agregadas.
          </p>
        ))}

        {
          specifications.map((specification, index) => (
            <div key={index} className="flex gap-4 mb-4">
              <Input
                type="text"
                placeholder="Etiqueta"
                value={specification.label}
                onChange={(e) => {
                  const newSpecifications = [...specifications];
                  newSpecifications[index].label = e.target.value;
                  setSpecifications(newSpecifications);
                }}
                className="border rounded-md p-2 w-full"
              />
              <Input
                type="text"
                placeholder="Valor"
                value={specification.value}
                onChange={(e) => {
                  const newSpecifications = [...specifications];
                  newSpecifications[index].value = e.target.value;
                  setSpecifications(newSpecifications);
                }}
                className="border rounded-md p-2 w-full"
              />

              {/* boton de eliminar */}
              <Button
                variant="outline"
                className="w-8 h-8 p-0"
                type="button"
                onClick={() => {
                  const newSpecifications = [...specifications];
                  newSpecifications.splice(index, 1);
                  setSpecifications(newSpecifications);
                }}
              >
                X
              </Button>
            </div>
          ))
          }
          

      </form>
      {/* Boton nueva categoria */}
      <Button onClick={handleAddSpecifications} variant="outline" className="w-full">
        Agregar especificacion
      </Button>
    </>
  );
})
