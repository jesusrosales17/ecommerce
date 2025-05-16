import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  productGeneralSchema,
  ProductGeneralSchemaType,
} from "../schemas/productSchema";
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { forwardRef,  useImperativeHandle } from "react";


export const ProductGeneralForm = forwardRef ((_, ref) => {
  const form = useForm<ProductGeneralSchemaType>({
    resolver: zodResolver(productGeneralSchema),
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
      isOnSale: false,
      salePrice: undefined,
      isFeatured: false,
      status: "ACTIVE",
    },
  });

  const onSubmit= async ( data: ProductGeneralSchemaType) => {
    console.log("data", data);
  };

  useImperativeHandle(ref, () => ({
    submit: async () => {
      const isValid = await form.trigger();
      console.log(isValid)
      if (isValid) {
        onSubmit(form.getValues());
      }

      return isValid;
    },
  }))
  return (
    <>
      <h2 className="text-lg font-bold mb-4">
        Informacion general del producto
      </h2>
      <Form {...form}>
        <form  className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del producto</FormLabel>
                <Input type="text" placeholder="Ej. Celulares" {...field} />
                <FormDescription>
                  Nombre del producto que se mostrara en la tienda
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <Input type="number" placeholder="Ej. 1000" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                <FormDescription>
                  Precio del producto que se mostrara en la tienda
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <Input type="number" placeholder="Ej. 10" onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                <FormDescription>
                  Stock del producto que se mostrara en la tienda
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name="isOnSale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>¿Está en oferta?</FormLabel>
                <Switch 
                  id="isOnSale"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormDescription>
                  Si el producto está en oferta, se mostrará el precio de oferta
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          
            {
              form.watch("isOnSale") && (
 <FormField
                control={form.control}
                name="salePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio de oferta</FormLabel>
                    <Input type="number" placeholder="Ej. 800" onChange={(e) => field.onChange(e.target.valueAsNumber)} value={field.value} />
                    <FormDescription>
                      Precio de oferta del producto que se mostrara en la tienda
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              )
            } 
            
          


          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem>
                <FormLabel>¿Es destacado?</FormLabel>
                <Switch 
                  id="isFeatured"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormDescription>
                  Si el producto es destacado, se mostrará en la sección de
                  destacados
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Switch
                  id="status"
                  checked={field.value === "ACTIVE"}
                  onCheckedChange={(checked) => {
                    field.onChange(checked ? "ACTIVE" : "INACTIVE");
                  }}
                />
                <FormDescription>
                  Estado del producto, si está activo se mostrará en la tienda
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
});
