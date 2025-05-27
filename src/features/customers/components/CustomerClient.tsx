'use client';

import { useState, useEffect } from 'react';
import { CustomerTable } from './CustomerTable';
import { CustomerInfoDrawer } from './CustomerInfoDrawer';
import { SearchInput } from '@/components/ui/SearchInput';
import { useCustomerStore } from '../store/useCustomerStore';
import { CustomerWithRelations } from '../interfaces/customer';

interface CustomerClientProps {
  initialCustomers: CustomerWithRelations[];
}

export function CustomerClient({ initialCustomers }: CustomerClientProps) {
  const { 
    setCustomers, 
    searchQuery, 
    setSearchQuery, 
    filteredCustomers 
  } = useCustomerStore();

  // Inicializamos el store con los clientes obtenidos del servidor
  useEffect(() => {
    setCustomers(initialCustomers);
  }, [initialCustomers, setCustomers]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="w-full max-w-sm">
          <SearchInput
            placeholder="Buscar por nombre o email..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            className="h-9"
          />
        </div>
      </div>
      
      <CustomerTable customers={filteredCustomers} />
      <CustomerInfoDrawer />
    </div>
  );
}
