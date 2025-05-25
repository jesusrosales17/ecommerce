"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, CreditCard, Home } from "lucide-react";
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
    if (activeTab === "direccion") {
      if (!selectedAddressId) {
        return;
      }
      setActiveTab("pago");
    }
  };

  const handleBack = () => {
    if (activeTab === "pago") {
      setActiveTab("direccion");
    }
  };

  const handlePayment = async () => {
    if (!selectedAddressId) {
      return;
    }
    await createCheckoutSession(selectedAddressId);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full mb-6">
            <TabsTrigger value="direccion" className="flex-1">
              <Home className="h-4 w-4 mr-2" />
              Dirección
            </TabsTrigger>
            <TabsTrigger value="pago" className="flex-1" disabled={!selectedAddressId}>
              <CreditCard className="h-4 w-4 mr-2" />
              Pago
            </TabsTrigger>
          </TabsList>
          <TabsContent value="direccion">
            <AddressList
              addresses={addresses}
              selectable
              onAddressSelect={handleAddressSelect}
            />

            <div className="mt-6 flex justify-between">
              <Link href="/cart">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al carrito
                </Button>
              </Link>
              <Button
                onClick={handleContinue}
                disabled={!selectedAddressId}
              >
                Continuar al pago
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="pago">
            <Card>
              <CardHeader>
                <CardTitle>Finalizar compra</CardTitle>
                <CardDescription>
                  Revisa los detalles y procede al pago seguro con Stripe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Dirección de envío:</p>
                    {selectedAddressId && (
                      <div className="mt-1 p-3 bg-gray-50 rounded-md">
                        {addresses
                          .find((addr) => addr.id === selectedAddressId)
                          ?.street}, {" "}
                        {
                          addresses.find(
                            (addr) => addr.id === selectedAddressId
                          )?.city
                        }, {" "}
                        {
                          addresses.find(
                            (addr) => addr.id === selectedAddressId
                          )?.state
                        }, {" "}
                        {
                          addresses.find(
                            (addr) => addr.id === selectedAddressId
                          )?.postalCode
                        }
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="font-medium">Método de pago:</p>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Tarjeta de crédito / débito (Stripe)
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Button>
                <Button 
                  onClick={handlePayment}
                  disabled={isLoading}
                >
                  {isLoading ? "Procesando..." : "Pagar con Stripe"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="w-full md:w-80">
        <Card>
          <CardHeader>
            <CardTitle>Resumen del pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Productos ({itemsCount}):</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span>Gratis</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
