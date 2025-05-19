import { z } from "zod";

export const categorySchema = z.object({
    name: z.string().trim().min(3, {
        message: "El nombre de la categoría debe tener al menos 3 caracteres",
    }),
    description: z.string().optional(),
    image: z.instanceof(File).or(z.string()).refine(val => val !== '', {
        message: "La imagen es obligatoria",
    }),
    status: z.enum(["ACTIVE", "INACTIVE", "DELETED"], {
        errorMap: () => ({ message: "El estado no es valido" }),
    })
});

// para actualizar la categoria solo anexar el id
export const categoryUpdateSchema = categorySchema.extend({
    id: z.string().uuid({
        message: "El id de la categoría no es válido",
    }),
});

export type CategorySchemaType = z.infer<typeof categorySchema>;
export type CategoryUpdateSchemaType = z.infer<typeof categoryUpdateSchema>;


