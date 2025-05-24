import { CartItem, ProductImage } from "@prisma/client";

// Extended CartItem with product information for display
export interface CartItemWithProduct extends CartItem {
    Product?: {
        id: string;
        name: string;
        price: number;
        isOnSale?: boolean;
        salePrice?: number;
        images?: ProductImage[];
        // Add other product fields as needed
    };
}

// Pending cart item for anonymous users
export interface PendingCartItem {
    productId: string;
    quantity: number;
}

// The simplified CartStore interface only manages state
export interface CartStore {
    // Cart state
    cart: CartItemWithProduct[]| null;
    total: number;
    isLoading: boolean;
    isCartOpen: boolean;
    
    // Pending cart items for anonymous users
    pendingCartItem: PendingCartItem | null;
    redirectAfterLogin: string | null;
    
    // State setters
    setCart: (cart: CartItemWithProduct[]) => void;
    setTotal: (total: number) => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsCartOpen: (isOpen: boolean) => void;
    
    // Authentication-related actions
    setPendingCartItem: (item: PendingCartItem | null) => void;
    setRedirectAfterLogin: (path: string | null) => void;
    clearPendingData: () => void;
}
