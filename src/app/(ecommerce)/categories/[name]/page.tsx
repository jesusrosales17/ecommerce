import { ProductCardLong } from "@/features/products/components/ProductCardLong";
import { Product } from "@/features/products/interfaces/product";
import { formmatNumber } from "@/utils/number";
import { ProductFilters } from "@/features/products/components/ProductFilters";

interface Props {
  params: Promise<{
    name: string;
  }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}
const ProductsByCategoryPage = async ({ params, searchParams }: Props) => {
  const { name } = await params;

  // Construir la URL con los parámetros de búsqueda
  const queryParams = new URLSearchParams();
  queryParams.append("categoryName", name);

  // Añadir filtros adicionales si están presentes
  const onSale = (await searchParams).onSale;
  if (onSale) {
    queryParams.append("onSale", onSale);
  }

  const featured = (await searchParams).featured;
  if (featured) {
    queryParams.append("featured", featured);
  }

  const minPrice = (await searchParams).minPrice;
  if (minPrice) {
    queryParams.append("minPrice", minPrice);
  }

  const maxPrice = (await searchParams).maxPrice;
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
      <main className="container mx-auto min-h-screen lg:px-3 py-3 grid grid-cols-1 md:grid-cols-[30%_70%] lg:grid-cols-[20%_77%] mt-5 gap-4 relative w-full  ">
        <div className="px-3 lg:px-0">
          <h1 className="text-xl font-bold">{decodeURIComponent(name)}</h1>

          <ProductFilters
            showSaleFilter={true}
            showFeaturedFilter={true}
            showPriceFilter={true}
          />
        </div>

        <div className="flex flex-col items-center justify-center min-h-[300px]  p-6">
          <h2 className="text-2xl font-bold mb-2">No hay productos</h2>
          <p className="text-gray-500 text-center">
            No se encontraron productos en esta categoría con los filtros
            seleccionados
          </p>
          <p className="text-gray-500 text-center mt-1">
            Prueba con otros criterios de búsqueda
          </p>
        </div>
      </main>
    );
  }
  return (
    <main className="container mx-auto lg:px-3 py-3 grid grid-cols-1 md:grid-cols-[30%_70%] lg:grid-cols-[20%_77%] mt-5 gap-4 relative w-full ">
      <div className="px-3 lg:px-0 ">
        <h1 className="text-xl font-bold">{decodeURIComponent(name)}</h1>
        <p className="text-accent-foreground mb-4">
          {formmatNumber(products.length)}{" "}
          {products.length > 1 ? "resultados" : "resultado"}
        </p>

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

export default ProductsByCategoryPage;
