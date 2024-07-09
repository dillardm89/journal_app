// Styles from index.css applicable to pdf generation to prepend and append the serialized html string

export const pdfStartString = '<html><head><style>body { font-family: Helvetica, Arial; line-height: 1.5; font-weight: 400; font-size: 12px; } div#code-block-div { padding: 5px; background-color: #2E4F4F; color: #CBE4DE; } a { text-decoration: none; color: #0E8388; }</style></head><body>'

export const pdfEndString = '</body></html>'
