"use client";

import { toast } from "sonner";
import { NotificationAdapter } from "./notificationAdapter";

/**
 * Implementación del adaptador de notificaciones usando Sonner
 */
export const sonnerNotificationAdapter: NotificationAdapter = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) => toast.info(message),
  warning: (message) => toast.warning(message),
};