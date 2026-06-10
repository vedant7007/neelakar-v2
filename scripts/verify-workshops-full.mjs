import { chromium } from 'playwright'
import fs from 'fs'

const OUT = 'c:/tmp/shots4'
fs.mkdirSync(OUT, { recursive: true })
const URL = 'http://localhost:3000/workshops?preview=1'

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const errors = []

const d = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
d.on('console', m => { if (m.type() === 'error') errors.push('desktop: ' + m.text().slice(0, 200)) })
await d.goto(URL, { waitUntil: 'networkidle', timeout: 90000 })
await d.waitForTimeout(2600)

// Walk down the full page section by section
const steps = ['hero', 'idea', 'review', 'learn', 'programme', 'cta']
for (let i = 0; i < 11; i++) {
  await d.screenshot({ path: `${OUT}/d-${String(i).padStart(2, '0')}.png` })
  await d.evaluate(() => window.scrollBy(0, Math.round(window.innerHeight * 0.85)))
  await d.waitForTimeout(900)
}

// Mobile full-page strips
const m = await (await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage()
m.on('console', x => { if (x.type() === 'error') errors.push('mobile: ' + x.text().slice(0, 200)) })
await m.goto(URL, { waitUntil: 'networkidle', timeout: 90000 })
await m.waitForTimeout(2600)
for (let i = 0; i < 12; i++) {
  await m.screenshot({ path: `${OUT}/m-${String(i).padStart(2, '0')}.png` })
  await m.evaluate(() => window.scrollBy(0, Math.round(window.innerHeight * 0.85)))
  await m.waitForTimeout(800)
}

console.log('CONSOLE ERRORS (' + errors.length + '):')
errors.slice(0, 15).forEach(e => console.log(' -', e))
await browser.close()
