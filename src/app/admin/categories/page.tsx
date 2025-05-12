import { CategoryTable } from "@/features/categories/components/CategoryTable";
import { CategoryDrawer } from "@/features/categories/components/CategoryDrawer";

const CategoriesPage = () => {
  return (
    <>
      <div className="flex md:justify-between gap-4 md:items-center mb-5 flex-col md:flex-row">
        <div>
          <h1 className="text-xl">Categorias</h1>
          <p className="text-sm text-gray-500">
            Administra las categorias de tu tienda
          </p>
        </div>
        <CategoryDrawer/>
      </div>

      <CategoryTable />
    </>
  );
};

export default CategoriesPage;
