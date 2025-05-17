import {   ChevronLeft } from "lucide-react";
import Link from "next/link";
import ProductPageContent from "@/features/products/components/ProductPageContent";

export const metadata = {
  title: "Nuevo Producto",
  description: "Crea un nuevo producto",
}
const NewProductPage = async () => {
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
     
      <ProductPageContent /> 
      </div>
    </div>
  );
};

export default NewProductPage;
