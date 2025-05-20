import { z } from "zod";

// Schema para validar las especificaciones desde un FormData
export const productSpecificationFormSchema = z.object({
  name: z.string().trim().min(2, {
    message: "El nombre de la especificación debe tener al menos 2 caracteres",
  }),
  value: z.string().trim().min(1, {
    message: "El valor de la especificación no puede estar vacío",
  }),
});

export type ProductSpecificationFormType = z.infer<typeof productSpecificationFormSchema>;

/**
 * Extrae las especificaciones de producto desde un FormData
 * @param formData FormData que contiene los datos del formulario
 * @returns Array de especificaciones extraídas
 */
export function extractSpecificationsFromFormData(formData: FormData): ProductSpecificationFormType[] {
  const specifications: ProductSpecificationFormType[] = [];
  const specNames = formData.getAll('specificationName');
  const specValues = formData.getAll('specificationValue');
  
  // Asegurarse de que tenemos el mismo número de nombres y valores
  const count = Math.min(specNames.length, specValues.length);
  
  for (let i = 0; i < count; i++) {
    const name = specNames[i]?.toString() || '';
    const value = specValues[i]?.toString() || '';
    
    if (name.trim() && value.trim()) {
      specifications.push({
        name,
        value
      });
    }
  }

  
  return specifications;
}
