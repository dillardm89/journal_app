import { Outlet } from 'react-router-dom'
import { JournalContextProvider } from './context-provider'


/**
 * Layout for limiting JournalContext Provider to /expenses route
 * @returns {React.JSX.Element}
 */
export default function JournalContextLayout(): React.JSX.Element {
    return (
        <JournalContextProvider>
            <Outlet />
        </JournalContextProvider>
    )
}
