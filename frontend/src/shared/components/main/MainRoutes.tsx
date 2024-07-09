import { Navigate, Routes, Route } from 'react-router-dom'
import MainLayout from './MainLayout'
import ProfileSettings from '../../../user/pages/ProfileSettings'
import Journal from '../../../journal/pages/Journal'
import JournalContextLayout from '../../../context/journal-context/journal-layout'


/**
 * Component for handling route navigation
 * @returns {React.JSX.Element}
 */
export default function MainRoutes(): React.JSX.Element {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path='/' element={<JournalContextLayout />}>
                    <Route index element={<Journal />} /></Route>

                <Route path='/settings' element={<ProfileSettings />} />

                <Route path='/*' element={<Navigate to='/' replace />} />
            </Route>
        </Routes>
    )
}
