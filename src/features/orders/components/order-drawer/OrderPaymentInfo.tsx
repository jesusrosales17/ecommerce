'use client';

import { formatter } from '@/utils/price';
import { Prisma } from '@prisma/client';

interface OrderPaymentInfoProps {
  total: number | bigint | string | Prisma.Decimal;
  paymentId: string | null;
  paymentStatus: string | null;
}

export const OrderPaymentInfo = ({ 
  total, 
  paymentId, 
  paymentStatus 
}: OrderPaymentInfoProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium">Información de Pago</h3>
      <div className="mt-1 space-y-1">
        <p className="text-sm text-slate-500">
          <span className="font-medium text-slate-700">Total:</span>{' '}
          {formatter.format(Number(total))}
        </p>
        <p className="text-sm text-slate-500">
          <span className="font-medium  text-slate-700">ID de Pago:</span>{' '}
          <span className='text-[9px] line-clamp-1'>

          {paymentId || 'No disponible'}
          </span>
        </p>
        <p className="text-sm text-slate-500">
          <span className="font-medium text-slate-700">Estado del Pago:</span>{' '}
          {paymentStatus || 'No disponible'}
        </p>
      </div>
    </div>
  );
};
