import { useCallback } from 'react'
import { useManageTag } from '../dashboard/tag-hook'
import { useManageJournal } from '../journal/journal-hook'
import type { TagItemType } from '../../utils/types/tag-types'
import type { JournalItemType } from '../../utils/types/journal-types'
import type { HandlerResponse, HookResponse } from '../../utils/types/shared-types'
import { add_api_error, add_failed_heading, update_api_error, update_failed_heading, delete_failed_heading, delete_api_error } from '../../utils/user/response-messages'


/**
 * Custom useResponseHandler hook for handling responses from useManage type hooks
 * that interact with API for creating, updating, and deleting objects
*/
export function useResponseHandler() {
    const { createTag, updateTag, deleteTag, convertAppTag } = useManageTag()
    const { createJournal, updateJournal, deleteJournal, convertAppJournal } = useManageJournal()


    /**
     * Callback function to handle adding object in database
     * @param {object} objectData
     * @param {string} type object name ('journal' or 'tag')
     * @returns {HandlerResponse}
     */
    const createHandler = useCallback(async (objectData: object, type: string): Promise<HandlerResponse> => {
        let response: HookResponse
        if (type == 'tag') {
            const tagData = objectData as TagItemType
            const tagItem = convertAppTag(tagData)
            response = await createTag(tagItem)
        } else if (type == 'journal') {
            const journalData = objectData as JournalItemType
            const journalItem = convertAppJournal(journalData)
            response = await createJournal(journalItem)
        } else {
            response = { status: 400, message: 'Invalid type string' }
        }

        if (response.status != 200) {
            return {
                status: 400, type: 'error', heading: add_failed_heading, message: add_api_error
            }
        }
        return { status: 200, message: response.message as string }
    }, [convertAppTag, convertAppJournal, createJournal, createTag])


    /**
     * Callback function to handle updating object in database
     * @param {object} objectData
     * @param {string} type object name ('journal' or 'tag')
     * @returns {HandlerResponse}
     */
    const updateHandler = useCallback(async (objectData: object, type: string): Promise<HandlerResponse> => {
        let response: HookResponse
        if (type == 'tag') {
            const tagData = objectData as TagItemType
            const tagItem = convertAppTag(tagData)
            tagItem.tag_id = tagData.tag_id
            response = await updateTag(tagItem)
        } else if (type == 'journal') {
            const journalData = objectData as JournalItemType
            const journalItem = convertAppJournal(journalData)
            journalItem.journal_id = journalData.journal_id
            response = await updateJournal(journalItem)
        } else {
            response = { status: 400, message: 'Invalid type string' }
        }

        if (response.status != 200) {
            return {
                status: 400, type: 'error', heading: update_failed_heading, message: update_api_error
            }
        }
        return { status: 200 }
    }, [convertAppTag, updateTag, updateJournal, convertAppJournal])


    /**
     * Callback function to handle deleting object in database
     * @param {string} objectId
     * @param {string} type object name ('journal' or 'tag')
     * @returns {HandlerResponse}
     */
    const deleteHandler = useCallback(async (objectId: string, type: string): Promise<HandlerResponse> => {
        let response: HookResponse
        if (type == 'tag') {
            response = await deleteTag(objectId)
        } else if (type == 'journal') {
            response = await deleteJournal(objectId)
        } else {
            response = { status: 400, message: 'Invalid type string' }
        }

        if (response.status != 200) {
            return {
                status: 400, type: 'error', heading: delete_failed_heading, message: delete_api_error
            }
        }
        return { status: 200 }
    }, [deleteJournal, deleteTag])


    return { createHandler, updateHandler, deleteHandler }
}
