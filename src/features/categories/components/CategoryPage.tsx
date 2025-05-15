"use client";
import { CategoryTable } from "./CategoryTable";
import { CategoryFormDrawer } from "./CategoryFormDrawer";
import { useCategoryStore } from "../store/categoryStore";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";
import { CategoryInfoDrawer } from "./CategoryInfoDrawer";
import { SearchInput } from "@/components/ui/SearchInput";

interface Props {
  initialCategories: Category[];
}

export const CategoryPage = ({ initialCategories }: Props) => {
  const { categories, setCategories, setIsOpenDrawer } = useCategoryStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setCategories(initialCategories);
  }, []);

 useEffect(() => {
    const filteredCategories = initialCategories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setCategories(filteredCategories);
  
 }, [searchQuery])

  return (
    <>
      <div className="flex md:justify-between gap-4 md:items-center mb-5 flex-col md:flex-row">
        <div>
          <h1 className="text-xl">Categorias</h1>
          <p className="text-sm text-gray-500">
            Administra las categorias de tu tienda
          </p>
        </div>
        <Button
          onClick={() => setIsOpenDrawer(true)}
          className="w-full md:w-auto"
        >
          <IoMdAdd />
          Nueva categoría
        </Button>
        <CategoryFormDrawer />
      </div>
        <SearchInput
          placeholder="Buscar categoria"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          classname="mb-4"
        />
      <CategoryTable categories={categories} />
      <CategoryInfoDrawer />
    </>
  );
};
