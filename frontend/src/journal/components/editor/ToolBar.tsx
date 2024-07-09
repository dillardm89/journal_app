import { useState } from 'react'
import { useSlate } from 'slate-react'
import type { Descendant } from 'slate'
import { Tooltip } from 'react-tooltip'
import { useLinkElementHook } from '../../../hooks/journal/link-element-hook'
import { useHeadingElementHook } from '../../../hooks/journal/heading-element-hook'
import { useBlockElementHook } from '../../../hooks/journal/block-element-hook'
import { useListElementHook } from '../../../hooks/journal/list-element-hook'
import { useEditorHTMLHook } from '../../../hooks/journal/editor-html-hook'
import AddLinkModal from './AddLinkModal'
import Button from '../../../shared/components/elements/Button'
import HeadingMenu from './HeadingMenu'
import PdfElementModal from './PdfElementModal'
import saveIcon from '../../../assets/icons/save-icon.png'
import pdfIcon from '../../../assets/icons/pdf-icon.png'
import boldIcon from '../../../assets/icons/bold-icon.png'
import italicIcon from '../../../assets/icons/italic-icon.png'
import underlineIcon from '../../../assets/icons/underline-icon.png'
import leftIcon from '../../../assets/icons/left-icon.png'
import centerIcon from '../../../assets/icons/center-icon.png'
import rightIcon from '../../../assets/icons/right-icon.png'
import justifyIcon from '../../../assets/icons/justify-icon.png'
import listIcon from '../../../assets/icons/list-icon.png'
import linkIcon from '../../../assets/icons/link-icon.png'
import horizontalIcon from '../../../assets/icons/horizontal-icon.png'
import codeIcon from '../../../assets/icons/code-icon.png'
import type { LinkElement } from '../../../utils/types/editor-types'
import { pdfStartString, pdfEndString } from '../../../utils/user/pdf-styles'
import '../../../../public/styles/journal/editor/toolbar.css'


/**
 * ToolBarProps
 * @typedef {object} ToolBarProps
 * @property {string} journalTitle string with journal title (empty for new journals)
 * @property {function} onSave callback function to update array of element objects displayed in text editor
 */
export type ToolBarProps = {
    journalTitle: string,
    onSave: (editorArray: Descendant[]) => void
}


/**
 * Component for rending editor toolbar
 * Props passed down from TextEditor
 * @param {object} ToolBarProps
 * @returns {React.JSX.Element}
 */
