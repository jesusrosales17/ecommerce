'use client'
import { CategoryTable } from './CategoryTable'
import { CategoryDrawer } from './CategoryDrawer'
import { useCategoryStore } from '../store/categoryStore'
import { Category } from '@prisma/client'
import { useState } from 'react'

interface Props {
  initialCategories: Category[];
}

export const CategoryPage = ({initialCategories}: Props) => {

  const {categories, setCategories} = useCategoryStore();

  useState(() => {
    setCategories(initialCategories);
  })

  return (
    <>
    <div className="flex md:justify-between gap-4 md:items-center mb-5 flex-col md:flex-row">
        <div>
          <h1 className="text-xl">Categorias</h1>
          <p className="text-sm text-gray-500">
            Administra las categorias de tu tienda
          </p>
        </div>
        <CategoryDrawer/>
      </div>

      <CategoryTable categories={categories} />
    </>
  )
}
