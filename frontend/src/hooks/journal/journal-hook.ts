import { useCallback } from 'react'
import { useAPIClient } from '../api/api-hook'
import { useJSON } from '../utils/json-hook'
import type { JournalItemType, DBJournalResponse } from '../../utils/types/journal-types'
import { blankJournal, JournalSearchType } from '../../utils/types/journal-types'
import type { HandlerResponse, HookResponse } from '../../utils/types/shared-types'


/** Custom useManageJournal hook to handle retrieving and updating journal data */
export function useManageJournal() {
    const apiUrl = import.meta.env.VITE_APP_API_URL
    const userId = import.meta.env.VITE_APP_API_USERID
    const urlString = `${apiUrl}/journal`

    const { sendAPIRequest } = useAPIClient()
    const { stringifyData } = useJSON()


    /**
     * Callback function to convert journal object coming from API
     * to format used by app
     * @param {DBJournalResponse} journalData
     * @returns {JournalItemType}
     */
    const convertDBJournal = useCallback((journalData: DBJournalResponse): JournalItemType => {
        const journalItem: JournalItemType = {
            journal_id: journalData.id, //API sends 'id' field
            title: journalData.title,
            content: journalData.content,
            dateCreated: journalData.date_created!,
            tags: journalData.tags ? journalData.tags : undefined,
        }
        return journalItem
    }, [])


    /**
     * Callback function to convert journal object used by app
     * to format used by API
     * @param {JournalItemType} journalData
     * @returns {DBJournalResponse}
     */
    const convertAppJournal = useCallback((journalData: JournalItemType): DBJournalResponse => {
        const journalItem: DBJournalResponse = {
            user: userId,
            journal_id: journalData.journal_id!,
            title: journalData.title,
            content: journalData.content,
            tag_list: journalData.tag_list ? journalData.tag_list : undefined,
        }
        return journalItem
    }, [userId])


    /**
     * Callback function to retrieve user's journal data from database
     * @returns {JournalItemType[]}
     */
    const loadJournalData = useCallback(async (): Promise<JournalItemType[]> => {
        // Stringify data object
        const userIdData = { 'user': userId }
        const jsonResult = stringifyData(userIdData)
        if (jsonResult.status == 400) { return [] }

        // Retrieve user journal from database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/journals/user_journals`,
            'POST', stringData)
        if (response.status != 200) { return [] }

        const journalItemData = response.message as DBJournalResponse[]
        const userJournals: JournalItemType[] = []
        for (const journalItem of journalItemData) {
            const journalData = convertDBJournal(journalItem)
            userJournals.push(journalData)
        }
        return userJournals
    }, [sendAPIRequest, urlString, stringifyData, convertDBJournal, userId])


    /**
     * Callback function to retrieve a specific journal from database by id
     * @param {string} journalId
     * @returns {JournalItemType}
     */
    const getJournalById = useCallback(async (journalId: string): Promise<JournalItemType> => {
        // Stringify data object
        const journalData = { 'user': userId, 'journal_id': journalId }
        const jsonResult = stringifyData(journalData)
        if (jsonResult.status == 400) { return blankJournal }

        // Retrieve task in database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/journals/get_journal`, 'POST', stringData)
        if (response.status != 200) { return blankJournal }

        // Convert object for app
        const journalObject = response.message as DBJournalResponse
        const journalItem = convertDBJournal(journalObject)
        return journalItem
    }, [sendAPIRequest, userId, urlString, stringifyData, convertDBJournal])


    /**
    * Callback function to search user's journals by keywords
    * @property {number} searchType JournalSearchType enum
    * @property {string} searchText
    * @returns {JournalItemType[]}
    */
    const searchJournals = useCallback(async (searchType: JournalSearchType, searchText: string): Promise<JournalItemType[]> => {
        // Convert enum to string
        const type: string = JournalSearchType[searchType].toString()

        // Stringify data object
        const searchData = { 'user': userId, 'search_type': type.toLowerCase(), 'search_text': searchText }
        const jsonResult = stringifyData(searchData)
        if (jsonResult.status == 400) { return [] }

        // Retrieve user journal from database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/journals/search_journals`,
            'POST', stringData)
        if (response.status != 200) { return [] }

        const journalItemData = response.message as DBJournalResponse[]
        if (journalItemData.length == 0) { return [] }

        const userJournals: JournalItemType[] = []
        for (const journalItem of journalItemData) {
            const journalData = convertDBJournal(journalItem)
            userJournals.push(journalData)
        }
        return userJournals
    }, [sendAPIRequest, urlString, stringifyData, convertDBJournal, userId])


    /**
     * Callback function to create new journal in database
     * @param {DBJournalResponse} journalData
     * @returns {HookResponse}
     */
    const createJournal = useCallback(async (journalData: DBJournalResponse): Promise<HookResponse> => {
        // Stringify data object
        const jsonResult = stringifyData(journalData)
        if (jsonResult.status == 400) {
            return { status: jsonResult.status, message: jsonResult.message }
        }

        // Create journal in database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/journals/add_journal`, 'POST', stringData)
        return { status: response.status, message: response.message as string }
    }, [sendAPIRequest, urlString, stringifyData])


    /**
     * Callback function to update journal data in database
     * @param {DBJournalResponse} journalData
     * @returns {HookResponse}
     */
    const updateJournal = useCallback(async (journalData: DBJournalResponse): Promise<HookResponse> => {
        // Remove date_created, field not allowed in PATCH request
        delete journalData.date_created

        // Stringify data object
        const jsonResult = stringifyData(journalData)
        if (jsonResult.status == 400) {
            return { status: jsonResult.status, message: jsonResult.message }
        }

        // Update journal in database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/journals/update_journal`, 'PATCH', stringData)
        return { status: response.status, message: response.message as string }
    }, [sendAPIRequest, urlString, stringifyData])


    /**
     * Callback function to delete journal in database
     * @param {string} journalId
     * @returns {HookResponse}
     */
    const deleteJournal = useCallback(async (journalId: string): Promise<HookResponse> => {
        // Stringify data object
        const journalData = { 'user': userId, 'journal_id': journalId }
        const jsonResult = stringifyData(journalData)
        if (jsonResult.status == 400) {
            return { status: jsonResult.status, message: jsonResult.message }
        }

        // Delete journal in database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/journals/remove_journal`, 'DELETE', stringData)
        return { status: response.status, message: response.message as string }
    }, [sendAPIRequest, urlString, userId, stringifyData])


    /**
    * Callback function to export journal to pdf
    * @property {string} htmlString
    * @property {string} journalTitle
    * @returns {HandlerResponse}
    */
    const exportJournalPdf = useCallback(async (htmlString: string, journalTitle: string): Promise<HandlerResponse> => {

        // Stringify data object
        const exportData = { 'user': userId, 'html_content': htmlString, 'filename': journalTitle }
        const jsonResult = stringifyData(exportData)
        if (jsonResult.status == 400) {
            return { status: jsonResult.status }
        }

        // API request to convert html string to pdf file
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/journals/export_journal`,
            'POST', stringData)
        if (response.status != 200) {
            return { status: response.status }
        }

        try {
            const byteString: string = (response.message as string)
            const byteCharacters = window.atob(byteString)
            const byteNumbers = new Array(byteCharacters.length)
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i)
            }
            const byteArray: Uint8Array = new Uint8Array(byteNumbers)
            const pdfBlob: Blob = new Blob([byteArray], { type: 'application/pdf' })

            const link: HTMLAnchorElement = document.createElement('a')
            link.href = window.URL.createObjectURL(pdfBlob)
            link.download = `${journalTitle}.pdf`
            link.click()
            return { status: response.status }
        } catch (error) {
            return { status: 500 }
        }
    }, [sendAPIRequest, urlString, stringifyData, userId])


    return { loadJournalData, updateJournal, deleteJournal, createJournal, convertAppJournal, searchJournals, getJournalById, exportJournalPdf }
}
