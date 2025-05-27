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
import { useOrderStore, Order } from '../store/useOrderStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatter } from '@/utils/price';
import { OrderStatus } from '@prisma/client';

export const OrderInfoDrawer = () => {
  const { isOpenInfoDrawer, setIsOpenInfoDrawer, orderToShow } = useOrderStore();

  if (!orderToShow) return null;
  // Función para obtener el color del badge según el estado
  const getBadgeVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => {
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
  const getStatusText = (status: OrderStatus): string => {
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
    <Drawer open={isOpenInfoDrawer} onOpenChange={setIsOpenInfoDrawer}  direction='right'>
      <DrawerContent  >
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
            </div>            <div>
              <h3 className="text-lg font-medium">Dirección de Envío</h3>
              {orderToShow.Address ? (
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-slate-500">
                    <span className="font-medium text-slate-700">Nombre:</span>{' '}
                    {orderToShow.Address.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    <span className="font-medium text-slate-700">Dirección:</span>{' '}
                    {orderToShow.Address.street}
                  </p>
                  <p className="text-sm text-slate-500">
                    <span className="font-medium text-slate-700">Ciudad/Estado:</span>{' '}
                    {orderToShow.Address.city}, {orderToShow.Address.state} {orderToShow.Address.postalCode}
                  </p>
                  <p className="text-sm text-slate-500">
                    <span className="font-medium text-slate-700">País:</span>{' '}
                    {orderToShow.Address.country}
                  </p>
                  <p className="text-sm text-slate-500">
                    <span className="font-medium text-slate-700">Teléfono:</span>{' '}
                    {orderToShow.Address.phone}
                  </p>
                  {orderToShow.Address.reference && (
                    <p className="text-sm text-slate-500">
                      <span className="font-medium text-slate-700">Referencia:</span>{' '}
                      {orderToShow.Address.reference}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-500 mt-1">No hay información de dirección disponible</p>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Productos del Pedido</h3>
              <div className="mt-3 space-y-3">
                {orderToShow.items && orderToShow.items.length > 0 ? (
                  orderToShow.items.map((item) => (
                    <div key={item.id} className="bg-slate-50 p-3 rounded-md border">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-slate-500">Cantidad: {item.quantity}</p>
                          
                          {item.Product?.images && item.Product.images.length > 0 && (
                            <div className="mt-2">
                              <img 
                                src={`/api/uploads/products/${item.Product.images[0].name}`} 
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatter.format(Number(item.price))}
                          </p>
                          <p className="text-sm text-slate-500">
                            Total: {formatter.format(Number(item.price) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 mt-1">No hay productos en este pedido</p>
                )}
              </div>
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
