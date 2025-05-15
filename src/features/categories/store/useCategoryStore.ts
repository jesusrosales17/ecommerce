import { create } from 'zustand';
import { CategoryStore } from '../interfaces/categoryStore';
import { Category } from '@prisma/client';

export const useCategoryStore = create<CategoryStore>()((set, get) => ({
    categories: [],
    categoryToUpdate: null,
    isOpenDrawer: false,
    categoryToShow: null,
    isOpenInfoDrawer: false,
    setCategories: (categories) => {
        set({
            categories: categories,
        })
    },
    setCategoryToUpdate: (category) => {
        set({
            categoryToUpdate: category,
        })
    },
    addCategory: (category) => {
        set({
            categories: [...get().categories, category],
            isOpenDrawer: false,
        })

    },
    updateCategory: (category: Category) => {
        const updatedCategories = get().categories.map((cat) => cat.id === category.id ? category : cat);
        set({
            categories: updatedCategories,
            isOpenDrawer: false,
        })
    },
    setCategoryToShow: (category) => {
        set({
            categoryToShow: category,
        })
    },
    //   drawer del formulario
    setIsOpenDrawer: (isOpen) => {
        set({
            isOpenDrawer: isOpen,
            categoryToUpdate: null,   
        })
    },
    //   drawer de la info
    setIsOpenInfoDrawer(isOpen) {
        set({
            isOpenInfoDrawer: isOpen,
            categoryToShow: null,
        })
    },

}))