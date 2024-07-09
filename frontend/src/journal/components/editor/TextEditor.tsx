import { useState, useCallback, useEffect, useMemo, KeyboardEvent } from 'react'
import { createEditor, Node, type Descendant } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { useEditorHTMLHook } from '../../../hooks/journal/editor-html-hook'
import { useBlockElementHook } from '../../../hooks/journal/block-element-hook'
import WordCount from './WordCount'
import ToolBar from './ToolBar'
import TextLeaf, { type TextLeafProps } from './TextLeaf'
import type { CustomEditor, RenderPropsType } from '../../../utils/types/editor-types'
import type { ToolBarProps } from './ToolBar'


/**
 * TextEditorProps
 * @typedef {object} TextEditorProps
 * @property {string} journalContent string with HTML tags (empty for new journals)
 * @property {string} journalTitle string with journal title (empty for new journals)
 * @property {function} onSave callback function to update array of element objects displayed in text editor
 */
type TextEditorProps = ToolBarProps & {
    journalContent: string,
    journalTitle: string,
    onSave: (editorArray: Descendant[]) => void,
}


/**
 * Component for rending Slate rich text editor
 * Props passed down from JournalEditor
 * @param {object} TextEditorProps
 * @returns {React.JSX.Element}
 */
export default function TextEditor({ journalContent, journalTitle, onSave }: TextEditorProps): React.JSX.Element {
    const { deserializeHTMLString } = useEditorHTMLHook()
    const { toggleBoldMark, toggleItalicMark, toggleUnderlineMark, resetToParagraphNode } = useBlockElementHook()

    const [strippedContent, setStrippedContent] = useState<string>('')
    const [componentKey, setComponentKey] = useState<number>(0)
    const [contentArray, setContentArray] = useState<Descendant[]>([{ type: 'paragraph', align: '', children: [{ text: '' }] }])


    /**
     * Functions to set inline element types
     * @param {CustomEditor} editor
     * @returns {CustomEditor}
    */
    const withInlines = (editor: CustomEditor): CustomEditor => {
        const { isInline } = editor
        editor.isInline = element => ['link'].includes(element.type) || isInline(element)
        return editor
    }


    // Create global editor
    const editor = useMemo(() => withInlines(withReact(createEditor())), [])


    /** Function to determine element for rendering based on props passed
     * @param {object} RenderPropsType
     * @returns {React.JSX.Element}
     */
    const renderElement = useCallback(({ attributes, children, element }: RenderPropsType): React.JSX.Element => {
        switch (element.type) {
            case 'heading': {
                const HeadingLevel = `h${element.level}` as keyof JSX.IntrinsicElements
                return <HeadingLevel {...attributes} style={{ textAlign: element.align ? element.align : undefined }}>
                    {children}
                </HeadingLevel>
            }
            case 'code':
                return <div id='code-block-div'><code {...attributes} >{children}</code></div>
            case 'link':
                return <a {...attributes} target='_blank' href={element.url}>{children}</a>
            case 'list':
                return <ul {...attributes}>{children}</ul>
            case 'list-item':
                return <li {...attributes}>{children}</li>
            case 'separator':
                return (<div {...attributes} style={{ borderBottom: '2px solid #999999' }} >{children}</div >)
            default:
                return <p {...attributes} style={{ textAlign: element.align ? element.align : undefined }}>{children}</p>
        }
    }, [])


    /** Function to render text leaf (element children)
     * @param {object} TextLeafProps
     * @returns {React.JSX.Element}
     */
    const renderLeaf = useCallback(({ ...props }: TextLeafProps): React.JSX.Element => {
        return <TextLeaf {...props} />
    }, [])


    /**
     * Function to convert array of element objects to string
     * to calculate word and character counts in WordCount component
     * @param {Descendant[]} contentArray
     */
    const stripElementArray = useCallback((contentArray: Descendant[]) => {
        const contentString = contentArray.map(n => Node.string(n)).join(' ')
        setStrippedContent(contentString)
    }, [])


    /**
     * Function to handle change event in Slate editor
     * @param {Descendant[]} value
     */
    const handleChange = (value: Descendant[]): void => {
        const isAstChange = editor.operations.some(op => 'set_selection' !== op.type)
        if (isAstChange) { stripElementArray(value) }
    }


    /** Function to bind keyboard events
     * @param {KeyboardEvent} event
     */
    const handleKeyDownEvent = (event: KeyboardEvent): void => {
        if (event.ctrlKey && event.key == 'b') {
            event.preventDefault()
            toggleBoldMark(editor)
        } else if (event.ctrlKey && event.key == 'i') {
            event.preventDefault()
            toggleItalicMark(editor)
        } else if (event.ctrlKey && event.key == 'u') {
            event.preventDefault()
            toggleUnderlineMark(editor)
        } else if (event.ctrlKey && event.key == 'Enter') {
            event.preventDefault()
            resetToParagraphNode(editor)
        }
    }


    useEffect(() => {
        // useEffect to load journal for editing
        const getContentArray = (contentString: string) => {
            const document = new DOMParser().parseFromString(contentString, 'text/html')
            const content = deserializeHTMLString(document.body) as Descendant[]
            setContentArray(content)
        }

        if (journalContent != '') {
            getContentArray(journalContent)
            setComponentKey(1)

            const strippedContent = journalContent.replace(/(<([^>]+)>)/ig, '')
            setStrippedContent(strippedContent)
        }
    }, [journalContent, deserializeHTMLString])


    return (<>
        <div key={componentKey} className='text-box-div'>
            <Slate editor={editor} initialValue={contentArray}
                onChange={(value: Descendant[]) => handleChange(value)}
            >
                <ToolBar onSave={onSave} journalTitle={journalTitle} />

                <div className='editor-scroller' >
                    <div className='editor-element-div'>
                        <Editable placeholder={journalContent == '' ? 'Write in your journal...' : undefined}
                            renderElement={renderElement}
                            renderLeaf={renderLeaf}
                            spellCheck={true}
                            autoFocus={true}
                            onKeyDown={(event: KeyboardEvent) => handleKeyDownEvent(event)}
                        />
                    </div>
                </div>
            </Slate >
        </div >

        <WordCount strippedContent={strippedContent} />
    </>)
}

