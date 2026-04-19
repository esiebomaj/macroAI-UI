import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import api from '../lib/api'

const MD_COMPONENTS = {
  p: ({ node, ...props }) => <p style={{ margin: '0 0 8px' }} {...props} />,
  ul: ({ node, ...props }) => <ul style={{ margin: '0 0 8px', paddingLeft: 18 }} {...props} />,
  ol: ({ node, ...props }) => <ol style={{ margin: '0 0 8px', paddingLeft: 18 }} {...props} />,
  li: ({ node, ...props }) => <li style={{ margin: '2px 0' }} {...props} />,
  h1: ({ node, ...props }) => <h1 style={{ fontSize: 15, margin: '4px 0 6px', fontWeight: 600 }} {...props} />,
  h2: ({ node, ...props }) => <h2 style={{ fontSize: 14, margin: '4px 0 6px', fontWeight: 600 }} {...props} />,
  h3: ({ node, ...props }) => <h3 style={{ fontSize: 13, margin: '4px 0 6px', fontWeight: 600 }} {...props} />,
  strong: ({ node, ...props }) => <strong style={{ fontWeight: 600 }} {...props} />,
  em: ({ node, ...props }) => <em style={{ fontStyle: 'italic' }} {...props} />,
  a: ({ node, ...props }) => (
    <a target="_blank" rel="noreferrer" style={{ color: '#c8f066', textDecoration: 'underline' }} {...props} />
  ),
  code: ({ inline, children, ...props }) =>
    inline ? (
      <code
        style={{
          fontFamily: 'DM Mono, monospace', fontSize: 12,
          background: '#0e0e0e', border: '1px solid #2a2a2a',
          borderRadius: 4, padding: '1px 5px',
        }}
        {...props}
      >{children}</code>
    ) : (
      <pre style={{
        margin: '6px 0', padding: 10, background: '#0e0e0e',
        border: '1px solid #2a2a2a', borderRadius: 6, overflowX: 'auto',
        fontFamily: 'DM Mono, monospace', fontSize: 12, lineHeight: 1.45,
      }}>
        <code {...props}>{children}</code>
      </pre>
    ),
  blockquote: ({ node, ...props }) => (
    <blockquote
      style={{
        margin: '6px 0', padding: '2px 10px',
        borderLeft: '2px solid #c8f066', color: '#bbb',
      }}
      {...props}
    />
  ),
  table: ({ node, ...props }) => (
    <table style={{ borderCollapse: 'collapse', margin: '6px 0', fontSize: 12 }} {...props} />
  ),
  th: ({ node, ...props }) => (
    <th style={{ border: '1px solid #2a2a2a', padding: '4px 8px', textAlign: 'left' }} {...props} />
  ),
  td: ({ node, ...props }) => (
    <td style={{ border: '1px solid #2a2a2a', padding: '4px 8px' }} {...props} />
  ),
  hr: () => <hr style={{ border: 0, borderTop: '1px solid #2a2a2a', margin: '8px 0' }} />,
}

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

// iPhones typically produce HEIC/HEIF files, which only Safari can decode via
// <img>. Detect those and convert to JPEG before the canvas resize step.
function isHeicFile(file) {
  return (
    /heic|heif/i.test(file.type) ||
    /\.(heic|heif)$/i.test(file.name || '')
  )
}

async function normalizeImageFile(file) {
  if (!isHeicFile(file)) return file
  // Dynamic import so non-HEIC users don't pay the ~wasm bundle cost.
  // heic-to uses a modern libheif build and handles newer HEIC variants
  // (Live Photos, 10-bit HEVC) that older libs choke on.
  const { heicTo } = await import('heic-to')
  const blob = await heicTo({ blob: file, type: 'image/jpeg', quality: 0.9 })
  const newName = (file.name || 'image').replace(/\.(heic|heif)$/i, '') + '.jpg'
  return new File([blob], newName, { type: 'image/jpeg' })
}

