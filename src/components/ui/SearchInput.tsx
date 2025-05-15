import { Search } from "lucide-react"
import { Input } from "./input"
import { cn } from "@/libs/utils"

interface ServiceSearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  placeholder?: string
  classname?: string
}

export const SearchInput= ({ searchQuery, setSearchQuery, placeholder = "Buscar...", classname }: ServiceSearchProps) => {
  return (
    <div className={cn(" w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between", classname )}>
      <div className="relative w-full md:w-80">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          className="w-full pl-9 "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  )
}
