import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatus } from "@prisma/client";
import { useState } from "react";
import { BadgeCheck, Clock, ShoppingBag, Truck, XCircle } from "lucide-react";
import { toast } from "sonner";

interface UpdateOrderStatusDialogProps {
  orderId: string;
  currentStatus: OrderStatus;
  onStatusUpdated?: () => void;
  trigger: React.ReactNode;
}

export const UpdateOrderStatusDialog = ({
  currentStatus,
  onStatusUpdated,
  trigger,
}: UpdateOrderStatusDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  // const { changeOrderStatus } = useOrderStore();

  // Function to get status label
  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "Pendiente";
      case "PROCESSING":
        return "Procesando";
      case "SHIPPED":
        return "Enviado";
      case "DELIVERED":
        return "Entregado";
      case "CANCELLED":
        return "Cancelado";
      default:
        return status;
    }
  };

  // // Function to get status icon
  // const getStatusIcon = (status: OrderStatus) => {
  //   switch (status) {
  //     case "PENDING":
  //       return <Clock className="h-4 w-4 mr-2" />;
  //     case "PROCESSING":
  //       return <ShoppingBag className="h-4 w-4 mr-2" />;
  //     case "SHIPPED":
  //       return <Truck className="h-4 w-4 mr-2" />;
  //     case "DELIVERED":
  //       return <BadgeCheck className="h-4 w-4 mr-2" />;
  //     case "CANCELLED":
  //       return <XCircle className="h-4 w-4 mr-2" />;
  //     default:
  //       return null;
  //   }
  // };

  const handleUpdateStatus = async () => {
    if (selectedStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    
    try {
      // await changeOrderStatus(orderId, selectedStatus);
      toast.success(`El pedido ha sido actualizado a ${getStatusLabel(selectedStatus)}`);

      // Close dialog and run callback
      setIsOpen(false);

      if (onStatusUpdated) {
        onStatusUpdated();
      }
    } catch (error) {
      console.log(error)
      toast.error("No se pudo actualizar el estado del pedido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar estado del pedido</DialogTitle>
          <DialogDescription>
            Selecciona el nuevo estado para este pedido
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING" className="flex items-center">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Pendiente
                </div>
              </SelectItem>
              <SelectItem value="PROCESSING" className="flex items-center">
                <div className="flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Procesando
                </div>
              </SelectItem>
              <SelectItem value="SHIPPED" className="flex items-center">
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  Enviado
                </div>
              </SelectItem>
              <SelectItem value="DELIVERED" className="flex items-center">
                <div className="flex items-center">
                  <BadgeCheck className="h-4 w-4 mr-2" />
                  Entregado
                </div>
              </SelectItem>
              <SelectItem value="CANCELLED" className="flex items-center">
                <div className="flex items-center">
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancelado
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleUpdateStatus} disabled={isLoading}>
            {isLoading ? "Actualizando..." : "Actualizar estado"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};