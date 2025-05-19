import { Product } from "@/features/products/interfaces/product";

export interface ProductsByCategory {
    [category: string]: {
        products: Product[];
        category: string;
    };
}