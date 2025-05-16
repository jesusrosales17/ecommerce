import { z } from "zod";



export const  productGeneralSchema = z.object({
    name: z.string().trim().min(3, {
        message: "El nombre del producto debe tener al menos 3 caracteres",
    }),
    price: z.number().positive({
        message: "El precio del producto debe ser un número positivo",
    }).optional(),
    stock: z.number().int().nonnegative({
        message: "El stock del producto debe ser un número entero no negativo",
    }),
    isOnSale: z.boolean().optional(),
    // si el producto esta en oferta, el precio de oferta es requerido
    salePrice: z.number().positive({
        message: "El precio de venta debe ser un número positivo",
    }).optional(), 
    isFeatured: z.boolean().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "DELETED"], {
        errorMap: () => ({ message: "El estado no es valido" }),
    }),
}).superRefine((data, ctx) => {
    if(data.isOnSale && data.salePrice === undefined) {
        ctx.addIssue({
            path: ["salePrice"],
            code: z.ZodIssueCode.custom,
            message: "El precio de oferta es requerido si el producto está en oferta",
        });
    }
}) 


export type ProductGeneralSchemaType = z.infer<typeof productGeneralSchema>;