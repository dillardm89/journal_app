import { SetStateAction } from 'react'
import { DBTagResponse } from './tag-types'


/**
 * JournalSearchType
 * @typedef {object} JournalSearchType
 * Enum representation of Journal Search type
 */
export enum JournalSearchType { Title, Tags, Date, Content }


/** Blank journal object */
export const blankJournal: JournalItemType = {
    title: '', content: '', dateCreated: '', tags: []
}


/**
 * JournalItemType
 * @typedef {object} JournalItemType
 * @property {string} title
 * @property {string} content
 * @property {string} dateCreated (optional) objects coming from API have 'date_created' field that will be converted to JS date in ISO string format, but field not required for new journals and must be removed before updating journals
 * @property {array} tags (optional) array of DBTagResponse objects when receiving data from db
 * @property {array} tag_list (optional) array of tag ID strings when sending data to db
 * @property {string} journal_id (optional) id for existing journals
 */
export type JournalItemType = {
    title: string,
    content: string,
    dateCreated?: string,
    tags?: DBTagResponse[],
    tag_list?: string[],
    journal_id?: string
}


/**
 * DBJournalResponse
 * @typedef {object} DBJournalResponse
 * @property {string} title
 * @property {string} content
 * @property {string} user id for user
 * @property {array} tags (optional) array of DBTagResponse objects when receiving data from db
 * @property {array} tag_list (optional) array of tag ID strings when sending data to db
 * @property {string} date_created (optional) Journal objects coming from API have 'date_created' field, but field must be removed before updating any journals / Django datetime ISO string format
 * @property {string} id (optional) Journal objects coming from API have 'id' field
 * @property {string} journal_id (optional) Journal objects being sent to API have 'journal_id' field
 */
export type DBJournalResponse = {
    title: string,
    content: string,
    user: string,
    tags?: DBTagResponse[],
    tag_list?: string[],
    date_created?: string,
    id?: string,
    journal_id?: string
}


/**
 * JournalContextValue
 * @typedef {object} JournalContextValue
 * @property {boolean} openEditor whether journal editor component is displayed
 * @property {function} setOpenEditor callback function to update openEditor state
 */
export type JournalContextValue = {
    openEditor: boolean,
    setOpenEditor: React.Dispatch<SetStateAction<boolean>>
}
