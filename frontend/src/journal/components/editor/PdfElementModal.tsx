import { useState } from 'react'
import { useManageJournal } from '../../../hooks/journal/journal-hook'
import Modal from '../../../shared/components/elements/Modal'
import Button from '../../../shared/components/elements/Button'
import { avoidCharacters } from '../../../utils/user/avoid-characters'
import type { HandlerResponse } from '../../../utils/types/shared-types'
import '../../../../public/styles/journal/editor/journal-preview.css'


/**
 * PdfElementModalProps
 * @typedef {object} PdfElementModalProps
 * @property {boolean} openModal determines whether to display modal
 * @property {string} pdfString string of serialized html elements from text editor
 * @property {string} journalTitle string with journal title
 * @property {function} onCloseModal callback function to handle closing modal
 */
type PdfElementModalProps = {
    openModal: boolean,
    pdfString: string,
    journalTitle: string,
    onCloseModal: () => void
}


/**
 * Component for modal to view journal rendering before exporting to pdf
 * Props passed down from ToolBar
 * @param {object} PdfElementModalProps
 * @returns {React.JSX.Element}
 */
export default function PdfElementModal({ openModal, journalTitle, pdfString, onCloseModal }: PdfElementModalProps): React.JSX.Element {
    const { exportJournalPdf } = useManageJournal()

    const [exportError, setExportError] = useState<boolean>(false)


    /** Function to export journal to PDF */
    const handleExportPDF = async (): Promise<void> => {
        let cleanTitle: string = journalTitle
        for (const character of avoidCharacters) { cleanTitle = cleanTitle.replace(character, '_') }
        const fileTitle: string = cleanTitle.split(' ').join('_')

        const response: HandlerResponse = await exportJournalPdf(pdfString, fileTitle)
        if (response.status != 200) {
            setExportError(true)
        } else {
            onCloseModal()
        }
    }


    return (
        <Modal openModal={openModal} onCloseModal={onCloseModal} specialClass='journal-viewer-modal'>
            <div className='journal-preview-heading'>
                <h3 className='journal-preview-title'>Preview Your Content</h3>

                <p className='journal-preview-message'>
                    Click 'Export' if you are satisfied with the rendering or 'Cancel' to continue editing your journal.
                </p>

                {exportError && (
                    <p className='journal-preview-error'>
                        Error exporting journal to PDF. Please click 'Cancel' then try again.
                    </p>
                )}
            </div>

            <div className='journal-preview-div'>
                <div className='journal-preview-scroller'>
                    <div className="journal-preview-content">
                        <div dangerouslySetInnerHTML={{ __html: pdfString }} >
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'none' }}>

            </div>

            <div className='journal-preview-buttons'>
                <div className='modal-btn-div'>
                    <Button onClick={handleExportPDF}
                        type='button' classId='modal-save-btn'>
                        Export
                    </Button>

                    <Button onClick={onCloseModal} type='button' classId='modal-close-btn'>
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal >
    )
}
