"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

interface ProductFiltersProps {
  showSaleFilter?: boolean
  showFeaturedFilter?: boolean
  showPriceFilter?: boolean
  defaultOnSale?: boolean
  defaultFeatured?: boolean
  defaultMinPrice?: number
  defaultMaxPrice?: number
}

export function ProductFilters({
  showSaleFilter = true,
  showFeaturedFilter = true,
  showPriceFilter = true,
  defaultOnSale = false,
  defaultFeatured = false,
  defaultMinPrice = 0,
  defaultMaxPrice = 10000
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
    const [isOnSale, setIsOnSale] = useState(defaultOnSale || searchParams.get('onSale') === 'true')
  const [isFeatured, setIsFeatured] = useState(defaultFeatured || searchParams.get('featured') === 'true')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : defaultMinPrice)
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : defaultMaxPrice)
  
  // Debounce function to prevent too many router changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateFilters()
    }, 500)
    
    return () => clearTimeout(timeout)
  }, [isOnSale, isFeatured, minPrice, maxPrice])
  
  const updateFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Update or remove onSale param
    if (isOnSale) {
      params.set('onSale', 'true')
    } else {
      params.delete('onSale')
    }
      // Update or remove featured param
    if (isFeatured) {
      params.set('featured', 'true')
    } else {
      params.delete('featured')
    }
    
    // Update or remove price params
    if (minPrice !== defaultMinPrice) {
      params.set('minPrice', minPrice.toString())
    } else {
      params.delete('minPrice')
    }
    
    if (maxPrice !== defaultMaxPrice) {
      params.set('maxPrice', maxPrice.toString())
    } else {
      params.delete('maxPrice')
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }
    const resetFilters = () => {
    setIsOnSale(defaultOnSale)
    setIsFeatured(defaultFeatured)
    setMinPrice(defaultMinPrice)
    setMaxPrice(defaultMaxPrice)
    
    // Limpiar los parámetros de la URL
    const params = new URLSearchParams()
    
    // Mantener los valores por defecto si existen
    if (defaultOnSale) {
      params.set('onSale', 'true')
    }
    
    if (defaultFeatured) {
      params.set('featured', 'true')
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }
  
  // Verificar si hay algún filtro aplicado para mostrar el botón de reset
  const hasActiveFilters = () => {
    return (
      (isOnSale !== defaultOnSale) || 
      (isFeatured !== defaultFeatured) || 
      (minPrice !== defaultMinPrice) ||
      (maxPrice !== defaultMaxPrice)
    )
  }

  return (
    <div className="space-y-4   rounded-md ">
      <div className="flex items-center justify-between">
        {hasActiveFilters() && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="text-xs flex items-center gap-1 h-7"
          >
            <XCircle className="h-4 w-4" /> 
            Limpiar filtros
          </Button>
        )}
      </div>
      
      {showSaleFilter && (
        <div className="flex items-center justify-between">
          <Label htmlFor="sale-filter" className="text-sm">Productos en oferta</Label>
          <Switch 
            id="sale-filter" 
            checked={isOnSale}
            onCheckedChange={setIsOnSale}
          />
        </div>
      )}
      
      {showFeaturedFilter && (
        <div className="flex items-center justify-between">
          <Label htmlFor="featured-filter" className="text-sm">Productos destacados</Label>
          <Switch 
            id="featured-filter" 
            checked={isFeatured}
            onCheckedChange={setIsFeatured}
          />
        </div>
      )}
      
      {showPriceFilter && (
        <div className="space-y-3">
          <Label className="text-sm">Rango de precio</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              min={0}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full bg-white"
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              min={minPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full bg-white"
            />
          </div>
        </div>
      )}
    </div>
  )
}
