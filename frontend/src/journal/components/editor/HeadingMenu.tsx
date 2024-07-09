import { useSlate } from 'slate-react'
import { useHeadingElementHook } from '../../../hooks/journal/heading-element-hook'
import Button from '../../../shared/components/elements/Button'
import '../../../../public/styles/journal/editor/heading-menu.css'

/**
 * HeadingMenuProps
 * @typedef {object} HeadingMenuProps
 * @property {function} onSelect callback function to handle closing menu
 */
type HeadingMenuProps = {
    onSelect: () => void
}


/**
 * Component for displaying heading menu in editor toolbar
 * Props passed down from ToolBar
 * @param {object} HeadingMenuProps
 * @returns {React.JSX.Element}
 */
export default function HeadingMenu({ onSelect }: HeadingMenuProps): React.JSX.Element {
    const editor = useSlate()
    const { checkHeadingLevelActive, toggleHeadingBlock } = useHeadingElementHook()


    /**
     * Function to handle select heading menu option
     * @param {number} option
     */
    const handleSelectHeading = (option: number): void => {
        toggleHeadingBlock(editor, option)
        onSelect()
    }


    return (
        <div className='heading-menu-box'>
            <Button classId='heading-menu-btn' type='button'
                active={editor && checkHeadingLevelActive(editor, 1)}
                onClick={() => handleSelectHeading(1)}>H1</Button>

            <Button classId='heading-menu-btn' type='button'
                active={editor && checkHeadingLevelActive(editor, 2)}
                onClick={() => handleSelectHeading(2)}>H2</Button>

            <Button classId='heading-menu-btn' type='button'
                active={editor && checkHeadingLevelActive(editor, 3)}
                onClick={() => handleSelectHeading(3)}>H3</Button>

            <Button classId='heading-menu-btn' type='button'
                active={editor && checkHeadingLevelActive(editor, 4)}
                onClick={() => handleSelectHeading(4)}>H4</Button>

            <Button classId='heading-menu-btn' type='button'
                active={editor && checkHeadingLevelActive(editor, 5)}
                onClick={() => handleSelectHeading(5)}>H5</Button>

            <Button classId='heading-menu-btn' type='button'
                active={editor && checkHeadingLevelActive(editor, 6)}
                onClick={() => handleSelectHeading(6)}>H6</Button>
        </div>
    )
}
