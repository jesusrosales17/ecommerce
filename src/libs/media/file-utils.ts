import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { mkdir, writeFile } from "fs/promises";

// Define base uploads path
export const uploadsBasePath = process.env.NEXT_PUBLIC_UPLOADS_PATH || path.join(process.cwd(), "uploads");

/**
 * Saves a file from FormData to disk
 * 
 * @param file - File from FormData
 * @param folder - Subfolder inside uploads directory (e.g. "products", "categories")
 * @returns filename - The name of the saved file
 */
export async function saveFile(file: File, folder: string): Promise<string> {
  try {
    // Get file extension
    const originalName = file.name;
    const extension = originalName.split('.').pop()?.toLowerCase();

    if (!extension) {
      throw new Error("Invalid file extension");
    }

    // Generate a unique filename
    const filename = `${uuidv4()}.${extension}`;
    
    // Create full directory path
    const folderPath = path.join(uploadsBasePath, folder);
    
    // Create directory if it doesn't exist
    await mkdir(folderPath, { recursive: true });
    
    // Create full file path
    const filePath = path.join(folderPath, filename);
    
    // Convert the file to a buffer and save it
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, fileBuffer);
    
    return filename;
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
}

/**
 * Deletes a file from disk
 * 
 * @param filename - Name of the file to delete
 * @param folder - Subfolder inside uploads directory (e.g. "products", "categories")
 */
export async function deleteFile(filename: string, folder: string): Promise<void> {
  try {
    const filePath = path.join(uploadsBasePath, folder, filename);
    
    // Check if file exists before attempting to delete
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}
