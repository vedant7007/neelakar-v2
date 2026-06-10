import { chromium } from 'playwright'
import fs from 'fs'

const OUT = 'c:/tmp/shots3'
fs.mkdirSync(OUT, { recursive: true })
const URL = 'http://localhost:3000/workshops?preview=1'

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const errors = []

// Desktop
const d = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
d.on('console', m => { if (m.type() === 'error') errors.push('desktop: ' + m.text().slice(0, 200)) })
await d.goto(URL, { waitUntil: 'networkidle', timeout: 90000 })
await d.waitForTimeout(2800) // let hero animation settle
await d.screenshot({ path: `${OUT}/01-hero.png` })

// Scroll into the list
await d.evaluate(() => window.scrollTo(0, 700))
await d.waitForTimeout(1400)
await d.screenshot({ path: `${OUT}/02-list-top.png` })

await d.evaluate(() => window.scrollTo(0, 1500))
await d.waitForTimeout(1400)
await d.screenshot({ path: `${OUT}/03-list-mid.png` })

// Hover a row + open the reserve form
const reserve = d.locator('.wk-reserve').first()
if (await reserve.count() > 0) {
  await reserve.scrollIntoViewIfNeeded()
  await d.waitForTimeout(500)
  await reserve.click()
  await d.waitForTimeout(900)
  await d.screenshot({ path: `${OUT}/04-reserve-open.png` })
}

// Full page tall capture
await d.evaluate(() => window.scrollTo(0, 0))
await d.waitForTimeout(600)
await d.screenshot({ path: `${OUT}/05-fullpage.png`, fullPage: true })

// Mobile
const m = await (await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage()
m.on('console', x => { if (x.type() === 'error') errors.push('mobile: ' + x.text().slice(0, 200)) })
await m.goto(URL, { waitUntil: 'networkidle', timeout: 90000 })
await m.waitForTimeout(2800)
await m.screenshot({ path: `${OUT}/06-mobile-hero.png` })
await m.evaluate(() => window.scrollTo(0, 620))
await m.waitForTimeout(1400)
await m.screenshot({ path: `${OUT}/07-mobile-list.png` })
const mReserve = m.locator('.wk-reserve').first()
if (await mReserve.count() > 0) {
  await mReserve.scrollIntoViewIfNeeded()
  await m.waitForTimeout(500)
  await mReserve.click()
  await m.waitForTimeout(900)
  await m.screenshot({ path: `${OUT}/08-mobile-reserve.png` })
}

console.log('CONSOLE ERRORS (' + errors.length + '):')
errors.slice(0, 15).forEach(e => console.log(' -', e))
await browser.close()
