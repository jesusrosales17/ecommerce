import { Category } from "@prisma/client";

export interface CategorySearchParams {
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    limit?: number;
    page?: number;
}

export interface CategoryStore  {
    categories: Category[];
    categoryToUpdate: Category | null;
    categoryToShow: Category | null;
    setCategories: (categories: Category[]) => void;
    setCategoryToUpdate: (category: Category) => void;
    addCategory: (category: Category) => void;
    updateCategory: (category: Category) => void;
    deleteCategory: (categoryId: string) => void;
    setCategoryToShow: (category: Category) => void;
    // category drawer 
    isOpenDrawer: boolean;
    setIsOpenDrawer: (isOpen: boolean) => void;

    // info drawer
    isOpenInfoDrawer: boolean;
    setIsOpenInfoDrawer: (isOpen: boolean) => void;

    categoriesFetch: (params?: CategorySearchParams) => Promise<void>;
}