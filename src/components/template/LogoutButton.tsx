'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import React from 'react';

export const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex items-center gap-2 text-sm font-medium text-red-500 px-2 py-2 rounded-md transition-colors hover:bg-accent w-full text-left"
    >
      <LogOut className="h-4 w-4" />
      <span>Cerrar sesión</span>
    </button>
  );
};

export default LogoutButton;
