import { Category } from "@prisma/client";

export interface CategoryStore  {
    categories: Category[];
    categoryToUpdate: Category | null;
    categoryToShow: Category | null;
    setCategories: (categories: Category[]) => void;
    setCategoryToUpdate: (category: Category) => void;
    addCategory: (category: Category) => void;
    updateCategory: (category: Category) => void;
    setCategoryToShow: (category: Category) => void;
    // category drawer 
    isOpenDrawer: boolean;
    setIsOpenDrawer: (isOpen: boolean) => void;

    // info drawer
    isOpenInfoDrawer: boolean;
    setIsOpenInfoDrawer: (isOpen: boolean) => void;

    categoriesFetch: () => Promise<void>;
}