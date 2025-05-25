import { redirect } from "next/navigation";

import prisma from "@/libs/prisma";
import CheckoutPageClient from "@/features/checkout/components/CheckoutPageClient";
import { getSession } from "@/libs/auth/auth";
import { getCartWithTotals } from "@/features/cart/server/cart-utils";

export default async function CheckoutPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/checkout");
  }

  // Get user's addresses
  const addresses = await prisma.address.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      isDefault: "desc",
    },
  });

  // If user has no addresses, redirect to address creation
  if (addresses.length === 0) {
    redirect("/addresses?checkout=true");
  }

  // Get cart data using the helper function
  const cartData = await getCartWithTotals();

  // If cart is empty, redirect to cart page
  if (!cartData) {
    redirect("/cart");
  }

  const { cartTotal, itemsCount } = cartData;

  return (
    <div className="container py-8 mx-auto px-4 2xl:px-0 min-h-[100dvh]">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <CheckoutPageClient
        addresses={addresses}
        cartTotal={cartTotal}
        itemsCount={itemsCount}
      />
    </div>
  );
}
