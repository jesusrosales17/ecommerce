export const formmatNumber = (value: number | string) => {
    if (typeof value === 'string') {
        value = parseFloat(value);
    }
    
    return value.toLocaleString('es-MX', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
    }