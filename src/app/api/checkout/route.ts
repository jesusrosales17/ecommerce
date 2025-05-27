import { NextResponse } from "next/server";
import { Address, CartItem, Product, ProductImage } from "@prisma/client";

import stripe from "@/libs/stripe";
import prisma from "@/libs/prisma";
import { getSession } from "@/libs/auth/auth";

interface CartItemWithProduct extends CartItem {
  Product?: Product & {
    images: ProductImage[];
  };
}

interface CartWithItems {
  id: string;
  items: CartItemWithProduct[];
}

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Debe iniciar sesión" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { addressId } = body;

    if (!addressId) {
      return NextResponse.json(
        { error: "Debe seleccionar una dirección de envío" },
        { status: 400 }
      );
    }

    // Verify the address belongs to the user
    const address = await prisma.address.findUnique({
      where: {
        id: addressId,
        userId: session.user.id,
      },
    }) as Address | null;

    if (!address) {
      return NextResponse.json(
        { error: "Dirección no encontrada" },
        { status: 404 }
      );
    }

    // Get cart items for the user
    const cart = await prisma.cart.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            Product: {
              include: {
                images: true
              }
            },
          },
        },
      },
    }) as CartWithItems | null;

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      );
    }

    // // Calculate total amount
    // const amount = cart.items.reduce((total: number, item: CartItemWithProduct) => {
    //   const price = item.Product?.isOnSale && item.Product.salePrice
    //     ? Number(item.Product.salePrice)
    //     : Number(item.Product?.price);
      
    //   return total + price * item.quantity;
    // }, 0);


    // Create a Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cart.items.map((item: CartItemWithProduct) => {
        const price = item.Product?.isOnSale && item.Product.salePrice
          ? Number(item.Product.salePrice)
          : Number(item.Product?.price);
          const image = item.Product?.images.find(img => img.isPrincipal) || item.Product?.images[0];
          console.log(  `${process.env.NEXT_PUBLIC_URL}/api/uploads/products/${image?.name}`)
        return {
          price_data: {
            currency: "mxn",
            product_data: {
              name: item.Product?.name || "Producto",
              images: item.Product?.images
                ? [
                    `${process.env.NEXT_PUBLIC_URL}/api/uploads/products/${
                      item.Product.images[0]?.name
                    }`,
                  ]
                : [],
            },
            unit_amount: Math.round(price * 100), // Stripe requires amount in cents
          },
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      metadata: {
        userId: session.user.id,
        cartId: cart.id,
        addressId: address.id,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Error al crear sesión de pago:", error);
    return NextResponse.json(
      { error: "Error al procesar el pago" },
      { status: 500 }
    );
  }
}

