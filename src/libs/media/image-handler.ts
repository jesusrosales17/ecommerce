import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Guarda una imagen del FormData en el sistema de archivos
 * @param file Objeto File del FormData
 * @param basePath Ruta base donde se guardarán las imágenes (por defecto, public/uploads/products)
 * @returns Objeto con la información de la imagen guardada
 */
export async function saveImage(
  file: File, 
  basePath: string = 'products'
): Promise<{ name: string; url: string }> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear la carpeta si no existe con la env NEXT_PUBLIC_UPLOADS_PATH
    const uploadDir = path.join(process.cwd(), process.env.NEXT_PUBLIC_UPLOADS_PATH || 'uploads', basePath);
    await fs.mkdir(uploadDir, { recursive: true });

    // Generar un nombre único para la imagen
    const fileExtension = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Guardar la imagen
    await fs.writeFile(filePath, buffer);

    // Retornar la información de la imagen
    return {
      name: fileName,
      url: `/uploads/${basePath}/${fileName}`,
    };
  } catch (error) {
    console.error('Error al guardar la imagen:', error);
    throw new Error('Error al guardar la imagen');
  }
}

/**
 * Elimina una imagen del sistema de archivos
 * @param fileName Nombre del archivo a eliminar
 * @param basePath Ruta base donde está la imagen (por defecto, public/uploads/products)
 */
export async function deleteImage(
  fileName: string,
  basePath: string = 'products'
): Promise<void> {
  try {

    const uploadDir = path.join(process.cwd(), process.env.NEXT_PUBLIC_UPLOADS_PATH || 'uploads', basePath);

    const filePath = path.join(uploadDir, fileName);
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
    throw new Error('Error al eliminar la imagen');
  }
}

/**
 * Procesa múltiples imágenes desde un FormData
 * @param formData FormData con imágenes
 * @param fieldName Nombre del campo que contiene las imágenes
 * @param basePath Ruta base donde se guardarán las imágenes
 * @returns Array con la información de las imágenes guardadas
 */
export async function processMultipleImages(
  formData: FormData,
  fieldName: string = 'images',
  basePath: string = 'products'
): Promise<{ name: string; url: string }[]> {
  const images = formData.getAll(fieldName);
  const savedImages: { name: string; url: string }[] = [];
  for (const image of images) {
    if (image instanceof File) {
      const savedImage = await saveImage(image, basePath);
      savedImages.push(savedImage);
    }
  }

  return savedImages;
}
