import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useOrderStore } from '../store/useOrderStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatter } from '@/utils/price';

export const OrderInfoDrawer = () => {
  const { isOpenInfoDrawer, setIsOpenInfoDrawer, orderToShow } = useOrderStore();

  if (!orderToShow) return null;

  // Función para obtener el color del badge según el estado
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'default';
      case 'PROCESSING':
        return 'secondary';
      case 'SHIPPED':
        return 'secondary';
      case 'DELIVERED':
        return 'secondary'; // Changed from 'success' to 'secondary' as success is not a valid variant
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Función para traducir el estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'PROCESSING':
        return 'Procesando';
      case 'SHIPPED':
        return 'Enviado';
      case 'DELIVERED':
        return 'Entregado';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <Drawer open={isOpenInfoDrawer} onOpenChange={setIsOpenInfoDrawer}>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Detalles del Pedido</DrawerTitle>
          <DrawerDescription>
            Información completa del pedido #{orderToShow.id.substring(0, 8)}
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="px-4 h-full">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Estado del Pedido</h3>
              <Badge variant={getBadgeVariant(orderToShow.status) || "default"} className="mt-1 uppercase">
                {getStatusText(orderToShow.status)}
              </Badge>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Información de Pago</h3>
              <div className="mt-1 space-y-1">
                <p className="text-sm text-slate-500">
                  <span className="font-medium text-slate-700">Total:</span>{' '}
                  {formatter.format(Number(orderToShow.total))}
                </p>
                <p className="text-sm text-slate-500">
                  <span className="font-medium text-slate-700">ID de Pago:</span>{' '}
                  {orderToShow.paymentId || 'No disponible'}
                </p>
                <p className="text-sm text-slate-500">
                  <span className="font-medium text-slate-700">Estado del Pago:</span>{' '}
                  {orderToShow.paymentStatus || 'No disponible'}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Fecha de Pedido</h3>
              <p className="mt-1 text-sm text-slate-500">
                {new Date(orderToShow.createdAt).toLocaleDateString('es-MX', {
                  dateStyle: 'full',
                })}
              </p>
              <p className="text-sm text-slate-500">
                {new Date(orderToShow.createdAt).toLocaleTimeString('es-MX')}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Última Actualización</h3>
              <p className="mt-1 text-sm text-slate-500">
                {new Date(orderToShow.updatedAt).toLocaleDateString('es-MX', {
                  dateStyle: 'full',
                })}
              </p>
            </div>
          </div>
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
