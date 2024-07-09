import { useState } from 'react'
import { useResponseHandler } from '../../../../hooks/response-handler/handler-hook'
import { useForm } from '../../../../hooks/form/general-form-hook'
import TagModal from './TagModal'
import ConfirmDeleteModal from '../../../../shared/components/elements/ConfirmDeleteModal'
import type { TagItemType } from '../../../../utils/types/tag-types'
import editIcon from '../../../../assets/icons/edit_icon.png'
import deleteIcon from '../../../../assets/icons/delete_icon.png'


/**
 * TagItemProps
 * @typedef {object} TagItemProps
 * @property {TagItemType} tagInfo object containing information
 *                          for existing tag
 * @property {function} onModifyTags callback function to handle modifying tags
 */
type TagItemProps = {
    tagInfo: TagItemType,
    onModifyTags: () => void
}


/**
 * Component for rending individual tag item in list
 * Props passed down from TagManager
 * @param {object} TagItemProps
 * @returns {React.JSX.Element}
 */
export default function TagItem({ tagInfo, onModifyTags }: TagItemProps): React.JSX.Element {
    const { clearFormState } = useForm()
    const { deleteHandler } = useResponseHandler()

    const [openEditModal, setOpenEditModal] = useState<boolean>(false)
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
    const [deleteError, setDeleteError] = useState<boolean>(false)


    /** Function to handle deleting tag */
    const handleDeleteTag = async (): Promise<void> => {
        const handlerType = 'tag'
        const response = await deleteHandler(tagInfo.tag_id!, handlerType)
        if (response.status != 200) {
            setDeleteError(true)
        } else {
            document.querySelector('body')!.id = ''
            setOpenDeleteModal(false)
            setDeleteError(false)
            onModifyTags()
        }
    }


    /**
     * Function to handle closing modal and updating tag data if needed
     * @param {string} type modal type either 'edit' or 'delete'
     * @param {string} action close action either 'cancel' or 'save'
    */
    const handleCloseTagModal = (type: string, action: string): void => {
        document.querySelector('body')!.id = ''
        if (type == 'delete') {
            setOpenDeleteModal(false)
        } else {
            if (action == 'save') {
                onModifyTags()
            }
            clearFormState()
            setOpenEditModal(false)
        }
    }


    return (<>
        {openEditModal && (
            <TagModal openModal={openEditModal} onCloseModal={handleCloseTagModal}
                tagInfo={tagInfo} heading='Edit tag' type='edit'
            />)}

        {openDeleteModal && (
            <ConfirmDeleteModal openModal={openDeleteModal} typeString='tag'
                onCloseModal={() => handleCloseTagModal('delete', 'cancel')}
                onConfirmDelete={handleDeleteTag} isError={deleteError}
            />)}

        <li className='manager-list-item' >
            <p className='tag-item-name'>{tagInfo.name}</p>

            <p className='tag-item-journals'>{tagInfo.taggedJournals}</p>

            <div className='manager-icons-div' id='tag'>
                <img className='manager-edit-icon' src={editIcon} alt='edit icon'
                    onClick={() => setOpenEditModal(true)}
                />
                <img className='manager-delete-icon' src={deleteIcon} alt='delete icon'
                    onClick={() => setOpenDeleteModal(true)}
                />
            </div>
        </li>
    </>)
}
