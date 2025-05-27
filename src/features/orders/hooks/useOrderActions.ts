'use client'

import { OrderStatus } from "@prisma/client";
import { useOrderStore } from "../store/useOrderStore";
import { toast } from "sonner";

export const useOrderActions = () => {
  const { updateOrderStatus } = useOrderStore();

  /**
   * Cambia el estado de un pedido
   * @param orderId ID del pedido a actualizar
   * @param status Nuevo estado del pedido
   */
  const changeOrderStatus = async (orderId: string, status: OrderStatus) => {
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

      // Actualizar el estado en el store
      updateOrderStatus(orderId, status);
      
      // Notificar éxito
      toast.success('El estado del pedido ha sido actualizado');
      
      return true;
    } catch (error) {
      console.error('Error al cambiar el estado del pedido:', error);
      toast.error('Error al actualizar el estado del pedido');
      throw error;
    }
  };

  /**
   * Obtiene todos los pedidos
   */
  const fetchOrders = async () => {
    try {
      const base_url = process.env.NEXT_PUBLIC_URL;
      const response = await fetch(`${base_url}/api/orders`);
      
      if (!response.ok) {
        throw new Error('Error al obtener los pedidos');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener los pedidos:', error);
      toast.error('Error al cargar los pedidos');
      throw error;
    }
  };

  return {
    changeOrderStatus,
    fetchOrders
  };
};