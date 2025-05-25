import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Address } from "@prisma/client";

import { AddressForm } from "../interfaces/address.interface";

export const useAddressActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Get user addresses
  const getUserAddresses = async (): Promise<Address[]> => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/addresses");
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al obtener direcciones");
      }
      
      const addresses = await response.json();
      return addresses;
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("No se pudieron cargar las direcciones");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new address
  const createAddress = async (addressData: AddressForm): Promise<Address | null> => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear dirección");
      }

      const newAddress = await response.json();
      toast.success("Dirección creada correctamente");
      router.refresh();
      return newAddress;
    } catch (error) {
      console.error("Error creating address:", error);
      toast.error("No se pudo crear la dirección");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an address
  const updateAddress = async (id: string, addressData: AddressForm): Promise<Address | null> => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/addresses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar dirección");
      }

      const updatedAddress = await response.json();
      toast.success("Dirección actualizada correctamente");
      router.refresh();
      return updatedAddress;
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("No se pudo actualizar la dirección");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an address
  const deleteAddress = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al eliminar dirección");
      }

      toast.success("Dirección eliminada correctamente");
      router.refresh();
      return true;
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("No se pudo eliminar la dirección");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Set an address as default
  const setDefaultAddress = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/addresses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDefault: true }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al establecer dirección predeterminada");
      }

      toast.success("Dirección establecida como predeterminada");
      router.refresh();
      return true;
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("No se pudo establecer como dirección predeterminada");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getUserAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
};
