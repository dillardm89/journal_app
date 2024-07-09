import { useCallback } from 'react'
import { Transforms, Element, Editor } from 'slate'
import type { CustomEditor, CustomElement, ParagraphElement } from '../../utils/types/editor-types'


/** Custom useBlockElementHook hook for text editor block type button functionality */
export function useBlockElementHook() {
    /** Function to determine if text editor leaf has bold mark
     * @param {CustomEditor} editor
     * @returns {boolean}
     */
    const isBoldMarkActive = useCallback((editor: CustomEditor): boolean => {
        const marks = Editor.marks(editor)
        return marks ? marks.bold == true : false
    }, [])


    /** Function to determine if text editor leaf has italic mark
     * @param {CustomEditor} editor
     * @returns {boolean}
     */
    const isItalicMarkActive = useCallback((editor: CustomEditor): boolean => {
        const marks = Editor.marks(editor)
        return marks ? marks.italic == true : false
    }, [])


    /** Function to determine if text editor leaf has underline mark
     * @param {CustomEditor} editor
     * @returns {boolean}
     */
    const isUnderlineMarkActive = useCallback((editor: CustomEditor): boolean => {
        const marks = Editor.marks(editor)
        return marks ? marks.underline == true : false
    }, [])


    /** Function to determine if text editor block has left align
     * @param {CustomEditor} editor
     * @returns {boolean}
    */
    const isLeftAlignActive = useCallback((editor: CustomEditor): boolean => {
        const [match] = Editor.nodes(editor, {
            match: n => Element.isElement(n) &&
                (n.type == 'paragraph' || n.type == 'heading') && n.align == 'left',
        })
        return match ? true : false
    }, [])


    /** Function to determine if text editor block has center align
     * @param {CustomEditor} editor
     * @returns {boolean}
    */
    const isCenterAlignActive = useCallback((editor: CustomEditor): boolean => {
        const [match] = Editor.nodes(editor, {
            match: n => Element.isElement(n) &&
                (n.type == 'paragraph' || n.type == 'heading') && n.align == 'center',
        })
        return match ? true : false
    }, [])


    /** Function to determine if text editor block has right align
     * @param {CustomEditor} editor
     * @returns {boolean}
    */
    const isRightAlignActive = useCallback((editor: CustomEditor): boolean => {
        const [match] = Editor.nodes(editor, {
            match: n => Element.isElement(n) &&
                (n.type == 'paragraph' || n.type == 'heading') && n.align == 'right',
        })
        return match ? true : false
    }, [])


    /** Function to determine if text editor block has justify align
     * @param {CustomEditor} editor
     * @returns {boolean}
    */
    const isJustifyAlignActive = useCallback((editor: CustomEditor): boolean => {
        const [match] = Editor.nodes(editor, {
            match: n => Element.isElement(n) &&
                (n.type == 'paragraph' || n.type == 'heading') && n.align == 'justify',
        })
        return match ? true : false
    }, [])


    /** Function to determine if text editor block is type separator
     * @param {CustomEditor} editor
     * @returns {boolean}
    */
    const isSeparatorActive = useCallback((editor: CustomEditor): boolean => {
        const [match] = Editor.nodes(editor, {
            match: n => Element.isElement(n) && n.type == 'separator',
        })
        return match ? true : false
    }, [])


    /** Function to determine if text editor block is type code
     * @param {CustomEditor} editor
     * @returns {boolean}
    */
    const isCodeBlockActive = useCallback((editor: CustomEditor): boolean => {
        const [match] = Editor.nodes(editor, {
            match: n => Element.isElement(n) && n.type == 'code',
        })
        return match ? true : false
    }, [])


    /** Function to toggle text editor leaf bold mark
     * @param {CustomEditor} editor
    */
    const toggleBoldMark = useCallback((editor: CustomEditor): void => {
        const isActive = isBoldMarkActive(editor)
        if (isActive) {
            Editor.removeMark(editor, 'bold')
        } else {
            Editor.addMark(editor, 'bold', true)
        }
    }, [isBoldMarkActive])


    /** Function to toggle text editor leaf italic mark
     * @param {CustomEditor} editor
    */
    const toggleItalicMark = useCallback((editor: CustomEditor): void => {
        const isActive = isItalicMarkActive(editor)
        if (isActive) {
            Editor.removeMark(editor, 'italic')
        } else {
            Editor.addMark(editor, 'italic', true)
        }
    }, [isItalicMarkActive])


    /** Function to toggle text editor leaf underline mark
     * @param {CustomEditor} editor
    */
    const toggleUnderlineMark = useCallback((editor: CustomEditor): void => {
        const isActive = isUnderlineMarkActive(editor)
        if (isActive) {
            Editor.removeMark(editor, 'underline')
        } else {
            Editor.addMark(editor, 'underline', true)
        }
    }, [isUnderlineMarkActive])


    /** Function to toggle text editor block as type code
     * @param {CustomEditor} editor
    */
    const toggleCodeBlock = useCallback((editor: CustomEditor): void => {
        const isActive = isCodeBlockActive(editor)
        Transforms.setNodes(editor,
            { type: isActive ? 'paragraph' : 'code' },
            { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
        )
    }, [isCodeBlockActive])

    /** Function to toggle text editor block has left align
     * @param {CustomEditor} editor
    */
    const toggleLeftAlign = useCallback((editor: CustomEditor): void => {
        const isActive = isLeftAlignActive(editor)
        const blockType = (editor.getFragment()[0] as CustomElement).type
        if (blockType == 'paragraph' || blockType == 'heading') {
            Transforms.setNodes(editor,
                { type: blockType, align: isActive ? '' : 'left' },
                { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
            )
        }
    }, [isLeftAlignActive])


    /** Function to toggle text editor block has center align
     * @param {CustomEditor} editor
    */
    const toggleCenterAlign = useCallback((editor: CustomEditor): void => {
        const isActive = isCenterAlignActive(editor)
        const blockType = (editor.getFragment()[0] as CustomElement).type
        if (blockType == 'paragraph' || blockType == 'heading') {
            Transforms.setNodes(editor,
                { type: blockType, align: isActive ? '' : 'center' },
                { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
            )
        }
    }, [isCenterAlignActive])


    /** Function to toggle text editor block has right align
     * @param {CustomEditor} editor
    */
    const toggleRightAlign = useCallback((editor: CustomEditor): void => {
        const isActive = isRightAlignActive(editor)
        const blockType = (editor.getFragment()[0] as CustomElement).type
        if (blockType == 'paragraph' || blockType == 'heading') {
            Transforms.setNodes(editor,
                { type: blockType, align: isActive ? '' : 'right' },
                { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
            )
        }
    }, [isRightAlignActive])


    /** Function to toggle text editor block has justify align
     * @param {CustomEditor} editor
    */
    const toggleJustifyAlign = useCallback((editor: CustomEditor): void => {
        const isActive = isJustifyAlignActive(editor)
        const blockType = (editor.getFragment()[0] as CustomElement).type
        if (blockType == 'paragraph' || blockType == 'heading') {
            Transforms.setNodes(editor,
                { type: blockType, align: isActive ? '' : 'justify' },
                { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
            )
        }
    }, [isJustifyAlignActive])


    /** Function to toggle text editor block as type separator
     * @param {CustomEditor} editor
    */
    const toggleSeparator = useCallback((editor: CustomEditor): void => {
        const isActive = isSeparatorActive(editor)
        Transforms.setNodes(editor,
            { type: isActive ? 'paragraph' : 'separator' },
            { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
        )
    }, [isSeparatorActive])


    /** Function to reset block to type paragraph
     * @param {CustomEditor} editor
    */
    const resetToParagraphNode = useCallback((editor: CustomEditor): void => {
        const newParagraphNode: ParagraphElement = { type: 'paragraph', align: '', children: [{ text: '' }] }
        Transforms.insertNodes(editor, newParagraphNode)
    }, [])


    return { isBoldMarkActive, toggleBoldMark, isItalicMarkActive, toggleItalicMark, isUnderlineMarkActive, toggleUnderlineMark, isLeftAlignActive, toggleLeftAlign, isCenterAlignActive, toggleCenterAlign, isRightAlignActive, toggleRightAlign, isJustifyAlignActive, toggleJustifyAlign, isCodeBlockActive, toggleCodeBlock, isSeparatorActive, toggleSeparator, resetToParagraphNode }
}
