import { useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

export default function LibraryTab({ library, addFood, updateFood, removeFood, meals, addMeal, updateMeal, removeMeal }) {
  const isMobile = useIsMobile()

  // Food library state
  const [form, setForm] = useState({ name: '', cal: '', pro: '', carb: '', fat: '', unit: '' })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [foodSearch, setFoodSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)

  // Meal builder state
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState(null) // { mealId|null, name, items: [{food_id, qty}] }
  const [savingMeal, setSavingMeal] = useState(false)

  const foodById = Object.fromEntries(library.map(f => [f.id, f]))

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

  // --- Meal builder actions ---
  function enterSelect() {
    setEditingId(null)
    setSelectedIds([])
    setSearch('')
    setSelectMode(true)
  }

  function cancelSelect() {
    setSelectMode(false)
    setSelectedIds([])
    setSearch('')
  }

  function toggleSelect(id) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function groupIntoMeal() {
    if (!selectedIds.length) return
    setEditor({ mealId: null, name: '', items: selectedIds.map(id => ({ food_id: id, qty: 1 })) })
    setSelectMode(false)
    setSelectedIds([])
  }

  function openEditMeal(m) {
    setSelectMode(false)
    setEditor({ mealId: m.id, name: m.name, items: m.items.map(i => ({ food_id: i.food_id, qty: i.qty })) })
  }

  function closeEditor() {
    setEditor(null)
  }

  async function saveMeal() {
    const items = editor.items
      .filter(r => r.food_id)
      .map(r => ({ food_id: r.food_id, qty: parseFloat(r.qty) || 1 }))
    if (!editor.name.trim() || !items.length) return
    setSavingMeal(true)
    if (editor.mealId) {
      await updateMeal(editor.mealId, { name: editor.name.trim(), items })
    } else {
      await addMeal({ name: editor.name.trim(), items })
    }
    setSavingMeal(false)
    setEditor(null)
  }

  function setEditorItems(items) {
    setEditor(prev => ({ ...prev, items }))
  }

  // --- shared styles ---
  const card = { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 10, padding: '14px 16px', marginBottom: 8 }
  const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }
  const editGrid = { display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr 1fr 1fr', gap: 6, marginTop: 10 }
  const sectionLabel = { fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666' }
  const smallBtn = { background:'none', border:'1px solid #2a2a2a', borderRadius:5, padding:'4px 10px', fontSize:11, cursor:'pointer', color:'#666', fontFamily:'DM Sans, sans-serif' }
  const primaryBtn = (disabled) => ({ width: '100%', padding: 10, background: '#c8f066', color: '#0e0e0e', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: disabled ? 0.6 : 1 })

  function editorTotals() {
    return editor.items.reduce((a, r) => {
      const f = foodById[r.food_id]
      const q = parseFloat(r.qty) || 0
      if (!f) return a
      return { cal: a.cal + f.cal*q, pro: a.pro + f.pro*q, carb: a.carb + f.carb*q, fat: a.fat + f.fat*q }
    }, { cal: 0, pro: 0, carb: 0, fat: 0 })
  }

  // ---------- Meal editor (create from selection or edit existing) ----------
  if (editor) {
    const removeRowBtn = { background: 'none', border: '1px solid #2a2a2a', borderRadius: 5, color: '#666', cursor: 'pointer', fontSize: 16, lineHeight: 1 }
    const addRowBtn = { background: 'none', border: '1px dashed #2a2a2a', borderRadius: 6, color: '#c8f066', cursor: 'pointer', fontSize: 12, padding: '6px 10px', fontFamily: 'DM Sans, sans-serif' }
    const t = editorTotals()
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: 15, fontWeight: 500 }}>{editor.mealId ? 'Edit meal' : 'New meal'}</div>
          <button onClick={closeEditor} style={smallBtn}>cancel</button>
        </div>
        <div style={{ ...card }}>
          <div style={{ ...sectionLabel, marginBottom: 10 }}>Meal name</div>
          <input placeholder="e.g. Chicken & rice bowl" value={editor.name} onChange={e => setEditor(prev => ({ ...prev, name: e.target.value }))} style={{ marginBottom: 14 }} />

          <div style={{ ...sectionLabel, marginBottom: 10 }}>Foods in this meal</div>
          {editor.items.map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 68px 34px', gap: 6, marginBottom: 6 }}>
              <select value={r.food_id} onChange={e => setEditorItems(editor.items.map((x, j) => j === i ? { ...x, food_id: e.target.value } : x))}>
                <option value="">-- pick food --</option>
                {library.map(f => <option key={f.id} value={f.id}>{f.name} ({f.unit})</option>)}
              </select>
              <input type="number" min="0" step="0.5" placeholder="Qty" value={r.qty} onChange={e => setEditorItems(editor.items.map((x, j) => j === i ? { ...x, qty: e.target.value } : x))} />
              <button onClick={() => setEditorItems(editor.items.length > 1 ? editor.items.filter((_, j) => j !== i) : editor.items)} style={removeRowBtn} title="Remove">×</button>
            </div>
          ))}
          <button onClick={() => setEditorItems([...editor.items, { food_id: '', qty: 1 }])} style={addRowBtn}>+ add food</button>

          <div style={{ borderTop: '1px solid #2a2a2a', marginTop: 14, paddingTop: 12, fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#c8f066' }}>
            {Math.round(t.cal)} kcal · P:{Math.round(t.pro*10)/10}g C:{Math.round(t.carb*10)/10}g F:{Math.round(t.fat*10)/10}g
          </div>
        </div>
        <button onClick={saveMeal} disabled={savingMeal} style={{ ...primaryBtn(savingMeal), marginTop: 4 }}>
          {savingMeal ? 'Saving...' : (editor.mealId ? 'Save changes' : 'Save meal')}
        </button>
      </div>
    )
  }

  // ---------- Selection mode (build a meal from foods) ----------
  if (selectMode) {
    const q = search.trim().toLowerCase()
    const filtered = q ? library.filter(f => f.name.toLowerCase().includes(q)) : library
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: isMobile ? 'calc(100dvh - 200px)' : 'calc(100vh - 175px)' }}>
        {/* Fixed header: banner + search (does not scroll) */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ ...card, marginBottom: 10, borderColor: '#c8f066', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Pick foods for your meal</div>
              <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{selectedIds.length} selected</div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button onClick={cancelSelect} style={smallBtn}>cancel</button>
              <button onClick={groupIntoMeal} disabled={!selectedIds.length} style={{ ...primaryBtn(!selectedIds.length), width: 'auto', padding: '6px 14px' }}>
                Group into meal
              </button>
            </div>
          </div>
          <input placeholder="Search foods..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Scrollable food list (only this scrolls) */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, marginTop: 10 }}>
          {!filtered.length && <div style={{ textAlign: 'center', padding: '2rem', color: '#666', fontSize: 13 }}>{library.length ? 'No foods match your search.' : 'No foods to choose from.'}</div>}
          {filtered.map(f => {
            const on = selectedIds.includes(f.id)
            return (
              <div key={f.id} onClick={() => toggleSelect(f.id)} style={{ ...card, cursor: 'pointer', borderColor: on ? '#c8f066' : '#2a2a2a', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, border: on ? 'none' : '1px solid #444', background: on ? '#c8f066' : 'transparent', color: '#0e0e0e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                  {on ? '✓' : ''}
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, overflowWrap: 'anywhere' }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: '#666', fontFamily: 'DM Mono, monospace', marginTop: 2 }}>{f.unit} · {f.cal}kcal · P:{f.pro}g C:{f.carb}g F:{f.fat}g</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ---------- Default: unified library (meals strip + foods) ----------
  const mealCard = { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 10, padding: '12px 14px', width: 230, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 6 }
  const outlineBtn = { background: 'none', border: '1px solid #8aaa3a', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer', color: '#c8f066', fontFamily: 'DM Sans, sans-serif' }
  const fq = foodSearch.trim().toLowerCase()
  const filteredFoods = fq ? library.filter(f => f.name.toLowerCase().includes(fq)) : library

  return (
    <div>
      {/* Meals section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={sectionLabel}>Meals{meals.length ? ` · ${meals.length}` : ''}</div>
        <button
          onClick={enterSelect}
          disabled={!library.length}
          style={{ background: 'none', border: '1px solid #8aaa3a', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: library.length ? 'pointer' : 'not-allowed', color: '#c8f066', fontFamily: 'DM Sans, sans-serif', opacity: library.length ? 1 : 0.5 }}
          title={library.length ? 'Create a meal from your foods' : 'Add foods first'}
        >
          + New meal
        </button>
      </div>

      {!meals.length ? (
        <div style={{ ...card, textAlign: 'center', color: '#666', fontSize: 12, marginBottom: '1.75rem' }}>
          No meals yet. Tap “+ New meal” to group foods into a meal.
        </div>
      ) : (
        <div className="meals-strip" style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, marginBottom: '1.75rem', WebkitOverflowScrolling: 'touch' }}>
          {meals.map(m => (
            <div key={m.id} style={mealCard}>
              <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
              <div style={{ fontSize: 11, color: '#888', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {m.items.map(i => `${i.qty}× ${i.name}`).join(', ') || '(no items)'}
              </div>
              <div style={{ fontSize: 11, color: '#c8f066', fontFamily: 'DM Mono, monospace' }}>{m.total_cal} kcal</div>
              <div style={{ fontSize: 10, color: '#666', fontFamily: 'DM Mono, monospace' }}>P:{m.total_pro} C:{m.total_carb} F:{m.total_fat}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                <button onClick={() => openEditMeal(m)} style={{ ...smallBtn, flex: 1 }}>edit</button>
                <button onClick={() => removeMeal(m.id)} style={{ ...smallBtn, flex: 1 }}
                  onMouseOver={e => { e.currentTarget.style.borderColor='#ff5f5f'; e.currentTarget.style.color='#ff5f5f' }}
                  onMouseOut={e => { e.currentTarget.style.borderColor='#2a2a2a'; e.currentTarget.style.color='#666' }}>
                  remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Foods section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={sectionLabel}>Foods{library.length ? ` · ${library.length}` : ''}</div>
        <button onClick={() => setAddOpen(o => !o)} style={outlineBtn}>
          {addOpen ? 'close' : '+ Add food'}
        </button>
      </div>

      {/* Add form (collapsible) */}
      {addOpen && (
        <div style={{ ...card, marginBottom: '1rem' }}>
          <div style={{ ...sectionLabel, marginBottom: 10 }}>Add new food</div>
          <input placeholder="Food name" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} style={{ marginBottom: 8 }} />
          <div style={grid2}>
            <input type="number" placeholder="Calories" value={form.cal} onChange={e => setForm(p=>({...p,cal:e.target.value}))} />
            <input type="number" placeholder="Protein g" value={form.pro} onChange={e => setForm(p=>({...p,pro:e.target.value}))} />
            <input type="number" placeholder="Carbs g" value={form.carb} onChange={e => setForm(p=>({...p,carb:e.target.value}))} />
            <input type="number" placeholder="Fat g" value={form.fat} onChange={e => setForm(p=>({...p,fat:e.target.value}))} />
          </div>
          <input placeholder="Per unit (e.g. per 100g, per egg)" value={form.unit} onChange={e => setForm(p=>({...p,unit:e.target.value}))} style={{ marginTop: 8 }} />
          <button onClick={handleAdd} disabled={saving} style={{ ...primaryBtn(saving), marginTop: 8 }}>
            Save to library
          </button>
        </div>
      )}

      {/* Search */}
      {library.length > 0 && (
        <input placeholder="Search foods..." value={foodSearch} onChange={e => setFoodSearch(e.target.value)} style={{ marginBottom: '1rem' }} />
      )}

      {/* Library list */}
      {!library.length && <div style={{ textAlign: 'center', padding: '2rem', color: '#666', fontSize: 13 }}>No foods in your library yet.</div>}
      {library.length > 0 && !filteredFoods.length && <div style={{ textAlign: 'center', padding: '2rem', color: '#666', fontSize: 13 }}>No foods match your search.</div>}
      {filteredFoods.map(f => (
        <div key={f.id} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, overflowWrap: 'anywhere' }}>{f.name}</div>
              <div style={{ fontSize: 11, color: '#666', fontFamily: 'DM Mono, monospace', marginTop: 2, overflowWrap: 'anywhere' }}>{f.unit} · {f.cal}kcal · P:{f.pro}g C:{f.carb}g F:{f.fat}g</div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button onClick={() => editingId === f.id ? setEditingId(null) : startEdit(f)} style={smallBtn}>
                {editingId === f.id ? 'cancel' : 'edit'}
              </button>
              <button onClick={() => removeFood(f.id)} style={smallBtn}
                onMouseOver={e => { e.currentTarget.style.borderColor='#ff5f5f'; e.currentTarget.style.color='#ff5f5f' }}
                onMouseOut={e => { e.currentTarget.style.borderColor='#2a2a2a'; e.currentTarget.style.color='#666' }}>
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

      <style>{`
        .meals-strip::-webkit-scrollbar { height: 6px; }
        .meals-strip::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 3px; }
      `}</style>
    </div>
  )
}
