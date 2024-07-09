import Button from '../../../shared/components/elements/Button'
import Modal from '../../../shared/components/elements/Modal'
import type { JournalItemType } from '../../../utils/types/journal-types'
import '../../../../public/styles/journal/list/journal-viewer.css'


/**
 * JournalViewerProps
 * @typedef {object} JournalViewerProps
 * @property {boolean} openViewer whether to display journal viewer modal
 * @property {JournalItemType} journal JournalItemType object containing journal details
 * @property {function} onClose callback function to handle closing modal
 */
type JournalViewerProps = {
    openViewer: boolean,
    journal: JournalItemType,
    onClose: () => void
}


/**
 * Component for rending modal with journal
 * Props passed down from JournalItem
 * @param {object} JournalViewerProps
 * @returns {React.JSX.Element}
 */
export default function JournalViewer({ openViewer, journal, onClose }: JournalViewerProps): React.JSX.Element {
    const journalDate = (new Date(journal.dateCreated!)).toDateString()


    return (
        <Modal openModal={openViewer} onCloseModal={onClose} specialClass='journal-viewer-modal'>
            <div className='journal-viewer-heading'>
                <div className='journal-viewer-title'>
                    <h3>{journal.title}</h3>
                </div>
                <Button onClick={onClose} classId='close-viewer-btn' type='button'>X</Button>
            </div>

            <div className='journal-viewer-div'>
                <div className='journal-viewer-date'>
                    <p>Created:  {journalDate}</p>
                </div>

                <div className='journal-scroller'>
                    <div className='journal-viewer-content' dangerouslySetInnerHTML={{ __html: journal.content }}></div>
                </div>
            </div>
        </Modal>
    )
}
