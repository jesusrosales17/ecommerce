import {create} from 'zustand';
import { CategoryStore } from '../interfaces/categoryStore';
import { Category } from '@prisma/client';

export const useCategoryStore = create<CategoryStore>()((set, get) => ({
    categories: [],
    categoryToUpdate: null,
    isOpenDrawer: false,

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
   addCategory:  (category)  => {
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
   setIsOpenDrawer: (isOpen) => {
        set({
            isOpenDrawer: isOpen,
        })
   }

}))