import { NextResponse } from "next/server";
import { Product, ProductImage } from "@prisma/client";

import stripe from "@/libs/stripe";
import prisma from "@/libs/prisma";
import { getSession } from "@/libs/auth/auth";

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
    const { productId, quantity, addressId } = body;

    if (!productId || !quantity || !addressId) {
      return NextResponse.json(
        { error: "Faltan datos requeridos: productId, quantity, addressId" },
        { status: 400 }
      );
    }

    // Verify the address belongs to the user
    const address = await prisma.address.findUnique({
      where: {
        id: addressId,
        userId: session.user.id,
      },
    });

    if (!address) {
      return NextResponse.json(
        { error: "Dirección no encontrada" },
        { status: 404 }
      );
    }

    // Get product information
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    }) as (Product & { images: ProductImage[] }) | null;

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Check stock availability
    if ((product.stock ?? 0) < quantity) {
      return NextResponse.json(
        { error: "Stock insuficiente" },
        { status: 400 }
      );
    }

    // Calculate price (check if on sale)
    const price = product.isOnSale && product.salePrice
      ? Number(product.salePrice)
      : Number(product.price);

    // Get main product image
    const mainImage = product.images.find(img => img.isPrincipal) || product.images[0];

    // Create a Stripe checkout session for single product
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: product.name,
              images: mainImage 
                ? [`${process.env.NEXT_PUBLIC_URL}/api/uploads/products/${mainImage?.name}`]
                : [],
            },
            unit_amount: Math.round(price * 100), // Stripe requires amount in cents
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/products/${productId}`,
      metadata: {
        userId: session.user.id,
        productId: productId,
        quantity: quantity.toString(),
        addressId: address.id,
        type: "buy_now", // Flag to differentiate from cart checkout
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Error al crear sesión de compra directa:", error);
    return NextResponse.json(
      { error: "Error al procesar la compra" },
      { status: 500 }
    );
  }
}
