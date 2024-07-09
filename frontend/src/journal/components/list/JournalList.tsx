import { useCallback, useState } from 'react'
import JournalItem from './JournalItem'
import SortBox from './SortBox'
import Button from '../../../shared/components/elements/Button'
import type { JournalItemType } from '../../../utils/types/journal-types'
import '../../../../public/styles/journal/list/journal-list.css'


/**
 * JournalListProps
 * @typedef {object} JournalListProps
 * @property {JournalItemType[]} journalData array of objects containing information
 *                          for existing tags
 * @property {string} noJournalsText message to display if journal list empty
 * @property {boolean} searchActive determines title to display
 * @property {function} onClearSearch callback function to clear search results
 * @property {function} onEditJournal callback function to handle editing journal
 * @property {function} onDeleteJournal callback function to handle refresh list after delete
 */
type JournalListProps = {
    journalData: JournalItemType[],
    noJournalsText: string,
    searchActive: boolean,
    onClearSearch: () => void,
    onEditJournal: (journalId: string) => void,
    onDeleteJournal: () => void
}


/**
 * Component for managing list of user journals
 * Props passed down from Journal
 * @param {object} JournalListProps
 * @returns {React.JSX.Element}
 */
export default function JournalList({ journalData, noJournalsText, searchActive, onClearSearch, onDeleteJournal, onEditJournal }: JournalListProps): React.JSX.Element {
    const [sortOrder, setSortOrder] = useState<boolean>(true)


    /**
     * Function to handle selecting sort type from user selection
     * @param {string} type sort by type either 'title' or 'date'
     */
    const handleSelectSort = (type: 'title' | 'date'): void => {
        if (type == 'title') {
            handleSortTitle()
        } else { handleSortDate() }
    }


    /** Function to handle sorting journals by title */
    const handleSortTitle = useCallback((): void => {
        setSortOrder((prevMode) => !prevMode)
        if (sortOrder) {
            journalData.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
        } else {
            journalData.sort((b, a) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
        }
    }, [journalData, sortOrder])


    /** Function to handle sorting journals by date field */
    const handleSortDate = useCallback((): void => {
        setSortOrder((prevMode) => !prevMode)
        if (sortOrder) {
            journalData.sort((a, b) => Date.parse(a.dateCreated!) - Date.parse(b.dateCreated!))
        } else {
            journalData.sort((b, a) => Date.parse(a.dateCreated!) - Date.parse(b.dateCreated!))
        }
    }, [journalData, sortOrder])


    return (
        <div className='journal-list-container'>
            <div className='journal-list-heading'>
                <div className='heading-div'>
                    <h2>{searchActive ? 'Search Results' : 'Your Journals'}</h2>
                    <div className='heading-btn-div'>
                        {searchActive && (
                            <Button classId='clear-search-btn' type='button'
                                onClick={onClearSearch}>
                                Clear</Button>
                        )}
                    </div>
                </div>

                <SortBox setSortType={(type) => handleSelectSort(type)} />
            </div>

            <div className='journal-list'>
                {journalData.length == 0 && (
                    <div className='no-journals-div'>
                        <p>{noJournalsText}</p>
                    </div>
                )}

                <div className='scroller'>
                    <ul className='journal-list-ul'>
                        {journalData.map((journal, index) => (
                            <JournalItem key={index} journalInfo={journal} onEditJournal={onEditJournal}
                                onDeleteJournal={onDeleteJournal} />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
