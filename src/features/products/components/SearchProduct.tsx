'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/libs/utils'
import { Search, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface Props {
    classname?: string
    compact?: boolean
}

export const SearchProduct = ({classname, compact = false}: Props) => {
    const [search, setSearch] = useState<string>("");
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Cuando se abre el campo de búsqueda en móvil, enfócalo
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    const searchForm = (
        <form action="/products" method="get" className={cn("w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between", classname)}>
            <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    ref={compact ? searchInputRef : undefined}
                    type="search"
                    placeholder={"Buscar productos..."}
                    className="w-full pl-9"
                    name="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" hidden>Buscar</button>
            </div>
        </form>
    );

    if (compact) {
        return (
            <>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                    {isSearchOpen ? (
                        <X className="h-5 w-5 text-muted-foreground" />
                    ) : (
                        <Search className="h-5 w-5 text-muted-foreground" />
                    )}
                </Button>
                
                {/* Búsqueda desplegable para móvil */}
                {isSearchOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white p-4 shadow-md z-50 border-t">
                        {searchForm}
                    </div>
                )}
            </>
        );
    }

    return searchForm;
}
