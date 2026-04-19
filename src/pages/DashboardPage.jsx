import { useState } from 'react'
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

export default function DashboardPage() {
  const { session, user, signOut, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('Log')
  const [chatOpen, setChatOpen] = useState(false)
  const tracker = useTracker()
  const isMobile = useIsMobile()

  if (authLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#666', fontSize: 13, fontFamily: 'DM Mono, monospace' }}>
      Loading...
    </div>
  )
  if (!session) return <Navigate to="/auth" replace />

  if (tracker.loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#666', fontSize: 13, fontFamily: 'DM Mono, monospace' }}>
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
    <div style={wrapperStyle}>

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
          {/* Floating AI button */}
          {!chatOpen && (
            <button
              onClick={() => setChatOpen(true)}
              aria-label="Open AI assistant"
              style={{
                position: 'fixed',
                right: 16,
                bottom: `calc(16px + env(safe-area-inset-bottom))`,
                zIndex: 50,
                width: 56, height: 56, borderRadius: '50%',
                background: '#c8f066', color: '#0e0e0e', border: 'none',
                boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em',
              }}
            >
              AI
            </button>
          )}

          {chatOpen && (
            <div
              style={{
                position: 'fixed', inset: 0, zIndex: 100,
                background: '#161616',
                display: 'flex', flexDirection: 'column',
              }}
            >
              <ChatPanel
                refetchAll={tracker.fetchAll}
                isMobile
                onClose={() => setChatOpen(false)}
              />
            </div>
          )}
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
