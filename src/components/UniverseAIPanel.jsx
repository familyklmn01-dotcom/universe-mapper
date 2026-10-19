import { useMemo, useState } from 'react'

const cleanTopic = value => {
  const text = String(value || '').trim().replace(/[.!?]+$/g, '')
  const match = text.match(/(?:about|for|on|tentang|untuk|mengenai|topik)\s+(.+)/i)
  const topic = (match?.[1] || text).replace(/^(please|tolong|buatkan|buat|create|generate|build)\s+/i, '').trim()
  return (topic || 'New topic').split(/\s+/).slice(0, 7).join(' ')
}

export default function UniverseAIPanel({ onClose, onApply, readOnly, rightOffset = 348 }) {
  const [mode, setMode] = useState('mindmap')
  const [prompt, setPrompt] = useState('Buat mind map untuk membangun bisnis online')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const preview = useMemo(() => {
    const root = cleanTopic(prompt)
    if (mode === 'hierarchy') {
      return {
        root,
        children: [
          { name: 'Perencanaan', children: ['Tujuan dan ruang lingkup', 'Sumber daya'] },
          { name: 'Pelaksanaan', children: ['Aktivitas utama', 'Penanggung jawab'] },
          { name: 'Pengawasan', children: ['Pemantauan progres', 'Pengelolaan risiko'] },
          { name: 'Evaluasi', children: ['Hasil dan KPI', 'Perbaikan'] },
        ],
      }
    }
    return { root, children: ['Tujuan', 'Ide utama', 'Langkah', 'Risiko', 'Hasil'].map(name => ({ name, children: [] })) }
  }, [mode, prompt])

  const generatePreview = () => {
    if (!prompt.trim()) {
      setNotice('Tulis topik terlebih dahulu.')
      setPreviewOpen(false)
      return
    }
    setNotice('')
    setPreviewOpen(true)
  }

  const applyPreview = () => {
    if (readOnly) {
      setNotice('Akses Viewer hanya dapat melihat. Minta akses Editor untuk menambahkan grafik.')
      return
    }
    onApply?.({ ...preview, mode })
    setNotice('Contoh struktur ditambahkan ke canvas sebagai Main Structure baru.')
    setPreviewOpen(false)
  }

  return (
    <aside className="universe-ai-panel" style={{ right: `${rightOffset}px` }} aria-label="Universe AI panel">
      <header className="universe-ai-header">
        <div className="universe-ai-brand"><span className="universe-ai-mark">✦</span><div><strong>Universe AI</strong><small>Mind map & hierarchy</small></div></div>
        <button className="circle-button" onClick={onClose} aria-label="Close Universe AI">×</button>
      </header>
      <div className="universe-ai-body">
        <div className="universe-ai-prototype-note"><strong>Prototype mode</strong><span>AI provider belum terhubung. Tahap ini menguji alur panel dan pembuatan objek; contoh di bawah bukan hasil model AI.</span></div>
        <label className="universe-ai-field"><span>Jenis struktur</span><div className="universe-ai-mode-switch"><button type="button" className={mode === 'mindmap' ? 'active' : ''} onClick={() => { setMode('mindmap'); setPreviewOpen(false) }}>Mind Map</button><button type="button" className={mode === 'hierarchy' ? 'active' : ''} onClick={() => { setMode('hierarchy'); setPreviewOpen(false) }}>Hierarchy</button></div></label>
        <label className="universe-ai-field"><span>Jelaskan topikmu</span><textarea rows={4} value={prompt} onChange={event => { setPrompt(event.target.value); setPreviewOpen(false); setNotice('') }} placeholder="Contoh: struktur tim untuk peluncuran produk baru" /></label>
        <button className="button primary universe-ai-generate" type="button" onClick={generatePreview}>Buat contoh pratinjau</button>
        {notice && <p className="universe-ai-notice" role="status">{notice}</p>}
        {previewOpen && <section className="universe-ai-preview" aria-label="Structure preview">
          <div className="universe-ai-preview-title"><span>PRATINJAU CONTOH</span><strong>{preview.root}</strong></div>
          <div className="universe-ai-preview-tree"><div className="universe-ai-preview-root">{preview.root}</div>{preview.children.map(child => <div className="universe-ai-preview-branch" key={child.name}><span>{child.name}</span>{child.children.map(grandchild => <small key={grandchild}>{grandchild}</small>)}</div>)}</div>
          <p>Hasil akan ditambahkan sebagai struktur baru, tanpa mengganti grafik yang sedang ada.</p>
          <button className="button primary" type="button" onClick={applyPreview} disabled={readOnly}>Tambahkan ke canvas</button>
        </section>}
      </div>
      <footer className="universe-ai-footer"><span>Rencana paket</span><small>Free AI untuk Free · Paid AI untuk Pro — integrasi provider dan hak akses dikerjakan pada tahap berikutnya.</small></footer>
    </aside>
  )
}
