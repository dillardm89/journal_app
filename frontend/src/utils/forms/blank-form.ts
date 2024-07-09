import type { FormState } from '../types/shared-types'


/**
 * Default used to initialize formState in useForm for journals
 * Required fields that don't have a default value initialize
 * with 'isValid: false' to force user entries
 */
export const blankJournalFormState: FormState = {
    inputs: [
        { name: 'title', value: '', isValid: false },
        { name: 'tag-list', value: '', isValid: true }
    ],
    isValid: true
}


/**
 * Default used to initialize formState in useForm for editor links
 * Required fields that don't have a default value initialize
 * with 'isValid: false' to force user entries
 */
export const blankEditorLinkFormState: FormState = {
    inputs: [
        { name: 'text', value: '', isValid: false },
        { name: 'url', value: '', isValid: true }
    ],
    isValid: true
}


/**
 * Default used to initialize formState in useForm for tags
 * Required fields that don't have a defualt value initialize
 * with 'isValid: false' to force user entries
 */
export const blankTagFormState: FormState = {
    inputs: [
        { name: 'name', value: '', isValid: false }
    ],
    isValid: true
}
