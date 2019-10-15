const he = require('he')
const jsdom = require('jsdom')

const { JSDOM } = jsdom

async function handleTML(html, stack = []) {
  let stacked = {}
  let result = ''

  const {
    window: { document },
  } = new JSDOM(html)

  if (stack.length > 0) {
    for (const st of stack) {
      const isComplexQuery = typeof st === 'object' && st.query
      const query = isComplexQuery ? st.query : st
      const nodes = document.querySelectorAll(query)
      nodes.forEach(node => {
        let content = decodeAndTrim(node.textContent)
        if (isComplexQuery) {
          if (st.parse) {
            const parsedContent = st.parse.reduce((acc, query) => {
              const elem = node.querySelector(query)
              if (elem) {
                const cont = decodeAndTrim(elem.textContent)
                if (cont) {
                  return {
                    ...acc,
                    [query]: cont,
                  }
                }
              }
              return acc
            }, {})

            if (Object.keys(parsedContent).length > 0) {
              content = parsedContent
            }
          }
        }

        if (content !== '') {
          if (stacked[query]) {
            stacked[query] = [...stacked[query], content]
          } else {
            stacked[query] = [content]
          }
        }
      })
    }
  }

  return { result: document.body.textContent, stacked }
}

const decodeAndTrim = value => he.decode(value).trim()

module.exports = handleTML
