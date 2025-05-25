import Link from "next/link";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSession } from "@/libs/auth/auth";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/");
  }

  // Note: In a production environment, you should verify the payment status
  // by querying the Stripe API using the session_id

  return (
    <div className="container max-w-md py-16 px-4 mx-auto">
      <Card className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">¡Pago exitoso!</h1>
        <p className="text-muted-foreground mb-6">
          Gracias por tu compra. Tu pedido ha sido procesado correctamente.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          ID de la transacción: {session_id.slice(0, 8)}...
        </p>
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">
              Volver a la tienda
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/orders">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Ver mis pedidos
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
