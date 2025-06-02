'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const useProductActions = () => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  const deleteProduct = async (productId: string) => {
    try {
      setIsDeleting(productId);

      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al eliminar el producto');
      }

      toast.success('Producto eliminado correctamente');
      
      // Refrescar la página para actualizar la lista
      router.refresh();
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error inesperado al eliminar el producto';
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsDeleting(null);
    }
  };

  return {
    deleteProduct,
    isDeleting,
  };
};
