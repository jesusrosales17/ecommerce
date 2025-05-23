import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {  ProductSpecificationsTable } from "./ProductSpecificationsTable";
import { ProductSpecification } from "@prisma/client";

interface ProductTabsContentProps {
  description: string;
  specifications: ProductSpecification[];
}

export const ProductTabsContent = ({
  description,
  specifications,
}: ProductTabsContentProps) => {
  return (
    <Tabs defaultValue="desc" className="space-y-4">
      <TabsList>
        <TabsTrigger value="desc">Descripción</TabsTrigger>
        <TabsTrigger value="specs">Especificaciones</TabsTrigger>
      </TabsList>
      
      <TabsContent value="desc">
        <Card>
          <CardContent className="p-4">
            <ScrollArea className="h-64">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: description || "<p>Sin descripción</p>",
                }}
              />
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="specs">
        <Card>
          <CardContent className="p-4">
            {specifications.length > 0 ? (
              <ScrollArea className="h-64">
                <ProductSpecificationsTable  specifications={specifications} />
              </ScrollArea>
            ) : (
              <p className="text-center text-muted-foreground">
                Sin especificaciones
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
