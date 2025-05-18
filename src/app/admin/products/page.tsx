import { Button } from "@/components/ui/button";
import ProductTable from "@/features/products/components/ProductTable";
import { Product } from "@/features/products/interfaces/product";
import { Category } from "@prisma/client";
import Link from "next/link";
import { IoMdAdd } from "react-icons/io";

export const metadata = {
  title: "Productos",
  description: "Administra los productos de tu tienda",
};
const ProductPage = async () => {
  // optener productos y categorias al mismo tiempo

const [res, resCategories] = await Promise.all([
  fetch(`${process.env.NEXT_PUBLIC_URL}/api/products`, { method: "GET", cache: "no-store" }),
  fetch(`${process.env.NEXT_PUBLIC_URL}/api/categories`, { method: "GET", cache: "no-store" }),
]);
 

  if (!resCategories.ok) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-gray-500">No se pudieron cargar las categorias</p>
      </div>
    );
  }

  if (!res.ok) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-gray-500">No se pudieron cargar los productos</p>
      </div>
    );
  }
  const products: Product[] = await res.json();
  const categories: Category[] = await resCategories.json();

  console.log(products)
  return (
    <>
    <div className="flex  items-center md:justify-between gap-4 md:items-center mb-5 flex-col md:flex-row">
      <div>
        <h1 className="text-xl">Productos</h1>
        <p className="text-sm text-gray-500">
          Administra las categorias de tu tienda
        </p>
      </div>
      <Button
      asChild
        className="w-full md:w-auto"
      >
        <Link href="/admin/products/new">
        <IoMdAdd />
        Nuevo Producto
        </Link>
      </Button>

    </div>

    <ProductTable categories={categories} products={products} />
    </>
  );
};

export default ProductPage;
