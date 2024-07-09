import { useContext } from 'react'
import { JournalContext } from './create-context'
import type { JournalContextValue } from '../../utils/types/journal-types'


/**
 * Custom context hook for journal related values and callback functions
 * @returns {JournalContextValue}
 */
export function useJournalContext(): JournalContextValue {
    const context = useContext(JournalContext)

    if (!context) {
        throw new Error('useJournalContext must be used within an JournalContextProvider.')
    }
    return context
}
