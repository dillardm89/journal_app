import { type Descendant } from 'slate'
import { useState, useEffect, ChangeEvent } from 'react'
import { useJournalContext } from '../../../context/journal-context/journal-context'
import { useManageJournal } from '../../../hooks/journal/journal-hook'
import { useResponseHandler } from '../../../hooks/response-handler/handler-hook'
import { useEditorHTMLHook } from '../../../hooks/journal/editor-html-hook'
import { useForm } from '../../../hooks/form/general-form-hook'
import TextEditor from './TextEditor'
import AlertModal from '../../../shared/components/elements/AlertModal'
import Input from '../../../shared/components/elements/Input'
import TagSelector from './TagSelector'
import { journalTagListValidator, journalTitleValidator } from '../../../utils/forms/validation/default-validators/journal'
import type { DBTagResponse, TagItemType } from '../../../utils/types/tag-types'
import type { JournalItemType } from '../../../utils/types/journal-types'
import type { AlertStateType, HandlerResponse } from '../../../utils/types/shared-types'
import { blankAlert } from '../../../utils/user/blank-user-values'
import '../../../../public/styles/journal/editor/journal-editor.css'


/**
 * JournalEditorProps
 * @typedef {object} JournalEditorProps
 * @property {string} journalId (optional) id string for existing journal to edit
 */
type JournalEditorProps = {
    journalId?: string
}


/**
 * Component for user to create and edit new journals
 * Props passed down from Journal
 * @param {object} JournalEditorProps
 * @returns {React.JSX.Element}
 */
export default function JournalEditor({ journalId }: JournalEditorProps): React.JSX.Element {
    const { openEditor } = useJournalContext()
    const { serializeToHTML } = useEditorHTMLHook()
    const { getJournalById } = useManageJournal()
    const { createHandler, updateHandler } = useResponseHandler()
    const { initializeFormState, inputHandler, validateForm } = useForm()

    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [alertContent, setAlertContent] = useState<AlertStateType>(blankAlert)
    const [journalTitle, setJournalTitle] = useState<string>('')
    const [journalTags, setJournalTags] = useState<DBTagResponse[]>([])
    const [journalContent, setJournalContent] = useState<string>('')
    const [saveError, setSaveError] = useState<boolean>(false)
    const [editorArray, setEditorArray] = useState<Descendant[]>([])
    const [checkedTagList, setCheckedTagList] = useState<{ [id: string]: boolean }>({})


    /**
     * Function to handle updating journal title in state for passing down as props
     * to the toolbar, as well as handling input change form validation
     * @param {string} name
     * @param {string} value
     * @param {boolean} isValid
     */
    const handleTitleInput = (name: string, value: string, isValid: boolean): void => {
        setJournalTitle(value)
        inputHandler(name, value, isValid)
    }


    /** Function to handle closing alert modal */
    const handleCloseModal = (): void => {
        document.querySelector('body')!.id = ''
        setOpenAlert(false)
    }


    /**
     * Function to handle saving new or updated journals
     * @param {ChangeEvent<HTMLFormElement>} event
     */
    const handleSaveJournal = async (event: ChangeEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const formIsValid = validateForm(formData)
        if (!formIsValid) {
            setSaveError(true)
            return
        }

        const title: string = formData.get('title')!.toString()
        const tagList: string = formData.get('tag-list')!.toString()

        let stringHTML: string = ''
        for (const elementItem of editorArray) { stringHTML += serializeToHTML(elementItem) }

        // Compile all tag IDs and create new tag objects for tagList
        const allTagIds: string[] = []
        Object.keys(checkedTagList).forEach(id => {
            const isChecked = checkedTagList[id]
            if (isChecked) { allTagIds.push(id) }
        })

        if (tagList != '') {
            const newChecked: { [id: string]: boolean } = checkedTagList
            const newTagList: string[] = tagList.split(',')
            for (const newTag of newTagList) {
                const tagItem: TagItemType = { name: newTag.trim() }
                const response = await createHandler(tagItem, 'tag')
                if (response.status == 200) {
                    allTagIds.push(response.message!)
                    newChecked[response.message!] = true
                }
            }
            setCheckedTagList(newChecked)
        }

        const journalItem: JournalItemType = {
            title, content: stringHTML, tag_list: allTagIds.length > 0 ? allTagIds : undefined
        }

        // Update or create journal
        let response: HandlerResponse
        if (journalId == '' || journalId == undefined) {
            response = await createHandler(journalItem, 'journal')
        } else {
            journalItem.journal_id = journalId
            response = await updateHandler(journalItem, 'journal')
        }

        if (response.status != 200) {
            setAlertContent({
                type: 'error', heading: 'Error saving journal',
                message: 'Unable to save journal. Please check for any errors then try again.'
            })
            setOpenAlert(true)
        } else {
            setAlertContent({
                type: 'info', heading: 'Journal saved',
                message: 'Journal saved successfully. You may close the editor or continue working.'
            })
            setOpenAlert(true)
        }
    }


    useEffect(() => {
        // useEffect to initialize formState
        if (openEditor) {
            initializeFormState('journal')
        }
    }, [openEditor, initializeFormState])


    useEffect(() => {
        // useEffect to load journal data from API by Id
        const getJournalData = async (): Promise<void> => {
            const response = await getJournalById(journalId!)
            if (response.title == '') {
                setAlertContent({
                    type: 'error', heading: 'Error loading journal',
                    message: 'Unable to load journal at this time. Please close editor and try again later.'
                })
                setOpenAlert(true)
            } else {
                setJournalTitle(response.title)
                setJournalContent(response.content)
                if (response.tags) { setJournalTags(response.tags as DBTagResponse[]) }
            }
        }

        if (journalId) { getJournalData() }
    }, [getJournalById, journalId])


    return (<>
        {openAlert && (
            <AlertModal openModal={openAlert} type={alertContent.type} heading={alertContent.heading}
                message={alertContent.message} onClear={handleCloseModal} />
        )}

        <div className='journal-editor-container'>
            <div className='journal-editor-div'>
                {saveError && (<div className='editor-error-div'>
                    <p>Invalid inputs. Please make corrections and try again.</p>
                </div>)}

                <form className='journal-editor-form' onSubmit={(event: ChangeEvent<HTMLFormElement>) => handleSaveJournal(event)}>
                    <div className='editor-form-div'>
                        <div className='editor-title-div'
                            onInputCapture={e => e.stopPropagation()}>
                            <Input element='input' fieldId='title' name='title'
                                label='Journal Title' type='text' onInput={(name: string, value: string, isValid: boolean) => handleTitleInput(name, value, isValid)}
                                initialValue={journalTitle}
                                placeholder='Title' selectedValidators={journalTitleValidator}
                                errorText='Enter a valid title (2-100 characters).' />
                        </div>

                        <div className='editor-tag-div'
                            onInputCapture={e => e.stopPropagation()} >
                            <Input element='input' fieldId='tag-list' name='tag-list'
                                label='Journal Tags' type='text' onInput={inputHandler}
                                placeholder='Enter new tags (separated by comma)' selectedValidators={journalTagListValidator}
                                errorText='Enter a valid tag name (2-50 characters per tag)' />

                            <TagSelector journalTags={journalTags} onCloseMenu={(checkedList) => setCheckedTagList(checkedList)} />
                        </div>
                    </div>

                    <div className='rich-text-editor'>
                        <TextEditor journalContent={journalContent} journalTitle={journalTitle}
                            onSave={(editorArray: Descendant[]) => setEditorArray(editorArray)} />
                    </div>
                </form>
            </div>
        </div>
    </>)
}
