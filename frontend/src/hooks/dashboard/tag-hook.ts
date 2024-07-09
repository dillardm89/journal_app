import { useCallback } from 'react'
import { useAPIClient } from '../api/api-hook'
import { useJSON } from '../utils/json-hook'
import type { TagItemType, DBTagResponse } from '../../utils/types/tag-types'
import type { HookResponse } from '../../utils/types/shared-types'


/** Custom useManageTag hook to handle retrieving and updating tag data */
export function useManageTag() {
    const apiUrl = import.meta.env.VITE_APP_API_URL
    const userId = import.meta.env.VITE_APP_API_USERID
    const urlString = `${apiUrl}/dashboard`

    const { sendAPIRequest } = useAPIClient()
    const { stringifyData } = useJSON()


    /**
     * Callback function to convert tag object coming from API
     * to format used by app
     * @param {object} tagData
     * @returns {TagItemType}
     */
    const convertDBTag = useCallback((tagData: DBTagResponse): TagItemType => {
        const tagItem: TagItemType = {
            tag_id: tagData.id, //API sends 'id' field
            name: tagData.name,
            taggedJournals: tagData.tagged_journals
        }
        return tagItem
    }, [])


    /**
     * Callback function to convert tag object used by app
     * to format used by API
     * @param {TagItemType} tagData
     * @returns {DBTagResponse}
     */
    const convertAppTag = useCallback((tagData: TagItemType): DBTagResponse => {
        const tagItem: DBTagResponse = {
            user: userId,
            tag_id: tagData.tag_id!,
            name: tagData.name
        }
        return tagItem
    }, [userId])


    /**
     * Callback function to retrieve user's tags data from database
     * @returns {TagItemType[]}
     */
    const loadTagData = useCallback(async (): Promise<TagItemType[]> => {
        // Stringify data object
        const userIdData = { 'user': userId }
        const jsonResult = stringifyData(userIdData)
        if (jsonResult.status == 400) { return [] }

        // Retrieve user tags from database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/tags/user_tags`,
            'POST', stringData)
        if (response.status != 200) { return [] }

        const tagItemData = response.message as DBTagResponse[]
        const usertags: TagItemType[] = []
        for (const tagItem of tagItemData) {
            const tagData = convertDBTag(tagItem)
            usertags.push(tagData)
        }
        return usertags
    }, [sendAPIRequest, urlString, stringifyData, convertDBTag, userId])


    /**
     * Callback function to create new tag in database
     * @param {DBTagResponse} tagData
     * @returns {HookResponse}
     */
    const createTag = useCallback(async (tagData: DBTagResponse): Promise<HookResponse> => {
        // Stringify data object
        const jsonResult = stringifyData(tagData)
        if (jsonResult.status == 400) {
            return { status: jsonResult.status, message: jsonResult.message }
        }

        // Create tag in database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/tags/add_tag`, 'POST', stringData)
        return { status: response.status, message: response.message as string }
    }, [sendAPIRequest, urlString, stringifyData])


    /**
     * Callback function to update tag data in database
     * @param {DBTagResponse} tagData
     * @returns {HookResponse}
     */
    const updateTag = useCallback(async (tagData: DBTagResponse): Promise<HookResponse> => {
        // Remove date_created, field not allowed in PATCH request
        delete tagData.date_created

        // Stringify data object
        const jsonResult = stringifyData(tagData)
        if (jsonResult.status == 400) {
            return { status: jsonResult.status, message: jsonResult.message }
        }

        // Update tag in database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/tags/update_tag`, 'PATCH', stringData)
        return { status: response.status, message: response.message as string }
    }, [sendAPIRequest, urlString, stringifyData])


    /**
     * Callback function to delete tag in database
     * @param {string} tagId
     * @returns {HookResponse}
     */
    const deleteTag = useCallback(async (tagId: string): Promise<HookResponse> => {
        // Stringify data object
        const tagData = { 'user': userId, 'tag_id': tagId }
        const jsonResult = stringifyData(tagData)
        if (jsonResult.status == 400) {
            return { status: jsonResult.status, message: jsonResult.message }
        }

        // Delete tag in database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/tags/remove_tag`, 'DELETE', stringData)
        return { status: response.status, message: response.message as string }
    }, [sendAPIRequest, urlString, userId, stringifyData])


    return { loadTagData, updateTag, deleteTag, createTag, convertAppTag }
}
