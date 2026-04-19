import { useEffect, useState } from 'react'

export function useIsMobile(breakpoint = 768) {
  const query = `(max-width: ${breakpoint}px)`
  const get = () =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia(query).matches
      : false

  const [isMobile, setIsMobile] = useState(get)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia(query)
    const onChange = (e) => setIsMobile(e.matches)
    setIsMobile(mql.matches)
    if (mql.addEventListener) mql.addEventListener('change', onChange)
    else mql.addListener(onChange)
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange)
      else mql.removeListener(onChange)
    }
  }, [query])

  return isMobile
}
