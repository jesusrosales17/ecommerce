"use client";

import { Category } from '@prisma/client';
import { useEffect, useState } from 'react';

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    
    const fetchCategories = async () => {
        try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
        } catch (error) {
        console.error('Error fetching categories:', error);
        }
    };
    
    useEffect(() => {
        fetchCategories();
    }, []);
    
    return { categories, fetchCategories };
}
