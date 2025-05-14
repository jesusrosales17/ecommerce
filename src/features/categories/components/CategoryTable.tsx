import prisma from "@/libs/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {  Edit, Eye, MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategoryStore } from "../store/categoryStore";

interface Props {
  categories: Category[];
}

export  function CategoryTable({ categories }: Props) {
  const {setCategoryToUpdate} = useCategoryStore();

  const handleEdit = (category: Category) => {
    setCategoryToUpdate(category);
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha de creación</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                No hay categorías para mostrar
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description || "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={category.status === "ACTIVE" ? "default" : "secondary"}
                  >
                    {category.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(category.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell width={100}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"ghost"} className="w-8 h-8">
                      <MoreVertical  width={20} />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Eye />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                      onClick={() => handleEdit(category)}
                      >
                        <Edit />
                        Editar
                      </DropdownMenuItem>

                      <DropdownMenuItem className="text-red-500">
                        <Trash />
                         Eliminar 
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
