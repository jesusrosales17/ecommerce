"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight,  CreditCard, Home } from "lucide-react";
import { Address } from "@prisma/client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useCheckout } from "../hooks/useCheckout";
import { AddressList } from "@/features/addresses/components/AddressList";

interface CheckoutPageClientProps {
  addresses: Address[];
  cartTotal: number;
  itemsCount: number;
}

export default function CheckoutPageClient({
  addresses,
  cartTotal,
  itemsCount,
}: CheckoutPageClientProps) {
  const [activeTab, setActiveTab] = useState("direccion");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((addr) => addr.isDefault)?.id || null
  );
  const { isLoading, createCheckoutSession } = useCheckout();

  const handleAddressSelect = (address: Address) => {
    setSelectedAddressId(address.id);
  };

  const handleContinue = () => {
    if (activeTab === "direccion" && selectedAddressId) {
      setActiveTab("pago");
    }
  };

  const handleBack = () => {
    if (activeTab === "pago") {
      setActiveTab("direccion");
    }
  };

  const handlePayment = async () => {
    if (selectedAddressId) {
      await createCheckoutSession(selectedAddressId);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-6">
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6 grid grid-cols-2">
            <TabsTrigger value="direccion" className="w-auto">
              <Home className="h-4 w-4 mr-2" />
              Dirección
            </TabsTrigger>
            <TabsTrigger value="pago" disabled={!selectedAddressId} className="w-auto">
              <CreditCard className="h-4 w-4 mr-2" />
              Pago
            </TabsTrigger>
          </TabsList>

          <TabsContent value="direccion">
            <Card>
              <CardHeader>
                <CardTitle>Selecciona una dirección</CardTitle>
              </CardHeader>
              <CardContent>
                <AddressList
                  addresses={addresses}
                  selectable
                  onAddressSelect={handleAddressSelect}
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-4 md:flex-row justify-between">
                <Button variant="outline" asChild className="w-full md:w-auto">
                  <Link href="/cart">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al carrito
                  </Link>
                </Button>
                <Button onClick={handleContinue} disabled={!selectedAddressId} className="w-full md:w-auto">
                  Continuar al pago
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="pago">
            <Card>
              <CardHeader>
                <CardTitle>Finalizar compra</CardTitle>
                <CardDescription>
                  Revisa los detalles y paga de forma segura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="font-medium mb-2">Dirección de envío:</p>
                  {selectedAddressId && (
                    <div className="p-4 bg-muted rounded-lg text-sm leading-relaxed shadow-sm border">
                      {(() => {
                        const addr = addresses.find(
                          (a) => a.id === selectedAddressId
                        );
                        return addr ? (
                          <>
                            <p>{addr.street}</p>
                            <p>
                              {addr.city}, {addr.state}
                            </p>
                            <p>{addr.postalCode}</p>
                          </>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>

                <div>
                  <p className="font-medium mb-2">Método de pago:</p>
                  <div className="p-4 bg-muted rounded-lg flex items-center shadow-sm border">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Tarjeta de crédito / débito 
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Button>
                <Button onClick={handlePayment} disabled={isLoading}>
                  {isLoading ? "Procesando..." : "Pagar"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="w-full md:w-96 lg:mt-16">
        <Card className="">
          <CardHeader>
            <CardTitle>Resumen del pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>Productos ({itemsCount})</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span className="text-green-600 font-medium">Gratis</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
