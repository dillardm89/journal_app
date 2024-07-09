import { ChangeEvent, useEffect, useState, useRef, useCallback } from 'react'
import { useManageJournal } from '../../../hooks/journal/journal-hook'
import Button from '../../../shared/components/elements/Button'
import { JournalItemType, JournalSearchType } from '../../../utils/types/journal-types'
import arrowIcon from '../../../assets/icons/down-arrow-icon.png'
import searchIcon from '../../../assets/icons/search-icon.png'
import '../../../../public/styles/journal/list/search-bar.css'


/**
 * SearchBarProps
 * @typedef {object} SearchBarProps
 * @property {boolean} searchActive whether to clear search text
 * @property {function} onSearch callback function to updating journal list
 *              based on search results
 * @property {function} onClearSearch callback function to clear search results
 */
type SearchBarProps = {
    searchActive: boolean,
    onSearch: (searchResults: JournalItemType[]) => void,
    onClearSearch: () => void
}


/**
 * Component for rendering search bar and updating journal list with search results
 * Props passed down from Journal
 * @returns {React.JSX.Element}
 */
export default function SearchBar({ searchActive, onSearch, onClearSearch }: SearchBarProps): React.JSX.Element {
    const menuRef = useRef<HTMLDivElement>(null)
    const { searchJournals } = useManageJournal()

    const [showList, setShowList] = useState<boolean>(false)
    const [searchType, setSearchType] = useState<JournalSearchType>(0)
    const [searchValue, setSearchValue] = useState<string>('')


    /**
     * Function to handle setting search type and closing search box dropdown
     * @param {number} type JournalSearchType string
     */
    const handleSelectType = (type: JournalSearchType): void => {
        setSearchType(type)
        setShowList(false)
    }


    /**
     * Function to handle submitting search form to retrieve matching journals
     * @param {ChangeEvent<HTMLFormElement>} event
     */
    const handleSubmitSearch = async (event: ChangeEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const searchString = formData.get('search')!.toString().trim()
        let searchText: string = searchString
        if (searchType == JournalSearchType.Date) {
            try {
                searchText = (new Date(searchString)).toISOString()
            } catch (error) { onSearch([]) }
        }

        if (searchText.length == 0) {
            onClearSearch()
            return
        }

        const response = await searchJournals(searchType, searchText)
        onSearch(response)
    }


    /**
     * Function to close tag menu if user clicks elsewhere on screen
     * @param {MouseEvent} event
     */
    const handleCloseMenu = useCallback((event: MouseEvent): void => {
        if (menuRef.current && !menuRef.current!.contains(event.target as Node)) {
            setShowList(false)
        }
    }, [])


    useEffect(() => {
        // useEffect to handle event listener for clicking outside tag menu
        document.addEventListener('mousedown', handleCloseMenu)
        return () => { document.removeEventListener('mousedown', handleCloseMenu) }
    }, [handleCloseMenu])


    useEffect(() => {
        // useEffect to clear search value
        if (searchActive == false) {
            setSearchValue('')
        }
    }, [searchActive])


    return (
        <>
            <div className='search-type-div' ref={menuRef}>
                <Button classId='search-type-btn' type='button'
                    onClick={() => setShowList((prevMode) => !prevMode)} >
                    <div>
                        <p>{JournalSearchType[searchType]}</p>
                        <img src={arrowIcon} alt='down arrow icon' />
                    </div>
                </Button>

                {showList && (
                    <div className='search-type-options'>
                        <Button classId='search-option-btn' type='button'
                            onClick={() => handleSelectType(JournalSearchType.Title)}>Title</Button>

                        <Button classId='search-option-btn' type='button'
                            onClick={() => handleSelectType(JournalSearchType.Tags)}>Tags</Button>

                        <Button classId='search-option-btn' type='button'
                            onClick={() => handleSelectType(JournalSearchType.Date)}>Date</Button>

                        <Button classId='search-option-btn' type='button'
                            onClick={() => handleSelectType(JournalSearchType.Content)}>Content</Button>
                    </div>
                )}
            </div>

            <div className='search-bar-form'>
                <form onSubmit={handleSubmitSearch}>
                    <div className='search-bar-input'>
                        <input id='search' name='search' className='search-bar-input' type='text'
                            placeholder={searchType == JournalSearchType.Date ? 'Search by date created (month, day, and year)' : 'Search journals by keywords'}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}
                            value={searchValue}
                        />
                    </div>

                    <Button classId='search-bar-btn' type='submit'>
                        <img src={searchIcon} alt='search icon' />
                    </Button>
                </form>
            </div>
        </>
    )
}
