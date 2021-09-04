import { useCallback, useContext } from 'react'

import { ModalContext } from '../contexts/ModalContext'

type Handler = () => void

const useModal = (modal: React.ReactNode): [Handler, Handler] => {
  const { onPresent, onDismiss } = useContext(ModalContext)
  const onPresentCallback = useCallback(() => {
    onPresent(modal)
  }, [modal, onPresent])

  return [onPresentCallback, onDismiss]
}

export default useModal