export default function ToolBar({ journalTitle, onSave }: ToolBarProps): React.JSX.Element {
    const editor = useSlate()
    const { serializeToHTML } = useEditorHTMLHook()
    const { isBoldMarkActive, toggleBoldMark, isItalicMarkActive, toggleItalicMark, isUnderlineMarkActive, toggleUnderlineMark, isLeftAlignActive, toggleLeftAlign, isCenterAlignActive, toggleCenterAlign, isRightAlignActive, toggleRightAlign, isJustifyAlignActive, toggleJustifyAlign, isSeparatorActive, toggleSeparator, isCodeBlockActive, toggleCodeBlock } = useBlockElementHook()
    const { isLinkBlockActive, createLinkElement } = useLinkElementHook()
    const { isListBlockActive, toggleListBlock } = useListElementHook()
    const { isHeadingBlockActive } = useHeadingElementHook()


    const [openLinkModal, setOpenLinkModal] = useState<boolean>(false)
    const [openPdfModal, setOpenPdfModal] = useState<boolean>(false)
    const [modalComponentKey, setModalComponentKey] = useState<number>(0)
    const [showHeadingMenu, setShowHeadingMenu] = useState<boolean>(false)
    const [pdfString, setPdfString] = useState<string>('')
    const [linkElement, setLinkEelement] = useState<LinkElement>({ type: 'link', url: '', children: [{ text: '' }] })


    /**
     * Function to handle closing link or pdf modal
     * @param {string} modalType either 'link' or 'pdf'
     */
    const handleCloseModal = (modalType: string): void => {
        document.querySelector('body')!.id = ''
        if (modalType == 'link') {
            setOpenLinkModal(false)
        } else {
            setOpenPdfModal(false)
        }
    }


    /** Function to handle opening link modal */
    const handleOpenLinkModal = (): void => {
        const linkElement: LinkElement = createLinkElement(editor)
        setLinkEelement(linkElement)
        setModalComponentKey(modalComponentKey + 1)
        setOpenLinkModal(true)
    }


    /**
     * Function to open pdf modal for exporting journal
     * @param {Descendant[]} editorArray
     */
    const handleOpenPdfModal = (editorArray: Descendant[]): void => {
        let stringHTML: string = pdfStartString
        for (const elementItem of editorArray) { stringHTML += serializeToHTML(elementItem) }
        stringHTML += pdfEndString
        setPdfString(stringHTML)
        setOpenPdfModal(true)
    }


    return (<>
        {openPdfModal && (
            <PdfElementModal openModal={openPdfModal} pdfString={pdfString} journalTitle={journalTitle}
                onCloseModal={() => handleCloseModal('pdf')} />)}

        <AddLinkModal key={modalComponentKey} openModal={openLinkModal} linkElement={linkElement}
            onCloseModal={() => handleCloseModal('link')} />

        <div className='toolbar-div'>
            <Button type='submit' classId='toolbar-btn'
                onClick={() => onSave(editor.children)} >
                <img className='toolbar-btn-img' src={saveIcon} alt='Save'
                    data-tooltip-id='save-tooltip' data-tooltip-content='Save File' data-tooltip-place='bottom' />
            </Button>
            <Tooltip id='save-tooltip' style={{ zIndex: 10 }} />

            <Button type='button' classId='toolbar-btn'
                onClick={() => handleOpenPdfModal(editor.children)}
                style={{ fontWeight: 'bold' }}>
                <img className='toolbar-btn-img' src={pdfIcon} alt='PDF'
                    data-tooltip-id='pdf-tooltip' data-tooltip-content='Export PDF' data-tooltip-place='bottom' />
            </Button>
            <Tooltip id='pdf-tooltip' style={{ zIndex: 10 }} />

            <Button type='button' classId='toolbar-btn'
                active={editor && isBoldMarkActive(editor)}
                onClick={() => toggleBoldMark(editor)}
                style={{ fontWeight: 'bold' }}>
                <img className='toolbar-btn-img' src={boldIcon} alt='B'
                    data-tooltip-id='bold-tooltip' data-tooltip-content='Bold' data-tooltip-place='bottom' />
            </Button>
            <Tooltip id='bold-tooltip' style={{ zIndex: 10 }} />

            <Button type='button' classId='toolbar-btn toolbar-italic-btn'
                active={editor && isItalicMarkActive(editor)}
                onClick={() => toggleItalicMark(editor)}
                style={{ fontStyle: 'italic' }}>
                <img className='toolbar-btn-img' src={italicIcon} alt='I'
                    data-tooltip-id='italic-tooltip' data-tooltip-content='Italic' data-tooltip-place='bottom' />
            </Button>
            <Tooltip id='italic-tooltip' style={{ zIndex: 10 }} />

            <Button type='button' classId='toolbar-btn'
                active={editor && isUnderlineMarkActive(editor)}
                onClick={() => toggleUnderlineMark(editor)}
                style={{ textDecoration: 'underline' }}>
                <img className='toolbar-btn-img' src={underlineIcon} alt='U'
                    data-tooltip-id='underline-tooltip' data-tooltip-content='Underline' data-tooltip-place='bottom' />
            </Button>
            <Tooltip id='underline-tooltip' style={{ zIndex: 10 }} />

            <Button type='button' classId='toolbar-btn'
                active={editor && isLeftAlignActive(editor)}
                onClick={() => toggleLeftAlign(editor)}>
                <img className='toolbar-btn-img' src={leftIcon} alt='Left'
                    data-tooltip-id='left-tooltip' data-tooltip-content='Left Align' data-tooltip-place='bottom' />
            </Button>
            <Tooltip id='left-tooltip' style={{ zIndex: 10 }} />

            <Button type='button' classId='toolbar-btn'
                active={editor && isCenterAlignActive(editor)}
                onClick={() => toggleCenterAlign(editor)}>
                <img className='toolbar-btn-img' src={centerIcon} alt='Center'
                    data-tooltip-id='center-tooltip' data-tooltip-content='Center Align' data-tooltip-place='bottom' />
            </Button>
            <Tooltip id='center-tooltip' style={{ zIndex: 10 }} />

            <Button type='button' classId='toolbar-btn'
                active={editor && isRightAlignActive(editor)}
                onClick={() => toggleRightAlign(editor)}>
                <img className='toolbar-btn-img' src={rightIcon} alt='Right'
                    data-tooltip-id='right-tooltip' data-tooltip-content='Right Align' data-tooltip-place='bottom' />
            </Button>
            <Tooltip id='right-tooltip' style={{ zIndex: 10 }} />

            <Button type='button' classId='toolbar-btn'
                active={editor && isJustifyAlignActive(editor)}
                onClick={() => toggleJustifyAlign(editor)}>
                <img className='toolbar-btn-img' src={justifyIcon} alt='Justify'
                    data-tooltip-id='justify-tooltip' data-tooltip-content='Justify' data-tooltip-place='bottom' />
            </Button>
            <Tooltip id='justify-tooltip' style={{ zIndex: 10 }} />

            <div className='heading-menu-div' data-tooltip-id='heading-tooltip' data-tooltip-content='Heading Menu' data-tooltip-place='bottom'>
                <Button type='button' classId='heading-toolbar-btn'
                    active={editor && isHeadingBlockActive(editor)}
                    onClick={() => setShowHeadingMenu((prevMode) => !prevMode)}>
                    Heading
                </Button>
                {showHeadingMenu &&
                    <HeadingMenu onSelect={() => setShowHeadingMenu((prevMode) => !prevMode)} />}
            </div>
            <Tooltip id='heading-tooltip' style={{ zIndex: 10 }} />


            <Button type='button' classId='toolbar-btn'
                active={editor && isListBlockActive(editor)}
                onClick={() => toggleListBlock(editor)}>
                <img className='toolbar-btn-img' src={listIcon} alt='List'
                    data-tooltip-id='list-tooltip' data-tooltip-content='List' data-tooltip-place='bottom' />
            </Button>
            <Tooltip id='list-tooltip' style={{ zIndex: 10 }} />

            <Button type='button' classId='toolbar-btn'
                active={editor && isLinkBlockActive(editor)}
                onClick={handleOpenLinkModal}>
                <img className='toolbar-btn-img' src={linkIcon} alt='Link'
                    data-tooltip-id='link-tooltip' data-tooltip-content='Add Link' data-tooltip-place='bottom' />
            </Button>
            <Tooltip id='link-tooltip' style={{ zIndex: 10 }} />

            <Button type='button' classId='toolbar-btn'
                active={editor && isSeparatorActive(editor)}
                onClick={() => toggleSeparator(editor)}>
                <img className='toolbar-btn-img' src={horizontalIcon} alt='Separator'
                    data-tooltip-id='separator-tooltip' data-tooltip-content='Separator' data-tooltip-place='bottom' />
            </Button>
            <Tooltip id='separator-tooltip' style={{ zIndex: 10 }} />

            <Button type='button' classId='toolbar-btn'
                active={editor && isCodeBlockActive(editor)}
                onClick={() => toggleCodeBlock(editor)}>
                <img className='toolbar-btn-img' src={codeIcon} alt='Code'
                    data-tooltip-id='code-tooltip' data-tooltip-content='Code Block' data-tooltip-place='bottom' />
            </Button>
            <Tooltip id='code-tooltip' style={{ zIndex: 10 }} />
        </div>
    </>)
}
