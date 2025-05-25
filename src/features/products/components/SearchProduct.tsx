'use client'
import { Input } from '@/components/ui/input'
import { cn } from '@/libs/utils'
import { Search } from 'lucide-react'
import { useState } from 'react'

interface Props {
    classname?: string
}

export const SearchProduct = ({classname}: Props) => {
    const [search, setSearch] = useState<string>("");

    console.log(search)
  return (
    <form action={`/products`} className={cn(" w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between", classname )}>
      <div className="relative w-full md:w-80">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={"Buscar productos..."}
          className="w-full pl-9 "
          name='search'
          value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </form>
  )
}
