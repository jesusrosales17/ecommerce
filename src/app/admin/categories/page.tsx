import { CategoryTable } from "@/features/categories/components/CategoryTable";
import { CategoryDrawer } from "@/features/categories/components/CategoryDrawer";
import { CategoryPage } from "@/features/categories/components/CategoryPage";

export const metadata = {
  title: "Categorias",
  description: "Administra las categorias de tu tienda",
};

const Page = () => {
  return (
    <>
    <CategoryPage />
    </>
  );
};

export default Page;
