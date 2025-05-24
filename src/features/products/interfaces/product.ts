  export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    isOnSale: boolean;
    brand: string | null;
    color: string | null;
    salePrice: number | null;
    isFeatured: boolean;
    status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
    categoryId: string | null;
    createdAt: Date;
    updatedAt: Date;
    category: {
        id: string;
        name: string;
        description: string;
        status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
        createdAt: Date;
        updatedAt: Date;
    },
    images: {
        id: string;
        name: string;
        productId: string;
        isPrincipal: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[];
    specifications: {
        id: string;
        name: string;
        value: string;
        productId: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
  }