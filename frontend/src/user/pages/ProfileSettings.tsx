import { useEffect, useState } from 'react'
import { useManageTag } from '../../hooks/dashboard/tag-hook'
import TagManager from '../components/settings/tags/TagManager'
import { type TagItemType } from '../../utils/types/tag-types'
import '../../../public/styles/settings/settings.css'
import '../../../public/styles/settings/shared/settings-manager.css'


/**
 * Page for user settings / profile
 * @returns {React.JSX.Element}
 */
export default function ProfileSettings(): React.JSX.Element {
    const { loadTagData } = useManageTag()

    const [tagData, setTagData] = useState<TagItemType[]>([])
    const [needLoadTagData, setNeedLoadTagData] = useState<boolean>(true)
    const [noTagData, setNoTagData] = useState<boolean>(false)


    useEffect(() => {
        // useEffect to load user tag data from API
        const getTagData = async (): Promise<void> => {
            const response = await loadTagData()
            if (response.length == 0) {
                setNoTagData(true)
                setTagData([])
            } else {
                setNoTagData(false)
                setTagData(response)
            }
        }
        if (needLoadTagData) {
            getTagData()
            setNeedLoadTagData(false)
        }
    }, [loadTagData, needLoadTagData])


    return (<>
        <div className='settings-div' id={noTagData ? 'not-found' : 'exist'}>
            <div className='manager-container'>
                <TagManager onModifyTags={() => setNeedLoadTagData(true)} tagData={tagData} />
            </div>
        </div>
    </>)
}
