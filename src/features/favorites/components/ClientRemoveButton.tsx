'use client';

import { FavoriteRemoveButton } from './FavoriteRemoveButton';

interface ClientRemoveButtonProps {
  productId: string;
}

// Este componente client-side se encarga únicamente de la acción de eliminar
export const ClientRemoveButton = ({ productId }: ClientRemoveButtonProps) => {
  return <FavoriteRemoveButton productId={productId} />;
};
