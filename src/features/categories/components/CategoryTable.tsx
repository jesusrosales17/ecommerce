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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategoryStore } from "../store/useCategoryStore";
import { SearchInput } from "@/components/ui/SearchInput";
import { useState,  useMemo } from "react";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";

interface Props {
  categories: Category[];
}

export function CategoryTable({ categories }: Props) {
  const {
    setCategoryToUpdate,
    setIsOpenDrawer,
    setIsOpenInfoDrawer,
    setCategoryToShow,
  } = useCategoryStore();
 

  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (category: Category) => {
    setIsOpenDrawer(true);
    setCategoryToUpdate(category);
  };
  const handleShow = (category: Category) => {
    setIsOpenInfoDrawer(true);
    setCategoryToShow(category);
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]); 

  return (
    <div className="">
      <SearchInput
          placeholder="Buscar categoria"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          classname="mb-4"
        />
      <div className="rounded-md border" >
        <Table >
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
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-gray-500"
                >
                  No hay categorías para mostrar
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        category.status === "ACTIVE" ? "default" : "secondary"
                      }
                      className="uppercase"
                    >
                      {category.status === "ACTIVE" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(category.createdAt).toLocaleDateString("es-MX", {
                      dateStyle: "medium",
                    })}
                  </TableCell>
                  <TableCell width={100}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} className="w-8 h-8">
                          <MoreVertical width={20} />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleShow(category)}>
                          <Eye />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />                        <DropdownMenuItem onClick={() => handleEdit(category)}>
                          <Edit />
                          Editar
                        </DropdownMenuItem>

                        <DeleteCategoryDialog 
                          categoryId={category.id}
                          categoryName={category.name}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
