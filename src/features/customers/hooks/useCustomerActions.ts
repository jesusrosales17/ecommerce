'use client';

import { CustomerSummary, CustomerWithRelations } from "../interfaces/customer";
import { useState } from "react";
import { toast } from "sonner";

export const useCustomerActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  /**
   * Calcula estadísticas resumidas para un cliente
   */
  const calculateCustomerSummary = (customer: CustomerWithRelations): CustomerSummary => {
    const totalOrders = customer.Order?.length || 0;
    const totalSpent = customer.Order?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
    const lastOrderDate = totalOrders > 0 
      ? customer.Order?.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0].createdAt
      : null;
    const addressCount = customer.Address?.length || 0;

    return {
      totalOrders,
      totalSpent,
      lastOrderDate,
      addressCount
    };
  };

  /**
   * Obtiene todos los clientes
   */
  const fetchCustomers = async (): Promise<CustomerWithRelations[]> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/customers');

      if (!response.ok) {
        throw new Error('Error al obtener los clientes');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
      toast.error('Error al cargar los clientes');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    calculateCustomerSummary,
    fetchCustomers
  };
};
