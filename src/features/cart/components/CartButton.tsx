import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import React from 'react'

export const CartButton = () => {
  return (
  <Button
        size="icon"
        className="rounded-md bg-gray-500 group-hover:bg-rose-600 hover:bg-rose-600 hover:-translate-y-0.5 text-white transition-all duration-300 "
      >
        <ShoppingCart className="h-4 w-4" />
      </Button>
  )
}
