import { useState } from 'react'
import { useResponseHandler } from '../../../hooks/response-handler/handler-hook'
import ConfirmDeleteModal from '../../../shared/components/elements/ConfirmDeleteModal'
import TagList from './TagList'
import JournalViewer from './JournalViewer'
import type { JournalItemType } from '../../../utils/types/journal-types'
import editIcon from '../../../assets/icons/edit_icon.png'
import deleteIcon from '../../../assets/icons/delete_icon.png'
import '../../../../public/styles/journal/list/journal-item.css'


/**
 * JournalItemProps
 * @typedef {object} JournalItemProps
 * @property {JournalItemType} journalInfo JournalItemType object containing information
 *                          for existing journal
 * @property {function} onEditJournal callback function to handle editing journal
 * @property {function} onDeleteJournal callback function to handle refresh list after delete
 */
type JournalItemProps = {
    journalInfo: JournalItemType,
    onEditJournal: (journalId: string) => void,
    onDeleteJournal: () => void
}


/**
 * Component for rending individual journal item in list
 * Props passed down from JournalList
 * @param {object} JournalItemProps
 * @returns {React.JSX.Element}
 */
export default function JournalItem({ journalInfo, onEditJournal, onDeleteJournal }: JournalItemProps): React.JSX.Element {
    const { deleteHandler } = useResponseHandler()

    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
    const [deleteError, setDeleteError] = useState<boolean>(false)
    const [openViewer, setOpenViewer] = useState<boolean>(false)

    const journalDate = (new Date(journalInfo.dateCreated!)).toDateString()


    /** Function to handle closing journal viewer modal */
    const handleCloseViewer = (): void => {
        document.querySelector('body')!.id = ''
        setOpenViewer(false)
    }


    /** Function to handle deleting journal */
    const handleDeleteJournal = async (): Promise<void> => {
        const handlerType = 'journal'
        const response = await deleteHandler(journalInfo.journal_id!, handlerType)
        if (response.status != 200) {
            setDeleteError(true)
        } else {
            document.querySelector('body')!.id = ''
            setOpenDeleteModal(false)
            setDeleteError(false)
            onDeleteJournal()
        }
    }


    /** Function to handle closing modal if delete action cancelled */
    const handleCancelDelete = (): void => {
        document.querySelector('body')!.id = ''
        setOpenDeleteModal(false)
    }


    return (<>
        {openDeleteModal && (
            <ConfirmDeleteModal openModal={openDeleteModal} typeString='journal'
                onCloseModal={handleCancelDelete} isError={deleteError}
                onConfirmDelete={handleDeleteJournal}
            />)}

        {openViewer && (
            <JournalViewer journal={journalInfo} openViewer={openViewer}
                onClose={handleCloseViewer} />)}

        <li className='journal-list-item'>
            <div className='journal-details-div' onClick={() => setOpenViewer(true)}>
                <div className='journal-title'>
                    <h4>{journalInfo.title}</h4>
                </div>
                <div className='journal-date'>
                    <p>{journalDate}</p>
                </div>

                {journalInfo.tags && (
                    <TagList tags={journalInfo.tags} />)}
            </div>

            <div className='journal-icons-div'>
                <img className='journal-edit-icon' src={editIcon} alt='edit icon'
                    onClick={() => onEditJournal(journalInfo.journal_id!)}
                />
                <img className='journal-delete-icon' src={deleteIcon} alt='delete icon'
                    onClick={() => setOpenDeleteModal(true)}
                />
            </div>
        </li>
    </>)
}
