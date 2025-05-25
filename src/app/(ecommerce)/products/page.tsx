import { ProductCardLong } from "@/features/products/components/ProductCardLong";
import { Product } from "@/features/products/interfaces/product";
import { formmatNumber } from "@/utils/number";
import { ProductFilters } from "@/components/ui/ProductFilters";

const ProductsPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  // Construir la URL con los parámetros de búsqueda
  const queryParams = new URLSearchParams();
  
  // Añadir todos los filtros si están presentes
  if (searchParams.onSale) {
    queryParams.append('onSale', searchParams.onSale);
  }
    if (searchParams.featured) {
    queryParams.append('featured', searchParams.featured);
  }
  
  if (searchParams.minPrice) {
    queryParams.append('minPrice', searchParams.minPrice);
  }
  
  if (searchParams.maxPrice) {
    queryParams.append('maxPrice', searchParams.maxPrice);
  }
  
  // Realizar la petición con los filtros aplicados
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
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
      <main className="container mx-auto lg:px-3 py-3 grid grid-cols-1 md:grid-cols-[30%_70%] mt-5 gap-4">
        <div className="px-3 lg:px-0">
          <h1 className="text-xl font-bold">Todos los productos</h1>
          
          {/* Mostrar los filtros incluso cuando no hay resultados */}
          <ProductFilters 
            showSaleFilter={true}
            showFeaturedFilter={true}
            showPriceFilter={true}
            defaultOnSale={searchParams.onSale === 'true'}
            defaultFeatured={searchParams.featured === 'true'}
            defaultMinPrice={searchParams.minPrice ? Number(searchParams.minPrice) : 0}
            defaultMaxPrice={searchParams.maxPrice ? Number(searchParams.maxPrice) : 10000}
          />
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-white p-6">
          <h2 className="text-2xl font-bold mb-2">No hay productos</h2>
          <p className="text-gray-500 text-center">No se encontraron productos con los filtros seleccionados</p>
          <p className="text-gray-500 text-center mt-1">Prueba con otros criterios de búsqueda</p>
        </div>
      </main>
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
          showPriceFilter={true}          defaultOnSale={searchParams.onSale === 'true'}
          defaultFeatured={searchParams.featured === 'true'}
          defaultMinPrice={searchParams.minPrice ? Number(searchParams.minPrice) : 0}
          defaultMaxPrice={searchParams.maxPrice ? Number(searchParams.maxPrice) : 10000}
        />
      </div>
      
      <div className="grid grid-cols-1 bg-white">
        {products.map(product => (
          <ProductCardLong key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
};

export default ProductsPage;
