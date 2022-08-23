import React, { createContext, useState, useEffect, useMemo } from "react"

import { desktop, tablet, mobile } from "styles/media"
import { addDebouncedEventListener, isBrowser } from "utils/functions"

/**
 * Gives easy access to media queries
 */
export const ScreenContext = createContext({
  fullWidth: false,
  desktop: false,
  tablet: false,
  mobile: false,
})

type Props = {
  children: React.ReactNode
}

export function ScreenProvider({ children }: Props) {
  const [fw, setFw] = useState<boolean>(false)
  const [d, setD] = useState<boolean>(false)
  const [t, setT] = useState<boolean>(false)
  const [m, setM] = useState<boolean>(false)

  useEffect(() => {
    if (isBrowser()) {
      const setScreenContext = () => {
        setM(window.innerWidth <= mobile)
        setT(window.innerWidth > mobile && window.innerWidth <= tablet)
        setD(window.innerWidth > tablet && window.innerWidth <= desktop)
        setFw(window.innerWidth > desktop)
      }

      setScreenContext()

      const removeListener = addDebouncedEventListener(
        window,
        "resize",
        setScreenContext,
        100
      )

      return removeListener
    }
  }, [])

  const screenValue = useMemo(() => {
    return { fullWidth: fw, desktop: d, tablet: t, mobile: m }
  }, [d, fw, t, m])

  return (
    <ScreenContext.Provider value={screenValue}>
      {children}
    </ScreenContext.Provider>
  )
}
