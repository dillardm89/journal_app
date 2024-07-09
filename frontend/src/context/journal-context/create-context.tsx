import { createContext } from 'react'
import type { JournalContextValue } from '../../utils/types/journal-types'


/** Create custom journal context */
export const JournalContext = createContext<JournalContextValue | null>(null)
