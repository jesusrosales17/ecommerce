import { ProductCardLong } from "@/features/products/components/ProductCardLong";
import { Product } from "@/features/products/interfaces/product";
import { formmatNumber } from "@/utils/number";

interface Props {
  params: Promise<{
    name: string;
  }>;
}
const ProductsByCategoryPage = async ({ params }: Props) => {
  const { name } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/products?categoryName=${name}`
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
          No se encontraron productos en esta categoria
        </p>
      </div>
    );
  }
  return (
    <main className=" mx-auto lg:px-3 py-3 grid grid-cols-1 md:grid-cols-[30%_70%] mt-5">
      <div className="hidden lg:block px-3 lg:px-0">
        <h1 className="text-xl font-bold">{name}</h1>
        <p className="text-accent-foreground">
          {formmatNumber(products.length)}{" "}
          {products.length > 1 ? "resultados" : "resultado"}
        </p>
      </div>
      
     <h1 className="lg:hidden px-3 lg:px-0">
        {products[0].category.name}

     </h1>
      <div className="grid grid-cols-1  bg-white">
       {
        products.map(product => (
            <ProductCardLong key={product.id} product={product} />
        ))
       } 
      </div>
    </main>
  );
};

export default ProductsByCategoryPage;
