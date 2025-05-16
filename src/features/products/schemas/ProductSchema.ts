import { z } from "zod";



export const  productGeneralSchema = z.object({
    name: z.string().trim().min(3, {
        message: "El nombre del producto debe tener al menos 3 caracteres",
    }),
    description: z.string().optional(),
    price: z.number().positive({
        message: "El precio del producto debe ser un número positivo",
    }),
    stock: z.number().int().nonnegative({
        message: "El stock del producto debe ser un número entero no negativo",
    }),
    isOnSale: z.boolean().optional(),
    salePrice: z.number().positive({
        message: "El precio de venta debe ser un número positivo",
    }).optional(), 
    isFeatured: z.boolean().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "DELETED"], {
        errorMap: () => ({ message: "El estado no es valido" }),
    }),
})