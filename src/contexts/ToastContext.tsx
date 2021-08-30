import { Toast, ToastContainer, ToastTypes } from '../components/toast';
import { useToast } from '../hooks/useToast';
import React, { createContext, useCallback, useState } from 'react';

type ToastSignature = (opts: {
  message: Toast['message'];
  error?: any;
  title?: Toast['title'];
}) => void;

export interface ToastContext {
  toasts: Toast[];
  clear: () => void;
  remove: (id: string) => void;
  toastError: ToastSignature;
  toastInfo: ToastSignature;
  toastSuccess: ToastSignature;
  toastWarning: ToastSignature;
}

let globalId = 0;

export const ToastContext = createContext<ToastContext>({ toasts: [] } as any);

export const ToastProvider: React.FC = ({ children }) => {
  const [toasts, setToasts] = useState<ToastContext['toasts']>([]);

  const toast = useCallback(
    ({ title, message, type }: Omit<Toast, 'id'>) => {
      setToasts(prevToasts => {
        const id = `${new Date().valueOf()}_${globalId++}`;

        // Remove any existing toasts with the same id
        const currentToasts = prevToasts.filter(
          prevToast => prevToast.id !== id
        );

        return [
          {
            id,
            title,
            message,
            type
          },
          ...currentToasts
        ];
      });
    },
    [setToasts]
  );

  const toastError = ({ message, title, error }) => {
    let errorMessage = '';
    if (error instanceof Error) {
      errorMessage = error.message || `${error}`;
    } else if (error) {
      errorMessage = `${error}`;
    }
    return toast({
      title,
      message: `${message}\n${errorMessage}`,
      type: ToastTypes.DANGER
    });
  };
  const toastInfo = ({ message, title }) => {
    return toast({ title, message, type: ToastTypes.INFO });
  };
  const toastSuccess = ({ message, title }) => {
    return toast({ title, message, type: ToastTypes.SUCCESS });
  };
  const toastWarning = ({ message, title }) => {
    return toast({ title, message, type: ToastTypes.WARNING });
  };
  const clear = () => setToasts([]);
  const remove = (id: string) => {
    setToasts(prevToasts =>
      prevToasts.filter(prevToast => prevToast.id !== id)
    );
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        clear,
        remove,
        toastError,
        toastInfo,
        toastSuccess,
        toastWarning
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const ToastListener = () => {
  const { toasts, remove } = useToast();

  const handleRemove = (id: string) => remove(id);

  return <ToastContainer toasts={toasts} onRemove={handleRemove} />;
};
