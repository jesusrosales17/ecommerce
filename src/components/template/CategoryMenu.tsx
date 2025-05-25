"use client";

import { useState } from "react";
import Link from "next/link";
import { Category } from "@prisma/client";
import { ChevronDown, Tag } from "lucide-react";

interface CategoryMenuProps {
  categories: Category[];
}

export const CategoryMenu = ({ categories }: CategoryMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center justify-between w-full text-sm font-medium hover:text-primary px-2 py-2  transition-colors hover:bg-accent"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span>Categorías</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="mt-1 p-2  bg-white w-full">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat.id || cat.name}
                href={`/categories/${cat.name}`}
                className="block w-full text-sm py-1 px-2 rounded hover:bg-accent transition-colors"
              >
                {cat.name}
              </Link>
            ))
          ) : (
            <div className="text-sm text-muted-foreground py-1 px-2">
              Sin categorías
            </div>
          )}
    <div className="mt-2 pt-2">
            <Link
              href="/categories"
              className="block text-sm text-primary hover:underline py-1 px-2"
            >
              Ver todas las categorías
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
