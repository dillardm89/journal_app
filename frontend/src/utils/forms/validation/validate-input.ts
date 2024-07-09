import { validateUrl } from './url-validation'
import type { ValidatorType } from '../../types/shared-types'


/**
 * Function for validating input fields based on set parameters, returns isValid = boolean
 * Params passed down from Login, Register, or Input
 * @param {string} value string containing input field value
 * @param {ValidatorType[]} validators array of callback functions
 * @returns {boolean}
 */
export function validateInput(value: string, validators: ValidatorType[]): boolean {
    let isValid = true
    for (const validator of validators) {
        if (validator.type == 'REQUIRED') {
            isValid = isValid && value.trim().length > 0
        }

        if (validator.type == 'MIN_LENGTH') {
            isValid = isValid && value.trim().length >= validator.value!
        }

        if (validator.type == 'MAX_LENGTH') {
            isValid = isValid && value.trim().length <= validator.value!
        }

        if (validator.type == 'MIN_VALUE') {
            isValid = isValid && +value >= validator.value!
        }

        if (validator.type == 'MAX_VALUE') {
            isValid = isValid && +value <= validator.value!
        }

        if (validator.type == 'MIN_DATE') {
            const userDate = Date.parse(value)
            const validDate = validator.value!
            const dateValid = (userDate >= validDate)
            isValid = isValid && dateValid
        }

        if (validator.type == 'MAX_DATE') {
            const userDate = Date.parse(value)
            const validDate = validator.value!
            const dateValid = (userDate <= validDate)
            isValid = isValid && dateValid
        }

        if (validator.type == 'VALID_URL') {
            if (value.trim() == '') {
                isValid
            } else {
                const urlValid = validateUrl(value)
                isValid = isValid && urlValid
            }
        }
    }
    return isValid
}
