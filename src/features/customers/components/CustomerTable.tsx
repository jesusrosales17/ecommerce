"use client";

import { useState } from "react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Mail } from "lucide-react";
import { useCustomerStore } from "../store/useCustomerStore";
import { useCustomerActions } from "../hooks/useCustomerActions";
import { CustomerWithRelations } from "../interfaces/customer";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { formattedPrice } from "@/utils/price";

interface CustomerTableProps {
  customers: CustomerWithRelations[];
}

export function CustomerTable({ customers = [] }: CustomerTableProps) {
  const { setCustomerToShow, setIsInfoDrawerOpen } = useCustomerStore();
  const { calculateCustomerSummary } = useCustomerActions();

  // Verificamos que customers sea un array
  const safeCustomers = Array.isArray(customers) ? customers : [];

  const handleViewCustomer = (customer: CustomerWithRelations) => {
    setCustomerToShow(customer);
    setIsInfoDrawerOpen(true);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Total pedidos</TableHead>
            <TableHead>Total gastado</TableHead>
            <TableHead>Última compra</TableHead>
            <TableHead>Direcciones</TableHead>
            <TableHead>Registrado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeCustomers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                No hay clientes para mostrar
              </TableCell>
            </TableRow>
          ) : (
            safeCustomers.map((customer) => {
              const summary = calculateCustomerSummary(customer);

              return (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.name || "Sin nombre"}
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{summary.totalOrders}</TableCell>
                  <TableCell>{formattedPrice(summary.totalSpent)}</TableCell>
                  <TableCell>
                    {summary.lastOrderDate
                      ? formatDistanceToNow(new Date(summary.lastOrderDate), {
                          addSuffix: true,
                          locale: es,
                        })
                      : "No ha comprado"}
                  </TableCell>
                  <TableCell>{summary.addressCount}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(customer.createdAt), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewCustomer(customer)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            (window.location.href = `mailto:${customer.email}`)
                          }
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Contactar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
