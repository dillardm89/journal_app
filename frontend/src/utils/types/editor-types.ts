import { ReactNode } from 'react'
import type { BaseEditor } from 'slate'
import type { ReactEditor } from 'slate-react'


/**
 * CustomEditor
 * @typedef {object} CustomEditor
 */
export type CustomEditor = BaseEditor & ReactEditor


/**
 * RenderPropsType
 * @typedef {object} RenderPropsType
 * @property {object} element CustomElement type
 */
export type RenderPropsType = {
    attributes: object,
    element: CustomElement,
    children: ReactNode
}


/**
 * TextAttributesType
 * @typedef {object} TextAttributesType
 * @property {boolean} bold (optional)
 * @property {boolean} italic (optional)
 */
export type TextAttributesType = {
    bold?: boolean,
    italic?: boolean,
    underline?: boolean
}


/**
 * TextElement
 * @typedef {object} TextElement
 * @property {string} text
 */
export type TextElement = TextAttributesType & {
    text: string
}


/**
 * ParagraphElement
 * @typedef {object} ParagraphElement
 * @property {string} type 'paragraph'
 * @property {string} align text align for inline CSS style
 * @property {array} children array of TextElement or LinkElement objects
 */
export type ParagraphElement = {
    type: 'paragraph',
    align: 'left' | 'center' | 'right' | 'justify' | '',
    children: (TextElement | LinkElement)[]
}


/**
 * LinkElement
 * @typedef {object} LinkElement
 * @property {string} type 'paragraph'
 * @property {string} url
 * @property {array} children array of TextElement objects (array only ever has 1 object
 *                              but must be per array for Slate DOM model)
 */
export type LinkElement = {
    type: 'link',
    url: string,
    children: TextElement[]
}


/**
 * HeadingElement
 * @typedef {object} HeadingElement
 * @property {string} type 'heading'
 * @property {number} level level for CSS H tag (H1, H2, H3, H4, H5, H6)
 * @property {string} align text align for inline CSS style
 * @property {array} children array of TextElement or LinkElement objects (array only ever has 1 object
 *                              but must be per array for Slate DOM model)
 */
export type HeadingElement = {
    type: 'heading',
    level: number,
    align: 'left' | 'center' | 'right' | 'justify' | '',
    children: (TextElement | LinkElement)[]
}


/**
 * CodeElement
 * @typedef {object} CodeElement
 * @property {string} type 'code'
 * @property {array} children array of TextElement objects (array only ever has 1 object
 *                              but must be per array for Slate DOM model)
 */
export type CodeElement = {
    type: 'code',
    children: TextElement[]
}


/**
 * SeparatorElement
 * @typedef {object} SeparatorElement
 * @property {string} type 'separator'
 * @property {array} children array of TextElement objects (array only ever has 1 object
 *                              but must be per array for Slate DOM model)
 */
export type SeparatorElement = {
    type: 'separator',
    children: TextElement[]
}


/**
 * ListElement
 * @typedef {object} ListElement
 * @property {string} type 'list'
 * @property {array} children array of ListItemElement objects
 */
export type ListElement = {
    type: 'list',
    children: ListItemElement[]
}


/**
 * ListItemElement
 * @typedef {object} ListItemElement
 * @property {string} type 'list-item'
 * @property {array} children array of TextElement objects (array only ever has 1 object
 *                              but must be per array for Slate DOM model)
 */
export type ListItemElement = {
    type: 'list-item',
    children: TextElement[] | LinkElement[]
}


/**
 * CustomElement
 * @typedef {object} CustomElement
 */
export type CustomElement = ParagraphElement | HeadingElement | CodeElement | LinkElement | ListElement | ListItemElement | SeparatorElement


/**
 * Extends CustomTypes interface from 'slate' module
 * @property {interface} Editor CustomEditor interface
 * @property {object} Element CustomElement type
 * @property {object} Text TextElement type
 */
declare module 'slate' {
    interface CustomTypes {
        Editor: CustomEditor,
        Element: CustomElement,
        Text: TextElement,
    }
}
