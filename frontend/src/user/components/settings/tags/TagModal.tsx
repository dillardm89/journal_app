import { ChangeEvent, useState, useEffect } from 'react'
import { useForm } from '../../../../hooks/form/general-form-hook'
import { useResponseHandler } from '../../../../hooks/response-handler/handler-hook'
import Modal from '../../../../shared/components/elements/Modal'
import Button from '../../../../shared/components/elements/Button'
import TagForm from './TagForm'
import type { TagItemType } from '../../../../utils/types/tag-types'
import '../../../../../public/styles/components/form.css'


/**
 * TagModalProps
 * @typedef {object} TagModalProps
 * @property {string} type modal form type, either 'add' or 'edit
 * @property {boolean} openModal determines whether to display modal
 * @property {string} heading heading to be displayed
 * @property {function} onCloseModal callback function to handle closing modal
 * @property {object} tagInfo (optional) TagItemType object containing information
 *                          for existing tag to be edited
 */
type TagModalProps = {
    type: 'add' | 'edit',
    openModal: boolean,
    heading: string,
    onCloseModal: (type: string, action: string) => void,
    tagInfo?: TagItemType
}


/**
 * Component for modal to add / edit tags
 * Props passed down from TagItem or TagManager
 * @param {object} TagModalProps
 * @returns {React.JSX.Element}
 */
export default function TagModal({ type, openModal, heading, onCloseModal, tagInfo }: TagModalProps): React.JSX.Element {
    const { inputHandler, validateForm, initializeFormState, clearFormState } = useForm()
    const { createHandler, updateHandler } = useResponseHandler()

    const [isError, setIsError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')


    /** Function to handle close modal and clear formState */
    const handleCancelModal = (): void => {
        clearFormState()
        onCloseModal('edit', 'cancel')
    }


    /**
     * Function to handle hook response and error messaging
     * @param {number} status
     */
    const handleResponse = (status: number): void => {
        if (status != 200) {
            setErrorMessage('Invalid Inputs. Please correct and try again.')
            setIsError(true)
        } else {
            clearFormState()
            setIsError(false)
            onCloseModal('edit', 'save')
        }
    }


    /**
     * Function to handle saving new or updated tags
     * @param {ChangeEvent<HTMLFormElement>} event
     */
    const handleSaveTag = async (event: ChangeEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const formIsValid = validateForm(formData)
        if (!formIsValid) {
            handleResponse(400)
            return
        }

        const name = formData.get('name')!.toString()
        const tagData: TagItemType = { name }

        let response
        const handlerType = 'tag'
        if (type == 'add') {
            response = await createHandler(tagData, handlerType)
        } else {
            tagData.tag_id = tagInfo!.tag_id
            response = await updateHandler(tagData, handlerType)
        }
        handleResponse(response.status)
    }


    useEffect(() => {
        // useEffect to initialize formState
        if (openModal) {
            initializeFormState('tag')
        }
    }, [openModal, initializeFormState])


    return (
        <div
            onInputCapture={e => e.stopPropagation()}
            onBeforeInput={e => e.stopPropagation()}
            onInput={e => e.stopPropagation()}
        >
            <Modal openModal={openModal} onCloseModal={handleCancelModal}>
                <div id='info-modal'>
                    <h3>{heading}</h3>

                    <div className='modal-form'>
                        {isError && (
                            <p className='modal-form-error'>{errorMessage}</p>
                        )}

                        <form onSubmit={handleSaveTag}>
                            <TagForm tagInfo={tagInfo} onInput={inputHandler}
                            />

                            <div className="modal-btn-div">
                                <Button type='submit' classId='modal-save-btn'>
                                    Save
                                </Button>

                                <Button onClick={handleCancelModal} type='reset' classId='modal-close-btn'>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
