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
    { label: 'AI Assistant', link: '#ai-assistant' },
    { label: 'Food Library', link: '#food-library' },
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
   Section header
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

/* ============================================================
   AI Assistant feature section
   ============================================================ */

const ASSISTANT_PREVIEW_STEPS = [
  { kind: 'user', text: '2 eggs on toast and a black coffee for breakfast' },
  {
    kind: 'ai',
    text: 'Logged breakfast ↓',
    foods: [
      { name: '2× Large egg', P: 13, C: 0.8, F: 10, kcal: 150 },
      { name: 'Toast (2 slices)', P: 6, C: 28, F: 2, kcal: 160 },
      { name: 'Black coffee', P: 0, C: 0, F: 0, kcal: 5 },
    ],
    total: { kcal: 315, P: 19, C: 28.8, F: 12 },
  },
]

function AssistantPreview() {
  const isMobile = useIsMobile()
  return (
    <div
      style={{
        background: TOKENS.bg1,
        border: `1px solid ${TOKENS.line2}`,
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 40px 80px -40px rgba(200,240,102,0.06)',
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
          <Dot color={TOKENS.accent} size={6} style={{ animation: 'pulse 1.8s infinite' }} />
          <MonoLabel color="#fff">AI ASSISTANT</MonoLabel>
        </div>
        <MonoLabel>chat</MonoLabel>
      </div>

      <div
        style={{
          padding: isMobile ? '14px' : '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {ASSISTANT_PREVIEW_STEPS.map((step, i) => (
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
        <div style={{ flex: 1, color: TOKENS.muted2, fontSize: 13 }}>
          Tell me what you ate…
        </div>
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

function AIAssistantSection() {
  const isMobile = useIsMobile()
  return (
    <section
      id="ai-assistant"
      style={{
        borderBottom: `1px solid ${TOKENS.line}`,
        padding: isMobile ? '56px 16px' : '96px 28px',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 32 : 64,
          alignItems: 'center',
        }}
      >
        <div>
          <SectionHeader
            kicker="AI ASSISTANT"
            title={
              <>
                Just say what you{' '}
                <span
                  className="serif"
                  style={{ color: TOKENS.accent, fontStyle: 'italic' }}
                >
                  ate
                </span>
                .
              </>
            }
            sub="Tell the assistant what you ate in plain English or take a picture of your food and it figures out the foods, portions and macros for you."
          />

          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: isMobile ? '20px 0 0' : '28px 0 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {[
              'Tell it what you ate - "2 eggs on toast and a coffee"',
              'or take a picture of your plate',
              'Get accurate macros for every item, instantly',
              'Edit a portion or correct a guess in one tap',
              'Ask for meal recommendations, recipes, or nutrition advice',
              "plan your next day's meals",
            ].map((t) => (
              <li
                key={t}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  fontSize: isMobile ? 14 : 15,
                  color: '#d4d4d4',
                  lineHeight: 1.55,
                }}
              >
                <Dot
                  color={TOKENS.accent}
                  size={6}
                  style={{ marginTop: 8, flexShrink: 0 }}
                />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <AssistantPreview />
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   Food Library feature section
   ============================================================ */

function LibraryPreview() {
  const items = [
    { n: 'Chicken breast', t: '100g', kcal: 165, p: 31, used: 12 },
    { n: 'Greek yogurt 0%', t: '150g', kcal: 100, p: 17, used: 9 },
    { n: 'Oats', t: '100g dry', kcal: 380, p: 13, used: 8 },
    { n: 'Banana', t: 'medium', kcal: 110, p: 1.3, used: 6 },
    { n: 'Avocado', t: '½ medium', kcal: 120, p: 1.5, used: 4 },
    { n: 'Whey protein', t: '1 scoop', kcal: 130, p: 25, used: 4 },
  ]
  return (
    <div
      style={{
        background: TOKENS.bg1,
        border: `1px solid ${TOKENS.line2}`,
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 40px 80px -40px rgba(200,240,102,0.06)',
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
          <Dot color={TOKENS.accent} size={6} />
          <MonoLabel color="#fff">YOUR LIBRARY</MonoLabel>
        </div>
        <MonoLabel>{items.length} foods</MonoLabel>
      </div>

      <div>
        {items.map((it, i) => (
          <div
            key={it.n}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: 14,
              padding: '12px 14px',
              alignItems: 'center',
              borderBottom: i < items.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                minWidth: 0,
              }}
            >
              <span style={{ fontSize: 13.5, color: '#e6e6e6' }}>{it.n}</span>
              <span
                className="mono"
                style={{ fontSize: 10, color: TOKENS.muted, letterSpacing: '0.06em' }}
              >
                {it.t} · used {it.used}× this month
              </span>
            </div>
            <span
              className="mono"
              style={{ fontSize: 10, color: TOKENS.muted, whiteSpace: 'nowrap' }}
            >
              {it.p}g P
            </span>
            <span
              className="mono"
              style={{
                fontSize: 12,
                color: '#fff',
                minWidth: 44,
                textAlign: 'right',
              }}
            >
              {it.kcal}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: `1px solid ${TOKENS.line2}`,
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#0c0c0c',
        }}
      >
        <MonoLabel>SORTED · MOST USED</MonoLabel>
        <MonoLabel color={TOKENS.accent}>+ ADD</MonoLabel>
      </div>
    </div>
  )
}

function FoodLibrarySection() {
  const isMobile = useIsMobile()
  return (
    <section
      id="food-library"
      style={{
        borderBottom: `1px solid ${TOKENS.line}`,
        padding: isMobile ? '56px 16px' : '96px 28px',
        background: '#0c0c0c',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 32 : 64,
          alignItems: 'center',
        }}
      >
        {!isMobile && (
          <div>
            <LibraryPreview />
          </div>
        )}

        <div>
          <SectionHeader
            kicker="FOOD LIBRARY"
            title={
              <>
                Your favourite foods,{' '}
                <span
                  className="serif"
                  style={{ color: TOKENS.accent, fontStyle: 'italic' }}
                >
                  one tap
                </span>{' '}
                away.
              </>
            }
            sub="Macro.AI saves the meals and ingredients you eat all the time. Reuse them in a tap — or let the assistant pull them in for you."
          />

          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: isMobile ? '20px 0 0' : '28px 0 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {[
              'Save any food you want and reuse later',
              'Tell the assistant to save something in your library for you',
              'The assistant reaches for your library first',
            ].map((t) => (
              <li
                key={t}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  fontSize: isMobile ? 14 : 15,
                  color: '#d4d4d4',
                  lineHeight: 1.55,
                }}
              >
                <Dot
                  color={TOKENS.accent}
                  size={6}
                  style={{ marginTop: 8, flexShrink: 0 }}
                />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {isMobile && (
          <div>
            <LibraryPreview />
          </div>
        )}
      </div>
    </section>
  )
}

/* ============================================================
   FAQ
   ============================================================ */

function FAQ() {
  const items = [
    {
      q: 'Why do I need to know my macros?',
      a: 'Macros — calories, protein, carbs and fat — explain what your food actually does in your body. Knowing them helps you hit a calorie target for your goal (fat loss, maintenance, or muscle gain), get enough protein to preserve or build muscle, and avoid guessing every day. You do not need to be an expert: Macro.AI suggests sensible targets from your stats and goal, and the assistant keeps tracking light so you learn as you go.',
    },
    {
      q: 'What if the AI gets a portion wrong?',
      a: 'One-tap to correct, or just tell the assistant and it fixes itself.',
    },
    {
      q: 'Does it work for cutting / bulking?',
      a: "That's the whole point. Set a calorie + protein target, log normally, and the assistant flags when you drift.",
    },
    { q: 'Can I export my data?', a: 'Coming soon.' },
    {
      q: 'Is there a mobile app?',
      a: 'Coming soon.',
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
      <AIAssistantSection />
      <FoodLibrarySection />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}
