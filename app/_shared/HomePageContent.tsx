'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Header from '@/app/_shared/Header'
import Hero from '@/app/_shared/Hero'
import ProjectList from '@/app/_shared/ProjectList'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { ScrollArea } from '@/components/ui/scroll-area'
import GridBackgroundDemo from '@/src/components/grid-background-demo'
import { cn } from '@/lib/utils'

const SCROLL_END_THRESHOLD = 12

export default function HomePageContent() {
  const scrollRootRef = useRef<HTMLDivElement>(null)
  const [showBlur, setShowBlur] = useState(false)

  const updateBlurVisibility = useCallback(() => {
    const viewport = scrollRootRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]'
    ) as HTMLElement | null

    if (!viewport) return

    const { scrollTop, scrollHeight, clientHeight } = viewport
    const hasOverflow = scrollHeight > clientHeight + 1
    const atScrollEnd =
      scrollTop + clientHeight >= scrollHeight - SCROLL_END_THRESHOLD

    setShowBlur(hasOverflow && !atScrollEnd)
  }, [])

  useEffect(() => {
    const viewport = scrollRootRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]'
    ) as HTMLElement | null

    if (!viewport) return

    updateBlurVisibility()

    viewport.addEventListener('scroll', updateBlurVisibility, { passive: true })

    const resizeObserver = new ResizeObserver(updateBlurVisibility)
    resizeObserver.observe(viewport)

    const content = viewport.firstElementChild
    if (content) {
      resizeObserver.observe(content)
    }

    return () => {
      viewport.removeEventListener('scroll', updateBlurVisibility)
      resizeObserver.disconnect()
    }
  }, [updateBlurVisibility])

  return (
    <div ref={scrollRootRef} className="h-screen">
      <ScrollArea className="h-full">
        <div className="relative">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[50rem]">
            <GridBackgroundDemo />
          </div>
          <div className="relative z-10">
            <Header />
            <Hero />
            <ProjectList />
          </div>
        </div>
      </ScrollArea>

      <div
        aria-hidden={true}
        className={cn(
          'pointer-events-none fixed inset-x-0 bottom-0 z-20 h-[min(25vh,12rem)] transition-opacity duration-300',
          showBlur ? 'opacity-100' : 'opacity-0'
        )}
      >
        <ProgressiveBlur position="bottom" height="50%" className="h-full" />
      </div>
    </div>
  )
}
