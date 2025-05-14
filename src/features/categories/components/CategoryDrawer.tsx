
'use client'
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { IoMdAdd } from "react-icons/io";
import { CategoryForm } from "./CategoryForm";

interface Props {
  children?: React.ReactNode;
}

export function CategoryDrawer({ children }: Props) {
  const isMobile = useIsMobile();

  return (
    <>
      <Drawer direction={isMobile ? "bottom" : "right"}>
        <DrawerTrigger asChild className="flex items-center gap-2">
          {children ? (
            children
          ) : (
            <Button className="w-full md:w-auto">
              <IoMdAdd />
              Nueva categoría
            </Button>
          )}
        </DrawerTrigger>
        <DrawerContent>
          {/* <div className={`${isMobile ? "overflow-y-auto" : ""} `}> */}
          <DrawerHeader>
            <DrawerTitle className="text-2xl">
              Registrar nueva categoria
            </DrawerTitle>
            <DrawerDescription>
              Completa el formulario para registrar una nueva categoria para la
              tienda
            </DrawerDescription>
          </DrawerHeader>
          <Separator className="mb-4" />
          <div className="px-4 h-full">
            <CategoryForm />
          </div>

          {/* </div> */}
        </DrawerContent>
      </Drawer>
    </>
  );
}
