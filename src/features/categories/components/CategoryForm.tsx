"use client";
import axios from "axios";
import { DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/ui/FileUpload";
import { useCategoryForm } from "../hooks/useCategoryForm";
import { Button } from "@/components/ui/button";

export const CategoryForm = () => {
  const { form, isUpdating, onSubmit } = useCategoryForm();
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
          />          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Imagen: <span className="text-red-500">*</span>
                </FormLabel>                <FormControl>
                  <FileUpload
                    id="category-image"
                    value={field.value}
                    onChange={field.onChange}
                    defaultPreview={
                      isUpdating && typeof field.value === 'string' 
                        ? `/api/uploads/categories/${field.value}`
                        : null
                    }
                  />
                </FormControl>
                <FormDescription>
                  Imagen representativa de la categoría (obligatorio)
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
          <Button type="submit">
            {isUpdating ? "Actualizar" : "Registrar"}
          </Button>
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
