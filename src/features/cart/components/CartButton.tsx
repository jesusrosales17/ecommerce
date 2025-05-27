'use client';
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCartActions } from '../hooks/useCartActions'
import { toast } from 'sonner';

interface CartButtonProps {
  productId: string;
  quantity?: number;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
  className?: string;
}

export const CartButton = ({
  productId,
  quantity = 1,
  variant = 'default',
  size = 'icon',
  showText = false,
  className = ''
}: CartButtonProps) => {
  const { addToCart, isLoading } = useCartActions();
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    // Evitar que el evento se propague a elementos padres (como el Link de la tarjeta)
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // La lógica de autenticación está ahora dentro de useCartActions
      await addToCart(productId, quantity);
      // El toast de éxito se muestra en useCartActions si la operación es exitosa
    } catch (error) {
      console.log(error)
      toast.error('Error al agregar al carrito');
    }
  };
  return (
    <Button
      onClick={handleAddToCart}
      size={size}
      variant={variant}
      disabled={isLoading}
      className={`rounded-md hover:-translate-y-0.5 transition-all duration-300 ${className}`}
    >
      <ShoppingCart className="h-4 w-4" />
      {showText && <span className="ml-2">Agregar al carrito</span>}
    </Button>
  )
}
