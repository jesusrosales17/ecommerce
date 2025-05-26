import { formatDistanceToNow, format } from "date-fns";
import { es } from "date-fns/locale";

export const formatRelativeTime = (dateString: string) => {
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: es,
  });
};

export const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy HH:mm", {
    locale: es
  });
};