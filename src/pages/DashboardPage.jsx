import { useState, useRef, useLayoutEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTracker } from '../hooks/useTracker'
import { useIsMobile } from '../hooks/useIsMobile'
import LogTab from '../components/LogTab'
import LibraryTab from '../components/LibraryTab'
import HistoryTab from '../components/HistoryTab'
import GoalsTab from '../components/GoalsTab'
import ChatPanel from '../components/ChatPanel'

const TABS = ['Log', 'Library', 'History', 'Goals']

const FAB_HINT_STORAGE_KEY = 'macroai-assistant-fab-hint-dismissed'

function getFabHintDismissedFromStorage() {
  try {
    return localStorage.getItem(FAB_HINT_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function FabAssistantIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden style={{ display: 'block' }}>
      <path
        d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function DashboardPage() {
  const { session, user, signOut, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('Log')
  const [chatOpen, setChatOpen] = useState(false)
  const [fabHintDismissed, setFabHintDismissed] = useState(() => getFabHintDismissedFromStorage())
  const [hintArrowCenterX, setHintArrowCenterX] = useState(null)
  const fabRef = useRef(null)
  const coachCardRef = useRef(null)
  const tracker = useTracker()
  const isMobile = useIsMobile()
  const mobileDensityClass = isMobile ? 'mobile-app-density' : ''

  useLayoutEffect(() => {
    if (fabHintDismissed || chatOpen) return
    function alignHintArrow() {
      const fab = fabRef.current
      const card = coachCardRef.current
      if (!fab || !card) return
      const fr = fab.getBoundingClientRect()
      const cr = card.getBoundingClientRect()
      const fabCx = fr.left + fr.width / 2
      let x = fabCx - cr.left
      const pad = 14
      x = Math.max(pad, Math.min(cr.width - pad, x))
      setHintArrowCenterX(x)
    }
    alignHintArrow()
    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => alignHintArrow())
        : null
    if (fabRef.current) ro?.observe(fabRef.current)
    if (coachCardRef.current) ro?.observe(coachCardRef.current)
    window.addEventListener('resize', alignHintArrow)
    window.addEventListener('orientationchange', alignHintArrow)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', alignHintArrow)
      window.removeEventListener('orientationchange', alignHintArrow)
    }
  }, [fabHintDismissed, chatOpen])

  function persistFabHintDismissed() {
    try {
      localStorage.setItem(FAB_HINT_STORAGE_KEY, '1')
    } catch { /* ignore */ }
    setFabHintDismissed(true)
  }

  function openAssistant() {
    persistFabHintDismissed()
    setChatOpen(true)
  }

  if (authLoading) return (
    <div className={mobileDensityClass} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#666', fontSize: 13, fontFamily: 'DM Mono, monospace' }}>
      Loading...
    </div>
  )
  if (!session) return <Navigate to="/auth" replace />

  if (tracker.loading) return (
    <div className={mobileDensityClass} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#666', fontSize: 13, fontFamily: 'DM Mono, monospace' }}>
      Fetching your data...
    </div>
  )

  const wrapperStyle = isMobile
    ? { display: 'flex', flexDirection: 'column', minHeight: '100dvh' }
    : { display: 'grid', gridTemplateColumns: '1fr 340px', height: '100vh', maxWidth: 1100, margin: '0 auto', overflow: 'hidden' }

  const leftStyle = isMobile
    ? { padding: '1.1rem 1rem calc(6rem + env(safe-area-inset-bottom))', overflowY: 'auto', flex: 1 }
    : { padding: '2rem', overflowY: 'auto', borderRight: '1px solid #2a2a2a', height: '100vh', minHeight: 0 }

  return (
    <div style={wrapperStyle} className={mobileDensityClass}>

      {/* Main / left panel */}
      <div style={leftStyle}>

        {/* Logo + user */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '1.2rem' : '2rem', gap: 8 }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Macro<span style={{ color: '#c8f066' }}>.</span>AI
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <span style={{
              fontSize: 11, color: '#666', fontFamily: 'DM Mono, monospace',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              maxWidth: isMobile ? 140 : 'none',
            }}>{user?.email}</span>
            <button
              onClick={signOut}
              style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: 5, padding: '4px 10px', fontSize: 11, cursor: 'pointer', color: '#666', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
              onMouseOver={e => { e.target.style.borderColor = '#ff5f5f'; e.target.style.color = '#ff5f5f' }}
              onMouseOut={e => { e.target.style.borderColor = '#2a2a2a'; e.target.style.color = '#666' }}
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #2a2a2a',
            marginBottom: '1.25rem',
            overflowX: isMobile ? 'auto' : 'visible',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
          className="tabs-row"
        >
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: isMobile ? '10px 16px' : '8px 18px',
                fontSize: isMobile ? 13 : 12,
                cursor: 'pointer', border: 'none',
                background: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.03em',
                color: activeTab === tab ? 'white' : '#666',
                borderBottom: activeTab === tab ? '2px solid #c8f066' : '2px solid transparent',
                fontWeight: activeTab === tab ? 500 : 400,
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'Log' && (
          <LogTab
            goals={tracker.goals}
            todayLog={tracker.todayLog}
            library={tracker.library}
            addLogEntry={tracker.addLogEntry}
            removeLogEntry={tracker.removeLogEntry}
          />
        )}
        {activeTab === 'Library' && (
          <LibraryTab
            library={tracker.library}
            addFood={tracker.addFood}
            updateFood={tracker.updateFood}
            removeFood={tracker.removeFood}
          />
        )}
        {activeTab === 'History' && (
          <HistoryTab
            history={tracker.history}
            goals={tracker.goals}
            fetchHistory={tracker.fetchHistory}
          />
        )}
        {activeTab === 'Goals' && (
          <GoalsTab
            goals={tracker.goals}
            saveGoals={tracker.saveGoals}
          />
        )}
      </div>

      {/* Chat panel — sticky sidebar on desktop, slide-up overlay on mobile */}
      {isMobile ? (
        <>
          {/* First-session coach mark + floating assistant button */}
          {!chatOpen && (
            <>
              {!fabHintDismissed && (
                <div
                  role="region"
                  aria-label="Assistant tip"
                  style={{
                    position: 'fixed',
                    left: 16,
                    right: 16,
                    bottom: `calc(88px + env(safe-area-inset-bottom))`,
                    zIndex: 51,
                    maxWidth: 360,
                    marginLeft: 'auto',
                  }}
                >
                  <div
                    ref={coachCardRef}
                    style={{
                      position: 'relative',
                      padding: '12px 14px',
                      background: '#1f1f1f',
                      border: '1px solid #333',
                      borderRadius: 10,
                      boxShadow: '0 12px 40px rgba(0,0,0,0.55)',
                    }}
                  >
                    <p
                      id="fab-assistant-hint"
                      style={{
                        margin: 0,
                        fontSize: 13,
                        lineHeight: 1.45,
                        color: '#e8e8e8',
                        fontFamily: 'DM Sans, sans-serif',
                      }}
                    >
                      Your AI assistant lives here. Tap to log by voice or text.
                    </p>
                    <button
                      type="button"
                      onClick={persistFabHintDismissed}
                      style={{
                        marginTop: 10,
                        padding: '8px 14px',
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: 'DM Sans, sans-serif',
                        color: '#0e0e0e',
                        background: '#c8f066',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                      }}
                    >
                      Got it
                    </button>
                    {hintArrowCenterX != null && (
                      <div
                        aria-hidden
                        style={{
                          position: 'absolute',
                          left: hintArrowCenterX,
                          bottom: -11,
                          width: 22,
                          height: 11,
                          transform: 'translateX(-50%)',
                          pointerEvents: 'none',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            left: '50%',
                            bottom: 0,
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '11px solid transparent',
                            borderRight: '11px solid transparent',
                            borderTop: '12px solid #333',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            left: '50%',
                            bottom: 2,
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '10px solid transparent',
                            borderRight: '10px solid transparent',
                            borderTop: '11px solid #1f1f1f',
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                ref={fabRef}
                type="button"
                onClick={openAssistant}
                aria-label="Log with AI — open assistant"
                style={{
                  position: 'fixed',
                  right: 16,
                  bottom: `calc(16px + env(safe-area-inset-bottom))`,
                  zIndex: 50,
                  minHeight: 48,
                  padding: '8px 16px 8px 10px',
                  borderRadius: 999,
                  background: 'linear-gradient(180deg, #d4f57a 0%, #c8f066 100%)',
                  color: '#0e0e0e',
                  border: '1px solid rgba(14, 14, 14, 0.12)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.35)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                  maxWidth: 'calc(100vw - 32px)',
                }}
              >
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'rgba(14, 14, 14, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#0e0e0e',
                  }}
                >
                  <FabAssistantIcon />
                </span>
                <span style={{ whiteSpace: 'nowrap', paddingRight: 2 }}>Log with AI</span>
              </button>
            </>
          )}

          {/* Keep ChatPanel mounted while closed so conversation state persists */}
          <div
            role="dialog"
            aria-modal={chatOpen ? 'true' : undefined}
            aria-hidden={!chatOpen}
            aria-label="AI Assistant"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: chatOpen ? 100 : -1,
              background: '#161616',
              display: 'flex',
              flexDirection: 'column',
              visibility: chatOpen ? 'visible' : 'hidden',
              pointerEvents: chatOpen ? 'auto' : 'none',
            }}
          >
            <ChatPanel
              refetchAll={tracker.fetchAll}
              isMobile
              onClose={() => setChatOpen(false)}
            />
          </div>
        </>
      ) : (
        <ChatPanel refetchAll={tracker.fetchAll} />
      )}

      <style>{`
        .tabs-row::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
