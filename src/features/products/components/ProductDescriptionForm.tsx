import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { forwardRef } from "react";
export const ProductDescriptionForm = forwardRef<{
  submit: () => string | boolean;
}>((_, ref) => {
  return (
    <>
      <div>
        <h2 className="text-lg font-bold mb-4">Descripcion del producto</h2>
        <p className="text-sm text-gray-500 mb-4">
          Agrega una descripcion del producto que se mostrara en la tienda, como
          el procesador, peso, y materiales.
        </p>
      </div>

      <div className="border rounded-md p-4">
        <SimpleEditor ref={ref} />
      </div>
    </>
  );
});
