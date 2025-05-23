import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductCategoryCardProps {
  categoryName?: string;
}

export const ProductCategoryCard = ({ categoryName }: ProductCategoryCardProps) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Tag className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Categoría</span>
        </div>
        <Badge variant="outline" className="text-sm">
          {categoryName ?? "Sin categoría"}
        </Badge>
      </CardContent>
    </Card>
  );
};
