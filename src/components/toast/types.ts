export enum ToastTypes {
  SUCCESS = 'success',
  FAILURE = 'failure',
  WARNING = 'warning',
  INFO = 'info',
}

export interface ToastAction {
  text: string
  url: string
}

export interface Toast {
  id: string
  type: ToastTypes
  title: string
  message: string
  duration?: number
  action?: ToastAction
}

export interface ToastContainerProps {
  toasts: Toast[]
  stackSpacing?: number
  duration?: number
  onRemove: (id: string) => void
}

export interface ToastItemProps {
  toast: Toast
  duration: number
  style: Partial<CSSStyleDeclaration>
  onRemove: ToastContainerProps['onRemove']
}

export interface ToastContentProps {
  toast: Toast
  onRemove: ToastContainerProps['onRemove']
}
