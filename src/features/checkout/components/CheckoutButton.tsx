"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutButtonProps {
  disabled?: boolean;
  cartEmpty?: boolean;
}

export function CheckoutButton({ disabled = false, cartEmpty = false }: CheckoutButtonProps) {
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={disabled || cartEmpty}
      className="w-full mt-4"
    >
      <ShoppingBag className="mr-2 h-4 w-4" />
      {cartEmpty ? "El carrito está vacío" : "Proceder al pago"}
    </Button>
  );
}
