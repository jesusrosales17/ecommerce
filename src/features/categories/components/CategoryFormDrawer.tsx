"use client";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { CategoryForm } from "./CategoryForm";
import { useCategoryStore } from "../store/useCategoryStore";

export function CategoryFormDrawer() {
  const isMobile = useIsMobile();
  const { isOpenDrawer, setIsOpenDrawer, categoryToUpdate } =
    useCategoryStore();
  return (
    <>
      <Drawer
        open={isOpenDrawer}
        onOpenChange={() => {
          setIsOpenDrawer(!isOpenDrawer);
        }}
        direction={isMobile ? "bottom" : "right"}
      >

        <DrawerContent className="">
          <div className={`overflow-y-auto h-full`}>
          <DrawerHeader>
            <DrawerTitle className="text-2xl">
              {categoryToUpdate ? "Actualizar categoria" : "Nueva categoria"}
            </DrawerTitle>
            <DrawerDescription>
              {categoryToUpdate
                ? "Completa el formulario para  actualizar la categoria"
                : "Completa el formulario para  registrar una nueva categoria para la tienda"}
            </DrawerDescription>
          </DrawerHeader>
          <Separator className="mb-4" />
          <div className="px-4 h-full">
            <CategoryForm  />
          </div>

          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
