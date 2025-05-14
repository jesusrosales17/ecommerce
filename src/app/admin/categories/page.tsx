import { CategoryPage } from "@/features/categories/components/CategoryPage";

export const metadata = {
  title: "Categorias",
  description: "Administra las categorias de tu tienda",
};


const Page = async () => {
  const base_url = process.env.PUBLIC_URL;

  const res = await fetch(`${base_url}/api/categories`, {
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
  console.log(categories)
  return (
    <>
  <CategoryPage initialCategories={categories} />
    </>
  );
};

export default Page;
