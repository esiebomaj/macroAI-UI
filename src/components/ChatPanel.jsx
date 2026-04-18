import { useState, useRef, useEffect } from 'react'
import api from '../lib/api'

const TOOL_LABELS = {
  log_food: 'Logging food',
  remove_logged_food: 'Removing log entry',
  modify_logged_food: 'Updating log entry',
  add_food_to_library: 'Adding to library',
  remove_food_from_library: 'Removing from library',
  modify_food_in_library: 'Updating library item',
  update_goals: 'Updating goals',
  list_log_entries: 'Reading log',
}

function prettyToolName(name) {
  return TOOL_LABELS[name] || name
}

function prettyToolComponent(j, name, args) {
  return (
    <div key={j} style={{
      fontSize: 10,
      fontFamily: 'DM Mono, monospace',
      color: '#888',
      background: '#1a1a1a',
      border: '0.1px solid rgba(149, 239, 164, 0.71)',
      borderRadius: 4,
      padding: '4px 8px',
      lineHeight: 1.4,
      width: 'fit-content',
    }}>
    <>
     <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#c8f066', margin: ' 0 4px 0 0', verticalAlign: 'middle' }} />
      <span style={{ color: '#c8f066' }}>{prettyToolName(name)}</span>
      {args.meal && <>
      <span style={{ color: '#555' }}>{` \u2192 `}</span>
      <span>{args.meal}</span>
      </>}
 

      {/* <br /> */}
      {args.name && <div style={{ marginTop: 4, borderTop: '1px solid #2a2a2a', paddingTop: 4}}>
      {args.name && <span style={{ fontWeight: 500, color: 'rgb(230 226 226)' }}>{args.qty || 1}x{args.name.slice(0, 10)} </span>}
      {args.pro && <span style={{ color: '#555', fontSize: 8}}>{args.pro}g Pro, </span>}
      {args.carb && <span style={{ color: '#555', fontSize: 8}}>{args.carb}g Carb,</span>}
      {args.fat && <span style={{ color: '#555', fontSize: 8}}>{args.fat}g Fat</span>}
      {args.cal && <span style={{ fontWeight: 500, color: 'rgb(230 226 226)' }}> {args.cal}kcal</span>}
      </div>}
    </>
    </div>
  )
}

export default function ChatPanel({ refetchAll }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hey! Tell me what you ate and I'll log it straight to your account.\n\nTry: \"Log 2 eggs and a banana for breakfast\" or \"What have I eaten today?\"" }
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const messagesRef = useRef(null)

  useEffect(() => {
    const el = messagesRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  async function send() {
    const text = input.trim()
    if (!text || busy) return
    setInput('')
    setBusy(true)
    setMessages(prev => [...prev, { role: 'user', text }])

    const newHistory = [...chatHistory, { role: 'user', content: text }]

    try {
      const res = await api.post('/chat/', { message: text, history: chatHistory })
      const { reply, mutated, tool_calls } = res.data

      setChatHistory([...newHistory, { role: 'assistant', content: reply }])

      if (mutated && refetchAll) {
        await refetchAll(false)
      }

      setMessages(prev => [...prev, { role: 'ai', text: reply, toolCalls: tool_calls || [] }])
    } catch (err) {
      console.error('Failed to send message', err)
      setMessages(prev => [...prev, { role: 'ai', text: 'Connection error. Please try again.' }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: '#161616', height: '100vh', position: 'sticky', top: 0 }}>
      {/* Header */}
      <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #2a2a2a', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8f066', animation: 'pulse 2s infinite' }} />
        AI Assistant
      </div>

      {/* Messages */}
      <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '90%' }}>
            {m.toolCalls?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 2 }}>
                {m.toolCalls.map((tc, j) => (
                    prettyToolComponent(j, tc.name, tc.args)
                ))}
              </div>
            )}
            <div style={{
              fontSize: 13, lineHeight: 1.5,
              background: m.role === 'user' ? '#c8f066' : '#1f1f1f',
              color: m.role === 'user' ? '#0e0e0e' : 'white',
              border: m.role === 'user' ? 'none' : '1px solid #2a2a2a',
              borderRadius: m.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
              padding: '10px 14px',
              fontWeight: m.role === 'user' ? 500 : 400,
            }}>
              {m.text.split('\n').map((line, j) => (
                <span key={j}>{line}{j < m.text.split('\n').length - 1 && <br />}</span>
              ))}
            </div>
          </div>
        ))}

        {busy && (
          <div style={{ alignSelf: 'flex-start', background: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: '4px 12px 12px 12px', padding: '12px 16px', display: 'flex', gap: 5 }}>
            {[0, 0.2, 0.4].map((delay, i) => (
              <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#666', animation: `bounce 1.2s ${delay}s infinite` }} />
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #2a2a2a', display: 'flex', gap: 8 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Tell me what you ate..."
          disabled={busy}
          style={{ flex: 1, padding: '10px 12px', background: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: 8, color: 'white', fontSize: 13, fontFamily: 'DM Sans, sans-serif', outline: 'none', resize: 'none', height: 42 }}
        />
        <button
          onClick={send}
          disabled={busy || !input.trim()}
          style={{ padding: '10px 16px', background: '#c8f066', color: '#0e0e0e', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: busy ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap', opacity: busy || !input.trim() ? 0.5 : 1 }}
        >
          Send
        </button>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
      `}</style>
    </div>
  )
}
