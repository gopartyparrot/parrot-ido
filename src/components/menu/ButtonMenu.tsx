import React, { Children, cloneElement, ReactElement } from 'react'

export interface ButtonMenuProps {
  activeIndex?: number
  onItemClick?: (index: number) => void
  children: React.ReactElement[]
}

const ButtonMenu: React.FC<ButtonMenuProps> = ({
  activeIndex = 0,
  onItemClick,
  children,
}) => {
  return (
    <div className="flex flex-row items-center justify-center space-x-6">
      {Children.map(children, (child: ReactElement, index) => {
        return cloneElement(child, {
          isActive: activeIndex === index,
          onClick: onItemClick ? () => onItemClick(index) : undefined,
        })
      })}
    </div>
  )
}

export default ButtonMenu
