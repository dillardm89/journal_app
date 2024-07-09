import { useSlate } from 'slate-react'
import { ChangeEvent, useState, useEffect } from 'react'
import { useForm } from '../../../hooks/form/general-form-hook'
import { useLinkElementHook } from '../../../hooks/journal/link-element-hook'
import Modal from '../../../shared/components/elements/Modal'
import Button from '../../../shared/components/elements/Button'
import Input from '../../../shared/components/elements/Input'
import { editorLinkTextValidator, editorLinkUrlValidator } from '../../../utils/forms/validation/default-validators/journal'
import type { LinkElement } from '../../../utils/types/editor-types'


/**
 * AddLinkModalProps
 * @typedef {object} AddLinkModalProps
 * @property {boolean} openModal determines whether to display modal
 * @property {LinkElement} linkElement details for link element
 * @property {function} onCloseModal callback function to handle closing modal
 */
type AddLinkModalProps = {
    openModal: boolean,
    linkElement: LinkElement,
    onCloseModal: () => void
}


/**
 * Component for modal to set link properties in journal editor
 * Props passed down from ToolBar
 * @param {object} AddLinkModalProps
 * @returns {React.JSX.Element}
 */
export default function AddLinkModal({ openModal, linkElement, onCloseModal }: AddLinkModalProps): React.JSX.Element {
    const editor = useSlate()
    const { inputHandler, validateForm, initializeFormState, clearFormState } = useForm()
    const { toggleLinkBlock } = useLinkElementHook()


    const [isError, setIsError] = useState<boolean>(false)


    /** Function to handle close modal and clear formState */
    const handleCloseLinkModal = (): void => {
        clearFormState()
        onCloseModal()
    }


    /**
     * Function to handle saving new or updated editor links
     * @param {ChangeEvent<HTMLFormElement>} event
     */
    const handleSaveEditorlink = (event: ChangeEvent<HTMLFormElement>): void => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const formIsValid = validateForm(formData)
        if (!formIsValid) {
            setIsError(true)
            return
        }

        const text = formData.get('text')!.toString().trim()
        const url = formData.get('url')!.toString().trim()
        toggleLinkBlock(editor, text, url)
        handleCloseLinkModal()
    }


    useEffect(() => {
        // useEffect to initialize formState
        if (openModal) {
            setIsError(false)
            initializeFormState('editor-link')
        }
    }, [openModal, initializeFormState])


    return (<div
        onInputCapture={e => e.stopPropagation()} onBeforeInput={e => e.stopPropagation()}
        onInput={e => e.stopPropagation()} onSubmit={e => e.stopPropagation()}
    >
        <Modal openModal={openModal} onCloseModal={handleCloseLinkModal}>
            <div id='info-modal'>
                <h3>Add Link</h3>

                <div className='modal-form'>
                    {isError &&
                        <p className='modal-form-error'>
                            Please correct errors.
                        </p>
                    }

                    <form onSubmit={(event: ChangeEvent<HTMLFormElement>) => handleSaveEditorlink(event)}>
                        <div className='modal-form-div'>
                            <Input
                                element='input' fieldId='text' name='text'
                                label='Link Text' type='text' onInput={inputHandler}
                                initialValue={linkElement.children[0].text}
                                selectedValidators={editorLinkTextValidator}
                                errorText='Enter valid text (min 2 characters).'
                            />

                            <Input
                                element='input' fieldId='url' name='url'
                                label='Link URL' type='text' onInput={inputHandler}
                                initialValue={linkElement.url}
                                selectedValidators={editorLinkUrlValidator}
                                errorText='Enter a valid website URL.'
                            />
                        </div>

                        <div className="modal-btn-div">
                            <Button type='submit' classId='modal-save-btn'>
                                Save
                            </Button>

                            <Button onClick={handleCloseLinkModal} type='reset' classId='modal-close-btn'>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    </div>)
}
