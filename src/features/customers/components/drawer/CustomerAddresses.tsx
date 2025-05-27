'use client';

import { Address } from "@prisma/client";
import { Home} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CustomerAddressesProps {
  addresses: Address[];
}

export function CustomerAddresses({ addresses = [] }: CustomerAddressesProps) {
  // Verificamos que addresses sea un array
  const safeAddresses = Array.isArray(addresses) ? addresses : [];
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Direcciones</h3>
      
      {safeAddresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
          <Home className="mb-2 h-12 w-12 text-muted-foreground/50" />
          <p>Este cliente no ha registrado ninguna dirección</p>
        </div>      ) : (
        <div className="grid gap-4 ">
          {safeAddresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold">{address.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {address.street}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-sm text-muted-foreground">{address.country}</p>
                    <p className="text-sm text-muted-foreground">
                      Teléfono: {address.phone}
                    </p>
                    {address.reference && (
                      <p className="text-sm text-muted-foreground">
                        Referencia: {address.reference}
                      </p>
                    )}
                  </div>
                  
                  {address.isDefault && (
                    <Badge variant="outline" className="bg-blue-50">
                      Predeterminada
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
