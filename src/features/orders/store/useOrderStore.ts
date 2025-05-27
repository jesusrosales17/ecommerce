import { OrderStatus } from '@prisma/client';
import { create } from 'zustand';
import { OrderStore } from '../interfaces/orderStore';

export const useOrderStore = create<OrderStore>((set) => ({
  // Estado
  orders: [],
  isOpenInfoDrawer: false,
  orderToShow: null,
  
  // Métodos para manipular estado
  setIsOpenInfoDrawer: (isOpen) => set({ isOpenInfoDrawer: isOpen }),
  setOrderToShow: (order) => set({ orderToShow: order }),
  setOrders: (orders) => set({ orders }),
  
  // Actualiza el estado de una orden específica
  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map((order) => 
      order.id === orderId 
        ? { ...order, status } 
        : order
    ),
    // Si es la orden que se está mostrando, también la actualizamos
    orderToShow: state.orderToShow?.id === orderId 
      ? { ...state.orderToShow, status } 
      : state.orderToShow
  })),
}));
