'use client';

import { CustomerWithRelations } from "../../interfaces/customer";
import { Calendar, Mail} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CustomerProfileInfoProps {
  customer: CustomerWithRelations;
}

export function CustomerProfileInfo({ customer }: CustomerProfileInfoProps) {
  // Función para obtener iniciales del nombre
  const getInitials = (name: string | null): string => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Información del Perfil</h3>
      
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg">
            {getInitials(customer.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="space-y-1">
          <h4 className="text-base font-semibold">{customer.name || "Sin nombre"}</h4>
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="mr-1 h-4 w-4" />
            {customer.email}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            Cliente desde {format(new Date(customer.createdAt), "PP", { locale: es })}
          </div>
          <div className="flex items-center gap-2 mt-2">
            {/* <Badge variant="outline">
              {customer.emailVerified ? "Email verificado" : "Email no verificado"}
            </Badge> */}
          </div>
        </div>
      </div>
    </div>
  );
}
