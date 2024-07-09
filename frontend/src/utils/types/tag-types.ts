/**
 * TagItemType
 * @typedef {object} TagItemType
 * @property {string} name
 * @property {number} taggedJournals (optional) number of journals with tag, may be blank
 * @property {string} tag_id (optional) id for existing links
 */
export type TagItemType = {
    name: string,
    taggedJournals?: number,
    tag_id?: string
}


/**
 * DBTagResponse
 * @typedef {object} DBTagResponse
 * @property {string} name
 * @property {string} user id for user
 * @property {string} date_created (optional) Tag objects coming from API have 'date_created' field, but field must be removed before updating any tags
 * @property {number} tagged_journals (optional) Tag objects coming from API have 'tagged_journals' field, but field not required for requests to API
 * @property {string} id (optional) Tag objects coming from API have 'id' field
 * @property {string} tag_id (optional) Tag objects being sent to API have 'tag_id' field
 */
export type DBTagResponse = {
    name: string,
    user: string,
    date_created?: string,
    tagged_journals?: number,
    id?: string,
    tag_id?: string
}
