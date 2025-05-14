import {create} from 'zustand';
import { CategoryStore } from '../interfaces/categoryStore';

export const useCategoryStore = create<CategoryStore>()((set, get) => ({
    categories: [],
    setCategories: (categories) => {
        set({
            categories: categories,
        })
    },
   addCategory:  (category)  => {
    set({
        categories: [...get().categories, category],
    })
   }

}))