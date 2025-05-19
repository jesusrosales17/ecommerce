import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";

interface SectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  viewAllLink?: string;
  className?: string;
  contentClassName?: string;
}

export function Section({
  title,
  description,
  children,
  viewAllLink,
  className,
  contentClassName,
}: SectionProps) {
  return (
    <section className={cn("py-8 md:py-12 bg-white p-4 rounded-lg shadow", className)}>
      <div className="container">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="mb-4 sm:mb-0">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            {description && (
              <p className="mt-1 text-muted-foreground">{description}</p>
            )}
          </div>
          
          {viewAllLink && (
            <Button asChild variant="link" className="px-0 sm:px-4">
              <Link href={viewAllLink}>Ver todo</Link>
            </Button>
          )}
        </div>
        
        <div className={cn("", contentClassName)}>
          {children}
        </div>
      </div>
    </section>
  );
}
