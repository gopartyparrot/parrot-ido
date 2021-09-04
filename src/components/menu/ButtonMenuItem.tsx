import classNames from 'classnames'
import React from 'react'
import { variants } from '../button/types'

import { ButtonMenuItemProps } from './types'

const ButtonMenuItem: React.FC<ButtonMenuItemProps> = ({
  isActive = false,
  variant = variants.PRIMARY,
  children,
  ...props
}: ButtonMenuItemProps) => {
  return (
    <button
      className={classNames(
        'px-2 py-1 pb-0 outline-none focus:outline-none text-mdx',
        `btn-${variant}`,
        {
          'text-tertiary': !isActive,
          'text-brandPrimary': isActive,
          'font-bold': isActive,
          'text-disabled': props.disabled,
          'cursor-not-allowed': props.disabled,
        }
      )}
      {...props}
    >
      {children}
      <div
        className={classNames('rounded-full h-1 -mx-2 mt-1', {
          'bg-brandPrimary': isActive,
          'bg-transparent': !isActive,
        })}
      />
    </button>
  )
}

export default ButtonMenuItem
