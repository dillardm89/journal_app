import { useState, useEffect } from 'react'


/**
 * WordCountProps
 * @typedef {object} WordCountProps
 * @property {string} strippedContent (optional) content for existing journal to edit
 */
type WordCountProps = {
    strippedContent?: string
}


/**
 * Component for rending editor word count
 * Props passed down from JournalEditor
 * @param {object} WordCountProps
 * @returns {React.JSX.Element}
 */
export default function WordCount({ strippedContent }: WordCountProps): React.JSX.Element {
    const [wordCount, setWordCount] = useState<number>(0)
    const [characterCount, setCharacterCount] = useState<number>(0)


    useEffect(() => {
        //useEffect to update content word count
        if (strippedContent) {
            const wordList: string[] = strippedContent.split(' ')
            const wordCount: number = wordList.length
            setWordCount(wordCount)

            const characterString: string = strippedContent.replace(' ', '')
            const characterCount: number = characterString.length
            setCharacterCount(characterCount)
        }
    }, [strippedContent])


    return (
        <div className='word-count-div'>
            <p className='word-count'>Word Count:  {wordCount.toLocaleString('en-us')}</p>
            <p className='character-count'>Character Count:  {characterCount.toLocaleString('en-us')}</p>
        </div>
    )
}
