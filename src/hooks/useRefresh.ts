import { useContext } from 'react'

import { RefreshContext } from '../contexts/RefreshContext'

export const useRefresh = () => useContext(RefreshContext)
