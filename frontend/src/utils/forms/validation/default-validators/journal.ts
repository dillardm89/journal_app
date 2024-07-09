import type { ValidatorType } from '../../../types/shared-types'
import { REQUIRED_VALIDATOR, MAXLENGTH_VALIDATOR, MINLENGTH_VALIDATOR, URL_VALIDATOR } from './validators'


/** Array of callback functions for validating journal title input field */
export const journalTitleValidator: ValidatorType[] = [REQUIRED_VALIDATOR(), MINLENGTH_VALIDATOR(2), MAXLENGTH_VALIDATOR(100)]


/** Array of callback functions for validating journal tag list input field */
export const journalTagListValidator: ValidatorType[] = [MINLENGTH_VALIDATOR(2), MAXLENGTH_VALIDATOR(50)]


/** Array of callback functions for validating journal title input field */
export const editorLinkTextValidator: ValidatorType[] = [REQUIRED_VALIDATOR(), MINLENGTH_VALIDATOR(2)]


/** Array of callback functions for validating journal title input field */
export const editorLinkUrlValidator: ValidatorType[] = [MINLENGTH_VALIDATOR(2), MAXLENGTH_VALIDATOR(2048), URL_VALIDATOR()]
