import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useCategoryStore } from "../store/useCategoryStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export const CategoryInfoDrawer = () => {
  const { isOpenInfoDrawer, setIsOpenInfoDrawer, categoryToShow } =
    useCategoryStore();
  const isMobile = useIsMobile();

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={isOpenInfoDrawer}
      onOpenChange={() => setIsOpenInfoDrawer(!isOpenInfoDrawer)}
    >
        <DrawerContent className="">
          <ScrollArea className="h-full overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle className="text-2xl">
                Información de la categoría
              </DrawerTitle>
              <DrawerDescription>
                Aquí puedes ver los detalles completos de la categoría
                seleccionada.
              </DrawerDescription>
            </DrawerHeader>

            <Separator className="mb-4" />

            <div className="px-6 pb-6 grid gap-6 text-sm">
              <div>
                <h2 className="text-base font-medium text-muted-foreground">
                  Nombre
                </h2>
                <p className="text-lg font-semibold">{categoryToShow?.name}</p>
              </div>

              <div>
                <h2 className="text-base font-medium text-muted-foreground">
                  Descripción
                </h2>
                <p>{categoryToShow?.description || "-"}</p>
              </div>

              <div>
                <h2 className="text-base font-medium text-muted-foreground">
                  Estado
                </h2>
                <Badge
                  variant={
                    categoryToShow?.status === "ACTIVE"
                      ? "default"
                      : "secondary"
                  }
                  className="uppercase"
                >
                  {categoryToShow?.status === "ACTIVE" ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              <div>
                <h2 className="text-base font-medium text-muted-foreground">
                  Fecha de creación
                </h2>
                {categoryToShow?.createdAt ? (
                  <p>
                    {new Date(categoryToShow.createdAt).toLocaleDateString(
                      "es-MX",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                ) : (
                  "-"
                )}
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
    </Drawer>
  );
};
