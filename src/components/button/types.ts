import { ComponentProps, ElementType, ReactElement, ReactNode } from 'react'

export const sizes = {
  MD: 'md',
  SM: 'sm',
  XS: 'xs',
} as const

export const variants = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
  TEXT: 'text',
  DANGER: 'danger',
  SUBTLE: 'subtle',
  SUCCESS: 'success',
} as const

export type Size = typeof sizes[keyof typeof sizes]
export type Variant = typeof variants[keyof typeof variants]

/**
 * @see https://www.benmvp.com/blog/polymorphic-react-components-typescript/
 */
export type AsProps<E extends ElementType = ElementType> = {
  as?: E
}

export type MergeProps<E extends ElementType> = AsProps<E> &
  Omit<ComponentProps<E>, keyof AsProps>

export type PolymorphicComponentProps<E extends ElementType, P> = P &
  MergeProps<E>

export type PolymorphicComponent<P, D extends ElementType = 'button'> = <
  E extends ElementType = D
>(
  props: PolymorphicComponentProps<E, P>
) => ReactElement | null

export interface BaseButtonProps {
  as?: 'a' | 'button'
  external?: boolean
  isLoading?: boolean
  size?: Size
  variant?: Variant
  disabled?: boolean
  startIcon?: ReactNode
  endIcon?: ReactNode
  children?: ReactNode
  block?: boolean
}

export type ButtonProps<P extends ElementType = 'button'> =
  PolymorphicComponentProps<P, BaseButtonProps>
