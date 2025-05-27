"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { XCircle, Filter, FilterIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductFiltersProps {
  showSaleFilter?: boolean;
  showFeaturedFilter?: boolean;
  showPriceFilter?: boolean;
  defaultOnSale?: boolean;
  defaultFeatured?: boolean;
  defaultMinPrice?: number;
  defaultMaxPrice?: number;
  defaultSearch?: string;
}

export function ProductFilters({
  showSaleFilter = true,
  showFeaturedFilter = true,
  showPriceFilter = true,
  defaultOnSale = false,
  defaultFeatured = false,
  defaultMinPrice,
  defaultMaxPrice,
  defaultSearch
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Inicializar estados con valores de searchParams o defaults
  const [isOnSale, setIsOnSale] = useState(
    defaultOnSale || searchParams.get("onSale") === "true"
  );

  const [isFeatured, setIsFeatured] = useState(
    defaultFeatured || searchParams.get("featured") === "true"
  );

  const [minPrice, setMinPrice] = useState<number | undefined>(
    searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : defaultMinPrice
  );

  const [maxPrice, setMaxPrice] = useState<number | undefined>(
    searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : defaultMaxPrice
  );
  const updateFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove onSale param
    if (isOnSale) {
      params.set("onSale", "true");
    } else {
      params.delete("onSale");
    }

    // Update or remove featured param
    if (isFeatured) {
      params.set("featured", "true");
    } else {
      params.delete("featured");
    }

    // Update or remove price params
    if (minPrice !== undefined && minPrice > 0) {
      params.set("minPrice", minPrice.toString());
    } else {
      params.delete("minPrice");
    }

    if (maxPrice !== undefined && maxPrice > 0) {
      params.set("maxPrice", maxPrice.toString());
    } else {
      params.delete("maxPrice");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };
  const resetFilters = () => {
    setIsOnSale(defaultOnSale);
    setIsFeatured(defaultFeatured);
    setMinPrice(undefined);
    setMaxPrice(undefined);

    // Limpiar los parámetros de la URL
    const params = new URLSearchParams();

    // Mantener los valores por defecto si existen
    if (defaultOnSale) {
      params.set("onSale", "true");
    }

    if (defaultFeatured) {
      params.set("featured", "true");
    }

    if (defaultSearch) {
      params.set("search", defaultSearch);
    }


    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Verificar si hay algún filtro aplicado para mostrar el botón de reset
  const hasActiveFilters = () => {
    return (
      isOnSale !== defaultOnSale ||
      isFeatured !== defaultFeatured ||
      (minPrice !== undefined && minPrice > 0) ||
      (maxPrice !== undefined && maxPrice > 0)
    );
  };
  const isMobile = useIsMobile();
  console.log(isMobile)
  const [showFilters, setShowFilters] = useState(isMobile);

  useEffect(() => {
    setShowFilters(!isMobile);
  }, [isMobile]);
  return (
    <div className="rounded-md">
      <div className="flex items-center justify-between mb-4">
        {/* <h2 className="text-lg font-semibold">Filtros</h2> */}
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

        <div className="flex items-center justify-between mb-4">
            <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className=" flex items-center gap-4 w-full lg:hidden h-10"
            >
                <FilterIcon />
            {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            </Button>
        </div>

      <div className={`${showFilters ? "block" : "hidden"} space-y-4`}>
        {showSaleFilter && (
          <div className="flex items-center justify-between">
            <Label htmlFor="sale-filter" className="text-sm">
              Productos en oferta
            </Label>
            <Switch
              id="sale-filter"
              checked={isOnSale}
              onCheckedChange={(checked) => setIsOnSale(checked)}
            />
          </div>
        )}

        {showFeaturedFilter && (
          <div className="flex items-center justify-between">
            <Label htmlFor="featured-filter" className="text-sm">
              Productos destacados
            </Label>
            <Switch
              id="featured-filter"
              checked={isFeatured}
              onCheckedChange={(checked) => setIsFeatured(checked)}
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
                value={minPrice === undefined ? "" : minPrice}
                min={0}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? undefined : Number(e.target.value);
                  setMinPrice(value);
                }}
                className="w-full bg-white"
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice === undefined ? "" : maxPrice}
                min={minPrice || 0}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? undefined : Number(e.target.value);
                  setMaxPrice(value);
                }}
                className="w-full bg-white"
              />
            </div>
          </div>
        )}

        <Button
          onClick={updateFilters}
          className="w-full mt-4"
          variant="default"
        >
          <Filter className="h-4 w-4 mr-2" />
          Aplicar filtros
        </Button>
      </div>
    </div>
  );
}
