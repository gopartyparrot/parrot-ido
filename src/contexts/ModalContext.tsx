import React, { createContext, useState } from 'react'
import { Modal } from '../components/modal'

interface ModalContext {
  onPresent: (node: React.ReactNode, key?: string) => void
  onDismiss: () => void
  setBlocking: (block: boolean) => void
}

export const ModalContext = createContext<ModalContext>({
  onPresent: () => null,
  onDismiss: () => null,
  setBlocking: () => null,
})

export const ModalProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [modalNode, setModalNode] = useState<React.ReactNode>()
  const [isBlocking, setBlocking] = useState(false)

  const handlePresent = (node: React.ReactNode) => {
    setModalNode(node)
    setBlocking(false)
    setIsOpen(true)
  }

  const handleDismiss = () => {
    if (!isBlocking) {
      setModalNode(undefined)
      setIsOpen(false)
    }
  }

  const handleRequestDismiss = () => {
    setModalNode(undefined)
    setBlocking(false)
    setIsOpen(false)
  }

  return (
    <ModalContext.Provider
      value={{
        onPresent: handlePresent,
        onDismiss: handleDismiss,
        setBlocking,
      }}
    >
      <Modal isOpen={isOpen} onDismiss={handleDismiss}>
        {React.isValidElement(modalNode) &&
          React.cloneElement(modalNode, {
            onRequestDismiss: handleRequestDismiss,
          })}
      </Modal>
      {children}
    </ModalContext.Provider>
  )
}
