import { ProductDetails } from "@/features/products/components/ProductDetails";
import ProductImagesGallery from "@/features/products/components/ProductImagesCallery";
import { ProductInfo } from "@/features/products/components/ProductInfo";
import { Product } from "@/features/products/interfaces/product";
import { formattedPrice } from "@/utils/price";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export const ProductPage = async ({ params }: Props) => {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products/${id}`);
  if (!res.ok) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Error</h1>
        <p className="text-gray-500">No se pudo cargar el producto</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={() => window.location.reload()}
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  const product: Product = await res.json();

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <a
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Inicio
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="w-3 h-3 mx-1 text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <a
                href={`/category/${product.category?.name}`}
                className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
              >
                {product.category?.name || "Sin categoría"}
              </a>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="w-3 h-3 mx-1 text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                {product.name}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8 p-6">
          {/* Galería de imágenes */}
          <div className="w-full">
            <ProductImagesGallery images={product.images} alt={product.name} />
          </div>

          {/* Información del producto */}
          <div className="flex flex-col space-y-6">
          <ProductInfo 
            product={{ 
              isOnSale: product.isOnSale,
              name: product.name,
              price: product.price,
              salePrice: product.salePrice || 0,
              stock: product.stock || 0,
              category: product.category.name,
            }} 
          />

          </div>
        </div>

       <ProductDetails product={product} /> 
      </div>
    </main>
  );
};

export default ProductPage;
