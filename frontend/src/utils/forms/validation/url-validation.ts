/** URL struction
 * http://user:pass@site.com:80/pa/th?q-val#hash
 * protocol/scheme - http://
 * user auth - user:pass
 * hostname - site.com
 * port - :80
 * host - site.com:80
 * pathname - /pa/th
 * search - ?q=val
 * path = /pa/th?q=val
 * hash - #hash
 */


/** Function to determine if scheme valid
 * @param {string} url
 * @returns {boolean}
 */
const checkValidScheme = (url: string): boolean => {
    const validSchemes: string[] = ['http', 'https', 'ftp', 'ftps']
    const urlScheme: string = url.split('://')[0].toLowerCase()
    const isValid = validSchemes.includes(urlScheme)
    return isValid
}


/**
 * Function to validate input string matches valid url format
 * @param {string} url
 * @returns {boolean}
 */
export const validateUrl = (url: string): boolean => {
    let urlIsValid: boolean = true
    if (url == '') {
        urlIsValid = false
        return urlIsValid
    }

    // Check url contains valid segments
    let urlSplit: URL
    try {
        urlSplit = new URL(url)
        urlIsValid = urlIsValid && (urlSplit instanceof URL)
    } catch (error) {
        urlIsValid = false
        return urlIsValid
    }

    // Check url contains valid protocol
    try {
        urlIsValid = urlIsValid && checkValidScheme(url)
    } catch (error) {
        urlIsValid = false
        return urlIsValid
    }

    return urlIsValid
}
