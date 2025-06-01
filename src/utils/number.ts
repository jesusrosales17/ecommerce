export const formmatNumber = (value: number | string) => {
    if (typeof value === 'string') {
        value = parseFloat(value);
    }
    
    return value.toLocaleString('es-MX', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
};

// Alternative spelling for compatibility
export const formatNumber = (value: number | string) => {
    if (typeof value === 'string') {
        value = parseFloat(value);
    }
    
    return value.toLocaleString('es-MX', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
};

// Format currency function for compatibility
export const formatCurrency = (value: number | string) => {
    if (typeof value === 'string') {
        value = parseFloat(value);
    }
    
    return value.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};