import { Product, ProductImage } from "@prisma/client";

// Interface para un item en favoritos
export interface FavoriteItemWithProduct {
    id: string;
    userId: string;
    productId: string;
    Product?: {
        id: string;
        name: string;
        price: number;
        isOnSale?: boolean;
        salePrice?: number;
        stock: number;
        // Otras propiedades del producto según sea necesario
        images?: ProductImage[];
    };
    createdAt: Date;
    updatedAt: Date;
}

// Interface para el estado global de favoritos
export interface FavoriteStore {
    // Estado de favoritos
    favorites: FavoriteItemWithProduct[] | null;
    isLoading: boolean;
    isFavoritesOpen: boolean;
    
    // Setters para el estado
    setFavorites: (favorites: FavoriteItemWithProduct[]) => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsFavoritesOpen: (isOpen: boolean) => void;
    
    // Para manejar actualizaciones locales optimistas
    addToFavoriteLocally: (favorite: FavoriteItemWithProduct) => void;
    removeFromFavoriteLocally: (productId: string) => void;
}
