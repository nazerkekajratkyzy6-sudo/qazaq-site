// Қолданылуы: SITE_URL=https://сіздің-сайт.vercel.app npm run qr
import QRCode from 'qrcode'
import { mkdirSync } from 'node:fs'
const url = process.env.SITE_URL
if (!url || !/^https?:\/\//.test(url)) {
  console.error('SITE_URL көрсетілмеген. Мысалы: SITE_URL=https://example.vercel.app npm run qr')
  process.exit(1)
}
const base = url.replace(/\/$/, '')
const targets = {
  'qr-home': base + '/#/',
  'qr-archive': base + '/#/archive',
  'qr-lab': base + '/#/lab',
  'qr-games': base + '/#/games',
  'qr-results': base + '/#/results',
}
mkdirSync('public/qr', { recursive: true })
for (const [name, link] of Object.entries(targets)) {
  await QRCode.toFile(`public/qr/${name}.png`, link, { width: 640, margin: 2, color: { dark: '#2A2521', light: '#FDFBF6' } })
  console.log(name, '→', link)
}
