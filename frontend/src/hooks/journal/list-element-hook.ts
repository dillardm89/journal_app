import { useCallback } from 'react'
import { Transforms, Element, Editor } from 'slate'
import type { CustomEditor, ListElement, ListItemElement } from '../../utils/types/editor-types'


/** Custom useListElementHook hook for text editor list button functionality */
export function useListElementHook() {
    /** Function to determine if text editor block is type list
     * @param {CustomEditor} editor
     * @returns {boolean}
     */
    const isListBlockActive = useCallback((editor: CustomEditor): boolean => {
        const [match] = Editor.nodes(editor, {
            match: n => Element.isElement(n) && n.type == 'list',
        })
        return match ? true : false
    }, [])


    /** Function to toggle text editor block as type list
     * @param {CustomEditor} editor
    */
    const toggleListBlock = useCallback((editor: CustomEditor): void => {
        const isActive = isListBlockActive(editor)

        if (isActive) {
            Transforms.unwrapNodes(editor, {
                match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type == 'list', split: true
            })
            Transforms.setNodes(editor, { type: 'paragraph' },
                { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
            )
        } else {
            const listItem: ListItemElement = { type: 'list-item', children: [] }
            const listElement: ListElement = { type: 'list', children: [] }

            Transforms.setNodes(editor, listItem)
            Transforms.wrapNodes(editor, listElement, { split: true })
        }
    }, [isListBlockActive])


    return { isListBlockActive, toggleListBlock }
}
