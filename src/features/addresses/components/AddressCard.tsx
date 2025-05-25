"use client";

import { useState } from "react";
import { Address } from "@prisma/client";
import {
  CheckCircle,
  Trash2,
  PenLine,
  Home,
  MapPin,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useAddressActions } from "../hooks/useAddressActions";

interface AddressCardProps {
  address: Address;
  onEdit?: (address: Address) => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (address: Address) => void;
}

export function AddressCard({
  address,
  onEdit,
  selectable,
  selected,
  onSelect,
}: AddressCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingDefault, setIsSettingDefault] = useState(false);
  const { deleteAddress, setDefaultAddress } = useAddressActions();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteAddress(address.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetDefault = async () => {
    try {
      setIsSettingDefault(true);
      await setDefaultAddress(address.id);
    } finally {
      setIsSettingDefault(false);
    }
  };

  return (
    <Card className={`relative ${selected ? "ring-2 ring-primary" : ""} ${selectable ? "cursor-pointer hover:bg-gray-50" : ""}`} 
      onClick={selectable && onSelect ? () => onSelect(address) : undefined}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">{address.name}</CardTitle>
          </div>
          {address.isDefault && (
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
              Predeterminada
            </Badge>
          )}
        </div>
        <CardDescription className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          {address.street}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm">
          {address.city}, {address.state}, {address.postalCode}
        </p>
        <p className="text-sm">{address.country}</p>
        <p className="text-sm flex items-center gap-2 mt-1">
          <Phone className="h-4 w-4 text-muted-foreground" />
          {address.phone}
        </p>
        {address.reference && (
          <p className="text-sm mt-1 text-muted-foreground">
            <span className="font-medium">Referencia:</span> {address.reference}
          </p>
        )}
      </CardContent>
      {!selectable && (
        <CardFooter className="flex justify-end gap-2 pt-2">
          {!address.isDefault && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSetDefault}
              disabled={isSettingDefault}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              {isSettingDefault ? "Estableciendo..." : "Predeterminada"}
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(address)}
            >
              <PenLine className="h-4 w-4 mr-1" />
              Editar
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar dirección?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no puede ser revertida. Esta dirección será
                  eliminada permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Eliminando..." : "Eliminar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  );
}
