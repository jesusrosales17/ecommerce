
export  const formattedPrice = (price: string | number) => {
    return Number(price).toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN'
    });
  };