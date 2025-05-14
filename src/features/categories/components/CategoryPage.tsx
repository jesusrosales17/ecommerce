import React from 'react'
import { CategoryTable } from './CategoryTable'
import { CategoryDrawer } from './CategoryDrawer'

export const CategoryPage = () => {
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

      <CategoryTable categories={[]} />
    </>
  )
}
