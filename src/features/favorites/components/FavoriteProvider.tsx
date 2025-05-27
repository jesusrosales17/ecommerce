'use client';

import React, { useEffect } from 'react';
import { useFavoriteActions } from '../hooks/useFavoriteActions';

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { fetchFavorites, isAuthenticated } = useFavoriteActions();

  // Fetch favorites if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
    
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return <>{children}</>;
};
