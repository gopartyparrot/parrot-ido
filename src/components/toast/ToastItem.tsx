import React, { useCallback, useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import ToastContent from './ToastContent'
import { ToastItemProps } from './types'

const ToastItem: React.FC<ToastItemProps> = ({
  toast,
  duration,
  style,
  onRemove,
  ...props
}) => {
  const timer = useRef<number>()
  const ref = useRef(null)
  const removeHandler = useRef(onRemove)

  const handleRemove = useCallback(
    () => removeHandler.current(toast.id),
    [toast.id, removeHandler]
  )

  const handleMouseEnter = () => {
    clearTimeout(timer.current)
  }

  const handleMouseLeave = () => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = window.setTimeout(() => {
      handleRemove()
    }, duration)
  }

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = window.setTimeout(() => {
      handleRemove()
    }, duration)

    return () => {
      clearTimeout(timer.current)
    }
  }, [timer, duration, handleRemove])

  return (
    <CSSTransition nodeRef={ref} timeout={250} style={style} {...props}>
      <div
        className="left-4 sm:left-auto right-4 fixed z-50 max-w-full sm:w-full sm:max-w-sm transition-all ease-in duration-200"
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ToastContent toast={toast} onRemove={handleRemove} />
      </div>
    </CSSTransition>
  )
}

export default ToastItem
