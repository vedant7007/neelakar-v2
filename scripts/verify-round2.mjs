import { chromium } from 'playwright'
import fs from 'fs'

const OUT = 'c:/tmp/shots2'
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'msedge', headless: true })

const errors = []
const desktop = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
desktop.on('console', m => { if (m.type() === 'error') errors.push('desktop: ' + m.text().slice(0, 200)) })

// Workshops page
await desktop.goto('http://localhost:3000/workshops', { waitUntil: 'networkidle', timeout: 90000 })
await desktop.waitForTimeout(2500)
await desktop.screenshot({ path: `${OUT}/01-workshops.png` })

// Try opening a register form if a workshop exists
const reserveBtn = desktop.locator('text=Reserve').first()
if (await reserveBtn.count() > 0) {
  await reserveBtn.click()
  await desktop.waitForTimeout(800)
  await desktop.screenshot({ path: `${OUT}/02-workshops-form.png` })
}

// Admin login
await desktop.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle', timeout: 90000 })
await desktop.waitForTimeout(1500)
await desktop.screenshot({ path: `${OUT}/03-admin-login.png` })

// Admin redirect check: /admin should land on login
await desktop.goto('http://localhost:3000/admin', { waitUntil: 'networkidle', timeout: 90000 })
await desktop.waitForTimeout(1500)
console.log('admin redirect landed on:', desktop.url())

// Mobile checks
const mob = await (await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage()
mob.on('console', m => { if (m.type() === 'error') errors.push('mobile: ' + m.text().slice(0, 200)) })

await mob.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 90000 })
await mob.waitForTimeout(3000)
await mob.screenshot({ path: `${OUT}/04-mobile-home.png` })

await mob.goto('http://localhost:3000/production', { waitUntil: 'networkidle', timeout: 90000 })
await mob.waitForTimeout(2500)
await mob.screenshot({ path: `${OUT}/05-mobile-production.png` })

await mob.goto('http://localhost:3000/production/photography', { waitUntil: 'networkidle', timeout: 90000 })
await mob.waitForTimeout(3500)
await mob.screenshot({ path: `${OUT}/06-mobile-photography.png` })

await mob.goto('http://localhost:3000/workshops', { waitUntil: 'networkidle', timeout: 90000 })
await mob.waitForTimeout(2500)
await mob.screenshot({ path: `${OUT}/07-mobile-workshops.png` })

console.log('CONSOLE ERRORS (' + errors.length + '):')
errors.slice(0, 15).forEach(e => console.log(' -', e))

await browser.close()
