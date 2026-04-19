import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/* ============================================================
   Design tokens (scoped to the landing page wrapper)
   ============================================================ */
const TOKENS = {
  bg: '#0a0a0a',
  bg1: '#0f0f0f',
  bg2: '#141414',
  line: '#1f1f1f',
  line2: '#2a2a2a',
  text: '#f2f2f2',
  muted: '#8a8a8a',
  muted2: '#666',
  accent: '#c8f066',
  danger: '#ff6b5c',
  warn: '#ffb86b',
  ok: '#8fd694',
  carbs: '#e9c46a',
  protein: '#c8f066',
  fat: '#ff8c7a',
}

const DEMO_SPEED = 1.2
const SHOW_DIAGNOSTICS = true

/* ============================================================
   Responsive hook
   ============================================================ */

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  )
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])
  return isMobile
}

/* ============================================================
   Small building blocks
   ============================================================ */

const MonoLabel = ({ children, color, style }) => (
  <span
    className="mono"
    style={{
      fontSize: 11,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: color || TOKENS.muted2,
      ...style,
    }}
  >
    {children}
  </span>
)

const Dot = ({ color = TOKENS.accent, size = 6, style }) => (
  <span
    style={{
      display: 'inline-block',
      width: size,
      height: size,
      borderRadius: size,
      background: color,
      ...style,
    }}
  />
)

const Hairline = ({ vertical, style }) => (
  <div
    style={{
      background: TOKENS.line2,
      ...(vertical ? { width: 1, alignSelf: 'stretch' } : { height: 1, width: '100%' }),
      ...style,
    }}
  />
)

const Logo = ({ size = 13 }) => (
  <div
    className="mono"
    style={{
      fontSize: size,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#cfcfcf',
      fontWeight: 500,
    }}
  >
    Macro<span style={{ color: TOKENS.accent }}>.</span>AI
  </div>
)

/* ============================================================
   Top Nav
   ============================================================ */

