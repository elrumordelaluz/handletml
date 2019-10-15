import test from 'ava'
import handletml from '.'

const h1 = 'Hola'
const p = 'Lorem ipsum dolor sit amet'
const html = `<h1>${h1}</h1> <p>${p}</p>`
const text = `${h1} ${p}`

test('Result', async t => {
  const { result } = await handletml(html)
  t.true(result === text)
})

test('Stacked simple', async t => {
  const { stacked } = await handletml(html, ['h1', 'p'])
  t.true(Array.isArray(stacked.h1))
  t.true(stacked.h1.length === 1)
  t.true(Array.isArray(stacked.p))
  t.true(stacked.p.length === 1)
  t.true(stacked.h1[0] === h1)
  t.true(stacked.p[0] === p)
})

test('Stacked more items', async t => {
  const html = `
  <ul>
    <li><strong>Item 1</strong><p>Lorem Ipsum</p></li>
    <li><strong>Item 2</strong><p>Lorem Ipsum</p></li>
    <li><strong>Item 3</strong><p>Lorem Ipsum</p></li>
  </ul>`
  const { stacked } = await handletml(html, [
    { query: 'li', parse: ['strong', 'p'] },
  ])
  t.true(Array.isArray(stacked.li))
  t.true(stacked.li.length === 3)
  let n = 1
  for (const item of stacked.li) {
    t.true(item.p === 'Lorem Ipsum')
    t.true(item.strong === `Item ${n++}`)
  }
})
