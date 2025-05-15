import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoMdAdd } from "react-icons/io";

export const metadata = {
  title: "Productos",
  description: "Administra los productos de tu tienda",
};

const ProductPage = () => {
  return (
    <div className="flex md:justify-between gap-4 md:items-center mb-5 flex-col md:flex-row">
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
      {/* <CategoryFormDrawer /> */}
    </div>
  );
};

export default ProductPage;
