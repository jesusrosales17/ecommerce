import { Category } from "@prisma/client";

export interface CategoryStore  {
    categories: Category[];
    setCategories: (categories: Category[]) => void;
    addCategory: (category: Category) => void;
}