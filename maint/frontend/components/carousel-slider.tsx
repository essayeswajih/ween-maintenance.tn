'use client'

import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CarouselProps {
  items: React.ReactNode[]
  itemsPerView?: number
  autoplay?: boolean
  autoplayInterval?: number
}

export default function CarouselSlider({
  items,
  itemsPerView = 3,
  autoplay = false,
  autoplayInterval = 5000,
}: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 10)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)

      // Update active dot based on scroll position
      const index = Math.round(scrollLeft / clientWidth)
      setActiveIndex(index)
    }
  }

  useEffect(() => {
    checkScroll()
    const currentRef = scrollRef.current
    if (currentRef) {
      currentRef.addEventListener('scroll', checkScroll)
    }
    window.addEventListener('resize', checkScroll)
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', checkScroll)
      }
      window.removeEventListener('resize', checkScroll)
    }
  }, [items])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const scrollToItem = (index: number) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current
      scrollRef.current.scrollTo({ left: index * clientWidth, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      if (canScrollRight) {
        scroll('right')
      } else {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        }
      }
    }, autoplayInterval)

    return () => clearInterval(interval)
  }, [autoplay, autoplayInterval, canScrollRight])

  // Total "virtual" pages for dots
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current
      setTotalPages(Math.ceil(scrollWidth / clientWidth))
    }
  }, [items])

  return (
    <div className="relative w-full group/carousel">
      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 px-4 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex-none snap-center sm:snap-start w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            {item}
          </div>
        ))}
      </div>

      {/* Side Navigation Buttons - Hidden on Mobile, Hover on Desktop */}
      <div className="hidden sm:block">
        <Button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          variant="outline"
          size="icon"
          className={`absolute left-4 top-[calc(50%-1.5rem)] -translate-y-1/2 z-20 
            rounded-full bg-background/40 backdrop-blur-xl border-white/20 shadow-2xl 
            opacity-0 group-hover/carousel:opacity-100 transition-all duration-500 hover:bg-background/60 hover:scale-110 active:scale-95
            ${!canScrollLeft && 'opacity-0 pointer-events-none'}`}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-primary" />
        </Button>

        <Button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          variant="outline"
          size="icon"
          className={`absolute right-4 top-[calc(50%-1.5rem)] -translate-y-1/2 z-20 
            rounded-full bg-background/40 backdrop-blur-xl border-white/20 shadow-2xl 
            opacity-0 group-hover/carousel:opacity-100 transition-all duration-500 hover:bg-background/60 hover:scale-110 active:scale-95
            ${!canScrollRight && 'opacity-0 pointer-events-none'}`}
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-primary" />
        </Button>
      </div>

      {/* Decorative Dots Indicators - Minimalist & Elegant */}
      <div className="flex justify-center gap-3 mt-4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToItem(i)}
            className={`h-1.5 rounded-full transition-all duration-700 
              ${i === activeIndex
                ? 'w-12 bg-primary/80 shadow-[0_0_15px_rgba(var(--primary),0.2)]'
                : 'w-2 bg-muted-foreground/20 hover:bg-muted-foreground/40'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
