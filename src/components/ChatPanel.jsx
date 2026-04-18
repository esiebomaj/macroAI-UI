import { useState, useRef, useEffect } from 'react'
import api from '../lib/api'

export default function ChatPanel({ addLogEntry }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hey! Tell me what you ate and I'll log it straight to your account.\n\nTry: \"Log 2 eggs and a banana for breakfast\" or \"What have I eaten today?\"" }
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
      const { reply, logged_entries } = res.data

      setChatHistory([...newHistory, { role: 'assistant', content: reply }])

      for (const entry of logged_entries) {
        addLogEntry(entry, true)
      }

      setMessages(prev => [...prev, { role: 'ai', text: reply }])
    } catch (err) {
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
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            maxWidth: '90%', fontSize: 13, lineHeight: 1.5,
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
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
        ))}

        {busy && (
          <div style={{ alignSelf: 'flex-start', background: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: '4px 12px 12px 12px', padding: '12px 16px', display: 'flex', gap: 5 }}>
            {[0, 0.2, 0.4].map((delay, i) => (
              <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#666', animation: `bounce 1.2s ${delay}s infinite` }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
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
