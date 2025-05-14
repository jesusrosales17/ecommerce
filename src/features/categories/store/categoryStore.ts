import {create} from 'zustand';
import { CategoryStore } from '../interfaces/categoryStore';

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
    })
   },

   setIsOpenDrawer: (isOpen) => {
        set({
            isOpenDrawer: isOpen,
        })
   }

}))