import { useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

export default function LibraryTab({ library, addFood, updateFood, removeFood }) {
  const isMobile = useIsMobile()
  const [form, setForm] = useState({ name: '', cal: '', pro: '', carb: '', fat: '', unit: '' })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)

  async function handleAdd() {
    if (!form.name.trim()) return
    setSaving(true)
    await addFood({ name: form.name, cal: +form.cal||0, pro: +form.pro||0, carb: +form.carb||0, fat: +form.fat||0, unit: form.unit||'per serving' })
    setForm({ name:'', cal:'', pro:'', carb:'', fat:'', unit:'' })
    setSaving(false)
  }

  function startEdit(f) {
    setEditingId(f.id)
    setEditForm({ name: f.name, cal: f.cal, pro: f.pro, carb: f.carb, fat: f.fat, unit: f.unit })
  }

  async function handleSave(id) {
    setSaving(true)
    await updateFood(id, { name: editForm.name, cal: +editForm.cal, pro: +editForm.pro, carb: +editForm.carb, fat: +editForm.fat, unit: editForm.unit })
    setEditingId(null)
    setSaving(false)
  }

  const card = { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 10, padding: '14px 16px', marginBottom: 8 }
  const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }
  const editGrid = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr 1fr 1fr',
    gap: 6,
    marginTop: 10,
  }

  return (
    <div>
      {/* Add form */}
      <div style={{ ...card, marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', marginBottom: 10 }}>Add new food</div>
        <input placeholder="Food name" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} style={{ marginBottom: 8 }} />
        <div style={grid2}>
          <input type="number" placeholder="Calories" value={form.cal} onChange={e => setForm(p=>({...p,cal:e.target.value}))} />
          <input type="number" placeholder="Protein g" value={form.pro} onChange={e => setForm(p=>({...p,pro:e.target.value}))} />
          <input type="number" placeholder="Carbs g" value={form.carb} onChange={e => setForm(p=>({...p,carb:e.target.value}))} />
          <input type="number" placeholder="Fat g" value={form.fat} onChange={e => setForm(p=>({...p,fat:e.target.value}))} />
        </div>
        <input placeholder="Per unit (e.g. per 100g, per egg)" value={form.unit} onChange={e => setForm(p=>({...p,unit:e.target.value}))} style={{ marginTop: 8 }} />
        <button onClick={handleAdd} disabled={saving} style={{ width: '100%', padding: 10, background: '#c8f066', color: '#0e0e0e', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', marginTop: 8, fontFamily: 'DM Sans, sans-serif', opacity: saving ? 0.6 : 1 }}>
          Save to library
        </button>
      </div>

      {/* Library list */}
      {!library.length && <div style={{ textAlign: 'center', padding: '2rem', color: '#666', fontSize: 13 }}>No foods in your library yet.</div>}
      {library.map(f => (
        <div key={f.id} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, overflowWrap: 'anywhere' }}>{f.name}</div>
              <div style={{ fontSize: 11, color: '#666', fontFamily: 'DM Mono, monospace', marginTop: 2, overflowWrap: 'anywhere' }}>{f.unit} · {f.cal}kcal · P:{f.pro}g C:{f.carb}g F:{f.fat}g</div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button onClick={() => editingId === f.id ? setEditingId(null) : startEdit(f)} style={{ background:'none', border:'1px solid #2a2a2a', borderRadius:5, padding:'4px 10px', fontSize:11, cursor:'pointer', color:'#666', fontFamily:'DM Sans, sans-serif' }}>
                {editingId === f.id ? 'cancel' : 'edit'}
              </button>
              <button onClick={() => removeFood(f.id)} style={{ background:'none', border:'1px solid #2a2a2a', borderRadius:5, padding:'4px 10px', fontSize:11, cursor:'pointer', color:'#666', fontFamily:'DM Sans, sans-serif' }}
                onMouseOver={e => { e.target.style.borderColor='#ff5f5f'; e.target.style.color='#ff5f5f' }}
                onMouseOut={e => { e.target.style.borderColor='#2a2a2a'; e.target.style.color='#666' }}>
                remove
              </button>
            </div>
          </div>

          {editingId === f.id && (
            <div style={{ borderTop: '1px solid #2a2a2a', marginTop: 10, paddingTop: 10 }}>
              {isMobile && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Name</div>
                  <input value={editForm.name} onChange={e => setEditForm(p=>({...p,name:e.target.value}))} />
                </div>
              )}
              <div style={editGrid}>
                {!isMobile && (
                  <div><div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Name</div><input value={editForm.name} onChange={e => setEditForm(p=>({...p,name:e.target.value}))} /></div>
                )}
                <div><div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Calories</div><input type="number" value={editForm.cal} onChange={e => setEditForm(p=>({...p,cal:e.target.value}))} /></div>
                <div><div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Protein g</div><input type="number" value={editForm.pro} onChange={e => setEditForm(p=>({...p,pro:e.target.value}))} /></div>
                <div><div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Carbs g</div><input type="number" value={editForm.carb} onChange={e => setEditForm(p=>({...p,carb:e.target.value}))} /></div>
                <div><div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Fat g</div><input type="number" value={editForm.fat} onChange={e => setEditForm(p=>({...p,fat:e.target.value}))} /></div>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Per unit</div>
                <input value={editForm.unit} onChange={e => setEditForm(p=>({...p,unit:e.target.value}))} />
              </div>
              <button onClick={() => handleSave(f.id)} disabled={saving} style={{ marginTop: 8, background:'none', border:'1px solid #8aaa3a', borderRadius:6, padding:'5px 12px', fontSize:12, cursor:'pointer', color:'#c8f066', fontFamily:'DM Sans, sans-serif' }}>
                Save changes
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
