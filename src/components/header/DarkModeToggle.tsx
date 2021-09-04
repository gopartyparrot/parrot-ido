import { useTheme } from 'next-themes'
import React, { useCallback } from 'react'

import ModeDarkIcon from '../../../public/icons/mode-dark.svg'
import ModeLightIcon from '../../../public/icons/mode-light.svg'

export const DarkModeToggle: React.FC = () => {
  const { setTheme, theme } = useTheme()
  const handleChange = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [setTheme, theme])

  return (
    <label className="relative w-14 h-6 flex-shrink-0" htmlFor="dark-mode-btn">
      <input
        id="dark-mode-btn"
        type="checkbox"
        onChange={handleChange}
        className="opacity-0 w-0 h-0 appearance-none"
      />
      <span className="absolute top-0 left-0 right-0 bottom-0 rounded-3xl bg-tertiary">
        <span className="dark-mode-toggle bg-default rounded-full absolute top-0 left-0 p-1 bottom-0 transform transition-all duration-300 ease-in-out">
          <ModeLightIcon className="text-white fill-current dark-hidden" />
          <ModeDarkIcon className=" text-white fill-current light-hidden" />
        </span>
      </span>
    </label>
  )
}
