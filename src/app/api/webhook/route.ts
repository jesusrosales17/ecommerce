import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { CartItem, Product, ProductImage } from "@prisma/client";

import stripe from "@/libs/stripe";
import prisma from "@/libs/prisma";

// This is your Stripe webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

interface CartItemWithProduct extends CartItem {
  Product?: Product & {
    images: ProductImage[];
    salePrice?: number | null;
  };
}

interface Cart {
  id: string;
  userId: string;
  items: CartItemWithProduct[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;

    console.log("Received webhook event:", body);


    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret!
      );
    } catch (err) {
      const error = err as Error;
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
          // Retrieve session metadata
        const userId = checkoutSession.metadata?.userId;
        const addressId = checkoutSession.metadata?.addressId;
        const type = checkoutSession.metadata?.type;

        if (!userId || !addressId) {
          console.error("Missing metadata in checkout session");
          return new NextResponse("Missing session metadata", { status: 400 });
        }

        try {
          if (type === "buy_now") {
            // Handle "Buy Now" checkout (single product)
            const productId = checkoutSession.metadata?.productId;
            const quantity = parseInt(checkoutSession.metadata?.quantity || "1");

            if (!productId) {
              throw new Error("Missing productId for buy_now checkout");
            }

            // Get product data
            const product = await prisma.product.findUnique({
              where: { id: productId },
            });

            if (!product) {
              throw new Error(`Product ${productId} not found`);
            }

            // Calculate total
            const price = product.isOnSale && product.salePrice
              ? Number(product.salePrice)
              : Number(product.price);
            const orderTotal = price * quantity;

            // Create order for single product
            const order = await prisma.order.create({
              data: {
                userId,
                addressId,
                total: orderTotal,
                paymentId: checkoutSession.id,
                paymentStatus: checkoutSession.payment_status,
                items: {
                  create: [{
                    productId: productId,
                    name: product.name,
                    price: price,
                    quantity: quantity,
                  }],
                },
              },
            });

            // Update product stock
            await prisma.product.update({
              where: { id: productId },
              data: {
                stock: {
                  decrement: quantity,
                },
              },
            });

            console.log(`Buy Now Order ${order.id} created successfully for user ${userId}`);
          } else {
            // Handle regular cart checkout
            const cartId = checkoutSession.metadata?.cartId;

            if (!cartId) {
              throw new Error("Missing cartId for cart checkout");
            }

            // 1. Get cart data
            const cart = await prisma.cart.findUnique({
              where: { id: cartId },
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
            }) as Cart | null;

            if (!cart) {
              throw new Error(`Cart ${cartId} not found`);
            }

            // 2. Calculate total
            const orderTotal = cart.items.reduce((total: number, item: CartItemWithProduct) => {
              const price = item.Product?.isOnSale && item.Product.salePrice
                ? Number(item.Product.salePrice)
                : Number(item.Product?.price);
              return total + price * item.quantity;
            }, 0);

            // 3. Create order
            const order = await prisma.order.create({
              data: {
                userId,
                addressId,
                total: orderTotal,
                paymentId: checkoutSession.id,
                paymentStatus: checkoutSession.payment_status,
                items: {
                  create: cart.items.map(item => ({
                    productId: item.productId,
                    name: item.Product?.name || "Producto",
                    price: item.Product?.isOnSale && item.Product.salePrice
                      ? item.Product.salePrice
                      : item.Product!.price,
                    quantity: item.quantity,
                  })),
                },
              },
            });

            // 4. Update product stock for each item
            for (const item of cart.items) {
              await prisma.product.update({
                where: { id: item.productId },
                data: {
                  stock: {
                    decrement: item.quantity,
                  },
                },
              });
            }

            // 5. Clear cart
            await prisma.cartItem.deleteMany({
              where: { cartId },
            });

            console.log(`Cart Order ${order.id} created successfully for user ${userId}`);
          }
          
          // TODO: Send order confirmation email
          
        } catch (error) {
          console.error("Error creating order:", error);
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Webhook error", { status: 500 });
  }
}
