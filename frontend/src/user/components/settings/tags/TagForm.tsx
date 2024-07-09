import Input from '../../../../shared/components/elements/Input'
import { tagNameValidator } from '../../../../utils/forms/validation/default-validators/tag'
import type { TagItemType } from '../../../../utils/types/tag-types'
import type { OnInputType } from '../../../../utils/types/shared-types'
import '../../../../../public/styles/settings/tags/tag-form.css'


/**
 * TagFormProps
 * @typedef {object} TagFormProps
 * @property {TagItemType} tagInfo (optional) object containing information
 *                          for existing tag to be edited
 */
type TagFormProps = OnInputType & {
    tagInfo?: TagItemType
}


/**
 * Component for rendering form to add / edit tag
 * Props passed down from TagModal
 * @param {object} TagFormProps
 * @returns {React.JSX.Element}
 */
export default function TagForm({ tagInfo, onInput }: TagFormProps): React.JSX.Element {
    return (
        <div className='tag-form-div'>
            <div className='form-input-div' id='tag'>
                <Input
                    name='name' fieldId='name' label='Display Name'
                    element='input' selectedValidators={tagNameValidator}
                    errorText='Please enter a valid tag name (2-50 characters).'
                    onInput={onInput} type='text'
                    initialValue={tagInfo ? tagInfo.name : ''}
                />
            </div>
        </div>
    )
}
