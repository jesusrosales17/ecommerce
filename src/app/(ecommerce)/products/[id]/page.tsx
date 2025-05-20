import ProductImagesGallery from "@/features/products/components/ProductImagesCallery";
import { Product } from "@/features/products/interfaces/product";
import { formattedPrice } from "@/utils/price";

interface Props {
  params: Promise<{ id: string }>;
}

export const ProductPage = async ({ params }: Props) => {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products/${id}`);
  if (!res.ok) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-gray-500">No se pudo cargar el producto</p>
      </div>
    );
  }

  const product: Product = await res.json();

  return (
    <div className="container bg-white mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-8 bg-white p-6 ">
        {/* Galería de imágenes */}
        <div className="w-full">
          <ProductImagesGallery images={product.images} alt={product.name} />
        </div>

        {/* Información del producto */}
        <div className="flex flex-col justify-between space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

            <div className="flex items-center gap-3 mt-2">
              <span className="text-2xl font-bold text-blue-600">
                {formattedPrice(product.isOnSale ? product.salePrice! : product.price)}
              </span>
              {product.isOnSale && (
                <span className="text-lg text-gray-400 line-through">
                  {formattedPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border rounded-md overflow-hidden">
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100">-</button>
              <span className="px-4 py-2">1</span>
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100">+</button>
            </div>
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition">
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div className="bg-white mt-8 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Descripción</h2>
        <div
          className="prose prose-sm max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>

      {/* Detalles */}
      <div className="bg-white mt-6 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Detalles del producto</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li><strong>Categoría:</strong> {product.category?.name || 'Sin categoría'}</li>
          <li><strong>Stock disponible:</strong> {product.stock}</li>
          {product.specifications.map((spec) => (
            <li key={spec.id}><strong>{spec.name}:</strong> {spec.value}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default ProductPage;