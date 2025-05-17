import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  productGeneralSchema,
  ProductGeneralSchemaType,
} from "../schemas/ProductSchema";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { forwardRef, useImperativeHandle } from "react";
import { useProductStore } from "../store/useProductStore";
import { useCategoryStore } from "@/features/categories/store/useCategoryStore";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { useEffect} from "react";
export const ProductGeneralForm = forwardRef((_, ref) => {
  const { setGeneral, general } = useProductStore();
  const { categories} = useCategoryStore();
  console.log(general)
  const form = useForm<ProductGeneralSchemaType>({
    resolver: zodResolver(productGeneralSchema),
    defaultValues: {
      name: general?.name || "",
      price: general?.price || 0,
      stock: general?.stock || 0,
      isOnSale: general?.isOnSale || false,
      salePrice: general?.salePrice || undefined,
      isFeatured: general?.isFeatured || false,
      status: general?.status || "ACTIVE",
      categoryId: general?.categoryId || "",
    },
  });

  useImperativeHandle(ref, () => ({
    submit: async () => {
      const isValid = await form.trigger();

      if (isValid) {
        const data = form.getValues();
        setGeneral(data);
      }

      return isValid;
    },
  }));

  useEffect(() => {
    form.reset({
      name: general?.name || "",
      price: general?.price || 0,
      stock: general?.stock || 0,
      isOnSale: general?.isOnSale || false,
      salePrice: general?.salePrice || undefined,
      isFeatured: general?.isFeatured || false,
      status: general?.status || "ACTIVE",
      categoryId: general?.categoryId || "",
    });
  }, [general]);


  return (
    <>
      <h2 className="text-lg font-bold mb-4">
        Informacion general del producto
      </h2>
      <Form {...form}>
        <form className="space-y-4">
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
                <Input
                  type="number"
                  placeholder="Ej. 1000"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
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
                <Input
                  type="number"
                  placeholder="Ej. 10"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
                <FormDescription>
                  Stock del producto que se mostrara en la tienda
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select
                  defaultValue={field.value}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* sin categoria */}
                    <SelectItem value="undefined">Sin categoria</SelectItem>
                    
                    {
                      categories.length > 0 ? (
                        <SelectGroup>
                          {categories.map((category, index) => (
                            console.log(category),
                            <SelectItem key={category.id ?? `fallback-${index}`} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ) : (
                        <SelectItem value="undefinedk">
                          No hay categorias
                        </SelectItem>
                      )
                    }
                  </SelectContent>
                </Select>
                <FormDescription>
                  Categoria del producto que se mostrara en la tienda
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

          {form.watch("isOnSale") && (
            <FormField
              control={form.control}
              name="salePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio de oferta</FormLabel>
                  <Input
                    type="number"
                    placeholder="Ej. 800"
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    value={field.value}
                  />
                  <FormDescription>
                    Precio de oferta del producto que se mostrara en la tienda
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
