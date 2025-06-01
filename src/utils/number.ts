export const formmatNumber = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined) {
        return '0';
    }
    
    if (typeof value === 'string') {
        value = parseFloat(value);
        if (isNaN(value)) {
            return '0';
        }
    }
    
    return value.toLocaleString('es-MX', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
};

// Alternative spelling for compatibility
export const formatNumber = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined) {
        return '0';
    }
    
    if (typeof value === 'string') {
        value = parseFloat(value);
        if (isNaN(value)) {
            return '0';
        }
    }
    
    return value.toLocaleString('es-MX', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
};

// Format currency function for compatibility
export const formatCurrency = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined) {
        return '$0.00';
    }
    
    if (typeof value === 'string') {
        value = parseFloat(value);
        if (isNaN(value)) {
            return '$0.00';
        }
    }
    
    return value.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};