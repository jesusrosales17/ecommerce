"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/libs/utils"
import { Button } from "@/components/ui/button"

interface Slide {
  id: string
  imageUrl: string
  title: string
  description: string
  ctaText: string
  ctaLink: string
}

const demoSlides: Slide[] = [
  {
    id: "1",
    imageUrl: "/images/slider/slide-1.jpg",
    title: "Descubre las últimas tendencias",
    description: "Todo lo que necesitas para renovar tu estilo en una sola tienda",
    ctaText: "Ver novedades",
    ctaLink: "/category/novedades",
  },
  {
    id: "2",
    imageUrl: "/images/slider/slide-2.jpg",
    title: "Ofertas exclusivas",
    description: "¡Hasta un 50% de descuento en productos seleccionados!",
    ctaText: "Ver ofertas",
    ctaLink: "/descuentos",
  },
  {
    id: "3",
    imageUrl: "/images/slider/slide-3.jpg",
    title: "Lo más vendido",
    description: "Descubre por qué nuestros productos son los favoritos",
    ctaText: "Ver top ventas",
    ctaLink: "/destacados",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === demoSlides.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === demoSlides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? demoSlides.length - 1 : prev - 1))
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      {/* Main carousel container with images */}
      <div className="relative h-[400px] md:h-[500px] w-full">
        {demoSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            {/* Background image - can be replaced with actual product images later */}
            <div className="absolute inset-0 bg-black/40 z-10" />
            
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover"
            />

            {/* Content overlay */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-start p-6 md:p-12 lg:p-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{slide.title}</h2>
              <p className="text-white text-lg md:text-xl mb-8 max-w-md">{slide.description}</p>
              <Button asChild size="lg">
                <Link href={slide.ctaLink}>{slide.ctaText}</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel controls */}
      <div className="absolute bottom-4 right-4 z-30 flex space-x-2">
        <Button size="icon" variant="outline" className="bg-white/50 h-9 w-9 rounded-full" onClick={prevSlide}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Anterior</span>
        </Button>
        <Button size="icon" variant="outline" className="bg-white/50 h-9 w-9 rounded-full" onClick={nextSlide}>
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">Siguiente</span>
        </Button>
      </div>

      {/* Indicator buttons */}
      <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center space-x-2">
        {demoSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all",
              index === currentSlide
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
