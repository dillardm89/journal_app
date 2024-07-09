import { ChangeEvent, useState, useEffect, useRef, useCallback } from 'react'
import Button from '../../../shared/components/elements/Button'
import { useManageTag } from '../../../hooks/dashboard/tag-hook'
import type { DBTagResponse, TagItemType } from '../../../utils/types/tag-types'
import '../../../../public/styles/journal/editor/tag-selector.css'


/**
 * TagSelectorProps
 * @typedef {object} TagSelectorProps
 * @property {DBTagResponse[]} journalTags array of journal tag objects
 * @property {function} onCloseMenu callback function to handle final checkedList
 */
type TagSelectorProps = {
    journalTags: DBTagResponse[],
    onCloseMenu: (checkedList: { [id: string]: boolean }) => void
}


/**
 * Component for rendering selectable list of tags for individiual journal
 * Props passed down from JournalEditor
 * @param {object} TagSelectorProps
 * @returns {React.JSX.Element}
 */
export default function TagSelector({ journalTags, onCloseMenu }: TagSelectorProps): React.JSX.Element {
    const visibleRef = useRef<HTMLDivElement>(null)
    const { loadTagData } = useManageTag()

    const [showList, setShowList] = useState<boolean>(false)
    const [userTagList, setUserTagList] = useState<TagItemType[]>([])
    const [checkedList, setCheckedList] = useState<{ [id: string]: boolean }>({})


    /**
     * Function to update selectedTags list state
     * @param {ChangeEvent<HTMLInputElement>} event
     */
    const handleUpdateSelectedTags = (event: ChangeEvent<HTMLInputElement>): void => {
        const { value, checked } = event.target
        setCheckedList(prevCheckedList => ({ ...prevCheckedList, [value]: checked }))
    }


    /** Function to toggle tag menu visibility */
    const handleToggleMenu = (): void => {
        const currentVisibility: boolean = showList
        setShowList((prevMode) => !prevMode)
        if (currentVisibility) { onCloseMenu(checkedList) }
    }


    /**
     * Function to close tag menu if user clicks elsewhere on screen
     * @param {MouseEvent} event
     */
    const handleCloseMenu = useCallback((event: MouseEvent): void => {
        if (visibleRef.current && !visibleRef.current!.contains(event.target as Node)) {
            setShowList(false)
            onCloseMenu(checkedList)
        }
    }, [checkedList, onCloseMenu])


    useEffect(() => {
        // useEffect to handle event listener for clicking outside tag menu
        document.addEventListener('mousedown', handleCloseMenu)
        return () => { document.removeEventListener('mousedown', handleCloseMenu) }
    }, [handleCloseMenu])


    useEffect(() => {
        // useEffect to load list of all tags by user
        const loadUserTags = async (): Promise<void> => {
            const userTags: TagItemType[] = await loadTagData()
            if (userTags.length == 0) { return }
            setUserTagList(userTags)

            const userTagIds: string[] = []
            for (const tag of userTags) { userTagIds.push(tag.tag_id!) }

            // Compare userTags to journalTags and create checkedList
            const initialCheckedList: { [id: string]: boolean } = {}
            if (journalTags.length > 0) {
                journalTags.forEach(tag => {
                    initialCheckedList[tag.id!] = userTagIds.includes(tag.id!)
                })
            }
            setCheckedList(initialCheckedList)
        }

        loadUserTags()
    }, [loadTagData, journalTags])


    return (<>
        {userTagList.length > 0 && (
            <div className='tag-selector-div' id={showList ? 'with-list' : 'btn-only'} ref={visibleRef}>
                <Button classId='tag-selector-btn' type='button' onClick={handleToggleMenu} >
                    Select Tags
                </Button>

                {showList && (
                    <div className='tag-selector-options'>
                        {userTagList.map((tag, index) => (
                            <div key={index} className='tag-option-item'>
                                <input
                                    type='checkbox'
                                    value={tag.tag_id!}
                                    className='tag-option-checkbox'
                                    id={tag.name}
                                    checked={checkedList[tag.tag_id!] || false}
                                    onChange={handleUpdateSelectedTags} />
                                <label className='tag-option-label'
                                    htmlFor={tag.name}>
                                    {tag.name}
                                </label>
                            </div>
                        ))}
                    </div>)}
            </div>)}
    </>)
}
