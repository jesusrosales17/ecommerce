"use client";

import { useCategoryStore } from '../store/useCategoryStore';
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
      image: categoryToUpdate?.image || "",
      status: categoryToUpdate?.status || "ACTIVE",
    },
  });
  const onSubmit = async (data: CategorySchemaType) => {
    try {
      // Create a FormData object to send multipart/form-data
      const formData = new FormData();
      formData.append('name', data.name);
      
      if (data.description) {
        formData.append('description', data.description);
      }
      
      formData.append('status', data.status);
      
      // Append image if it exists and is a File object
      if (data.image && data.image instanceof File) {
        formData.append('image', data.image);
      }
      
      if(categoryToUpdate)  {
        const response = await axios.put(
          `/api/categories/${categoryToUpdate.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
        const { category } = response.data;
        updateCategory(category);
        sonnerNotificationAdapter.success(response.data.message);
        return;
      }
      
      const response = await axios.post('/api/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
