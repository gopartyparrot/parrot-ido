import classNames from 'classnames'
import React from 'react'

type ButtonRadiusProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  isSecondary?: boolean
}

const ButtonRadius: React.FC<ButtonRadiusProps> = ({
  className = '',
  children,
  isSecondary,
  ...rest
}) => {
  return (
    <button
      className={classNames(
        'font-mono h-7 w-7 rounded-full outline-none ring-opacity-75 text-white text-lg focus:outline-none custom-button-active-effect',
        {
          'bg-brandPrimary hover:bg-brandPrimaryHover': !isSecondary,
          'bg-brandSecondary hover:bg-brandSecondaryHover': isSecondary,
          'bg-disabled hover:bg-disabled active:shadow-none cursor-not-allowed remove-active-effect':
            rest.disabled,
          'text-disabled': rest.disabled,
        },
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export default ButtonRadius
