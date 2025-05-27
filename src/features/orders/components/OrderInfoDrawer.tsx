"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useOrderStore } from "../store/useOrderStore";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import the smaller components
import { OrderStatusDisplay } from "./order-drawer/OrderStatusDisplay";
import { OrderPaymentInfo } from "./order-drawer/OrderPaymentInfo";
import { OrderDateInfo } from "./order-drawer/OrderDateInfo";
import { OrderAddressInfo } from "./order-drawer/OrderAddressInfo";
import { OrderItemsList } from "./order-drawer/OrderItemsList";
import { useIsMobile } from "@/hooks/use-mobile";

export const OrderInfoDrawer = () => {
  const { isOpenInfoDrawer, setIsOpenInfoDrawer, orderToShow } =
    useOrderStore();
  const isMobile = useIsMobile();

  if (!orderToShow) return null;

  return (
    <Drawer
      open={isOpenInfoDrawer}
      onOpenChange={setIsOpenInfoDrawer}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent className="  ">
        <ScrollArea className="h-full overflow-y-auto ">
          <DrawerHeader>
            <DrawerTitle>Detalles del Pedido</DrawerTitle>
            <DrawerDescription>
              Información completa del pedido #{orderToShow.id.substring(0, 8)}
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-6 px-4">
            {/* Estado del Pedido */}
            <OrderStatusDisplay status={orderToShow.status} />

            {/* Información de Pago */}
            <OrderPaymentInfo
              total={orderToShow.total}
              paymentId={orderToShow.paymentId}
              paymentStatus={orderToShow.paymentStatus}
            />

            {/* Fechas del Pedido */}
            <OrderDateInfo
              createdAt={orderToShow.createdAt}
              updatedAt={orderToShow.updatedAt}
            />

            {/* Dirección de Envío */}
            <OrderAddressInfo address={orderToShow.Address} />

            {/* Productos del Pedido */}
            <OrderItemsList items={orderToShow.items} />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DrawerClose>
          </DrawerFooter>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
