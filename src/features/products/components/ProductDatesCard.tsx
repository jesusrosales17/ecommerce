import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { formatRelativeTime } from "@/utils/date";

interface ProductDatesCardProps {
  createdAt: string;
  updatedAt: string;
}

export const ProductDatesCard = ({ createdAt, updatedAt }: ProductDatesCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Fechas</span>
        </div>
        <ul className="text-sm space-y-1">
          <li>
            <strong>Creado:</strong> {formatRelativeTime(createdAt)}
          </li>
          <li>
            <strong>Actualizado:</strong> {formatRelativeTime(updatedAt)}
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};
