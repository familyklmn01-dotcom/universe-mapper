import { useState } from 'react'
import { generateFreeAIStructure } from '../lib/aiClient.js'

const renderTree = (node, path = '0') => (
  <div className="universe-ai-preview-branch" key={path}>
    <span>{node.name}</span>
    {(node.children || []).map((child, index) => renderTree(child, `${path}-${index}`))}
  </div>
)

export default function UniverseAIPanel({ onClose, onApply, readOnly, user, rightOffset = 348 }) {
  const [mode, setMode] = useState('mindmap')
  const [prompt, setPrompt] = useState('Buat mind map untuk membangun bisnis online')
  const [preview, setPreview] = useState(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  const generatePreview = async () => {
    if (!prompt.trim()) { setNotice('Tulis topik terlebih dahulu.'); setPreview(null); return }
    setBusy(true); setNotice('Menghubungi Free AI…'); setPreview(null)
    try {
      const structure = await generateFreeAIStructure({ prompt, mode, user })
      setPreview(structure)
      setNotice(`Pratinjau siap · ${structure.nodeCount} node · Free AI`)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Free AI tidak dapat memproses permintaan.')
    } finally { setBusy(false) }
  }

  const applyPreview = () => {
    if (readOnly) { setNotice('Akses Viewer hanya dapat melihat. Minta akses Editor untuk menambahkan grafik.'); return }
    if (!preview) return
    onApply?.(preview)
    setNotice('Struktur ditambahkan ke canvas sebagai Main Structure baru.')
    setPreview(null)
  }

  return (
    <aside className="universe-ai-panel" style={{ right: `${rightOffset}px` }} aria-label="Universe AI panel">
      <header className="universe-ai-header">
        <div className="universe-ai-brand"><span className="universe-ai-mark">✦</span><div><strong>Universe AI</strong><small>Mind map & hierarchy</small></div></div>
        <button className="circle-button" onClick={onClose} aria-label="Close Universe AI">×</button>
      </header>
      <div className="universe-ai-body">
        <div className="universe-ai-prototype-note universe-ai-live-note"><strong>Free AI · kuota terbatas</strong><span>Instruksi dikirim melalui backend. Hasil divalidasi dan ditampilkan sebagai pratinjau sebelum masuk ke canvas.</span></div>
        <label className="universe-ai-field"><span>Jenis struktur</span><div className="universe-ai-mode-switch"><button type="button" className={mode === 'mindmap' ? 'active' : ''} onClick={() => { setMode('mindmap'); setPreview(null); setNotice('') }} disabled={busy}>Mind Map</button><button type="button" className={mode === 'hierarchy' ? 'active' : ''} onClick={() => { setMode('hierarchy'); setPreview(null); setNotice('') }} disabled={busy}>Hierarchy</button></div></label>
        <label className="universe-ai-field"><span>Jelaskan topikmu</span><textarea rows={4} maxLength={5000} value={prompt} onChange={event => { setPrompt(event.target.value); setPreview(null); setNotice('') }} placeholder="Contoh: struktur tim untuk peluncuran produk baru" disabled={busy} /></label>
        <button className="button primary universe-ai-generate" type="button" onClick={generatePreview} disabled={busy || readOnly}>{busy ? 'Memproses…' : 'Buat dengan Free AI'}</button>
        {notice && <p className="universe-ai-notice" role="status" aria-live="polite">{notice}</p>}
        {preview && <section className="universe-ai-preview" aria-label="Structure preview">
          <div className="universe-ai-preview-title"><span>PRATINJAU AI</span><strong>{preview.root}</strong></div>
          <div className="universe-ai-preview-tree">{preview.children.map((child, index) => renderTree(child, String(index)))}</div>
          <p>{preview.nodeCount} node akan ditambahkan sebagai struktur baru. Grafik yang sedang ada tidak akan diganti.</p>
          <button className="button primary" type="button" onClick={applyPreview} disabled={readOnly}>Tambahkan ke canvas</button>
        </section>}
      </div>
      <footer className="universe-ai-footer"><span>Free AI · Stage 4</span><small>Paid AI dan penentuan provider berdasarkan paket akan dihubungkan pada tahap berikutnya. Kuota provider dapat berubah.</small></footer>
    </aside>
  )
}
