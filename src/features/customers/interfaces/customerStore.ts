import { CustomerWithRelations } from "./customer";

export interface CustomerStore {
  // Estado
  customers: CustomerWithRelations[];
  filteredCustomers: CustomerWithRelations[];
  customerToShow: CustomerWithRelations | null;
  searchQuery: string;
  
  // Drawer states
  isInfoDrawerOpen: boolean;
  
  // Métodos para manipular estado
  setCustomers: (customers: CustomerWithRelations[]) => void;
  setCustomerToShow: (customer: CustomerWithRelations | null) => void;
  setSearchQuery: (query: string) => void;
  setIsInfoDrawerOpen: (isOpen: boolean) => void;
  
  // Métodos de filtrado
  filterCustomers: () => void;
}
