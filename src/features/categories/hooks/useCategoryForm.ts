"use client";

import { useCategoryStore } from '../store/categoryStore';
import { sonnerNotificationAdapter } from '@/libs/adapters/sonnerAdapter';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { CategorySchemaType, categorySchema } from '../schemas/categorySchema';

export const useCategoryForm = () => {
   const { addCategory, updateCategory, categoryToUpdate } = useCategoryStore();

  const form = useForm<CategorySchemaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: categoryToUpdate?.name || "",
      description: categoryToUpdate?.description || "",
      status: categoryToUpdate?.status || "ACTIVE",
    },
  });

  const onSubmit = async (data: CategorySchemaType) => {
    try {
      if(categoryToUpdate)  {
        const response = await axios.put(
          `/api/categories/${categoryToUpdate.id}`,
          {
            name: data.name,
            description: data.description,
            status: data.status,
          }
        );
        
        const { category } = response.data;
        updateCategory(category);
        sonnerNotificationAdapter.success(response.data.message);
        return;
      }
      const response = await axios.post("/api/categories", {
        name: data.name,
        description: data.description,
        status: data.status,
      });

      const { category } = response.data;
      addCategory(category);
      sonnerNotificationAdapter.success(response.data.message);

    
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      if (axios.isAxiosError(error)) {
        sonnerNotificationAdapter.error(
          error?.response?.data.error || "Error al crear la categoria"
        );
      }
    }
  };

  return {
    form,
    onSubmit,
    isUpdating: !!categoryToUpdate,
  }
}
