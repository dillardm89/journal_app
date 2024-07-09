import type { ValidatorType } from '../../../types/shared-types'
import { REQUIRED_VALIDATOR, MAXLENGTH_VALIDATOR, MINLENGTH_VALIDATOR } from './validators'


/** Array of callback functions for validating tag name input field */
export const tagNameValidator: ValidatorType[] = [REQUIRED_VALIDATOR(), MINLENGTH_VALIDATOR(2), MAXLENGTH_VALIDATOR(50)]
