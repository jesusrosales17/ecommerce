import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ProductSummaryCardProps {
  id: string;
  imagesCount: number;
  specificationsCount: number;
}

export const ProductSummaryCard = ({
  id,
  imagesCount,
  specificationsCount,
}: ProductSummaryCardProps) => {
  return (
    <Card>
      <CardContent className="p-4 text-sm space-y-2">
        <h3 className="text-lg font-semibold">Resumen</h3>
        <div className="flex justify-between">
          <span>ID:</span>
          <span className="font-mono break-all">{id}</span>
        </div>
        <div className="flex justify-between">
          <span>Imágenes:</span>
          <span>{imagesCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Specs:</span>
          <span>{specificationsCount}</span>
        </div>
      </CardContent>
    </Card>
  );
};
