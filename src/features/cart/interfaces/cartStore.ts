import { CartItem } from "@prisma/client";

// Extended CartItem with product information for display
export interface CartItemWithProduct extends CartItem {
    Product?: {
        id: string;
        name: string;
        price: number;
        isOnSale?: boolean;
        salePrice?: number;
        image?: string;
        // Add other product fields as needed
    };
}

// Pending cart item for anonymous users
export interface PendingCartItem {
    productId: string;
    quantity: number;
}

export interface CartStore {
    // Cart state
    cart: CartItemWithProduct[];
    total: number;
    isLoading: boolean;
    isCartOpen: boolean;
    
    // Pending cart items for anonymous users
    pendingCartItem: PendingCartItem | null;
    redirectAfterLogin: string | null;
    
    // Cart actions
    setCart: (cart: CartItemWithProduct[]) => void;
    setTotal: (total: number) => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsCartOpen: (isOpen: boolean) => void;
    
    // Cart item operations
    addToCart: (productId: string, quantity: number, isAuthenticated: boolean) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    fetchCart: () => Promise<void>;
    clearCart: () => Promise<void>;
    
    // Authentication-related actions
    setPendingCartItem: (item: PendingCartItem | null) => void;
    setRedirectAfterLogin: (path: string | null) => void;
    clearPendingData: () => void;
    processPendingCartItem: () => Promise<void>;
}
