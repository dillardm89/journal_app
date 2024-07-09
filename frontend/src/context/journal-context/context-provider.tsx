import { useState, ReactNode } from 'react'
import { JournalContext } from './create-context'


/**
 * JournalContextProviderProps
 * @typedef {object} JournalContextProviderProps
 * @property {ReactNode} children
 */
type JournalContextProviderProps = {
    children: ReactNode
}


/**
 * Component to set values and callback functions for JournalContext Provider
 * @param {object} JournalContextProviderProps
 * @returns {React.JSX.Element}
 */
export function JournalContextProvider({ children }: JournalContextProviderProps): React.JSX.Element {
    const [openEditor, setOpenEditor] = useState<boolean>(false)


    const ctxValue = {
        openEditor,
        setOpenEditor
    }


    return (
        <JournalContext.Provider value={ctxValue}>{children}</JournalContext.Provider>
    )
}
