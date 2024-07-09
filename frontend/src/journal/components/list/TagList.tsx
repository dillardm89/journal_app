import type { DBTagResponse } from '../../../utils/types/tag-types'


/**
 * TagListProps
 * @typedef {object} TagListProps
 * @property {DBTagResponse[]} tags array of objects containing user tags
 */
type TagListProps = {
    tags: DBTagResponse[]
}


/**
 * Component for rendering list of tags for individiual journal
 * Props passed down from JournalItem
 * @returns {React.JSX.Element}
 */
export default function TagList({ tags }: TagListProps): React.JSX.Element {
    return (
        <div className='tag-scroller'>
            <ul className='journal-tags-ul'>
                {tags.map((tag, index) => (
                    <li key={index} className='journal-tag-item'>{tag.name}</li>
                ))}
            </ul>
        </div>
    )
}
