'use client';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useCustomerStore } from "../store/useCustomerStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import { CustomerOrdersSummary } from "./drawer/CustomerOrdersSummary";
import { CustomerAddresses } from "./drawer/CustomerAddresses";
import { CustomerProfileInfo } from "./drawer/CustomerProfileInfo";

export function CustomerInfoDrawer() {
  const { isInfoDrawerOpen, setIsInfoDrawerOpen, customerToShow } = useCustomerStore();
  const isMobile = useIsMobile();

  if (!customerToShow) return null;

  return (
    <Drawer
      open={isInfoDrawerOpen}
      onOpenChange={setIsInfoDrawerOpen}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent className="">
        <ScrollArea className="h-full overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Información del Cliente</DrawerTitle>
            <DrawerDescription>
              Detalles completos del cliente {customerToShow.name || customerToShow.email}
            </DrawerDescription>
          </DrawerHeader>

          <div className="space-y-6 px-4">
            {/* Información del perfil */}
            <CustomerProfileInfo customer={customerToShow} />
            
            <Separator />
              {/* Resumen de pedidos */}
            <CustomerOrdersSummary orders={customerToShow.Order} />
            
            <Separator />
            
            {/* Direcciones del cliente */}
            <CustomerAddresses addresses={customerToShow.Address} />
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
}
