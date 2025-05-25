"use client";

import { useState } from "react";
import { Address } from "@prisma/client";
import { PlusCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { AddressCard } from "./AddressCard";
import { AddressForm } from "./AddressForm";

interface AddressListProps {
  addresses: Address[];
  selectable?: boolean;
  onAddressSelect?: (address: Address) => void;
}

export function AddressList({
  addresses,
  selectable,
  onAddressSelect,
}: AddressListProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedForCheckout, setSelectedForCheckout] = useState<string | null>(
    null
  );

  const handleAddSuccess = () => {
    setShowAddDialog(false);
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    setSelectedAddress(null);
  };

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setShowEditDialog(true);
  };

  const handleSelect = (address: Address) => {
    setSelectedForCheckout(address.id);
    if (onAddressSelect) {
      onAddressSelect(address);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Mis direcciones</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddDialog(true)}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Agregar dirección
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center p-6 border rounded-md bg-gray-50">
          <p className="text-muted-foreground">
            No tienes direcciones guardadas. Agrega una para continuar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={!selectable ? handleEdit : undefined}
              selectable={selectable}
              selected={selectable && selectedForCheckout === address.id}
              onSelect={selectable ? handleSelect : undefined}
            />
          ))}
        </div>
      )}

      {/* Add Address Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agregar dirección</DialogTitle>
          </DialogHeader>
          <AddressForm
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar dirección</DialogTitle>
          </DialogHeader>
          {selectedAddress && (
            <AddressForm
              initialData={selectedAddress}
              onSuccess={handleEditSuccess}
              onCancel={() => setShowEditDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
