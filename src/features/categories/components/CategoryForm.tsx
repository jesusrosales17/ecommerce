'use client'
import { Button } from "@/components/ui/button";
import { DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { categorySchema, CategorySchemaType } from "../schemas/categorySchema";
import { useForm} from 'react-hook-form';

export const CategoryForm = () => {
  const form = useForm<CategorySchemaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      status: "ACTIVE",
    },
  });

  const onSubmit = async (data: CategorySchemaType) => {
    try {
      
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" h-full flex flex-col justify-between"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre:</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Celulares" {...field} />
                </FormControl>
                <FormDescription>
                  Nombre de la categoria que se mostrara en la tienda
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripcion: </FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Celulares de alta gama" {...field} />
                </FormControl>
                <FormDescription>
                  Descripcion de la categoria que se mostrara en la tienda
                  (opcional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Estado: </FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Switch
                      name="status"
                      id="status"
                      checked={field.value === "ACTIVE"}
                      onCheckedChange={(checked) => {
                        field.onChange(checked ? "ACTIVE" : "INACTIVE");
                      }}
                    />
                    <label htmlFor="status" className="text-sm text-gray-500">
                      {field.value ? "Activo" : "Inactivo"}
                    </label>
                  </div>
                </FormControl>
                <FormDescription>
                  Estado de la categoria, si esta activa se mostrara en la
                  tienda
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DrawerFooter className="mx-0 px-0">
          <Button type="submit">Registrar</Button>
          <DrawerClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </form>
    </Form>
  );
};
