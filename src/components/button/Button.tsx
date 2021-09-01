import classNames from 'classnames'
import { Spinner } from '../spinner'
import React, { cloneElement, ElementType, isValidElement } from 'react'

import { ButtonProps, sizes, variants } from './types'

const Button = <E extends ElementType = 'button'>(
  props: ButtonProps<E>
): JSX.Element => {
  const {
    startIcon,
    endIcon,
    className,
    variant = variants.PRIMARY,
    size = sizes.MD,
    isLoading = false,
    disabled = false,
    children,
    block = false,
    ...rest
  } = props
  const isDisabled = isLoading || disabled

  return (
    <button
      disabled={isDisabled}
      className={classNames(
        'font-bold px-4 outline-none ring-opacity-75 text-white focus:outline-none custom-button-active-effect',
        {
          'w-full': block,
          'py-2': size !== sizes.XS,
          'py-1': size === sizes.XS,
          'h-7': size === sizes.XS,
          'h-9': size === sizes.SM,
          'h-16': size === sizes.MD,
          'text-base': size === sizes.XS,
          'text-sm': size === sizes.SM,
          'text-lg': size === sizes.MD,
          'rounded-xl': size === sizes.MD,
          rounded: size === sizes.XS,
          'rounded-lg': size === sizes.SM,
          'bg-brandPrimary hover:bg-brandPrimaryHover':
            variant === variants.PRIMARY,
          'bg-brandSecondary hover:bg-brandSecondaryHover':
            variant === variants.SECONDARY,
          'bg-failure hover:bg-failureHover': variant === variants.DANGER,
          'bg-disabled hover:bg-disabled active:shadow-none cursor-now-allowed remove-active-effect':
            isDisabled,
          'text-disabled': isDisabled,
        },
        className
      )}
      {...rest}
    >
      <>
        {isLoading && <Spinner className="mr-2" />}
        {isValidElement(startIcon) && cloneElement(startIcon)}
        {children}
        {isValidElement(endIcon) && cloneElement(endIcon)}
      </>
    </button>
  )
}

export default Button
