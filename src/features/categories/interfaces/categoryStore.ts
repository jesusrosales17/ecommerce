import { Category } from "@prisma/client";

export interface CategoryStore  {
    categories: Category[];
    addCategory: (category: Category) => void;
}