'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCategoryStore } from '../store/useCategoryStore';

export const useCategoryActions = () => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();
  const { deleteCategory: deleteCategoryFromStore } = useCategoryStore();

  const deleteCategory = async (categoryId: string) => {
    try {
      setIsDeleting(categoryId);

      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al eliminar la categoría');
      }      toast.success('Categoría eliminada correctamente');
      
      // Eliminar la categoría del store local
      deleteCategoryFromStore(categoryId);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error inesperado al eliminar la categoría';
      
      toast.error(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      setIsDeleting(null);
    }
  };

  return {
    deleteCategory,
    isDeleting,
  };
};
