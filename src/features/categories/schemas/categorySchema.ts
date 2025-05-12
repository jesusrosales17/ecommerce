import { z } from "zod";

export const categorySchema = z.object({
    name: z.string().trim().min(3, {
        message: "El nombre de la categoría debe tener al menos 3 caracteres",
    }),
    description: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"], {
        errorMap: () => ({ message: "El estado no es valido" }),
    })
});

export type CategorySchemaType = z.infer<typeof categorySchema>;


