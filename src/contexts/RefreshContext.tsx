import React, { createContext, useCallback, useState } from 'react'

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
    requestAnimationFrame(() => {
      setManual((prev) => prev + 1)
    })
    // Wait 400ms before force update to allow some time for moment to sync
    setTimeout(() => {
      setManual((prev) => prev + 1)
    }, 400)
  }, [manual])

  return (
    <RefreshContext.Provider value={{ manual, doForceRefresh }}>
      {children}
    </RefreshContext.Provider>
  )
}
