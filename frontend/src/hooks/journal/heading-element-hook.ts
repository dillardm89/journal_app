import { useCallback } from 'react'
import { Transforms, Element, Editor } from 'slate'
import type { CustomEditor } from '../../utils/types/editor-types'


/** Custom useHeadingElementHook hook for text editor heading button functionality */
export function useHeadingElementHook() {
    /** Function to determine if text editor block is type heading
     * @param {CustomEditor} editor
     * @returns {boolean}
     */
    const isHeadingBlockActive = useCallback((editor: CustomEditor): boolean => {
        const [match] = Editor.nodes(editor, {
            match: n => Element.isElement(n) && n.type == 'heading',
        })
        return match ? true : false
    }, [])


    /** Function to determine which heading level is active
     * @param {CustomEditor} editor
     * @param {number} level
     * @returns {boolean}
     */
    const checkHeadingLevelActive = useCallback((editor: CustomEditor, level: number): boolean => {
        const [match] = Editor.nodes(editor, {
            match: n => Element.isElement(n) && n.type == 'heading' && n.level == level,
        })
        return match ? true : false
    }, [])


    /** Function to toggle text editor block as type heading
     * @param {CustomEditor} editor
     * @param {number} level
    */
    const toggleHeadingBlock = useCallback((editor: CustomEditor, level: number): void => {
        const isActive = isHeadingBlockActive(editor)
        const isSameLevel = checkHeadingLevelActive(editor, level)
        if (isActive && isSameLevel) {
            Transforms.setNodes(editor,
                { type: 'paragraph' },
                { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
            )
        } else {
            Transforms.setNodes(editor,
                { type: 'heading', level: level },
                { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
            )
        }
    }, [isHeadingBlockActive, checkHeadingLevelActive])


    return { isHeadingBlockActive, toggleHeadingBlock, checkHeadingLevelActive }
}
