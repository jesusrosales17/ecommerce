'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useCategoryActions } from "../hooks/useCategoryActions";

interface DeleteCategoryDialogProps {
  categoryId: string;
  categoryName: string;
}

export const DeleteCategoryDialog = ({ categoryId, categoryName }: DeleteCategoryDialogProps) => {
  const { deleteCategory, isDeleting } = useCategoryActions();

  const handleDelete = async () => {
    await deleteCategory(categoryId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-red-500 hover:text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
          <AlertDialogDescription>
            La categoría <strong>"{categoryName}"</strong> será eliminada y no se podrá recuperar.
            Su estado pasará a DELETED y ya no aparecerá en la tabla de categorías ni en la tienda.
            {" "}
            <br />
            <br />
            <strong>Importante:</strong> Si esta categoría tiene productos activos asociados, 
            no podrá ser eliminada. Primero deberás eliminar, desactivar o mover los productos 
            a otra categoría.
            <br />
            <br />
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={handleDelete}
            disabled={isDeleting === categoryId}
          >
            {isDeleting === categoryId ? "Eliminando..." : "Eliminar categoría"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
