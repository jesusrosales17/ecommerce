'use client';

interface OrderAddressInfoProps {
  address: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    reference?: string | null;
  } | null | undefined;
}

export const OrderAddressInfo = ({ address }: OrderAddressInfoProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium">Dirección de Envío</h3>
      {address ? (
        <div className="mt-1 space-y-1">
          <p className="text-sm text-slate-500">
            <span className="font-medium text-slate-700">Nombre:</span>{' '}
            {address.name}
          </p>
          <p className="text-sm text-slate-500">
            <span className="font-medium text-slate-700">Dirección:</span>{' '}
            {address.street}
          </p>
          <p className="text-sm text-slate-500">
            <span className="font-medium text-slate-700">Ciudad/Estado:</span>{' '}
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p className="text-sm text-slate-500">
            <span className="font-medium text-slate-700">País:</span>{' '}
            {address.country}
          </p>
          <p className="text-sm text-slate-500">
            <span className="font-medium text-slate-700">Teléfono:</span>{' '}
            {address.phone}
          </p>
          {address.reference && (
            <p className="text-sm text-slate-500">
              <span className="font-medium text-slate-700">Referencia:</span>{' '}
              {address.reference}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-500 mt-1">No hay información de dirección disponible</p>
      )}
    </div>
  );
};
