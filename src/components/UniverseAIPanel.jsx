import { useState } from 'react'
import { generateFreeAIStructure } from '../lib/aiClient.js'

const QUICK_PROMPTS = [
  { label: 'Mind map bisnis', mode: 'mindmap', prompt: 'Buat mind map untuk membangun bisnis online, dari riset pasar sampai penjualan dan evaluasi.' },
  { label: 'Struktur tim', mode: 'hierarchy', prompt: 'Buat struktur hierarki tim untuk meluncurkan produk digital, lengkap dengan fungsi dan tanggung jawab utama.' },
  { label: 'Rencana proyek', mode: 'mindmap', prompt: 'Buat mind map rencana proyek dari tujuan, ruang lingkup, tahapan, risiko, sumber daya, hingga metrik keberhasilan.' },
]

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

  const useQuickPrompt = (item) => {
    setMode(item.mode)
    setPrompt(item.prompt)
    setPreview(null)
    setNotice('Contoh instruksi dimuat. Kamu bisa mengubahnya sebelum membuat struktur.')
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
        <div className="universe-ai-intro"><span className="universe-ai-eyebrow">AI WORKSPACE</span><strong>Ubah ide menjadi struktur</strong><p>Tulis tujuanmu. Free AI akan menyusun cabang dan subtopik yang bisa kamu tinjau sebelum dibuat sebagai node yang dapat diedit.</p><div className="universe-ai-capability"><span>✦</span> Free AI <i /> Mind Map <i /> Hierarchy</div></div>
        <div className="universe-ai-quickstart"><div className="universe-ai-section-heading"><strong>Mulai dari contoh</strong><span>Opsional</span></div><div className="universe-ai-prompt-chips">{QUICK_PROMPTS.map(item => <button key={item.label} type="button" onClick={() => useQuickPrompt(item)} disabled={busy}>{item.label}</button>)}</div></div>
        <label className="universe-ai-field"><span>Jenis struktur</span><div className="universe-ai-mode-switch"><button type="button" className={mode === 'mindmap' ? 'active' : ''} onClick={() => { setMode('mindmap'); setPreview(null); setNotice('') }} disabled={busy}>Mind Map</button><button type="button" className={mode === 'hierarchy' ? 'active' : ''} onClick={() => { setMode('hierarchy'); setPreview(null); setNotice('') }} disabled={busy}>Hierarchy</button></div><small className="universe-ai-mode-hint">{mode === 'mindmap' ? 'Eksplorasi ide dari satu topik utama ke cabang-cabang terkait.' : 'Susun peran atau tahapan dalam urutan induk dan turunan.'}</small></label>
        <label className="universe-ai-field"><span>Instruksi kamu</span><textarea rows={4} maxLength={5000} value={prompt} onChange={event => { setPrompt(event.target.value); setPreview(null); setNotice('') }} placeholder="Contoh: susun strategi peluncuran produk, dari riset hingga evaluasi…" disabled={busy} /><small className="universe-ai-char-count">{prompt.length.toLocaleString('id-ID')} / 5.000 karakter</small></label>
        <button className="button primary universe-ai-generate" type="button" onClick={generatePreview} disabled={busy || readOnly || !prompt.trim()}>{busy ? <><span className="universe-ai-spinner" aria-hidden="true" /> Sedang menyusun struktur…</> : '✦  Buat struktur dengan AI'}</button>
        {readOnly && <p className="universe-ai-readonly-note">Mode Viewer: pembuatan struktur dinonaktifkan sampai kamu memiliki akses Editor.</p>}
        {notice && <p className="universe-ai-notice" role="status" aria-live="polite">{notice}</p>}
        {preview && <section className="universe-ai-preview" aria-label="Structure preview">
          <div className="universe-ai-preview-title"><span>HASIL GENERASI · {mode === 'mindmap' ? 'MIND MAP' : 'HIERARCHY'}</span><strong>{preview.root}</strong><small>Periksa hasilnya sebelum menambahkannya ke canvas.</small></div>
          <div className="universe-ai-preview-tree">{preview.children.map((child, index) => renderTree(child, String(index)))}</div>
          <p>{preview.nodeCount} node akan ditambahkan sebagai struktur baru. Grafik yang sedang ada tidak akan diganti.</p>
          <button className="button primary" type="button" onClick={applyPreview} disabled={readOnly}>Tambahkan ke canvas</button>
        </section>}
      </div>
      <footer className="universe-ai-footer"><span><i className="universe-ai-footer-dot" /> Free AI · Pratinjau sebelum diterapkan</span><small>AI menghasilkan rancangan awal. Kamu tetap bisa mengedit node setelah ditambahkan. Ketersediaan bergantung pada konfigurasi layanan.</small></footer>
    </aside>
  )
}
