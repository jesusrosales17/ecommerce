import { create } from 'zustand';
import { CategoryStore, CategorySearchParams } from '../interfaces/categoryStore';
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
            categories: [category,...get().categories ],
            isOpenDrawer: false,
        })

    },    updateCategory: (category: Category) => {
        const updatedCategories = get().categories.map((cat) => cat.id === category.id ? category : cat);
        set({
            categories: updatedCategories,
            isOpenDrawer: false,
        })
    },
    deleteCategory: (categoryId: string) => {
        const filteredCategories = get().categories.filter((cat) => cat.id !== categoryId);
        set({
            categories: filteredCategories,
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
    },    categoriesFetch: async (params?: CategorySearchParams) => {
        try {
            // Build query parameters
            const queryParams = new URLSearchParams();
            
            if (params?.status) {
                queryParams.append('status', params.status);
            }
            if (params?.search) {
                queryParams.append('search', params.search);
            }
            if (params?.sortBy) {
                queryParams.append('sortBy', params.sortBy);
            }
            if (params?.sortOrder) {
                queryParams.append('sortOrder', params.sortOrder);
            }
            if (params?.limit) {
                queryParams.append('limit', params.limit.toString());
            }
            if (params?.page) {
                queryParams.append('page', params.page.toString());
            }

            const url = `/api/categories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            
            const res = await fetch(url, {
                method: 'GET',
                cache: 'no-store',
            });
            
            if (!res.ok) {
                throw new Error('Error fetching categories');
            }
            
            const data = await res.json();
            set({
                categories: data,
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Optionally set an error state or show toast
        }
    },
}))