function Nav() {
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { label: 'Product', link: '#product' },
    { label: 'How it works', link: '#how-it-works' },
    { label: 'FAQ', link: '#faq' },
  ]

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(10,10,10,0.78)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${TOKENS.line}`,
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '12px 16px' : '14px 28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 0 : 28 }}>
          <Logo />
          {!isMobile && (
            <div style={{ display: 'flex', gap: 22 }}>
              {links.map((item) => (
                <a
                  key={item.label}
                  href={item.link}
                  className="mono"
                  style={{
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: TOKENS.muted2,
                    transition: 'color .15s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#cfcfcf')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = TOKENS.muted2)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {isMobile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link
              to="/auth"
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: TOKENS.accent,
                color: '#0a0a0a',
                padding: '8px 12px',
                borderRadius: 4,
                fontWeight: 500,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Start Tracking
            </Link>
            <button
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                width: 36,
                height: 36,
                display: 'inline-flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
                background: 'transparent',
                border: `1px solid ${TOKENS.line2}`,
                borderRadius: 4,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 1.5,
                  background: '#cfcfcf',
                  transition: 'transform .2s, opacity .2s',
                  transform: menuOpen ? 'translateY(3px) rotate(45deg)' : 'none',
                }}
              />
              <span
                style={{
                  width: 16,
                  height: 1.5,
                  background: '#cfcfcf',
                  transition: 'opacity .15s',
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  width: 16,
                  height: 1.5,
                  background: '#cfcfcf',
                  transition: 'transform .2s, opacity .2s',
                  transform: menuOpen ? 'translateY(-3px) rotate(-45deg)' : 'none',
                }}
              />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link
              to="/auth"
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: TOKENS.muted2,
                padding: '8px 12px',
                textDecoration: 'none',
              }}
            >
              Sign in
            </Link>
            <Link
              to="/auth"
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: TOKENS.accent,
                color: '#0a0a0a',
                padding: '9px 14px',
                borderRadius: 4,
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Start Tracking →
            </Link>
          </div>
        )}
      </div>

      {isMobile && menuOpen && (
        <div
          style={{
            borderTop: `1px solid ${TOKENS.line}`,
            background: 'rgba(10,10,10,0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            padding: '8px 16px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {links.map((item) => (
            <a
              key={item.label}
              href={item.link}
              onClick={() => setMenuOpen(false)}
              className="mono"
              style={{
                fontSize: 12,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#cfcfcf',
                padding: '14px 4px',
                borderBottom: `1px solid ${TOKENS.line}`,
                textDecoration: 'none',
              }}
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/auth"
            onClick={() => setMenuOpen(false)}
            className="mono"
            style={{
              fontSize: 12,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: TOKENS.muted,
              padding: '14px 4px',
              textDecoration: 'none',
            }}
          >
            Sign in
          </Link>
        </div>
      )}
    </nav>
  )
}

/* ============================================================
   Hero chat demo
   ============================================================ */

const DEMO_SCRIPT = [
  { kind: 'system', text: "Hey, tell me what you ate and I'll log it." },
  { kind: 'user', text: '2 eggs, a banana and greek yogurt for breakfast' },
  { kind: 'ai-thinking' },
  {
    kind: 'ai',
    text: 'Logged breakfast ↓',
    foods: [
      { name: '2× Large egg', P: 13, C: 0.8, F: 10, kcal: 150 },
      { name: 'Banana', P: 1.3, C: 27, F: 0.3, kcal: 110 },
      { name: 'Greek yogurt 0%', P: 17, C: 6, F: 0, kcal: 100 },
    ],
    total: { kcal: 360, P: 31, C: 34, F: 10 },
  },
  { kind: 'user', text: 'what should I eat for dinner to hit my protein goal?' },
  { kind: 'ai-thinking' },
  {
    kind: 'ai',
    text: "You're 54g short on protein and have 620 kcal left. Try:",
    suggest: [
      { name: '200g chicken breast', kcal: 330, p: 62 },
      { name: '1 cup jasmine rice', kcal: 205, p: 4 },
      { name: '½ avocado + greens', kcal: 120, p: 2 },
    ],
    note: 'Total · 655 kcal · 68g P · hits goal at 100%',
  },
]

function useDemoPlayer(script, speed = 1) {
  const [visible, setVisible] = useState(1)

  useEffect(() => {
    let cancelled = false
    let t
    function tick(idx) {
      if (cancelled) return
      if (idx >= script.length) {
        t = setTimeout(() => {
          if (cancelled) return
          setVisible(1)
          tick(1)
        }, 3500 / speed)
        return
      }
      const step = script[idx]
      const isThinking = step.kind === 'ai-thinking'
      const hold = isThinking
        ? 900
        : step.kind === 'user'
        ? 1400
        : step.kind === 'ai'
        ? 3200
        : 1800
      setVisible(idx + 1)
      t = setTimeout(() => tick(idx + 1), hold / speed)
    }
    tick(1)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [script, speed])

  return visible
}

function ChatBubble({ step }) {
  const isUser = step.kind === 'user'
  const isSystem = step.kind === 'system'
  const isThinking = step.kind === 'ai-thinking'

  const base = {
    maxWidth: '92%',
    padding: '10px 13px',
    borderRadius: 6,
    fontSize: 13,
    lineHeight: 1.5,
    animation: 'msgIn .35s cubic-bezier(.2,.7,.2,1) both',
  }

  if (isSystem) {
    return (
      <div
        style={{
          ...base,
          alignSelf: 'flex-start',
          background: 'transparent',
          border: `1px dashed ${TOKENS.line2}`,
          color: TOKENS.muted,
          fontSize: 12,
          maxWidth: '100%',
        }}
      >
        <MonoLabel style={{ display: 'block', marginBottom: 4 }}>AI Assistant</MonoLabel>
        {step.text}
      </div>
    )
  }
  if (isUser) {
    return (
      <div
        style={{
          ...base,
          alignSelf: 'flex-end',
          background: '#1a1a1a',
          border: `1px solid ${TOKENS.line2}`,
          color: '#efefef',
        }}
      >
        {step.text}
      </div>
    )
  }
  if (isThinking) {
    return (
      <div
        style={{
          ...base,
          alignSelf: 'flex-start',
          background: 'transparent',
          border: `1px solid ${TOKENS.line2}`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 12px',
        }}
      >
        <Dot style={{ animation: 'blink 1s infinite', animationDelay: '0s' }} />
        <Dot style={{ animation: 'blink 1s infinite', animationDelay: '.2s' }} />
        <Dot style={{ animation: 'blink 1s infinite', animationDelay: '.4s' }} />
      </div>
    )
  }
  return (
    <div
      style={{
        ...base,
        alignSelf: 'flex-start',
        background: '#0f140a',
        border: '1px solid #2a3a14',
        color: '#e7e7e7',
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '10px 13px 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Dot color={TOKENS.accent} size={5} />
        <MonoLabel color={TOKENS.accent}>Logged</MonoLabel>
        <span style={{ color: TOKENS.muted, fontSize: 12 }}>{step.text}</span>
      </div>
      {step.foods && (
        <div style={{ borderTop: '1px solid #1f2a10' }}>
          {step.foods.map((f, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                alignItems: 'center',
                gap: 10,
                padding: '7px 13px',
                borderBottom: i < step.foods.length - 1 ? '1px solid #16200c' : 'none',
                fontSize: 12,
              }}
            >
              <span style={{ color: '#dcdcdc' }}>{f.name}</span>
              <span className="mono" style={{ color: TOKENS.muted, fontSize: 10 }}>
                P{f.P} · C{f.C} · F{f.F}
              </span>
              <span className="mono" style={{ color: '#fff', fontSize: 11 }}>
                {f.kcal}
              </span>
            </div>
          ))}
          <div
            style={{
              padding: '8px 13px',
              display: 'flex',
              justifyContent: 'space-between',
              background: '#0b1006',
            }}
          >
            <MonoLabel color={TOKENS.muted}>Total</MonoLabel>
            <span className="mono" style={{ fontSize: 11, color: TOKENS.accent }}>
              {step.total.kcal} kcal · {step.total.P}g P
            </span>
          </div>
        </div>
      )}
      {step.suggest && (
        <div style={{ borderTop: '1px solid #1f2a10' }}>
          {step.suggest.map((f, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                padding: '7px 13px',
                fontSize: 12,
                borderBottom: i < step.suggest.length - 1 ? '1px solid #16200c' : 'none',
              }}
            >
              <span style={{ color: '#dcdcdc' }}>{f.name}</span>
              <span
                className="mono"
                style={{ color: TOKENS.muted, fontSize: 10, marginRight: 10 }}
              >
                {f.p}g P
              </span>
              <span className="mono" style={{ fontSize: 11 }}>
                {f.kcal}
              </span>
            </div>
          ))}
          <div style={{ padding: '8px 13px', background: '#0b1006' }}>
            <MonoLabel color={TOKENS.accent}>{step.note}</MonoLabel>
          </div>
        </div>
      )}
    </div>
  )
}

function HeroChat() {
  const visible = useDemoPlayer(DEMO_SCRIPT, DEMO_SPEED)
  const scrollRef = useRef(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [visible])

  return (
    <div
      style={{
        background: TOKENS.bg1,
        border: `1px solid ${TOKENS.line2}`,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 40px 80px -40px rgba(200,240,102,0.08)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '11px 14px',
          borderBottom: `1px solid ${TOKENS.line2}`,
          background: '#0c0c0c',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Dot color="#444" size={8} />
          <Dot color="#333" size={8} />
          <Dot color="#333" size={8} />
          <MonoLabel style={{ marginLeft: 10 }}>macro.ai / assistant</MonoLabel>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Dot color={TOKENS.accent} size={6} style={{ animation: 'pulse 1.6s infinite' }} />
          <MonoLabel color={TOKENS.accent}>LIVE</MonoLabel>
        </div>
      </div>

      <div
        ref={scrollRef}
        style={{
          padding: isMobile ? '14px 14px 8px' : '18px 18px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          minHeight: isMobile ? 360 : 420,
          maxHeight: isMobile ? 360 : 420,
          overflow: 'hidden',
        }}
      >
        {DEMO_SCRIPT.slice(0, visible).map((step, i) => (
          <ChatBubble key={i} step={step} />
        ))}
      </div>

      <div
        style={{
          borderTop: `1px solid ${TOKENS.line2}`,
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: '#0c0c0c',
        }}
      >
        <MonoLabel>›</MonoLabel>
        <div style={{ flex: 1, color: TOKENS.muted2, fontSize: 13 }}>Tell me what you ate…</div>
        <div
          style={{
            border: `1px solid ${TOKENS.line2}`,
            borderRadius: 4,
            padding: '3px 7px',
          }}
        >
          <MonoLabel>⏎</MonoLabel>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Hero
   ============================================================ */

const HEADLINE = {
  pre: 'MACRO TRACKING · AI-POWERED',
  main: ['Track your food ', 'macros', ',', ' achieve your goals using AI.'],
  sub: "Are you looking to lose weight, be fit, build muscle, or just take back control of what you eat? Macro.AI makes it effortless.",
}

function Hero() {
  const isMobile = useIsMobile()
  return (
    <section
      style={{
        borderBottom: `1px solid ${TOKENS.line}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,.025) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at 70% 30%, #000 10%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 70% 30%, #000 10%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: isMobile ? '40px 16px 72px' : '72px 28px 96px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.05fr 1fr',
          gap: isMobile ? 40 : 64,
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: isMobile ? 18 : 24,
              flexWrap: 'wrap',
            }}
          >
            <Dot color={TOKENS.accent} style={{ animation: 'pulse 2s infinite' }} />
            <MonoLabel color={TOKENS.accent}>{HEADLINE.pre}</MonoLabel>
            {!isMobile && <Hairline style={{ flex: 1, maxWidth: 120 }} />}
            {!isMobile && <MonoLabel>v1.0 · live</MonoLabel>}
          </div>

          <h1
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: isMobile ? 'clamp(36px, 10vw, 52px)' : 'clamp(44px, 5.6vw, 78px)',
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              fontWeight: 500,
              color: '#f4f4f4',
              marginBottom: isMobile ? 18 : 26,
            }}
          >
            {HEADLINE.main.map((part, i) =>
              part === 'macros' || part === 'itself' ? (
                <span
                  key={i}
                  className="serif"
                  style={{ color: TOKENS.accent, fontStyle: 'italic', fontWeight: 400 }}
                >
                  {part}
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </h1>

          <p
            style={{
              fontSize: isMobile ? 15 : 18,
              color: '#b8b8b8',
              maxWidth: 480,
              lineHeight: 1.55,
              marginBottom: isMobile ? 24 : 32,
            }}
          >
            {HEADLINE.sub}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: isMobile ? 12 : 36,
            }}
          >
            <Link
              to="/auth"
              style={{
                background: TOKENS.accent,
                color: '#0a0a0a',
                padding: isMobile ? '13px 20px' : '14px 22px',
                borderRadius: 5,
                fontFamily: 'DM Mono, monospace',
                fontSize: 12,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                textDecoration: 'none',
              }}
            >
              Start tracking free
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            marginBottom: isMobile ? 48 : 0,
          }}
        >
          <HeroChat />
          <StatsFloat />
        </div>
      </div>
    </section>
  )
}

