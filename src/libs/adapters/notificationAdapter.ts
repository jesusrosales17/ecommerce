/**
 * Interfaz para adaptador de notificaciones
 * Define los métodos que cualquier proveedor de notificaciones debe implementar
 */
export interface NotificationAdapter {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}