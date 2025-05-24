"use client";
import { CategoryTable } from "./CategoryTable";
import { CategoryFormDrawer } from "./CategoryFormDrawer";
import { useCategoryStore } from "../store/useCategoryStore";
import { Category } from "@prisma/client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";
import { CategoryInfoDrawer } from "./CategoryInfoDrawer";

interface Props {
  initialCategories: Category[];
}

export const CategoryPageContent = ({ initialCategories }: Props) => {
  const { categories, setCategories, setIsOpenDrawer } = useCategoryStore();

  useEffect(() => {
    setCategories(initialCategories);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



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

      <CategoryTable categories={categories} />
      <CategoryInfoDrawer />
    </>
  );
};
