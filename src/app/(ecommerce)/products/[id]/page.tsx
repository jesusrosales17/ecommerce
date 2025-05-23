import ProductBreadCrumbs from "@/features/products/components/ProductBreadCrumbs";
import { ProductDetails } from "@/features/products/components/ProductDetails";
import ProductImagesGallery from "@/features/products/components/ProductImagesCallery";
import { ProductInfo } from "@/features/products/components/ProductInfo";
import { Product } from "@/features/products/interfaces/product";

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
      <ProductBreadCrumbs
        productName={product.name}
        category={product.category?.name }
      />

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
              category: product.category?.name || "Sin categoría",
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
