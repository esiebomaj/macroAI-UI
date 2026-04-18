import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTracker } from '../hooks/useTracker'
import LogTab from '../components/LogTab'
import LibraryTab from '../components/LibraryTab'
import HistoryTab from '../components/HistoryTab'
import GoalsTab from '../components/GoalsTab'
import ChatPanel from '../components/ChatPanel'

const TABS = ['Log', 'Library', 'History', 'Goals']

export default function DashboardPage() {
  const { session, user, signOut, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('Log')
  const tracker = useTracker()

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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', minHeight: '100vh', maxWidth: 1100, margin: '0 auto' }}>

      {/* Left panel */}
      <div style={{ padding: '2rem', overflowY: 'auto', borderRight: '1px solid #2a2a2a' }}>

        {/* Logo + user */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Macro<span style={{ color: '#c8f066' }}>.</span>AI
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: '#666', fontFamily: 'DM Mono, monospace' }}>{user?.email}</span>
            <button
              onClick={signOut}
              style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: 5, padding: '4px 10px', fontSize: 11, cursor: 'pointer', color: '#666', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s' }}
              onMouseOver={e => { e.target.style.borderColor = '#ff5f5f'; e.target.style.color = '#ff5f5f' }}
              onMouseOut={e => { e.target.style.borderColor = '#2a2a2a'; e.target.style.color = '#666' }}
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #2a2a2a', marginBottom: '1.5rem' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 18px', fontSize: 12, cursor: 'pointer', border: 'none',
                background: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.03em',
                color: activeTab === tab ? 'white' : '#666',
                borderBottom: activeTab === tab ? '2px solid #c8f066' : '2px solid transparent',
                fontWeight: activeTab === tab ? 500 : 400,
                transition: 'all 0.15s',
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

      {/* Right panel — chat */}
      <ChatPanel
        addLogEntry={tracker.addLogEntry}
      />
    </div>
  )
}
