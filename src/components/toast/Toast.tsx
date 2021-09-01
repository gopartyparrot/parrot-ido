import React, { useCallback, useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Alert, AlertTypes } from '../alert'
import { ToastProps, ToastTypes } from './types'

const alertTypeMap = {
  [ToastTypes.INFO]: AlertTypes.INFO,
  [ToastTypes.SUCCESS]: AlertTypes.SUCCESS,
  [ToastTypes.DANGER]: AlertTypes.FAILURE,
  [ToastTypes.WARNING]: AlertTypes.WARNING,
}

const Toast: React.FC<ToastProps> = ({
  toast,
  onRemove,
  style,
  ttl,
  ...props
}) => {
  const timer = useRef<number>()
  const ref = useRef(null)
  const removeHandler = useRef(onRemove)
  const { id, title, message, type } = toast

  const handleRemove = useCallback(
    () => removeHandler.current(id),
    [id, removeHandler]
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
    }, ttl)
  }

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = window.setTimeout(() => {
      handleRemove()
    }, ttl)

    return () => {
      clearTimeout(timer.current)
    }
  }, [timer, ttl, handleRemove])

  return (
    <CSSTransition nodeRef={ref} timeout={250} style={style} {...props}>
      <div
        className="left-4 sm:left-auto right-4 fixed z-40 max-w-full sm:w-full sm:max-w-sm transition-all ease-in duration-200"
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Alert
          title={title}
          type={alertTypeMap[type]}
          onClick={handleRemove}
          message={message || ''}
        />
      </div>
    </CSSTransition>
  )
}

export default Toast
