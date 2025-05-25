import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface SectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  viewAllLink?: string;
  className?: string;
  contentClassName?: string;
  viewAllText?: string;
}

export function Section({
  title,
  description,
  children,
  viewAllLink,
  className,
  contentClassName,
  viewAllText
}: SectionProps) {
  return (
    <section
      className={cn("pt-8 pb-2   md:pb-12 md:pt-5  bg-white  rounded-lg shadow mx-2", className)}
    >
      <div className="w-full">
        <div className="mb-6 p-4  flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            {description && (
              <p className="mt-1 text-muted-foreground">{description}</p>
            )}
          </div>

          {viewAllLink && (
            <Button asChild variant={"ghost"} className="hidden sm:px-4 lg:block">
              <Link href={viewAllLink}>Ver más</Link>
            </Button>
          )}
        </div>

        <div className={cn("", contentClassName)}>{children}</div>
        {viewAllLink && (
          <Button asChild variant={"ghost"} className=" sm:px-4 mt-2 lg:hidden flex justify-between items-center ">
            <Link href={viewAllLink} className="text-blue-500 ">
            {viewAllText || 'Ver más'}
              <ChevronRight /> 
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
}