// Resize + re-encode an image File into a compact JPEG data URL so we don't
// ship multi-MB originals over the wire to the vision model.
function fileToCompressedDataUrl(file, maxEdge = 1024, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not decode image'))
      img.onload = () => {
        const { width, height } = img
        const scale = Math.min(1, maxEdge / Math.max(width, height))
        const w = Math.round(width * scale)
        const h = Math.round(height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
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
      {args.qty && <span style={{ fontWeight: 500, color: 'rgb(230 226 226)' }}>{args.qty}x </span>}
      {args.name && <span style={{ fontWeight: 500, color: 'rgb(230 226 226)' }}>{args.name.slice(0, 10)} </span>}
      {args.pro && <span style={{ color: '#555', fontSize: 8}}>{args.pro}g Pro, </span>}
      {args.carb && <span style={{ color: '#555', fontSize: 8}}>{args.carb}g Carb,</span>}
      {args.fat && <span style={{ color: '#555', fontSize: 8}}>{args.fat}g Fat</span>}
      {args.cal && <span style={{ fontWeight: 500, color: 'rgb(230 226 226)' }}> {args.cal}kcal</span>}
      </div>}
    </>
    </div>
  )
}

export default function ChatPanel({ refetchAll, isMobile = false, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hey! Tell me what you ate and I'll log it straight to your account.\n\nTry: \"Log 2 eggs and a banana for breakfast\", \"What have I eaten today?\", or attach a photo of your meal or a nutrition label and I'll estimate the macros." }
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [pendingImages, setPendingImages] = useState([]) // array of data URLs
  const [converting, setConverting] = useState(false) // true while HEIC->JPEG conversion runs
  const [attachError, setAttachError] = useState('')
  const messagesRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const el = messagesRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []).filter(f =>
      f.type.startsWith('image/') || isHeicFile(f)
    )
    if (!files.length) return
    setAttachError('')
    const needsConvert = files.some(isHeicFile)
    if (needsConvert) setConverting(true)
    try {
      const urls = await Promise.all(
        files.map(async (f) => {
          const normalized = await normalizeImageFile(f)
          return fileToCompressedDataUrl(normalized)
        })
      )
      setPendingImages(prev => [...prev, ...urls].slice(0, 4)) // cap at 4 per turn
    } catch (err) {
      console.error('Failed to read image', err)
      setAttachError(
        needsConvert
          ? "Couldn't convert that HEIC image — try saving it as JPEG first."
          : "Couldn't read that image — try a different file."
      )
    } finally {
      setConverting(false)
    }
  }

  function onFileInputChange(e) {
    handleFiles(e.target.files)
    // reset so the same file can be picked again later
    e.target.value = ''
  }

  function removePendingImage(idx) {
    setPendingImages(prev => prev.filter((_, i) => i !== idx))
  }

  function onPaste(e) {
    const items = e.clipboardData?.items
    if (!items) return
    const files = []
    for (const item of items) {
      if (item.kind !== 'file') continue
      const f = item.getAsFile()
      if (!f) continue
      if (f.type.startsWith('image/') || isHeicFile(f)) {
        files.push(f)
      }
    }
    if (files.length) {
      e.preventDefault()
      handleFiles(files)
    }
  }

  async function send() {
    const text = input.trim()
    const images = pendingImages
    if ((!text && images.length === 0) || busy) return
    setInput('')
    setPendingImages([])
    setBusy(true)
    setMessages(prev => [...prev, { role: 'user', text, images }])

    // Keep history text-only so we don't resend huge base64 payloads every turn.
    // Images are only attached to the current message.
    const historyText = text || (images.length ? '[sent image]' : '')
    const newHistory = [...chatHistory, { role: 'user', content: historyText }]

    try {
      const res = await api.post('/chat/', {
        message: text,
        history: chatHistory,
        images,
      })
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

  const rootStyle = isMobile
    ? { display: 'flex', flexDirection: 'column', background: '#161616', height: '100dvh', width: '100%' }
    : { display: 'flex', flexDirection: 'column', background: '#161616', height: '100vh', position: 'sticky', top: 0 }

  const pad = isMobile ? '1rem 1rem' : '1.2rem 1.5rem'

  return (
    <div style={rootStyle}>
      {/* Header */}
      <div style={{ padding: pad, borderBottom: '1px solid #2a2a2a', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8f066', animation: 'pulse 2s infinite' }} />
        <span style={{ flex: 1 }}>AI Assistant</span>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            aria-label="Close chat"
            style={{
              background: 'none', border: '1px solid #2a2a2a', borderRadius: 6,
              width: 30, height: 30, color: '#888', cursor: 'pointer',
              fontSize: 18, lineHeight: 1, padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >×</button>
        )}
      </div>

      {/* Messages */}
      <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', padding: pad, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '90%' }}>
            {m.toolCalls?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 2 }}>
                {m.toolCalls.map((tc, j) => (
                    prettyToolComponent(j, tc.name, tc.args)
                ))}
              </div>
            )}
            {m.role === 'user' && m.images?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'flex-end', marginBottom: m.text ? 4 : 0 }}>
                {m.images.map((url, j) => (
                  <img
                    key={j}
                    src={url}
                    alt="attachment"
                    style={{
                      maxWidth: 180, maxHeight: 180,
                      borderRadius: 10, border: '1px solid #2a2a2a',
                      objectFit: 'cover',
                    }}
                  />
                ))}
              </div>
            )}
            {(m.role !== 'user' || m.text) && (
            <div style={{
              fontSize: 13, lineHeight: 1.5,
              background: m.role === 'user' ? '#c8f066' : '#1f1f1f',
              color: m.role === 'user' ? '#0e0e0e' : 'white',
              border: m.role === 'user' ? 'none' : '1px solid #2a2a2a',
              borderRadius: m.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
              padding: '10px 14px',
              fontWeight: m.role === 'user' ? 500 : 400,
            }}>
              {m.role === 'user' ? (
                m.text.split('\n').map((line, j) => (
                  <span key={j}>{line}{j < m.text.split('\n').length - 1 && <br />}</span>
                ))
              ) : (
                <div className="chat-md" style={{ whiteSpace: 'normal' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
                    {m.text}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            )}
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
      <div style={{
        padding: isMobile ? `0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom))` : '1rem 1.5rem',
        borderTop: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {pendingImages.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {pendingImages.map((url, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img
                  src={url}
                  alt="pending"
                  style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, border: '1px solid #2a2a2a' }}
                />
                <button
                  onClick={() => removePendingImage(i)}
                  aria-label="Remove image"
                  style={{
                    position: 'absolute', top: -6, right: -6,
                    width: 18, height: 18, borderRadius: '50%',
                    background: '#0e0e0e', color: '#fff',
                    border: '1px solid #2a2a2a', cursor: 'pointer',
                    fontSize: 12, lineHeight: 1, padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >×</button>
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,image/heic,image/heif,.heic,.heif"
          multiple
          onChange={onFileInputChange}
          style={{ display: 'none' }}
        />

        {attachError && (
          <div style={{ fontSize: 12, color: '#ff8a8a', lineHeight: 1.4 }}>
            {attachError}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative', minWidth: 0, height: 44 }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={converting}
              aria-label={converting ? 'Converting image' : 'Attach image'}
              title={converting ? 'Converting image…' : 'Attach photo of food or nutrition label'}
              style={{
                position: 'absolute', left: 4, top: 4,
                width: 34, height: 34,
                background: 'transparent', border: 'none',
                borderRadius: 6, color: '#c8f066',
                cursor: converting ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 0, lineHeight: 0,
                zIndex: 1,
                opacity: converting ? 0.7 : 1,
              }}
            >
              {converting ? (
                <span style={{
                  width: 14, height: 14, borderRadius: '50%',
                  border: '2px solid rgba(200,240,102,0.3)',
                  borderTopColor: '#c8f066',
                  animation: 'chatSpin 0.8s linear infinite',
                  display: 'inline-block',
                }} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              )}
            </button>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              onPaste={onPaste}
              placeholder={pendingImages.length ? 'Add a note…' : 'Tell me what you ate…'}
              style={{ width: '100%', height: 44, padding: '11px 12px 11px 40px', background: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: 8, color: 'white', fontSize: 16, lineHeight: '20px', fontFamily: 'DM Sans, sans-serif', outline: 'none', resize: 'none', minWidth: 0, boxSizing: 'border-box' }}
            />
          </div>
          <button
            onClick={send}
            disabled={busy || (!input.trim() && pendingImages.length === 0)}
            style={{ height: 44, padding: '0 14px', background: '#c8f066', color: '#0e0e0e', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: busy ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap', opacity: busy || (!input.trim() && pendingImages.length === 0) ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', flexShrink: 0 }}
          >
            Send
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes chatSpin { to { transform: rotate(360deg); } }
        .chat-md { word-break: break-word; overflow-wrap: anywhere; }
        .chat-md > *:last-child { margin-bottom: 0 !important; }
      `}</style>
    </div>
  )
}
