'use client';

interface OrderDateInfoProps {
  createdAt: Date | string;
  updatedAt: Date | string;
}

export const OrderDateInfo = ({ createdAt, updatedAt }: OrderDateInfoProps) => {
  return (
    <>
      <div>
        <h3 className="text-lg font-medium">Fecha de Pedido</h3>
        <p className="mt-1 text-sm text-slate-500">
          {new Date(createdAt).toLocaleDateString('es-MX', {
            dateStyle: 'full',
          })}
        </p>
        <p className="text-sm text-slate-500">
          {new Date(createdAt).toLocaleTimeString('es-MX')}
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-medium">Última Actualización</h3>
        <p className="mt-1 text-sm text-slate-500">
          {new Date(updatedAt).toLocaleDateString('es-MX', {
            dateStyle: 'full',
          })}
        </p>
      </div>
    </>
  );
};
