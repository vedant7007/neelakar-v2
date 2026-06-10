import { chromium } from 'playwright'
import fs from 'fs'

const OUT = 'c:/tmp/shots'
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()

const errors = []
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 300)) })
page.on('pageerror', e => errors.push('PAGEERROR: ' + String(e).slice(0, 300)))

async function shot(name) {
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log('shot:', name)
}

// Homepage top
await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 90000 })
await page.waitForTimeout(3000)
await shot('01-home-hero')

// Scroll to trigger navbar + check double logo zone
await page.mouse.wheel(0, 1200)
await page.waitForTimeout(1500)
await shot('02-home-scrolled-navbar')

await page.mouse.wheel(0, 2500)
await page.waitForTimeout(1500)
await shot('03-home-mid')

await page.mouse.wheel(0, 4000)
await page.waitForTimeout(1500)
await shot('04-home-lower')

// Scroll to bottom for footer
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await page.waitForTimeout(2000)
await shot('05-home-footer')

// Production
await page.goto('http://localhost:3000/production', { waitUntil: 'networkidle', timeout: 90000 })
await page.waitForTimeout(3000)
await shot('06-production-hero')
await page.mouse.wheel(0, 1800)
await page.waitForTimeout(1500)
await shot('07-production-featured')
await page.mouse.wheel(0, 2400)
await page.waitForTimeout(1500)
await shot('08-production-mid')
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await page.waitForTimeout(1500)
await shot('09-production-bottom')

// Photography
await page.goto('http://localhost:3000/production/photography', { waitUntil: 'networkidle', timeout: 90000 })
await page.waitForTimeout(4000)
await shot('10-photography')

// Videography
await page.goto('http://localhost:3000/production/videography', { waitUntil: 'networkidle', timeout: 90000 })
await page.waitForTimeout(4000)
await shot('11-videography')

// Create with us
await page.goto('http://localhost:3000/create-with-us', { waitUntil: 'networkidle', timeout: 90000 })
await page.waitForTimeout(3000)
await shot('12-create-with-us')

// 404 page
await page.goto('http://localhost:3000/this-does-not-exist', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(1500)
await shot('13-not-found')

// Mobile viewport check — homepage + production
const mob = await (await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage()
await mob.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 90000 })
await mob.waitForTimeout(3000)
await mob.screenshot({ path: `${OUT}/14-mobile-home.png` })
await mob.goto('http://localhost:3000/production', { waitUntil: 'networkidle', timeout: 90000 })
await mob.waitForTimeout(3000)
await mob.screenshot({ path: `${OUT}/15-mobile-production.png` })
await mob.goto('http://localhost:3000/production/photography', { waitUntil: 'networkidle', timeout: 90000 })
await mob.waitForTimeout(3000)
await mob.screenshot({ path: `${OUT}/16-mobile-photography.png` })
await mob.goto('http://localhost:3000/create-with-us', { waitUntil: 'networkidle', timeout: 90000 })
await mob.waitForTimeout(3000)
await mob.screenshot({ path: `${OUT}/17-mobile-create.png` })
console.log('mobile shots done')

console.log('CONSOLE ERRORS (' + errors.length + '):')
errors.slice(0, 20).forEach(e => console.log(' -', e))

await browser.close()
