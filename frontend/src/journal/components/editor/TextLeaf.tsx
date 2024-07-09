import { ReactNode } from 'react'
import type { TextElement } from '../../../utils/types/editor-types'


/**
 * TextLeafProps
 * @typedef {object} TextLeafProps
 * @property {object} attributes SlateDOM attributes
 * @property {object} leaf TextElement
 * @property {ReactNode} children child(ren) element(s) to be rendered
 */
export type TextLeafProps = {
    attributes: object,
    leaf: TextElement,
    children: ReactNode
}


/**
 * Component for rendering styled leaf in text editor
 * Props passed down from TextEditor
 * @param {object} TextLeafProps
 * @returns {React.JSX.Element}
 */
export default function TextLeaf({ attributes, children, leaf }: TextLeafProps): React.JSX.Element {
    return (
        <span {...attributes}
            style={{
                fontWeight: leaf.bold ? 'bold' : 'normal',
                fontStyle: leaf.italic ? 'italic' : 'normal',
                textDecoration: leaf.underline ? 'underline' : undefined
            }}
        >
            {children}
        </span>
    )
}
