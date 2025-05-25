import { ProductCardLong } from "@/features/products/components/ProductCardLong";
import { Product } from "@/features/products/interfaces/product";
import { ProductFilters } from "@/components/ui/ProductFilters";

const SalesProducsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  // Construir la URL con los parámetros de búsqueda
  const queryParams = new URLSearchParams();

  // Siempre incluir onSale=true por defecto en la página de ventas
  queryParams.append("onSale", "true");
  // Añadir filtros adicionales si están presentes
  const featured = (await searchParams)?.featured;
  if (featured) {
    queryParams.append("featured", featured);
  }

  const minPrice = (await searchParams)?.minPrice;
  if (minPrice) {
    queryParams.append("minPrice", minPrice);
  }

  const maxPrice = (await searchParams)?.maxPrice;
  if (maxPrice) {
    queryParams.append("maxPrice", maxPrice);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/products?${queryParams.toString()}`
  );

  if (!res.ok) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-gray-500">No se pudieron cargar los productos</p>
      </div>
    );
  }

  const products: Product[] = (await res.json().catch(() => [])) || [];
  if (products.length === 0) {
    return (
      <main className="container mx-auto lg:px-3 py-3 grid grid-cols-1 md:grid-cols-[20%_77%] mt-5 gap-4">
        <div>
          <h1 className="text-xl font-bold mb-4">En oferta</h1>{" "}
          <ProductFilters
            defaultOnSale={true}
            showSaleFilter={false}
            showFeaturedFilter={true}
            showPriceFilter={true}
          />
        </div>

        <div className="flex flex-col items-center justify-center min-h-[300px]  p-6">
          <h2 className="text-2xl font-bold mb-2">
            No hay productos en oferta
          </h2>
          <p className="text-gray-500 text-center">
            No se encontraron productos en oferta con los filtros seleccionados
          </p>
          <p className="text-gray-500 text-center mt-1">
            Prueba con otros criterios de búsqueda
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto lg:px-3 py-3 grid grid-cols-1 md:grid-cols-[20%_77%] mt-5 gap-4">
      <div>
        <h1 className="text-xl font-bold mb-4">En oferta</h1>{" "}
        <ProductFilters
          defaultOnSale={true}
          showSaleFilter={false} // Ocultamos el filtro de ofertas porque ya estamos en la página de ofertas
          showFeaturedFilter={true}
          showPriceFilter={true}
        />
      </div>

      <div className="grid grid-cols-1 bg-white">
        {products.map((product) => (
          <ProductCardLong key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
};

export default SalesProducsPage;
