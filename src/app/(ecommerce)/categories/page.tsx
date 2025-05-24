import { Section } from "@/components/ui/section";
import { ProductsByCategory } from "@/features/ecommerce/interfaces/products";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Product } from "@/features/products/interfaces/product";



 const CategoriesPage = async () => {
  const productsRes = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/products`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  if (!productsRes.ok) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-gray-500">No se pudieron cargar las categorias</p>
      </div>
    );
  }
  const products: Product[] = (await productsRes.json().catch(() => [])) || [];
  //    separar por categorias 
 
  const productByCategories = products.reduce(
    (acc: ProductsByCategory, product: Product) => {
      const category = product.category?.name || "Sin categoria";
      if (!acc[category]) {
        acc[category] = {
          products: [],
          category,
        };
      }
      acc[category].products.push(product);
      return acc;
    },
    {}
  );
  return (
    <main className="xl:container mx-auto px-3 py-3">
      <div className="mb-10 mt-5">
        <h1 className="text-3xl font-bold">Categorias</h1>
        <p className="">Accede a una gran variedad de categorias</p>
      </div>

      <div>
        {Object.entries(productByCategories).map(([category, data]) => (
          <Section
          key={category}
            title={category}
            description={data.category}
            viewAllLink={`/categories/${category}`}
            viewAllText="Ver todos los productos destacados"
            className="mb-10"
          >
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 2xl:grid-cols-6 lg:gap-6 overflow-hidden lg:mx-4 lg:max-h-[350px] 2xl:max-h-[380px]">
              {data.products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  salePrice={product.salePrice as number | undefined}
                  isOnSale={product.isOnSale}
                  category={product.category?.name || "Sin categoria"}
                  image={product.images?.[0]?.name}
                />
              ))}
            </div>
          </Section>
        ))}
      </div>
    </main>
  );
};
export default CategoriesPage;
