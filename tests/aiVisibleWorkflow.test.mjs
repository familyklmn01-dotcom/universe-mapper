import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const panel = await readFile(new URL('../src/components/UniverseAIPanel.jsx', import.meta.url), 'utf8')
const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8')

test('AI panel offers visible guided entry points', () => {
  assert.match(panel, /Mulai dari contoh/)
  assert.match(panel, /Mind map bisnis/)
  assert.match(panel, /Struktur tim/)
  assert.match(panel, /Rencana proyek/)
  assert.match(panel, /Buat struktur dengan AI/)
})

test('AI results remain a preview until explicitly applied', () => {
  assert.match(panel, /PRATINJAU AI|HASIL GENERASI/)
  assert.match(panel, /Tambahkan ke canvas/)
  assert.match(panel, /Grafik yang sedang ada tidak akan diganti/)
})

test('AI panel styles are scoped and include reduced-motion handling', () => {
  assert.match(css, /\.universe-ai-intro/)
  assert.match(css, /prefers-reduced-motion:reduce/)
})
