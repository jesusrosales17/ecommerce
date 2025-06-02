import { CategoryPageContent } from "@/features/categories/components/CategoryPageContent";

export const metadata = {
  title: "Categorias",
  description: "Administra las categorias de tu tienda",
};

const CategoryPage = async () => {
  const base_url = process.env.NEXT_PUBLIC_URL;
  const res = await fetch(`${base_url}/api/categories?status=ALL`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-gray-500">No se pudieron cargar las categorias</p>
      </div>
    );
  }

  const categories = await res.json();
  return (
    <>
      <CategoryPageContent initialCategories={categories} />
    </>
  );
};

export default CategoryPage;
