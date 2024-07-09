import { useState, useEffect, useCallback, useRef } from 'react'
import Button from '../../../shared/components/elements/Button'
import sortIcon from '../../../assets/icons/general-sort-icon.png'
import '../../../../public/styles/journal/list/sort-box.css'


/**
 * SortBoxProps
 * @typedef {object} SortBoxProps
 * @property {function} setSortType callback function to handling setting list sort type
 */
type SortBoxProps = {
    setSortType: (type: 'title' | 'date') => void
}


/**
 * Component for user to select sort method
 * Props passed down from JournalList
 * @returns {React.JSX.Element}
 */
export default function SortBox({ setSortType }: SortBoxProps): React.JSX.Element {
    const sortRef = useRef<HTMLDivElement>(null)
    const [showList, setShowList] = useState<boolean>(false)


    /**
     * Function to handle setting sort type and closing sort box dropdown
     * @param {string} type sort method either 'title' or 'date'
     */
    const handleSelectSort = (type: 'title' | 'date'): void => {
        setSortType(type)
        setShowList(false)
    }


    /**
     * Function to close tag menu if user clicks elsewhere on screen
     * @param {MouseEvent} event
     */
    const handleCloseMenu = useCallback((event: MouseEvent): void => {
        if (sortRef.current && !sortRef.current!.contains(event.target as Node)) {
            setShowList(false)
        }
    }, [])


    useEffect(() => {
        // useEffect to handle event listener for clicking outside tag menu
        document.addEventListener('mousedown', handleCloseMenu)
        return () => { document.removeEventListener('mousedown', handleCloseMenu) }
    }, [handleCloseMenu])


    return (<div className='sort-box-div' ref={sortRef}>
        <Button classId='sort-box-btn' type='button'
            onClick={() => setShowList((prevMode) => !prevMode)} >
            <div>
                <p>Sort By</p>
                <img src={sortIcon} alt='sort arrow icon' />
            </div>
        </Button>

        {showList && (
            <div className='sort-box-options'>
                <Button classId='sort-option-btn' type='button'
                    onClick={() => handleSelectSort('title')}>Title</Button>

                <Button classId='sort-option-btn' type='button'
                    onClick={() => handleSelectSort('date')}>Date</Button>
            </div>)}
    </div>)
}
