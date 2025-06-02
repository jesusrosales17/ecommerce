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
import { useProductActions } from "../hooks/useProductActions";

interface DeleteProductDialogProps {
  productId: string;
  productName: string;
}

export const DeleteProductDialog = ({ productId, productName }: DeleteProductDialogProps) => {
  const { deleteProduct, isDeleting } = useProductActions();

  const handleDelete = async () => {
    await deleteProduct(productId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-red-500 hover:text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
          <AlertDialogDescription>
            El producto <strong>"{productName}"</strong> quedará eliminado y no se podrá recuperar.
            Su estado pasará a DELETED y ya no aparecerá en la tabla de productos ni en la tienda.
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white  hover:bg-destructive/90"
            onClick={handleDelete}
            disabled={isDeleting === productId}
          >
            {isDeleting === productId ? "Eliminando..." : "Eliminar producto"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
