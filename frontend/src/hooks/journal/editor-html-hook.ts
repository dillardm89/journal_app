import { useCallback } from 'react'
import escapeHtml from 'escape-html'
import { jsx } from 'slate-hyperscript'
import { Text, type Descendant } from 'slate'
//import { pdfStyles } from '../../utils/user/pdf-styles'
import type { CustomElement, HeadingElement, LinkElement, ParagraphElement, TextAttributesType, TextElement, ListElement, SeparatorElement, CodeElement, ListItemElement } from '../../utils/types/editor-types'


/** Custom useEditorHTMLHook hook to serialize text editor data to HTML for db or deserialize from HTML for text editor object array  */
export function useEditorHTMLHook() {
    /** Function to convert text editor object array to HTML string
     * @param {CustomElement | TextElement} node
     * @returns {string}
     */
    const serializeToHTML = useCallback((node: CustomElement | TextElement): string => {
        if (Text.isText(node)) {
            let string: string = escapeHtml(node.text)
            if (node.underline) { string = `<u>${string}</u>` }
            if (node.italic) { string = `<em>${string}</em>` }
            if (node.bold) { string = `<strong>${string}</strong>` }
            return string
        }

        const childString: string = node.children.map(n => serializeToHTML(n)).join('')

        switch (node.type) {
            case 'code': {
                const isVoidElement: boolean = (node.children.length == 1 && node.children[0].text == '')
                if (isVoidElement) {
                    return '<br />'
                } else { return `<div id="code-block-div"><code>${childString}</code></div>` }
            }
            case 'link':
                return `<a target="_blank" href="${escapeHtml(node.url)}">${childString}</a>`
            case 'paragraph': {
                const isVoidElement: boolean = (node.children.length == 1 && (node.children[0] as TextElement).text == '')
                if (isVoidElement) {
                    return '<br />'
                } else { return `<p style="text-align:${node.align}">${childString}</p>` }
            }
            case 'separator':
                return `<div>${childString}<hr style="border-bottom:2px solid #999999" /></div>`
            case 'list':
                return `<ul>${childString}</ul>`
            case 'list-item':
                return `<li>${childString}</li>`
            case 'heading': {
                const isVoidElement: boolean = (node.children.length == 1 && (node.children[0] as TextElement).text == '')
                if (isVoidElement) {
                    return '<br />'
                } else { return `<h${node.level} style="text-align:${node.align}">${childString}</h${node.level}>` }
            }
            default:
                return childString
        }
    }, [])


    /** Function to convert HTML string to object array
     * @param {HTMLElement | ChildNode} element
     * @param {TextAttributesType} markAttributes
     * @returns {unknown} TextElement, CustomElement, Descendent[], or null
     */
    const deserializeHTMLString = useCallback((element: HTMLElement | ChildNode, markAttributes: TextAttributesType = {}): unknown => {
        if (element.nodeType == Node.TEXT_NODE) {
            const textElement: TextElement = jsx('text', markAttributes, element.textContent)
            return textElement
        } else if (element.nodeType != Node.ELEMENT_NODE) {
            return null
        }

        const nodeAttributes = { ...markAttributes }

        // define attributes for text nodes
        switch (element.nodeName) {
            case 'STRONG':
                nodeAttributes.bold = true
                break
            case 'EM':
                nodeAttributes.italic = true
                break
            case 'U':
                nodeAttributes.underline = true
                break
        }

        const children = Array.from(element.childNodes)
            .map(n => deserializeHTMLString(n, nodeAttributes)).flat()
        if (children.length == 0) {
            children.push(jsx('text', nodeAttributes, ''))
        }

        switch (element.nodeName) {
            case 'BODY':
                return jsx('fragment', {}, children) as Descendant[]
            case 'BR':
                return jsx('element', { type: 'paragraph' }, children) as ParagraphElement
            case 'HR':
                return jsx('element', { type: 'separator' }, children) as SeparatorElement
            case 'CODE':
                return jsx('element', { type: 'code' }, children) as CodeElement
            case 'A':
                return jsx('element', {
                    type: 'link', url: (element as HTMLElement).getAttribute('href')
                }, children) as LinkElement
            case 'LI':
                return jsx('element', { type: 'list-item' }, children) as ListItemElement
            case 'UL':
                return jsx('element', { type: 'list' }, children) as ListElement
            case 'P':
                return jsx('element', { type: 'paragraph', align: (element as HTMLElement).style.textAlign }, children) as ParagraphElement
            case 'H1':
            case 'H2':
            case 'H3':
            case 'H4':
            case 'H5':
            case 'H6':
                return jsx('element', {
                    type: 'heading', level: parseInt(element.nodeName.split('H')[1], 10),
                    align: (element as HTMLElement).style.textAlign
                }, children) as HeadingElement
            default:
                return children as Descendant[]
        }
    }, [])


    return { serializeToHTML, deserializeHTMLString }
}
