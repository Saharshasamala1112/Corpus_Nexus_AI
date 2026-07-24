import { useCallback, useRef, useEffect } from 'react'

interface UseAutoScrollOptions {
  threshold?: number
  behavior?: ScrollBehavior
}

export function useAutoScroll(options: UseAutoScrollOptions = {}) {
  const { threshold = 100, behavior = 'smooth' } = options
  const scrollRef = useRef<HTMLDivElement>(null)
  const isAutoScrollingRef = useRef(true)

  const isNearBottom = useCallback(() => {
    const el = scrollRef.current
    if (!el) return true
    return el.scrollHeight - el.scrollTop - el.clientHeight < threshold
  }, [threshold])

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({
      top: el.scrollHeight,
      behavior,
    })
  }, [behavior])

  const handleScroll = useCallback(() => {
    isAutoScrollingRef.current = isNearBottom()
  }, [isNearBottom])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const scrollIfAutoScrolling = useCallback(() => {
    if (isAutoScrollingRef.current) {
      scrollToBottom()
    }
  }, [scrollToBottom])

  return {
    scrollRef,
    scrollToBottom,
    scrollIfAutoScrolling,
    isAutoScrolling: isAutoScrollingRef,
  }
}
