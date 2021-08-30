export enum ToastTypes {
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
  INFO = 'info'
}

export interface ToastAction {
  text: string;
  url: string;
}

export interface Toast {
  id: string;
  type: ToastTypes;
  title: string;
  message: string;
  action?: ToastAction;
}

export interface ToastContainerProps {
  toasts: Toast[];
  stackSpacing?: number;
  ttl?: number;
  onRemove: (id: string) => void;
}

export interface ToastProps {
  toast: Toast;
  onRemove: ToastContainerProps['onRemove'];
  ttl: number;
  style: Partial<CSSStyleDeclaration>;
}
