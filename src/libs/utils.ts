import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Obtiene las iniciales de un nombre.
 * Para nombres compuestos, toma la primera letra de cada palabra.
 * Si no hay nombre, devuelve "U" (Usuario).
 */
export function getInitials(name?: string | null): string {
  if (!name) return "U";
  
  return name
    .split(/\s+/)
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}
