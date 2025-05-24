'use client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { signOut } from 'next-auth/react'
import React from 'react'
import { Button } from '../ui/button'
import { Session } from 'next-auth';
import Link from 'next/link';
import { User } from 'lucide-react';

interface Props {
    session: Session;
}

export const DropdownUserEcommerce = ({ session }: Props) => {
  return (
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden md:inline">{session.user?.name || 'Cuenta'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {session.user.role === "ADMIN" && (
              <DropdownMenuItem asChild>
                <Link href="/admin">Panel de administración</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/account">Mi cuenta</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orders">Mis pedidos</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-red-500 cursor-pointer"
            >
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
  )
}