function StatsFloat() {
  const isMobile = useIsMobile()
  return (
    <div
      style={{
        position: isMobile ? 'static' : 'absolute',
        left: isMobile ? undefined : -24,
        bottom: isMobile ? undefined : -28,
        marginTop: isMobile ? 16 : 0,
        background: TOKENS.bg2,
        border: `1px solid ${TOKENS.line2}`,
        borderRadius: 8,
        padding: isMobile ? '12px 14px' : '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? 14 : 18,
        boxShadow: '0 10px 30px rgba(0,0,0,.4)',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <MonoLabel>TODAY</MonoLabel>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span className="mono" style={{ fontSize: 22, color: '#fff', fontWeight: 500 }}>
            1,959
          </span>
          <span className="mono" style={{ fontSize: 11, color: TOKENS.muted }}>
            / 2,000 kcal
          </span>
        </div>
      </div>
      <Hairline vertical style={{ height: 32 }} />
      <MacroPills />
    </div>
  )
}

function MacroPills() {
  const macros = [
    { k: 'Protein', v: 166, goal: 160, c: TOKENS.protein },
    { k: 'Carbs', v: 136, goal: 180, c: TOKENS.carbs },
    { k: 'Fat', v: 82, goal: 71, c: TOKENS.fat },
  ]
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {macros.map((m) => {
        const pct = Math.min(100, (m.v / m.goal) * 100)
        return (
          <div
            key={m.k}
            style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 44 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <MonoLabel style={{ marginRight: 4 }} color={m.c}>{m.k + ' '} </MonoLabel>
              <MonoLabel>{m.v}g</MonoLabel>
            </div>
            <div style={{ height: 3, background: '#1a1a1a', borderRadius: 2 }}>
              <div
                style={{ height: 3, width: `${pct}%`, background: m.c, borderRadius: 2 }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ============================================================
   Trust band
   ============================================================ */

function TrustBand() {
  const isMobile = useIsMobile()
  const items = [
    'loose weight',
    'build muscle',
    'Stay fit',
    'Stay healthy',
    'Cut fat',
    'Stay in a deficit',
  ]
  return (
    <section style={{ borderBottom: `1px solid ${TOKENS.line}`, background: '#0c0c0c' }}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: isMobile ? '16px 16px' : '20px 28px',
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 10 : 28,
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MonoLabel style={{ whiteSpace: 'nowrap' }}>HELPS YOU</MonoLabel>
          <Hairline style={{ width: 20, flexShrink: 0 }} />
        </div>
        <div
          style={{
            display: 'flex',
            gap: isMobile ? 18 : 36,
            flexWrap: 'wrap',
            rowGap: isMobile ? 8 : 10,
          }}
        >
          {items.map((x) => (
            <span
              key={x}
              className="mono"
              style={{ fontSize: 11, color: TOKENS.muted, letterSpacing: '0.08em' }}
            >
              {x}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Comparison
   ============================================================ */

function SectionHeader({ kicker, title, sub, align = 'left' }) {
  const isMobile = useIsMobile()
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 10 : 14,
        maxWidth: 720,
        ...(align === 'center' ? { margin: '0 auto', textAlign: 'center' } : {}),
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          ...(align === 'center' ? { justifyContent: 'center' } : {}),
        }}
      >
        <Dot color={TOKENS.accent} size={5} />
        <MonoLabel color={TOKENS.accent}>{kicker}</MonoLabel>
      </div>
      <h2
        style={{
          fontSize: isMobile ? 'clamp(28px, 7.5vw, 38px)' : 'clamp(34px, 3.8vw, 52px)',
          lineHeight: 1.05,
          letterSpacing: '-0.025em',
          fontWeight: 500,
          color: '#f4f4f4',
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            fontSize: isMobile ? 15 : 17,
            color: TOKENS.muted,
            maxWidth: 560,
            lineHeight: 1.55,
            ...(align === 'center' ? { margin: '0 auto' } : {}),
          }}
        >
          {sub}
        </p>
      )}
    </div>
  )
}

function ComparisonSection() {
  const isMobile = useIsMobile()
  return (
    <section
      style={{
        borderBottom: `1px solid ${TOKENS.line}`,
        padding: isMobile ? '56px 16px' : '96px 28px',
      }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <SectionHeader
          kicker="THE PROBLEM"
          title={
            <>
              Logging food in 2026 still{' '}
              <span className="serif" style={{ color: TOKENS.accent }}>
                sucks
              </span>
              .
            </>
          }
          sub="Everyone quits their macro app at week two. It's not you, it's them."
        />

        <div
          style={{
            marginTop: isMobile ? 32 : 56,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            border: `1px solid ${TOKENS.line2}`,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <OldWay isMobile={isMobile} />
          <NewWay isMobile={isMobile} />
        </div>
      </div>
    </section>
  )
}

function OldWay({ isMobile }) {
  const steps = [
    'Open barcode scanner',
    "Search 'chicken breast grilled'",
    'Pick 1 of 47 near-duplicates',
    'Guess the gram weight',
    'Repeat for every side',
    'Realise you forgot lunch',
  ]
  return (
    <div
      style={{
        padding: isMobile ? '22px 20px 24px' : '28px 28px 32px',
        borderRight: isMobile ? 'none' : `1px solid ${TOKENS.line2}`,
        borderBottom: isMobile ? `1px solid ${TOKENS.line2}` : 'none',
        background: '#0b0b0b',
      }}
    >
      <MonoLabel color="#ff6b5c" style={{ marginBottom: 14, display: 'block' }}>
        OTHER APPS
      </MonoLabel>
      <h3 style={{ fontSize: 22, letterSpacing: '-0.02em', marginBottom: 22, fontWeight: 500 }}>
        14 taps to log a chicken wrap.
      </h3>
      <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {steps.map((s, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              color: TOKENS.muted,
              fontSize: 14,
            }}
          >
            <span
              className="mono"
              style={{ fontSize: 10, color: '#444', width: 22, textAlign: 'right' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span
              style={{ textDecoration: 'line-through', textDecorationColor: '#333' }}
            >
              {s}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function NewWay({ isMobile }) {
  return (
    <div
      style={{
        padding: isMobile ? '22px 20px 24px' : '28px 28px 32px',
        background: '#0d0f09',
      }}
    >
      <MonoLabel color={TOKENS.accent} style={{ marginBottom: 14, display: 'block' }}>
        MACRO.AI
      </MonoLabel>
      <h3 style={{ fontSize: 22, letterSpacing: '-0.02em', marginBottom: 22, fontWeight: 500 }}>
        Say it. Done.
      </h3>
      <div
        style={{
          border: `1px solid ${TOKENS.line2}`,
          borderRadius: 6,
          padding: '11px 13px',
          background: '#1a1a1a',
          fontSize: 14,
          marginBottom: 14,
          color: '#ededed',
        }}
      >
        chicken wrap with extra avocado, side of slaw
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <Dot color={TOKENS.accent} />
        <span style={{ fontSize: 13, color: TOKENS.muted }}>
          Parsed. 3 items. 2 from library, 1 estimated.
        </span>
      </div>
      <div
        style={{
          display: 'grid',
          gap: 0,
          border: '1px solid #1f2a10',
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        {[
          { n: 'Chicken wrap', k: 520, p: 38 },
          { n: 'Avocado +½', k: 120, p: 1 },
          { n: 'Cabbage slaw', k: 95, p: 2 },
        ].map((f, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              borderBottom: i < 2 ? '1px solid #16200c' : 'none',
              background: i % 2 ? 'transparent' : '#0b1006',
            }}
          >
            <span style={{ fontSize: 13 }}>{f.n}</span>
            <div style={{ display: 'flex', gap: 14 }}>
              <span className="mono" style={{ fontSize: 11, color: TOKENS.muted }}>
                {f.p}g P
              </span>
              <span className="mono" style={{ fontSize: 11 }}>
                {f.k}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ============================================================
   Product preview
   ============================================================ */

function AppPreview() {
  const isMobile = useIsMobile()
  return (
    <section
      id="product"
      style={{
        borderBottom: `1px solid ${TOKENS.line}`,
        padding: isMobile ? '56px 16px' : '96px 28px',
        background: '#0a0a0a',
      }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <SectionHeader
          kicker="THE PRODUCT"
          title={<>Everything you need.</>}
          sub="Log, Food Library, History, Goals and an AI assistant docked on the right."
        />

        <div
          style={{
            marginTop: isMobile ? 32 : 56,
            border: `1px solid ${TOKENS.line2}`,
            borderRadius: 10,
            overflow: 'hidden',
            background: '#0c0c0c',
            boxShadow:
              '0 60px 120px -60px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,0.015) inset',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderBottom: `1px solid ${TOKENS.line2}`,
              background: '#0a0a0a',
            }}
          >
            <Dot color="#333" size={9} />
            <Dot color="#2a2a2a" size={9} />
            <Dot color="#2a2a2a" size={9} />
            <div
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 11,
                color: TOKENS.muted2,
                fontFamily: 'DM Mono, monospace',
                letterSpacing: '0.05em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              app.macro.ai / dashboard
            </div>
            {!isMobile && <div style={{ width: 70 }} />}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 360px',
              minHeight: isMobile ? 'auto' : 560,
            }}
          >
            <AppLogTab isMobile={isMobile} />
            <AppChat isMobile={isMobile} />
          </div>
        </div>

        <div
          style={{
            marginTop: isMobile ? 28 : 40,
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? 18 : 24,
          }}
        >
          {[
            { k: '01', t: 'Talk, don\u2019t tap', d: '"2 eggs and oats" is enough.' },
            { k: '02', t: 'Your personal library', d: 'Save favourites once. Reuse forever.' },
            {
              k: '03',
              t: 'Track your Goals',
              d: 'Weight, Calories, protein, carbs, fat. Tuned weekly.',
            },
            { k: '04', t: 'History at a glance', d: '' },
          ].map((f) => (
            <div key={f.k} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MonoLabel color={TOKENS.accent}>{f.k}</MonoLabel>
                <Hairline style={{ flex: 1 }} />
              </div>
              <div style={{ fontSize: isMobile ? 14 : 16, color: '#e6e6e6', fontWeight: 500 }}>
                {f.t}
              </div>
              <div
                style={{
                  fontSize: isMobile ? 12.5 : 13.5,
                  color: TOKENS.muted,
                  lineHeight: 1.55,
                }}
              >
                {f.d}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AppLogTab({ isMobile }) {
  return (
    <div
      style={{
        padding: isMobile ? '18px 16px' : '22px 26px',
        borderRight: isMobile ? 'none' : `1px solid ${TOKENS.line2}`,
        borderBottom: isMobile ? `1px solid ${TOKENS.line2}` : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 14 : 18,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Logo size={12} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {!isMobile && <MonoLabel>you@macro.ai</MonoLabel>}
          <div
            style={{
              border: `1px solid ${TOKENS.line2}`,
              borderRadius: 4,
              padding: '4px 10px',
            }}
          >
            <MonoLabel>Sign out</MonoLabel>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          borderBottom: `1px solid ${TOKENS.line2}`,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {['Log', 'Library', 'History', 'Goals'].map((t, i) => (
          <div
            key={t}
            style={{
              padding: isMobile ? '8px 14px' : '8px 18px',
              borderBottom: i === 0 ? `2px solid ${TOKENS.accent}` : '2px solid transparent',
              marginBottom: -1,
              whiteSpace: 'nowrap',
            }}
          >
            <span
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: i === 0 ? '#fff' : TOKENS.muted2,
                fontWeight: i === 0 ? 500 : 400,
              }}
            >
              {t}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? 8 : 12,
        }}
      >
        {[
          { k: 'CALORIES', v: 1959, g: 2000, c: '#e8e8e8' },
          { k: 'PROTEIN', v: 166, g: 160, c: TOKENS.protein, unit: 'g' },
          { k: 'CARBS', v: 136, g: 180, c: TOKENS.carbs, unit: 'g' },
          { k: 'FAT', v: 82, g: 71, c: TOKENS.fat, unit: 'g' },
        ].map((m) => {
          const pct = Math.min(100, (m.v / m.g) * 100)
          return (
            <div
              key={m.k}
              style={{
                border: `1px solid ${TOKENS.line2}`,
                borderRadius: 6,
                padding: '10px 12px',
                background: '#0d0d0d',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <MonoLabel color={m.c === '#e8e8e8' ? TOKENS.muted2 : m.c}>{m.k}</MonoLabel>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="mono" style={{ fontSize: 22, color: '#fff', fontWeight: 500 }}>
                  {m.v}
                </span>
                <span className="mono" style={{ fontSize: 10, color: TOKENS.muted2 }}>
                  /{m.g}
                  {m.unit || ''}
                </span>
              </div>
              <div style={{ height: 2, background: '#1a1a1a' }}>
                <div style={{ height: 2, width: `${pct}%`, background: m.c }} />
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Meal
          name="LUNCH"
          kcal={839}
          p={86}
          isMobile={isMobile}
          items={[
            { n: '3× Large carrot', p: 1.8, c: 18, f: 0.3, k: 75 },
            { n: '2× Chicken breast', p: 62, c: 0, f: 7.2, k: 330 },
            { n: 'Medium avocado', p: 3, c: 12, f: 22, k: 240 },
            { n: 'Cabbage (¼ head)', p: 2, c: 10, f: 0.2, k: 44 },
            { n: 'Greek yogurt', p: 17, c: 6, f: 5, k: 150 },
          ]}
        />
        <Meal
          name="DINNER"
          kcal={1120}
          p={80}
          isMobile={isMobile}
          items={[
            { n: '5× Large egg', p: 32.5, c: 2, f: 25, k: 375 },
            { n: 'Protein drink', p: 35, c: 23, f: 17, k: 400 },
            { n: '5× Bread slice', p: 12.5, c: 65, f: 5, k: 345 },
          ]}
        />
      </div>
    </div>
  )
}

function Meal({ name, kcal, p, items, isMobile }) {
  return (
    <div
      style={{
        border: `1px solid ${TOKENS.line2}`,
        borderRadius: 6,
        background: '#0d0d0d',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '9px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${TOKENS.line2}`,
          background: '#0a0a0a',
        }}
      >
        <MonoLabel color="#fff">{name}</MonoLabel>
        <MonoLabel>
          {kcal} kcal · {p}g P
        </MonoLabel>
      </div>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            padding: isMobile ? '7px 12px' : '7px 14px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr auto auto' : '1fr auto auto auto',
            alignItems: 'center',
            gap: isMobile ? 8 : 10,
            borderBottom: i < items.length - 1 ? '1px solid #161616' : 'none',
            fontSize: 13,
          }}
        >
          <span
            style={{
              color: '#dcdcdc',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {it.n}
          </span>
          {!isMobile && (
            <span className="mono" style={{ fontSize: 10, color: TOKENS.muted }}>
              P:{it.p}g C:{it.c}g F:{it.f}g
            </span>
          )}
          {isMobile && (
            <span className="mono" style={{ fontSize: 10, color: TOKENS.muted }}>
              {it.p}g P
            </span>
          )}
          <span className="mono" style={{ fontSize: 11, minWidth: 40, textAlign: 'right' }}>
            {it.k}
          </span>
          {!isMobile && <span style={{ color: '#333', fontSize: 12 }}>×</span>}
        </div>
      ))}
    </div>
  )
}

function AppChat({ isMobile }) {
  return (
    <div
      style={{
        padding: isMobile ? '18px 16px' : '22px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        background: '#0a0a0a',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Dot color={TOKENS.accent} size={6} style={{ animation: 'pulse 1.8s infinite' }} />
        <MonoLabel color="#fff">AI ASSISTANT</MonoLabel>
      </div>
      <div
        style={{
          padding: '10px 12px',
          border: `1px dashed ${TOKENS.line2}`,
          borderRadius: 6,
          fontSize: 13,
          color: TOKENS.muted,
          lineHeight: 1.6,
        }}
      >
        Hey! Tell me what you ate and I'll log it straight to your account.
      </div>
      <ChatMsg side="user">add 2 banana as snacks</ChatMsg>
      <ChatMsg side="ai">2 bananas added to snacks ↓</ChatMsg>
      <ChatMsg side="user">draft lunch + dinner for tomorrow hitting my goals</ChatMsg>
      <ChatMsg side="ai" rich>
        <div style={{ fontSize: 13, color: '#dcdcdc', lineHeight: 1.6 }}>
          Two meals that keep you at{' '}
          <b style={{ color: TOKENS.accent }}>2,000 kcal</b> / 160g P:
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: TOKENS.muted }}>
          <div>LUNCH · chicken breast 200g · rice 100g · cabbage ¼</div>
          <div>DINNER · 3 eggs · protein drink · bread ×3</div>
        </div>
      </ChatMsg>

      <div style={{ flex: 1 }} />
      <div
        style={{
          marginTop: 8,
          display: 'flex',
          gap: 8,
          border: `1px solid ${TOKENS.line2}`,
          borderRadius: 6,
          padding: '8px 10px',
        }}
      >
        <span className="mono" style={{ color: TOKENS.muted2, fontSize: 12 }}>
          ›
        </span>
        <span style={{ color: TOKENS.muted2, fontSize: 13 }}>Ask about your day…</span>
      </div>
    </div>
  )
}

function ChatMsg({ side, children, rich }) {
  if (side === 'user') {
    return (
      <div
        style={{
          alignSelf: 'flex-end',
          maxWidth: '90%',
          background: '#1a1a1a',
          border: `1px solid ${TOKENS.line2}`,
          padding: '8px 11px',
          borderRadius: 6,
          fontSize: 13,
        }}
      >
        {children}
      </div>
    )
  }
  return (
    <div
      style={{
        alignSelf: 'flex-start',
        maxWidth: '95%',
        background: '#0f140a',
        border: '1px solid #2a3a14',
        padding: rich ? '10px 12px' : '8px 11px',
        borderRadius: 6,
        fontSize: 13,
        color: '#dcdcdc',
      }}
    >
      {children}
    </div>
  )
}

/* ============================================================
   How It Works
   ============================================================ */

function HowItWorks() {
  const isMobile = useIsMobile()
  const steps = [
    { n: '01', t: 'Sign in', d: 'Email or Google. 2 seconds.', code: 'HOW IT WORKS' },
    { n: '02', t: 'Set your goals', d: 'Weight, Calories + macros.', code: 'PUT /goals' },
    {
      n: '03',
      t: 'Talk to the assistant',
      d: '"Had oatmeal and a protein shake". Done.',
      code: 'POST /chat',
    },
    {
      n: '04',
      t: 'Review + tweak',
      d: 'Confirm portions. Edit a number. Or tell the AI to fix it.',
      code: 'PATCH /log/:id',
    },
  ]
  return (
    <section
      id="how-it-works"
      style={{
        borderBottom: `1px solid ${TOKENS.line}`,
        padding: isMobile ? '56px 16px' : '96px 28px',
      }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <SectionHeader
          kicker="HOW IT WORKS"
          title={
            <>
              Four steps from signup to{' '}
              <span className="serif" style={{ color: TOKENS.accent }}>
                logged
              </span>
              .
            </>
          }
        />
        <div
          style={{
            marginTop: isMobile ? 32 : 56,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            border: `1px solid ${TOKENS.line2}`,
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          {steps.map((s, i) => {
            const isLast = i === steps.length - 1
            return (
              <div
                key={s.n}
                style={{
                  padding: isMobile ? '22px 20px 24px' : '28px 24px 32px',
                  borderRight:
                    !isMobile && !isLast ? `1px solid ${TOKENS.line2}` : 'none',
                  borderBottom:
                    isMobile && !isLast ? `1px solid ${TOKENS.line2}` : 'none',
                  background: i % 2 ? '#0b0b0b' : '#0d0d0d',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: isMobile ? 10 : 14,
                  minHeight: isMobile ? 'auto' : 240,
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <MonoLabel color={TOKENS.accent}>{s.n}</MonoLabel>
                  {SHOW_DIAGNOSTICS && <MonoLabel>{s.code}</MonoLabel>}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 18 : 22,
                    letterSpacing: '-0.02em',
                    color: '#f0f0f0',
                    fontWeight: 500,
                  }}
                >
                  {s.t}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 13 : 13.5,
                    color: TOKENS.muted,
                    lineHeight: 1.55,
                  }}
                >
                  {s.d}
                </div>
                <div style={{ flex: 1 }} />
                <StepVisual n={i} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function StepVisual({ n }) {
  const common = {
    height: 78,
    border: `1px solid ${TOKENS.line2}`,
    borderRadius: 6,
    padding: 10,
    fontSize: 11,
    background: '#080808',
    fontFamily: 'DM Mono, monospace',
    color: TOKENS.muted,
    overflow: 'hidden',
    position: 'relative',
  }
  if (n === 0)
    return (
      <div style={common}>
        <div>› email: you@macro.ai</div>
        <div>› oauth: google ✓</div>
        <div style={{ color: TOKENS.accent }}>› session opened</div>
      </div>
    )
  if (n === 1)
    return (
      <div style={common}>
        <div>calories .... 2000</div>
        <div>protein ..... 160g</div>
        <div>carbs ....... 180g</div>
        <div>fat ......... 71g</div>
      </div>
    )
  if (n === 2)
    return (
      <div style={common}>
        <div>you: oatmeal + protein shake</div>
        <div style={{ color: TOKENS.accent }}>ai: ✓ logged 2 items, 420 kcal</div>
      </div>
    )
  return (
    <div style={common}>
      <div>was: bread × 5</div>
      <div style={{ color: TOKENS.accent }}>now: bread × 3</div>
      <div>Δ kcal: −138</div>
    </div>
  )
}

/* ============================================================
   Capabilities
   ============================================================ */

function Capabilities() {
  const isMobile = useIsMobile()
  return (
    <section
      style={{
        borderBottom: `1px solid ${TOKENS.line}`,
        padding: isMobile ? '56px 16px' : '96px 28px',
        background: '#0a0a0a',
      }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <SectionHeader
          kicker="WHAT IT CAN DO"
          title={
            <>
              An assistant that actually understands{' '}
              <span className="serif" style={{ color: TOKENS.accent }}>
                food
              </span>
              .
            </>
          }
          sub="It doesn't just parse text. It knows your library, your goals, and what you've already eaten today."
        />

        <div
          style={{
            marginTop: isMobile ? 32 : 56,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr 1fr',
            gridTemplateRows: isMobile ? 'auto' : 'auto auto',
            gap: 1,
            background: TOKENS.line2,
            border: `1px solid ${TOKENS.line2}`,
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <Cap
            span={isMobile ? null : [1, 3]}
            title="AI Assistant that understands portions"
            body={
              <>
                "Half a cup of rice and a palm-sized salmon" gets portioned correctly, with
                reasonable estimates when you don't specify. Every estimate is marked and you
                can correct it.
              </>
            }
            right={<PortionDemo />}
            wide={!isMobile}
            isMobile={isMobile}
          />
          <Cap
            title="Library that learns"
            body="Your regular foods get saved automatically. Over time the AI reaches for them first."
            right={<LibraryDemo />}
            isMobile={isMobile}
          />
          <Cap
            title="Meal planning"
            body="Ask for tomorrow's lunch. Get a plan that hits your macros using foods you actually eat."
            right={<PlannerDemo />}
            isMobile={isMobile}
          />
          <Cap
            title="History & trends"
            body="Your past 90 days in one place. Spot the streaks that worked."
            right={<TrendDemo />}
            isMobile={isMobile}
          />
          <Cap
            title="Corrections, not re-typing"
            body={<>"Actually make that 150g not 200". The AI finds the entry and updates it.</>}
            right={<FixDemo />}
            isMobile={isMobile}
          />
        </div>
      </div>
    </section>
  )
}

function Cap({ title, body, right, span, wide, isMobile }) {
  const style = {
    background: TOKENS.bg,
    padding: isMobile ? '20px 18px' : wide ? '28px 32px' : '24px 24px',
    display: 'grid',
    gridTemplateColumns: wide && !isMobile ? '1fr 1.1fr' : '1fr',
    gap: isMobile ? 16 : wide ? 28 : 16,
    ...(span ? { gridColumn: `${span[0]} / span ${span[1]}` } : {}),
  }
  return (
    <div style={style}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: isMobile ? 17 : wide ? 22 : 16,
            fontWeight: 500,
            letterSpacing: '-0.01em',
            color: '#f0f0f0',
            lineHeight: 1.25,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: isMobile ? 13 : wide ? 14.5 : 13,
            color: TOKENS.muted,
            lineHeight: 1.55,
          }}
        >
          {body}
        </div>
      </div>
      <div>{right}</div>
    </div>
  )
}

function PortionDemo() {
  return (
    <div
      style={{
        border: `1px solid ${TOKENS.line2}`,
        borderRadius: 6,
        background: '#0c0c0c',
        padding: 14,
        fontSize: 12,
      }}
    >
      <div style={{ color: '#e0e0e0', marginBottom: 10, fontSize: 13 }}>
        "half a cup rice + palm salmon"
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <CapRow label="Jasmine rice · ~100g" v="130 kcal" tag="library" tagC={TOKENS.accent} />
        <CapRow label="Salmon fillet · ~120g" v="250 kcal" tag="estimated" tagC={TOKENS.warn} />
        <CapRow
          label="Olive oil · assumed 1 tsp"
          v="40 kcal"
          tag="assumption"
          tagC={TOKENS.muted}
        />
      </div>
      <div
        style={{
          borderTop: `1px solid ${TOKENS.line2}`,
          marginTop: 12,
          paddingTop: 10,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
        }}
      >
        <MonoLabel>TOTAL</MonoLabel>
        <span className="mono" style={{ color: TOKENS.accent }}>
          420 kcal · 34g P
        </span>
      </div>
    </div>
  )
}

function CapRow({ label, v, tag, tagC }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        gap: 10,
        alignItems: 'center',
      }}
    >
      <span style={{ color: '#dcdcdc' }}>{label}</span>
      <span
        className="mono"
        style={{
          fontSize: 9,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: tagC,
          border: `1px solid ${tagC}`,
          padding: '2px 6px',
          borderRadius: 3,
          opacity: 0.9,
        }}
      >
        {tag}
      </span>
      <span className="mono" style={{ fontSize: 11 }}>
        {v}
      </span>
    </div>
  )
}

function LibraryDemo() {
  const items = [
    'Chicken breast',
    'Oats 100g',
    'Protein shake',
    'Greek yogurt',
    'Banana',
    'Avocado',
  ]
  return (
    <div
      style={{
        border: `1px solid ${TOKENS.line2}`,
        borderRadius: 6,
        background: '#0c0c0c',
        padding: 12,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 6,
        fontSize: 12,
      }}
    >
      {items.map((x, i) => (
        <div
          key={x}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 8px',
            border: `1px solid ${TOKENS.line}`,
            borderRadius: 4,
            background: i < 3 ? '#0f140a' : 'transparent',
          }}
        >
          <Dot color={i < 3 ? TOKENS.accent : '#333'} size={4} />
          <span style={{ color: i < 3 ? '#e0e0e0' : TOKENS.muted }}>{x}</span>
        </div>
      ))}
    </div>
  )
}

function PlannerDemo() {
  return (
    <div
      style={{
        border: `1px solid ${TOKENS.line2}`,
        borderRadius: 6,
        background: '#0c0c0c',
        padding: 12,
        fontSize: 12,
      }}
    >
      <MonoLabel color={TOKENS.accent} style={{ display: 'block', marginBottom: 8 }}>
        PLAN · TOMORROW
      </MonoLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {[
          ['Breakfast', 540],
          ['Lunch', 620],
          ['Dinner', 720],
          ['Snack', 120],
        ].map(([label, v]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#dcdcdc' }}>{label}</span>
            <span className="mono" style={{ color: TOKENS.muted }}>
              {v}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 10,
          paddingTop: 8,
          borderTop: `1px solid ${TOKENS.line2}`,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <MonoLabel>PROTEIN</MonoLabel>
        <span className="mono" style={{ color: TOKENS.accent, fontSize: 11 }}>
          161g · 100%
        </span>
      </div>
    </div>
  )
}

function TrendDemo() {
  const bars = [65, 80, 92, 70, 88, 95, 100, 82, 91, 74, 86, 98, 90]
  return (
    <div
      style={{
        border: `1px solid ${TOKENS.line2}`,
        borderRadius: 6,
        background: '#0c0c0c',
        padding: 12,
      }}
    >
      <div
        style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}
      >
        <MonoLabel>LAST 13 DAYS</MonoLabel>
        <MonoLabel color={TOKENS.accent}>STREAK · 6</MonoLabel>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 56 }}>
        {bars.map((b, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${b}%`,
              background: b >= 85 ? TOKENS.accent : '#2a2a2a',
              borderRadius: 1,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function FixDemo() {
  return (
    <div
      style={{
        border: `1px solid ${TOKENS.line2}`,
        borderRadius: 6,
        background: '#0c0c0c',
        padding: 12,
        fontSize: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 9px',
          borderRadius: 4,
          background: '#1a1a1a',
          border: `1px solid ${TOKENS.line2}`,
          alignSelf: 'flex-end',
          maxWidth: '90%',
        }}
      >
        actually make that 150g not 200
      </div>
      <div
        style={{
          padding: '6px 9px',
          borderRadius: 4,
          background: '#0f140a',
          border: '1px solid #2a3a14',
          fontSize: 12,
          color: '#dcdcdc',
        }}
      >
        <div>
          Chicken breast: <s style={{ color: '#666' }}>200g</s> →{' '}
          <span style={{ color: TOKENS.accent }}>150g</span>
        </div>
        <div className="mono" style={{ fontSize: 10, color: TOKENS.muted }}>
          kcal −82 · P −15g
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   FAQ
   ============================================================ */

function FAQ() {
  const items = [
    {
      q: 'Do I need to know my macros?',
      a: 'No. Put in your height, weight and goal (cut / maintain / bulk) and Macro.AI suggests starting numbers. You can tune them any time.',
    },
    {
      q: 'Is my data private?',
      a: 'Yes. Every row is locked to your account with Postgres row-level security. No one at Macro.AI can browse what you ate for lunch.',
    },
    {
      q: 'What if the AI gets a portion wrong?',
      a: 'Every AI-estimated entry is tagged. One-tap to correct, or just tell the assistant and it fixes itself.',
    },
    {
      q: 'Does it work for cutting / bulking?',
      a: "That's the whole point. Set a calorie + protein target, log normally, and the assistant flags when you drift.",
    },
    { q: 'Can I export my data?', a: 'CSV export from History. You own what you log.' },
    {
      q: 'Is there a mobile app?',
      a: 'iOS and Android via the same account. Currently in private beta. Join the waitlist below.',
    },
  ]
  const [open, setOpen] = useState(0)
  const isMobile = useIsMobile()
  return (
    <section
      id="faq"
      style={{
        borderBottom: `1px solid ${TOKENS.line}`,
        padding: isMobile ? '56px 16px' : '96px 28px',
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <SectionHeader kicker="FAQ" title="Questions, answered." align="left" />
        <div
          style={{
            marginTop: isMobile ? 28 : 40,
            border: `1px solid ${TOKENS.line2}`,
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          {items.map((it, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                style={{
                  borderBottom:
                    i < items.length - 1 ? `1px solid ${TOKENS.line2}` : 'none',
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    padding: isMobile ? '16px 16px' : '18px 22px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                    color: '#efefef',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: isMobile ? 10 : 14,
                      minWidth: 0,
                    }}
                  >
                    <MonoLabel color={isOpen ? TOKENS.accent : TOKENS.muted2}>
                      {String(i + 1).padStart(2, '0')}
                    </MonoLabel>
                    <span
                      style={{
                        fontSize: isMobile ? 14.5 : 16,
                        fontWeight: 500,
                        lineHeight: 1.35,
                      }}
                    >
                      {it.q}
                    </span>
                  </div>
                  <span
                    className="mono"
                    style={{
                      fontSize: 16,
                      color: TOKENS.muted,
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                      transition: 'transform .2s',
                      flexShrink: 0,
                    }}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: isMobile ? '0 16px 18px 44px' : '0 22px 20px 58px',
                      color: TOKENS.muted,
                      fontSize: isMobile ? 13.5 : 14,
                      lineHeight: 1.6,
                    }}
                  >
                    {it.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Final CTA
   ============================================================ */

function FinalCTA() {
  const isMobile = useIsMobile()
  return (
    <section
      style={{
        padding: isMobile ? '72px 16px' : '112px 28px',
        borderBottom: `1px solid ${TOKENS.line}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          opacity: 0.05,
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 'min(22vw, 320px)',
            letterSpacing: '-0.03em',
            color: TOKENS.accent,
            whiteSpace: 'nowrap',
          }}
        >
          2,000 kcal
        </div>
      </div>

      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <MonoLabel color={TOKENS.accent}>START NOW · FREE FOREVER TIER</MonoLabel>
        <h2
          style={{
            fontSize: isMobile ? 'clamp(32px, 9vw, 44px)' : 'clamp(40px, 5vw, 68px)',
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
            fontWeight: 500,
            margin: '18px 0 22px',
          }}
        >
          Stop{' '}
          <span className="serif" style={{ color: TOKENS.accent }}>
            guessing
          </span>
          . Start Tracking.
        </h2>
        <p
          style={{
            color: TOKENS.muted,
            fontSize: isMobile ? 15 : 17,
            maxWidth: 520,
            margin: '0 auto 36px',
            lineHeight: 1.55,
          }}
        >
          30 seconds to sign up. No credit card. Cancel with a command.
        </p>
        <div style={{ display: 'inline-flex', gap: 10 }}>
          <Link
            to="/auth"
            style={{
              background: TOKENS.accent,
              color: '#0a0a0a',
              padding: isMobile ? '14px 20px' : '15px 24px',
              borderRadius: 5,
              fontFamily: 'DM Mono, monospace',
              fontSize: isMobile ? 11 : 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            CREATE ACCOUNT NOW →
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Footer
   ============================================================ */

function Footer() {
  const isMobile = useIsMobile()
  const cols = [
    { h: 'PRODUCT', l: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
    { h: 'COMPANY', l: ['About', 'Blog', 'Careers', 'Contact'] },
    { h: 'RESOURCES', l: ['Docs', 'API', 'Status', 'Privacy'] },
  ]
  return (
    <footer
      style={{
        padding: isMobile ? '40px 16px 24px' : '56px 28px 32px',
        background: '#080808',
      }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : '1.6fr repeat(3, 1fr)',
            gap: isMobile ? 28 : 40,
            paddingBottom: isMobile ? 28 : 40,
            borderBottom: `1px solid ${TOKENS.line2}`,
          }}
        >
          <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
            <Logo size={14} />
            <p
              style={{
                marginTop: 14,
                color: TOKENS.muted,
                fontSize: 13,
                maxWidth: 280,
                lineHeight: 1.6,
              }}
            >
              For athletes, nerds, and anyone tired of boring calorie counting.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <MonoLabel style={{ display: 'block', marginBottom: 14 }}>{c.h}</MonoLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {c.l.map((x) => (
                  <a
                    key={x}
                    href="#"
                    style={{ fontSize: 13.5, color: '#bbb', textDecoration: 'none' }}
                  >
                    {x}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <MonoLabel>© 2026 MACRO.AI · ALL RIGHTS RESERVED</MonoLabel>
          <MonoLabel>
            MADE WITH <span style={{ color: '#ff5c7a' }}>♥</span> BY{' '}
            <a
              href="https://github.com/esiebomaj"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 2 }}
            >
              JEREMIAH
            </a>
          </MonoLabel>
        </div>
      </div>
    </footer>
  )
}

/* ============================================================
   Page
   ============================================================ */

export default function LandingPage() {
  const { session, loading } = useAuth()

  // Logged-in users skip the landing page and go straight to the app
  // if (!loading && session) return <Navigate to="/app" replace />

  return (
    <div
      style={{
        background: TOKENS.bg,
        color: TOKENS.text,
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      <Nav />
      <Hero />
      <TrustBand />
      <ComparisonSection />
      <AppPreview />
      <HowItWorks />
      <Capabilities />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}
