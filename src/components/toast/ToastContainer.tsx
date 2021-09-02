import React from 'react'
import { TransitionGroup } from 'react-transition-group'

import ToastItem from './ToastItem'
import { ToastContainerProps } from './types'

const Z_INDEX = 1000
const TOP_POSITION = 80 // Initial position from the top

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
  duration = 6000,
  stackSpacing = 48,
}) => {
  return (
    <div className="toast-container">
      <TransitionGroup>
        {toasts.map((toast, index) => {
          const zIndex = (Z_INDEX - index).toString()
          const top = TOP_POSITION + index * stackSpacing
          return (
            <ToastItem
              key={toast.id}
              toast={toast}
              onRemove={onRemove}
              duration={toast.duration || duration}
              style={{ top: `${top}px`, zIndex }}
            />
          )
        })}
      </TransitionGroup>
    </div>
  )
}

export default ToastContainer
