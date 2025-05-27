"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
  addressFormSchema,
  AddressFormValues,
} from "../schemas/address-form.schema";
import { useAddressActions } from "../hooks/useAddressActions";
import { Address } from "@prisma/client";

interface AddressFormProps {
  initialData?: Address;
  onSuccess?: (address: Address) => void;
  onCancel?: () => void;
}

export function AddressForm({
  initialData,
  onSuccess,
  onCancel,
}: AddressFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createAddress, updateAddress } = useAddressActions();

  const form = useForm<AddressFormValues>({
    // 
    resolver: zodResolver(addressFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          street: initialData.street,
          city: initialData.city,
          state: initialData.state,
          postalCode: initialData.postalCode,
          country: initialData.country,
          phone: initialData.phone,
          reference: initialData.reference || "",
          isDefault: initialData.isDefault,
        }
      : {
          name: "",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "México",
          phone: "",
          reference: "",
          isDefault: false,
        },
  });

  async function onSubmit(data: AddressFormValues) {
    try {
      setIsSubmitting(true);
      
      let result;
      if (initialData) {
        result = await updateAddress(initialData.id, {
          ...data,
          reference: data.reference || "" // Ensure reference is always a string
        });
      } else {
        result = await createAddress({
          ...data,
          reference: data.reference || "" // Ensure reference is always a string
        });
      }
      
      if (result && onSuccess) {
        onSuccess(result);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo*</FormLabel>
              <FormControl>
                <Input placeholder="Juan Pérez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calle y número*</FormLabel>
              <FormControl>
                <Input placeholder="Av. Revolución #123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad*</FormLabel>
                <FormControl>
                  <Input placeholder="Ciudad de México" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado*</FormLabel>
                <FormControl>
                  <Input placeholder="CDMX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código Postal*</FormLabel>
                <FormControl>
                  <Input placeholder="06500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>País</FormLabel>
                <FormControl>
                  <Input placeholder="México" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono*</FormLabel>
              <FormControl>
                <Input placeholder="5555555555" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referencias (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Casa blanca con portón azul, frente al parque..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Dirección predeterminada</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Guardando..."
              : initialData
              ? "Actualizar"
              : "Guardar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
