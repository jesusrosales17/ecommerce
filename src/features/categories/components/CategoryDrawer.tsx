
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
import { useCategoryStore } from "../store/categoryStore";

interface Props {
  children?: React.ReactNode;
}

export function CategoryDrawer({ children }: Props) {
  const isMobile = useIsMobile();
  const {isOpenDrawer, setIsOpenDrawer} = useCategoryStore();
  return (
    <>
      <Drawer open={isOpenDrawer} onOpenChange={() => {setIsOpenDrawer(!isOpenDrawer)}} direction={isMobile ? "bottom" : "right"}>
        <DrawerTrigger asChild className="flex items-center gap-2">
         
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
            <CategoryForm onClose={() => setIsOpenDrawer(false)} />
          </div>

          {/* </div> */}
        </DrawerContent>
      </Drawer>
    </>
  );
}
