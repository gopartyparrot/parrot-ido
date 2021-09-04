import { useContext } from 'react'
import { IDOContext } from '../contexts/IDOContext'

export const useIDO = () => useContext(IDOContext)
