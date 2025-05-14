import { Category } from "@prisma/client";

export interface CategoryStore  {
    categories: Category[];
    categoryToUpdate: Category | null;
    setCategories: (categories: Category[]) => void;
    setCategoryToUpdate: (category: Category) => void;
    addCategory: (category: Category) => void;

    // otros
    isOpenDrawer: boolean;
    setIsOpenDrawer: (isOpen: boolean) => void;
}