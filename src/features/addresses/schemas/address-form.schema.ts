import * as z from "zod";

export const addressFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  street: z
    .string()
    .min(5, { message: "La dirección debe tener al menos 5 caracteres" }),
  city: z.string().min(2, { message: "La ciudad es requerida" }),
  state: z.string().min(2, { message: "El estado es requerido" }),
  postalCode: z
    .string()
    .min(5, { message: "El código postal debe tener al menos 5 caracteres" }),
  country: z.string().default("México"),
  phone: z
    .string()
    .min(10, { message: "El teléfono debe tener al menos 10 caracteres" }),
  reference: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;
