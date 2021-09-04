import React, { createContext, useCallback, useEffect, useState } from 'react'

const FAST_INTERVAL = 10000
const SLOW_INTERVAL = 60000

interface RefreshContext {
  manual: number
  doForceRefresh: () => void
}

export const RefreshContext = createContext<RefreshContext>({
  manual: 0,
  doForceRefresh: () => null,
})

export const RefreshProvider = ({ children }) => {
  const [manual, setManual] = useState(0)

  const doForceRefresh = useCallback(() => {
    setManual((prev) => prev + 1)
  }, [manual])

  return (
    <RefreshContext.Provider value={{ manual, doForceRefresh }}>
      {children}
    </RefreshContext.Provider>
  )
}
