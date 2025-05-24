import { z } from "zod";

// Esquema para validar formularios de producto
export const productFormSchema = z.object({
  name: z.string().trim().min(3, {
    message: "El nombre del producto debe tener al menos 3 caracteres",
  }),
  description: z.string().optional(),
  price: z.number().nonnegative({
    message: "El precio del producto debe ser un número positivo",
    }),
  stock: z.number().min(0, {
    message: "El stock del producto debe ser un número entero positivo",
  }).optional(),
  brand: z.string().trim().min(3, {
    message: "La marca del producto debe tener al menos 3 caracteres",
  }).optional(),
  color: z.string().trim().min(3, {
    message: "El color del producto debe tener al menos 3 caracteres",
  }).optional(),
  isOnSale: z.boolean().optional(),
  salePrice: z.number().min(0, {
    message: "El precio de oferta debe ser un número positivo",
  }).optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "DELETED"], {
    errorMap: () => ({ message: "El estado no es válido" }),
  }),
  categoryId: z.string().optional(),
}).superRefine((data, ctx) => {
  if(data.isOnSale && (!data.salePrice || data.salePrice <= 0)) {
    ctx.addIssue({
      path: ["salePrice"],
      code: z.ZodIssueCode.custom,
      message: "El precio de oferta es requerido si el producto está en oferta",
    });
  }
  
  // El categoryId puede ser una cadena vacía desde un form
  if (data.categoryId === "") {
    data.categoryId = undefined;
  }
});

export type ProductFormSchemaType = z.infer<typeof productFormSchema>;
