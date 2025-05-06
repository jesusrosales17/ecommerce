'use client';

import { signOut } from 'next-auth/react';

interface Props {
  className?: string;
  children?: React.ReactNode;

}

export const SignOutButton= ({className, children}: Props) => {
  return (
    <button className={`${className}`} type="button" onClick={() => signOut()}>
      {children}
    </button>
  )
}
