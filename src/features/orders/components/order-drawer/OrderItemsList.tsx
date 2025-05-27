'use client';

import { formatter } from '@/utils/price';
import { Prisma } from '@prisma/client';
import Link from 'next/link';

interface OrderItemsListProps {
  items?: Array<{
    id: string;
    name: string;
    price: number | bigint | string | Prisma.Decimal;
    quantity: number;
    Product?: {
      id?: string;
      name?: string;
      images?: Array<{
        id: string;
        name: string;
        isPrincipal?: boolean | null;
      }>;
    };
  }>;
}

export const OrderItemsList = ({ items = [] }: OrderItemsListProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium">Productos del Pedido</h3>
      <div className="mt-3 space-y-3">
        {items && items.length > 0 ? (
          items.map((item) => (
            <Link  href={`/products/${item.Product?.id}`} key={item.id} className="bg-slate-50 p-3 rounded-md border block">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-slate-500">Cantidad: {item.quantity}</p>
                    {item.Product?.images && item.Product.images.length > 0 && (
                    <div className="mt-2">
                      <img 
                        src={`/api/uploads/products/${item.Product.images[0].name}`} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatter.format(Number(item.price))}
                  </p>
                  <p className="text-sm text-slate-500">
                    Total: {formatter.format(Number(item.price) * item.quantity)}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-slate-500 mt-1">No hay productos en este pedido</p>
        )}
      </div>
    </div>
  );
};
