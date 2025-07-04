"use client"

import { useState, useEffect} from "react"
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
    imageUrl: "/images/slider/categorias.png",
    title: "Gran variedad de categorías",
    description: "Descubre lo último en tecnología, moda y más",
    ctaText: "Ver categorías",
    ctaLink: "/categories",
  },
  {
    id: "2",
    imageUrl: "/images/slider/ofertas.png",
    title: "Ofertas exclusivas",
    description: "¡Gran variedad de ofetas en los productos!",
    ctaText: "Ver ofertas",
    ctaLink: "/sales",
  },
  {
    id: "3",
    imageUrl: "/images/slider/productos.jpg",
    title: "Productos destacados",
    description: "Encuentra los productos destacados de la tienda",
    ctaText: "Ver top ventas",
    ctaLink: "/featured",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [autoplayPaused, setAutoplayPaused] = useState(false)

  // Auto slide functionality
  useEffect(() => {
    if (autoplayPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === demoSlides.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplayPaused])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === demoSlides.length - 1 ? 0 : prev + 1))
    setAutoplayPaused(true)
    // Resume autoplay after 4 seconds of inactivity
    setTimeout(() => setAutoplayPaused(false), 4000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? demoSlides.length - 1 : prev - 1))
    setAutoplayPaused(true)
    // Resume autoplay after 4 seconds of inactivity
    setTimeout(() => setAutoplayPaused(false), 4000)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    setIsDragging(true)
    setAutoplayPaused(true)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStartX(e.clientX)
    setIsDragging(true)
    setAutoplayPaused(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    setTouchEndX(e.touches[0].clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setTouchEndX(e.clientX)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    
    const deltaX = touchEndX - touchStartX
    const minSwipeDistance = 50 // Mínimo para considerar un swipe válido
    
    if (deltaX > minSwipeDistance) {
      prevSlide()
    } else if (deltaX < -minSwipeDistance) {
      nextSlide() 
    }

    setIsDragging(false)
    // Resume autoplay after 4 seconds
    setTimeout(() => setAutoplayPaused(false), 4000)
  }

  const handleMouseUp = () => {
    handleTouchEnd()
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      handleTouchEnd()
    }
  }
  return (
    <div
      className="relative h-[calc(100dvh-65px)] 2xl:h-[calc(75dvh)]  overflow-hidden "
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main carousel container with images */}
      <div className={`relative h-full w-full `}>
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
