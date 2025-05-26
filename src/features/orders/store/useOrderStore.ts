import { Order, OrderStatus } from '@prisma/client';
import { create } from 'zustand';

interface OrderState {
  isOpenInfoDrawer: boolean;
  orderToShow: Order | null;
  setIsOpenInfoDrawer: (isOpen: boolean) => void;
  setOrderToShow: (order: Order | null) => void;
  changeOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  isOpenInfoDrawer: false,
  orderToShow: null,
  setIsOpenInfoDrawer: (isOpen) => set({ isOpenInfoDrawer: isOpen }),
  setOrderToShow: (order) => set({ orderToShow: order }),
  changeOrderStatus: async (orderId: string, status: OrderStatus) => {
    try {
      const base_url = process.env.NEXT_PUBLIC_URL;
      const response = await fetch(`${base_url}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del pedido');
      }

      // Si tenemos el pedido abierto en el drawer, actualizamos su estado
      set((state) => {
        if (state.orderToShow && state.orderToShow.id === orderId) {
          return {
            orderToShow: {
              ...state.orderToShow,
              status,
            },
          };
        }
        return state;
      });
      
    } catch (error) {
      console.error('Error al cambiar el estado del pedido:', error);
      throw error;
    }
  },
}));
