import Modal from './Modal'
import Button from './Button'


/**
 * ConfirmDeleteModalProps
 * @typedef {object} ConfirmDeleteModalProps
 * @property {boolean} openModal determines whether to display modal
 * @property {string} typeString item type to be deleted for heading and message
 * @property {function} onConfirmDelete callback function to handle deleting item
 * @property {function} onCloseModal callback function to handle closing modal
 * @property {string} buttonText (optional) alternate text for 'Delete' button
 * @property {boolean} isError (optional) whether error occured when attempting to delete in db
 * @property {string} message (optional) extended message to display, otherwise shows default
 */
type ConfirmDeleteModalProps = {
    openModal: boolean,
    typeString: string,
    onConfirmDelete: () => void,
    onCloseModal: () => void,
    buttonText?: string,
    isError?: boolean,
    message?: string,
}


/**
 * Component for modal to confirm item deletion
 * Props passed down from various components
 * @param {object} ConfirmDeleteModalProps
 * @returns {React.JSX.Element}
 */
export default function ConfirmDeleteModal({ isError, typeString, openModal, message, buttonText, onCloseModal, onConfirmDelete }: ConfirmDeleteModalProps): React.JSX.Element {
    return (
        <Modal openModal={openModal} onCloseModal={onCloseModal}>
            <div id='error-modal'>
                {isError &&
                    <p className='modal-form-error'>
                        Deleting Failed. Please click cancel then try again.
                    </p>
                }

                <h3>Warning: {typeString} may be deleted</h3>

                {!message && (
                    <p id='modal-message'>
                        Are you sure you want to delete this {typeString}?
                    </p>
                )}

                {message && (<p id='modal-message'>{message}</p>)}

                <div className="modal-btn-div">
                    <Button onClick={onConfirmDelete} type='button' classId='modal-delete-btn'>
                        {buttonText ? buttonText : 'Delete'}
                    </Button>

                    <Button onClick={onCloseModal} type='reset' classId='modal-close-btn'>
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>)
}
