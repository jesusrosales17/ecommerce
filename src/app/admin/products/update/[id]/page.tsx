import { ProductUpdatePageContent } from "@/features/products/components/ProductUpdatePageContent";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

const ProductUpdatePage = async ({ params }: Params) => {
  const { id } = await params;

  // optener el producto por id
  const product = await fetch(`${process.env.PUBLIC_URL}/api/products/${id}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!product.ok) {
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
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Error</h1>
            <p className="text-gray-500">
                No se pudo cargar el producto. Verifica que el ID sea correcto.
            </p>
          </div>
        </div>
      </div>
    );
  }
  const productData = await product.json();

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

        <ProductUpdatePageContent productData={productData} />
      </div>
    </div>
  );
};

export default ProductUpdatePage;
