import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/solid'
import React, { Fragment } from 'react'

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  initialFocusRef?: React.RefObject<unknown>
  children?: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({
  isOpen = false,
  onDismiss,
  children,
}) => {
  return (
    // <Transition  as={Fragment}>
    <Dialog
      open={isOpen}
      onClose={onDismiss}
      className="fixed z-40 inset-0 overflow-y-auto"
    >
      {/* <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        > */}
      <Dialog.Overlay className="fixed inset-0 bg-overlay" />
      {/* </Transition.Child> */}
      <div className="min-h-full flex items-center max-w-sm w-full mx-auto">
        <div className="relative bg-default rounded-3xl w-full p-4 sm:p-6">
          <div className="absolute -right-3 -top-3.5">
            <button
              onClick={onDismiss}
              className="bg-brandPrimary p-1 text-white rounded-full inline-flex outline-none focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </Dialog>
    // </Transition>
  )
}

export default Modal
