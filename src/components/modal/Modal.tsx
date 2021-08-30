import { Dialog } from '@headlessui/react';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  minHeight?: number | false;
  maxHeight?: number;
  initialFocusRef?: React.RefObject<unknown>;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen = false,
  onDismiss,
  children
}) => {
  console.log('isOpen', isOpen);

  return (
    <Dialog
      open={isOpen}
      onClose={() => onDismiss()}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative bg-white text-black w-full max-w-sm mx-auto rounded-3xl p-6">
          {children}
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
