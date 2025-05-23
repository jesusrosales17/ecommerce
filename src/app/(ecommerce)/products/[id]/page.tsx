import ProductImagesGallery from "@/features/products/components/ProductImagesCallery";
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

  // // Calcular rating promedio (asumiendo que el producto tiene reviews)
  // const averageRating = product.reviews?.length 
  //   ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length 
  //   : 0;

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <a href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Inicio
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <a href={`/category/${product.category?.name}`} className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">
                {product.category?.name || "Sin categoría"}
              </a>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{product.name}</span>
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              
              {/* Rating y reviews */}
              {/* {product.reviews?.length > 0 && (
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={`h-5 w-5 ${
                          rating < averageRating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {averageRating.toFixed(1)} ({product.reviews.length} reseñas)
                  </span>
                </div>
              )} */}

              {/* Precio */}
              <div className="mt-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    {formattedPrice(
                      product.isOnSale ? product.salePrice! : product.price
                    )}
                  </span>
                  {product.isOnSale && (
                    <span className="text-lg text-gray-500 line-through">
                      {formattedPrice(product.price)}
                    </span>
                  )}
                  {product.isOnSale && (
                    <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                      {Math.round(((product.price - product.salePrice!) / product.price) * 100)}% OFF
                    </span>
                  )}
                </div>
                {product.isOnSale && (
                  <p className="mt-1 text-sm text-green-600">
                    Ahorras {formattedPrice(product.price - product.salePrice!)}
                  </p>
                )}
              </div>

              {/* Disponibilidad */}
              <div className="mt-4">
                <p className={`text-sm font-medium ${
                  product.stock > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.stock > 0 
                    ? `Disponible (${product.stock} unidades)` 
                    : 'Agotado'}
                </p>
              </div>
            </div>

            {/* Especificaciones destacadas */}
            <div className="border-t border-b border-gray-200 py-4">
              <h3 className="text-sm font-medium text-gray-900">Características principales</h3>
              <ul className="mt-2 space-y-2">
                {product.specifications.slice(0, 3).map((spec) => (
                  <li key={spec.id} className="flex">
                    <span className="text-gray-600 text-sm">{spec.name}:</span>
                    <span className="ml-1 text-sm font-medium text-gray-900">{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cantidad y acciones */}
            <div className="space-y-4">
              <div className="flex items-center">
                <label htmlFor="quantity" className="mr-4 text-sm font-medium text-gray-700">
                  Cantidad
                </label>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <button 
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                    disabled={product.stock <= 0}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">1</span>
                  <button 
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                    disabled={product.stock <= 0}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  className="flex-1 flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
                  disabled={product.stock <= 0}
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Añadir al carrito
                </button>
                <button 
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                  title="Guardar en favoritos"
                >
                  <HeartIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Envío y devoluciones */}
            <div className="mt-2">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Envío gratis en pedidos superiores a $50</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Devoluciones gratuitas hasta 30 días</span>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción y detalles */}
        <div className="border-t border-gray-200 px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Descripción */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Descripción
              </h2>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            {/* Detalles */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Detalles del producto
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Categoría</span>
                    <span className="font-medium text-gray-900">
                      {product.category?.name || "Sin categoría"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Stock disponible</span>
                    <span className="font-medium text-gray-900">
                      {product.stock} unidades
                    </span>
                  </li>
                  {product.specifications.map((spec) => (
                    <li key={spec.id} className="flex justify-between">
                      <span className="text-gray-600">{spec.name}</span>
                      <span className="font-medium text-gray-900">{spec.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductPage;