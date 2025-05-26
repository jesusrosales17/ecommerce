"use client"
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const OrderImprimButton = () => {
  return (
    <Button variant="outline" size="sm" onClick={() => window.print()}>
      <Printer className="h-4 w-4 mr-2" />
      Imprimir
    </Button>
  );
};

export default OrderImprimButton;
