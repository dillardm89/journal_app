import { useState, useEffect } from 'react'
import { useJournalContext } from '../../context/journal-context/journal-context'
import { useManageJournal } from '../../hooks/journal/journal-hook'
import ConfirmDeleteModal from '../../shared/components/elements/ConfirmDeleteModal'
import SearchBar from '../components/list/SearchBar'
import JournalEditor from '../components/editor/JournalEditor'
import JournalList from '../components/list/JournalList'
import Button from '../../shared/components/elements/Button'
import { JournalItemType } from '../../utils/types/journal-types'
import '../../../public/styles/journal/journal.css'


/**
 * Page for user journaling
 * @returns {React.JSX.Element}
 */
export default function Journal(): React.JSX.Element {
    const { openEditor, setOpenEditor } = useJournalContext()
    const { loadJournalData } = useManageJournal()

    const [needLoadData, setNeedLoadData] = useState<boolean>(true)
    const [journalData, setJournalData] = useState<JournalItemType[]>([])
    const [noJournalsText, setNoJournalsText] = useState<string>('')
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
    const [editJournalId, setEditJournalId] = useState<string>('')
    const [searchActive, setSearchActive] = useState<boolean>(false)


    /**
     * Function to handle closing modal
     * @param {string} action close action either 'cancel' or 'close'
    */
    const handleCloseModal = (action: string): void => {
        document.querySelector('body')!.id = ''
        setOpenDeleteModal(false)
        if (action == 'close') {
            setNeedLoadData(true)
            setEditJournalId('')
            setOpenEditor(false)
        }
    }


    /**
     * Function to handle opening journal editor and passing in
     * journal ID string for editing
     * @param {string} journalId
    */
    const handleEditJournal = (journalId: string): void => {
        setOpenEditor(true)
        setEditJournalId(journalId)
    }


    /**
     * Function to handle updating journal list with search results
     * @param {array} searchResults
    */
    const handleSearchResults = (searchResults: JournalItemType[]): void => {
        setSearchActive(true)
        if (searchResults.length == 0) {
            setJournalData([])
            setNoJournalsText('No journals found for search criteria. For date searches, please include the month, day, and year. Try again or click to add some.')
        } else {
            setJournalData(searchResults)
        }
    }


    /** Function to handle clearing search results */
    const handleClearSearch = (): void => {
        setSearchActive(false)
        setNeedLoadData(true)
    }


    useEffect(() => {
        // useEffect to load user journal data from API
        const getJournalData = async (): Promise<void> => {
            const response = await loadJournalData()
            if (response.length == 0) {
                setJournalData([])
                setNoJournalsText('No journals found. Click to add some.')
            } else {
                setJournalData(response)
            }
        }
        if (needLoadData) {
            getJournalData()
            setNeedLoadData(false)
        }
    }, [loadJournalData, needLoadData])


    return (<>
        {openDeleteModal && (
            <ConfirmDeleteModal openModal={openDeleteModal} typeString='journal' buttonText='Close'
                onConfirmDelete={() => handleCloseModal('close')}
                onCloseModal={() => handleCloseModal('cancel')}
                message='Any unsaved changes will be lost by clicking "Close". Click "Cancel" to go back and save your changes first.' />)}

        <div className='journal-container'>
            {openEditor && (
                <JournalEditor journalId={editJournalId} />)}

            <div className='journal-nav-bar'>
                <div className='add-journal-div'>
                    {!openEditor && (
                        <Button type='button' classId='add-journal-btn'
                            onClick={() => setOpenEditor(true)}>
                            New Journal
                        </Button>)}

                    {openEditor && (
                        <Button type='button' classId='add-journal-btn'
                            onClick={() => setOpenDeleteModal(true)}>
                            Close Editor
                        </Button>)}
                </div>


                <div className='search-bar-div'>
                    <SearchBar onSearch={(searchResults) => handleSearchResults(searchResults)}
                        onClearSearch={handleClearSearch} searchActive={searchActive} />
                </div>
            </div>

            <JournalList journalData={journalData} noJournalsText={noJournalsText}
                onEditJournal={(journalId: string) => handleEditJournal(journalId)}
                onDeleteJournal={() => setNeedLoadData(true)}
                searchActive={searchActive} onClearSearch={handleClearSearch} />
        </div>
    </>)
}
