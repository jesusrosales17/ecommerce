import { z } from "zod";

/**
 * Convierte un FormData en un objeto plano para validación con Zod
 * @param formData FormData a convertir
 * @returns Objeto plano con los datos del formulario
 */
export function parseFormData(formData: FormData): Record<string, string | File | File[]> {
  const result: Record<string, string | File | File[]> = {};
  const entries = Array.from(formData.entries());

  // Agrupar entradas por nombre para manejar campos con múltiples valores (como arrays de archivos)
  const groupedEntries: Record<string, any[]> = {};
  
  entries.forEach(([key, value]) => {
    if (!groupedEntries[key]) {
      groupedEntries[key] = [];
    }
    groupedEntries[key].push(value);
  });

  // Procesar cada grupo
  for (const [key, values] of Object.entries(groupedEntries)) {
    // Si el nombre del campo termina con [], tratarlo como un array
    if (key.endsWith('[]')) {
      const actualKey = key.slice(0, -2);
      result[actualKey] = values;
    }
    // Si hay múltiples valores pero no es un array explícito (sin [])
    else if (values.length > 1) {
      result[key] = values;
    }
    // Caso común: un solo valor
    else {
      result[key] = values[0];
    }
  }

  return result;
}

/**
 * Valida y transforma los datos de un FormData usando un esquema Zod
 * @param formData FormData a validar
 * @param schema Esquema Zod para validación
 * @returns Datos validados y transformados según el esquema
 */
export async function validateFormData<T>(formData: FormData, schema: z.ZodSchema<T>): Promise<T> {
  const data = parseFormData(formData);
  return schema.parseAsync(data);
}
