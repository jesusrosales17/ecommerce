"use client";
import { CategoryTable } from "./CategoryTable";
import { CategoryDrawer } from "./CategoryDrawer";
import { useCategoryStore } from "../store/categoryStore";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";

interface Props {
  initialCategories: Category[];
}

export const CategoryPage = ({ initialCategories }: Props) => {
  const { categories, setCategories, setIsOpenDrawer } = useCategoryStore();

  useEffect(() => {
    setCategories(initialCategories);
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
        <CategoryDrawer />
      </div>

      <CategoryTable categories={categories} />
    </>
  );
};
