import { ProductCardLong } from "@/features/products/components/ProductCardLong";
import { Product } from "@/features/products/interfaces/product";
import { formmatNumber } from "@/utils/number";
import { ProductFilters } from "@/components/ui/ProductFilters";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  // Construir la URL con los parámetros de búsqueda
  const queryParams = new URLSearchParams();

  // Añadir todos los filtros si están presentes
  const onSale = (await searchParams).onSale;
  if (onSale) {
    queryParams.append("onSale", onSale);
  }
  const featured = (await searchParams).featured;
  if (featured) {
    queryParams.append("featured", featured);
  }
  const minSale = (await searchParams).minSale;
  if (minSale) {
    queryParams.append("minSale", minSale);
  }
  const maxSale = (await searchParams).maxSale;
  if (maxSale) {
    queryParams.append("maxSale", maxSale);
  }
  const minPrice = (await searchParams).minPrice;
  if (minPrice) {
    queryParams.append("minPrice", minPrice);
  }

  const maxPrice = (await searchParams).maxPrice;
  if (maxPrice) {
    queryParams.append("maxPrice", maxPrice);
  }

  // Realizar la petición con los filtros aplicados
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/products${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`
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
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">No hay productos</h1>
        <p className="text-gray-500">
          No se encontraron productos con los filtros seleccionados
        </p>
      </div>
    );
  }

  return (
    <main className="container mx-auto lg:px-3 py-3 grid grid-cols-1 md:grid-cols-[30%_70%] mt-5 gap-4">
      <div className="px-3 lg:px-0">
        <h1 className="text-xl font-bold">Todos los productos</h1>
        <p className="text-accent-foreground mb-4">
          {formmatNumber(products.length)}{" "}
          {products.length > 1 ? "resultados" : "resultado"}
        </p>

        {/* Aquí mostramos todos los filtros disponibles */}
        <ProductFilters
          showSaleFilter={true}
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

export default ProductsPage;
