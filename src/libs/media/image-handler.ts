import { promises as fs } from 'fs';
import path from 'path';
import {File} from 'node:buffer';
import { v4 as uuidv4 } from 'uuid';

/**
 * Guarda una imagen del FormData en el sistema de archivos
 * @param file Objeto File del FormData
 * @param basePath Ruta base donde se guardarán las imágenes (por defecto, public/uploads/products)
 * @returns Objeto con la información de la imagen guardada
 */
export async function saveImage(
  buffer: Buffer,
  originalName: string,
  basePath: string = 'products'
): Promise<{ name: string; url: string }> {
  try {
    const uploadDir = path.join(process.cwd(), process.env.NEXT_PUBLIC_UPLOADS_PATH || 'uploads', basePath);
    await fs.mkdir(uploadDir, { recursive: true });

    const fileExtension = path.extname(originalName);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

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
): Promise<{ name: string; url: string; isPrincipal?: boolean }[]> {
  const images = formData.getAll(fieldName);
  const principalImageIndex = formData.get('principalImageIndex');
  const savedImages: { name: string; url: string; isPrincipal?: boolean }[] = [];
  
  // Convertir el índice de la imagen principal a número
  const principalIndex = principalImageIndex ? parseInt(principalImageIndex.toString(), 10) : -1;
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    if (image instanceof File) {
      const savedImage = await saveImage(image, basePath);
      // Marcar la imagen como principal si su índice coincide con el principalImageIndex
      savedImages.push({
        ...savedImage,
        isPrincipal: i === principalIndex
      });
    }
  }

  return savedImages;
}
