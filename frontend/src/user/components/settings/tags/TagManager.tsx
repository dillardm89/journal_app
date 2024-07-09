import { useEffect, useState } from 'react'
import TagItem from './TagItem'
import Button from '../../../../shared/components/elements/Button'
import TagModal from './TagModal'
import type { TagItemType } from '../../../../utils/types/tag-types'
import sortIcon from '../../../../assets/icons/az-sort-icon.png'
import '../../../../../public/styles/settings/tags/tag-manager.css'


/**
 * TagManagerProps
 * @typedef {object} TagManagerProps
 * @property {TagItemType[]} tagInfo array of objects containing information
 *                          for existing tags
 * @property {function} onModifyTags callback function to handle modifying tags
 */
type TagManagerProps = {
    tagData: TagItemType[],
    onModifyTags: () => void
}


/**
 * Component for managing list of user tags
 * Props passed down from ProfileSettings
 * @param {object} TagManagerProps
 * @returns {React.JSX.Element}
 */
export default function TagManager({ tagData, onModifyTags }: TagManagerProps): React.JSX.Element {
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [sortAZOrder, setSortAZOrder] = useState<boolean>(true)
    const [noTagData, setnoTagData] = useState<boolean>(false)


    /** Function to handle sorting tags alphabetically or reverse */
    const handleSortTags = (): void => {
        setSortAZOrder((prevMode) => !prevMode)
        if (sortAZOrder) {
            tagData.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        } else {
            tagData.sort((b, a) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        }
    }


    /**
     * Function to handle closing modal and updating tag data if needed
     * @param {string} action
     */
    const handleCloseTagModal = (action: string): void => {
        document.querySelector('body')!.id = ''
        if (action == 'cancel') {
            setOpenModal(false)
        } else {
            setOpenModal(false)
            onModifyTags()
        }
    }


    useEffect(() => {
        // useEffect to display message if no tag data
        if (tagData.length == 0) {
            setnoTagData(true)
        } else {
            setnoTagData(false)
        }
    }, [tagData])


    return (<>
        {openModal && (
            <TagModal openModal={openModal} onCloseModal={handleCloseTagModal}
                heading='Add New Tag' type='add'
            />)}

        <div className='manager-heading'>
            <h2>Tag Manager</h2>

            <div className='manager-actions'>
                <Button classId='add-tag-btn' type='button' onClick={() => setOpenModal(true)}>
                    Add Tag
                </Button>

                <div className='sort-settings-div'>
                    <img src={sortIcon} alt='sort arrow icon'
                        onClick={handleSortTags}
                    />
                </div>
            </div>
        </div>

        <div className='manager-list'>
            <div className='manager-list-heading'>
                <h4 className='tag-name-heading'>Tag Name</h4>

                <h4 className='tag-journals-heading'>Tagged Journals</h4>

                <div className='manager-icons-heading' id='tag'>
                    <h4>Edit</h4>
                    <h4>/</h4>
                    <h4>Delete</h4>
                </div>
            </div>

            {noTagData && (
                <div className='no-settings-div'>
                    <p>No tags found. Click to add some.</p>
                </div>
            )}

            <div className='scroller'>
                <ul className='manager-list-ul'>
                    {tagData.map((tag, index) => (
                        <TagItem key={index} tagInfo={tag} onModifyTags={onModifyTags} />
                    ))}
                </ul>
            </div>
        </div>
    </>)
}
