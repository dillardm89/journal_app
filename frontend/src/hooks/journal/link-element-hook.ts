import { useCallback } from 'react'
import { Transforms, Element, Editor, Range, Path, Point } from 'slate'
import type { CustomEditor, CustomElement, LinkElement, ListElement, ListItemElement, TextElement } from '../../utils/types/editor-types'


/**
 * FragmentDetails
 * @typedef {object} FragmentDetails
 * @property {boolean} hasLink whether editor selection include Link block
 * @property {LinkElement} linkFragment
 */
type FragmentDetails = {
    hasLink: boolean,
    linkFragment: LinkElement
}


/** Custom useLinkElementHook hook for text editor link button functionality */
export function useLinkElementHook() {
    /** Function to determine if text editor block is type link
     * @param {CustomEditor} editor
     * @returns {boolean}
     */    const isLinkBlockActive = useCallback((editor: CustomEditor): boolean => {
    const [match] = Editor.nodes(editor, {
        match: n => Element.isElement(n) && n.type == 'link',
    })
    return match ? true : false
}, [])


    /** Function to determine if block contains link and return details if true
     * @param {CustomEditor} editor
     * @returns {FragmentDetails}
     */
    const getLinkFragmentDetails = useCallback((editor: CustomEditor): FragmentDetails => {
        const { selection } = editor
        const [, path] = Editor.node(editor, selection!)
        const start = Editor.start(editor, path)
        const end = Editor.end(editor, path)
        const elementFragment = Editor.fragment(editor, { anchor: start, focus: end })[0] as CustomElement

        let hasLink: boolean = false
        let linkFragment: LinkElement = { type: 'link', url: '', children: [{ text: '' }] }
        if ((elementFragment.children[0] as LinkElement).type == 'link') {
            hasLink = true
            linkFragment = (elementFragment.children[0]) as LinkElement
        } else if ((elementFragment.type == 'list')) {
            const listItemElement = (elementFragment as ListElement).children[0] as ListItemElement
            if ((listItemElement.children[0] as LinkElement).type == 'link') {
                hasLink = true
                linkFragment = (listItemElement.children[0]) as LinkElement
            }
        }
        return { hasLink, linkFragment }
    }, [])


    /** Function to create link element for new link block
     * @param {CustomEditor} editor
     * @returns {LinkElement}
     */
    const createLinkElement = useCallback((editor: CustomEditor): LinkElement => {
        const { hasLink, linkFragment } = getLinkFragmentDetails(editor)
        const { selection } = editor
        const isCollapsed = selection && Range.isCollapsed(selection)

        let linkElement: LinkElement
        if (hasLink) {
            linkElement = { type: 'link', url: linkFragment.url, children: [{ text: linkFragment.children[0].text }] }
        } else if (!isCollapsed) {
            const fragment = (editor.getFragment()[0] as CustomElement).children[0]
            let linkText: string
            if ((fragment as ListItemElement).type == 'list-item') {
                const textFragment = (fragment as ListItemElement).children[0] as TextElement
                linkText = textFragment.text
            } else {
                const textFragment = fragment as TextElement
                linkText = textFragment.text
            }
            linkElement = { type: 'link', url: '', children: [{ text: linkText }] }
        } else {
            linkElement = { type: 'link', url: '', children: [{ text: '' }] }
        }
        return linkElement
    }, [getLinkFragmentDetails])


    /** Function to toggle text editor block as type link
     * @param {CustomEditor} editor
     * @param {string} text link text to display
     * @param {sting} url link url
    */
    const toggleLinkBlock = useCallback((editor: CustomEditor, text: string, url: string): void => {
        const { selection } = editor
        const isCollapsed = selection && Range.isCollapsed(selection)
        const isActive = isLinkBlockActive(editor)
        const newLink: LinkElement = { type: 'link', url, children: [{ text: text != '' ? text : url }] }

        if (url != '' && !isCollapsed) {
            if (isActive) {
                Transforms.unwrapNodes(editor, {
                    match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type == 'link'
                })
            }
            Transforms.delete(editor)
            Transforms.insertNodes(editor, newLink)
        } else if (url != '' && isCollapsed) {
            if (!isActive) {
                Transforms.insertNodes(editor, newLink)
            } else {
                const [linkNode] = Editor.nodes(editor, { at: selection, match: n => Element.isElement(n) && n.type == 'link' })
                const linkPath: Path = linkNode[1]

                const isFirstChild: boolean = linkPath[linkPath.length - 1] == 0
                let newPoint: Point
                if (isFirstChild) {
                    newPoint = { path: linkPath, offset: 0 }
                } else {
                    const prevPath = Path.previous(linkPath)
                    const prevOffset = Editor.end(editor, prevPath)
                    newPoint = { path: prevPath, offset: prevOffset.offset }
                }

                Transforms.removeNodes(editor, { at: linkPath })
                Transforms.select(editor, newPoint)
                Transforms.insertNodes(editor, newLink)
            }
        } else if (url == '') {
            if (text != '') {
                Transforms.unwrapNodes(editor, {
                    match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type == 'link'
                })
            } else {
                Transforms.removeNodes(editor, {
                    match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type == 'link'
                })
            }
        }
    }, [isLinkBlockActive])


    return { createLinkElement, isLinkBlockActive, toggleLinkBlock }
}
