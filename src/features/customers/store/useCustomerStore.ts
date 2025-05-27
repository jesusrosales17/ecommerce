'use client';

import { create } from 'zustand';
import { CustomerStore } from '../interfaces/customerStore';

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  // Estado
  customers: [],
  filteredCustomers: [],
  customerToShow: null,
  searchQuery: '',
  
  // Drawer states
  isInfoDrawerOpen: false,
  
  // Métodos para manipular estado
  setCustomers: (customers) => set({ 
    customers, 
    filteredCustomers: customers 
  }),
  
  setCustomerToShow: (customer) => set({ customerToShow: customer }),
  
  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    get().filterCustomers();
  },
  
  setIsInfoDrawerOpen: (isInfoDrawerOpen) => set({ isInfoDrawerOpen }),
  
  // Métodos de filtrado
  filterCustomers: () => {
    const { customers, searchQuery } = get();
    
    if (!searchQuery.trim()) {
      set({ filteredCustomers: customers });
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = customers.filter((customer) => 
      customer.name?.toLowerCase().includes(query) || 
      customer.email.toLowerCase().includes(query)
    );
    
    set({ filteredCustomers: filtered });
  }
}));
