'use client';
import type { Product } from '../interfaces/product';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/SearchInput";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
}

interface Props {
  products: Product[];
  categories: Category[];
}

const ProductTable = ({ products, categories }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const formattedPrice = (price: string | number) => {
    return Number(price).toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN'
    });
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filtro por búsqueda
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtro por categoría
      const matchesCategory = 
        categoryFilter === "all" || 
        (product.categoryId === categoryFilter);
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <SearchInput
          placeholder="Buscar producto"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          classname="mb-0 w-full md:w-auto"
        />
        <div className="ml-auto">
          <Select value={categoryFilter}  onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className=''>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-gray-500"
                >
                  No hay productos para mostrar
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    {product.isOnSale && product.salePrice ? (
                      <div>
                        <span className="line-through text-gray-500 text-sm mr-2">
                          {formattedPrice(product.price)}
                        </span>
                        <span className="font-medium text-green-600">
                          {formattedPrice(product.salePrice)}
                        </span>
                      </div>
                    ) : (
                      formattedPrice(product.price)
                    )}
                  </TableCell>
                  <TableCell>{product.category?.name || "Sin categoría"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "ACTIVE" ? "default" : "secondary"
                      }
                      className="uppercase"
                    >
                      {product.status === "ACTIVE" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} className="w-8 h-8">
                          <MoreVertical width={20} />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <Link href={`/admin/products/${product.id}`}>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />

                        <Link href={`/admin/products/update/${product.id}`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        </Link>

                        <DropdownMenuItem className="text-red-500">
                          <Trash className="mr-2 h-4 w-4" />
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
    </div>
  );
};

export default ProductTable;