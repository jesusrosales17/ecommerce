import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";

interface ProductActionsCardProps {
  productId: string;
}

export const ProductActionsCard = ({ productId }: ProductActionsCardProps) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="text-lg font-semibold">Acciones</h3>
        <div className="flex flex-col space-y-2">
          <Link href={`/admin/products/update/${productId}`}>
            <Button className="w-full" variant="outline">
              <Edit className="mr-2 h-4 w-4" /> Editar
            </Button>
          </Link>
          <Button className="w-full" variant="destructive">
            <Trash className="mr-2 h-4 w-4" /> Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
