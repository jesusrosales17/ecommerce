import prisma from "@/libs/prisma";
import { getSession } from "@/libs/auth/auth";

/**
 * Get the user's cart with items and calculate totals
 * For use in server components
 */
export async function getCartWithTotals() {
  const session = await getSession();

  if (!session?.user) {
    return null;
  }

  // Get cart data
  const cart = await prisma.cart.findFirst({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          Product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return null;
  }

  // Calculate cart total and item count
  const cartTotal = cart.items.reduce((total, item) => {
    const price = item.Product?.isOnSale && item.Product.salePrice
      ? Number(item.Product.salePrice)
      : Number(item.Product?.price);
    
    return total + price * item.quantity;
  }, 0);

  const itemsCount = cart.items.reduce((count, item) => count + item.quantity, 0);

  return {
    cart,
    cartTotal,
    itemsCount,
  };
}
