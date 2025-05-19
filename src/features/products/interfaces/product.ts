  export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    isOnSale: boolean;
    salePrice: number | null;
    isFeatured: boolean;
    status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
    categoryId: string | null;
    createdAt: string;
    updatedAt: string;
    category: {
        id: string;
        name: string;
        description: string;
        status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
        createdAt: string;
        updatedAt: string;
    },
    images: {
        id: string;
        name: string;
        productId: string;
        createdAt: string;
        updatedAt: string;
    }[];
    specifications: {
        id: string;
        name: string;
        value: string;
        productId: string;
        createdAt: string;
        updatedAt: string;
    }[];
  }