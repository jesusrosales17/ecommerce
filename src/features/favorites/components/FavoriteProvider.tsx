'use client';

import React, { useEffect } from 'react';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { useFavoriteActions } from '../hooks/useFavoriteActions';
import { usePathname } from 'next/navigation';

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const pathname = usePathname();
  const { fetchFavorites, isAuthenticated } = useFavoriteActions();

  // Fetch favorites if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  return <>{children}</>;
};
